/** Paramètres publics d'IBKEYS (fournisseur d'identité d'IBTech, Keycloak realm « ibkeys »). Aucun secret ici. */
export const IBKEYS = {
  issuer: process.env.NEXT_PUBLIC_IBKEYS_ISSUER || "https://ibkeys.ibtech.click/realms/ibkeys",
  clientId: process.env.NEXT_PUBLIC_IBKEYS_CLIENT_ID || "cmci-ngaoundere",
};
export const IBKEYS_ROLES = ["ADMIN", "SECRETARIAT", "TRESORERIE"] as const;
export type IbkeysRole = (typeof IBKEYS_ROLES)[number];

const b64url = (buf: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const random = (n = 32) => b64url(crypto.getRandomValues(new Uint8Array(n)));

export const callbackUrl = () => `${location.origin}/connexion/ibkeys`;

/** Démarre la connexion IBKEYS (Authorization Code + PKCE S256) : redirige le navigateur. */
export async function startIbkeysLogin(suite = "/mon-espace") {
  const verifier = random(48);
  const state = random(16);
  const challenge = b64url(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier)));
  sessionStorage.setItem("ibkeys_pkce", JSON.stringify({ verifier, state, suite: suite.startsWith("/") ? suite : "/mon-espace" }));
  const u = new URL(`${IBKEYS.issuer}/protocol/openid-connect/auth`);
  u.search = new URLSearchParams({
    client_id: IBKEYS.clientId, response_type: "code", scope: "openid profile email",
    redirect_uri: callbackUrl(), state, code_challenge: challenge, code_challenge_method: "S256",
    ui_locales: document.documentElement.lang || "fr",
  }).toString();
  location.assign(u.toString());
}

/** Adresse de déconnexion IBKEYS (ferme aussi la session unique IBTech). */
export function ibkeysLogoutUrl(idToken?: string | null) {
  const u = new URL(`${IBKEYS.issuer}/protocol/openid-connect/logout`);
  const q: Record<string, string> = { client_id: IBKEYS.clientId, post_logout_redirect_uri: `${location.origin}/` };
  if (idToken) q.id_token_hint = idToken;
  u.search = new URLSearchParams(q).toString();
  return u.toString();
}
