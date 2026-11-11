import "server-only";
import { importPKCS8, SignJWT } from "jose";

/**
 * Émission de jetons personnalisés Firebase côté serveur, sans firebase-admin :
 * jeton JWT RS256 signé avec la clé du compte de service (méthode « bibliothèque JWT tierce »
 * décrite dans la documentation Firebase).
 * Variable d'environnement Vercel : FIREBASE_SERVICE_ACCOUNT = contenu JSON de la clé
 * du compte de service (ou ce même contenu encodé en base64).
 */
const AUD = "https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit";

interface ServiceAccount { client_email: string; private_key: string }
let cached: { email: string; key: CryptoKey } | null = null;

export function adminConfigured() {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT);
}

async function signer() {
  if (cached) return cached;
  const raw = (process.env.FIREBASE_SERVICE_ACCOUNT || "").trim();
  const sa = JSON.parse(raw.startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8")) as ServiceAccount;
  if (!sa.client_email || !sa.private_key) throw new Error("FIREBASE_SERVICE_ACCOUNT incomplet (client_email / private_key).");
  const key = await importPKCS8(sa.private_key.replace(/\\n/g, "\n"), "RS256");
  cached = { email: sa.client_email, key };
  return cached;
}

/** Jeton personnalisé valable 1 heure, à échanger côté client avec signInWithCustomToken. */
export async function createCustomToken(uid: string, claims: Record<string, unknown>) {
  if (uid.length > 128) throw new Error("uid trop long");
  const { email, key } = await signer();
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({ uid, claims })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(email).setSubject(email).setAudience(AUD)
    .setIssuedAt(now).setExpirationTime(now + 3600)
    .sign(key);
}
