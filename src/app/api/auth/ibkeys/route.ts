import { NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { adminConfigured, createCustomToken } from "@/lib/firebase-admin";
import { IBKEYS, IBKEYS_ROLES } from "@/lib/ibkeys";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const JWKS = createRemoteJWKSet(new URL(`${IBKEYS.issuer}/protocol/openid-connect/certs`));
const ALLOWED_ORIGINS = new Set([
  "https://cmcingaoundere.ibtech.click",
  "https://cmci-ngaoundere.vercel.app",
  "http://localhost:3000",
]);

function fail(status: number, code: string, message: string) {
  return NextResponse.json({ error: code, message }, { status });
}

/**
 * Reçoit le code d'autorisation IBKEYS (PKCE), l'échange auprès d'IBKEYS, vérifie le jeton
 * (signature, émetteur, azp, expiration) puis renvoie un jeton personnalisé Firebase
 * portant les rôles IBKEYS de l'application.
 */
export async function POST(req: Request) {
  if (!adminConfigured()) return fail(503, "not_configured", "La connexion IBKEYS n'est pas encore activée sur ce site (clé Firebase manquante).");

  let body: { code?: string; verifier?: string; redirectUri?: string };
  try { body = await req.json(); } catch { return fail(400, "bad_request", "Requête invalide."); }
  const { code, verifier, redirectUri } = body;
  if (!code || !verifier || !redirectUri) return fail(400, "bad_request", "Paramètres manquants.");
  let origin: string;
  try { origin = new URL(redirectUri).origin; } catch { return fail(400, "bad_request", "Adresse de retour invalide."); }
  if (!ALLOWED_ORIGINS.has(origin) || new URL(redirectUri).pathname !== "/connexion/ibkeys") return fail(400, "bad_redirect", "Adresse de retour non autorisée.");

  // 1. Échange du code contre les jetons (client public + PKCE : aucun secret)
  let tokenRes: Response;
  try {
    tokenRes = await fetch(`${IBKEYS.issuer}/protocol/openid-connect/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "authorization_code", client_id: IBKEYS.clientId, code, code_verifier: verifier, redirect_uri: redirectUri }),
    cache: "no-store",
    });
  } catch {
    return fail(502, "ibkeys_unreachable", "IBKEYS ne répond pas pour le moment. Réessayez dans une minute.");
  }
  if (!tokenRes.ok) return fail(401, "exchange_failed", "IBKEYS a refusé la connexion. Recommencez.");
  const tokens = (await tokenRes.json()) as { access_token?: string; id_token?: string };
  if (!tokens.access_token) return fail(401, "exchange_failed", "Réponse IBKEYS incomplète.");

  // 2. Vérification du jeton d'accès
  let claims: Record<string, unknown>;
  try {
    const { payload } = await jwtVerify(tokens.access_token, JWKS, { issuer: IBKEYS.issuer });
    claims = payload as Record<string, unknown>;
  } catch {
    return fail(401, "invalid_token", "Jeton IBKEYS invalide.");
  }
  if (claims.azp !== IBKEYS.clientId) return fail(401, "invalid_token", "Jeton émis pour une autre application.");
  const sub = String(claims.sub || "");
  if (!sub) return fail(401, "invalid_token", "Identité IBKEYS absente.");

  const ra = (claims.resource_access as Record<string, { roles?: string[] }> | undefined)?.[IBKEYS.clientId]?.roles ?? [];
  const roles = ra.filter((r): r is (typeof IBKEYS_ROLES)[number] => (IBKEYS_ROLES as readonly string[]).includes(r));
  const name = String(claims.name || [claims.given_name, claims.family_name].filter(Boolean).join(" ") || claims.preferred_username || "");
  const email = typeof claims.email === "string" ? claims.email : "";

  // 3. Jeton Firebase : uid stable lié au compte IBKEYS, rôles en revendications personnalisées
  try {
    const customToken = await createCustomToken(`ibkeys:${sub}`, { ibkeys: true, roles });
    return NextResponse.json({ customToken, idToken: tokens.id_token ?? null, profile: { name, email }, roles });
  } catch (e) {
    console.error("ibkeys: jeton Firebase", e);
    return fail(500, "firebase_error", "Impossible d'ouvrir la session. Réessayez plus tard.");
  }
}
