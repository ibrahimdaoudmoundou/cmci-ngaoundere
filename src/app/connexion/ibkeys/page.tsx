"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IbkeysError, useAuth } from "@/lib/auth";
import { callbackUrl } from "@/lib/ibkeys";
import { useLang } from "@/lib/i18n";

/** Retour d'IBKEYS : vérifie l'état, échange le code côté serveur et ouvre la session. */
export default function RetourIbkeys() {
  const { finishIbkeys } = useAuth();
  const { L } = useLang();
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return; done.current = true;
    const q = new URLSearchParams(location.search);
    const code = q.get("code"), state = q.get("state"), oops = q.get("error");
    let saved: { verifier?: string; state?: string; suite?: string } = {};
    try { saved = JSON.parse(sessionStorage.getItem("ibkeys_pkce") || "{}"); sessionStorage.removeItem("ibkeys_pkce"); } catch { /* ignore */ }
    if (oops) { setErr(L("La connexion IBKEYS a été annulée.", "IBKEYS sign-in was cancelled.")); return; }
    if (!code || !state || !saved.verifier || state !== saved.state) {
      setErr(L("Cette connexion a expiré. Recommencez depuis la page de connexion.", "This sign-in has expired. Please start again from the sign-in page."));
      return;
    }
    finishIbkeys(code, saved.verifier, callbackUrl())
      .then(() => router.replace(saved.suite || "/mon-espace"))
      .catch((e: unknown) => {
        if (e instanceof IbkeysError && e.code === "not_configured")
          setErr(L("La connexion IBKEYS n'est pas encore activée sur ce site. Utilisez l'e-mail ou Google en attendant.", "IBKEYS sign-in is not enabled on this site yet. Please use e-mail or Google for now."));
        else setErr(e instanceof Error ? e.message : L("Connexion impossible.", "Sign-in failed."));
      });
  }, [finishIbkeys, router, L]);

  return (
    <main className="page grid max-w-[560px] gap-4 py-16">
      {err ? (
        <>
          <h1 className="h2">{L("Connexion IBKEYS", "IBKEYS sign-in")}</h1>
          <p className="notice bg-bad-soft">{err}</p>
          <div><Link className="btn" href="/connexion">{L("Retour à la connexion", "Back to sign-in")}</Link></div>
        </>
      ) : (
        <p className="text-center text-muted">{L("Ouverture de votre session…", "Opening your session…")}</p>
      )}
    </main>
  );
}
