import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

/**
 * Firebase Admin, utilisé uniquement côté serveur (route /api/auth/ibkeys) pour émettre
 * un jeton Firebase après une connexion IBKEYS vérifiée.
 * Variable d'environnement Vercel : FIREBASE_SERVICE_ACCOUNT = contenu JSON de la clé du compte de service
 * (ou le même contenu encodé en base64).
 */
let app: App | null = null;

export function adminConfigured() {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT);
}

function readServiceAccount() {
  const raw = (process.env.FIREBASE_SERVICE_ACCOUNT || "").trim();
  const json = raw.startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
  const sa = JSON.parse(json);
  if (sa.private_key) sa.private_key = String(sa.private_key).replace(/\\n/g, "\n");
  return sa;
}

export function adminAuth() {
  if (!app) app = getApps()[0] ?? initializeApp({ credential: cert(readServiceAccount()) });
  return getAuth(app);
}
