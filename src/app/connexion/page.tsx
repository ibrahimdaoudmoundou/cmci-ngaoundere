"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHead } from "@/components/ui";
import { authMessage, useAuth } from "@/lib/auth";
import { telOk } from "@/lib/format";
import { useCollection } from "@/lib/hooks";
import type { Centre } from "@/lib/types";
import { useLang } from "@/lib/i18n";

export default function Connexion() {
  const { user, login, register, google, resetPassword } = useAuth();
  const router = useRouter();
  const { L, en } = useLang();
  const centres = useCollection<Centre>("centres");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [f, setF] = useState({ nom: "", tel: "", email: "", pass: "", quartier: "", centre: "" });
  const [err, setErr] = useState(""); const [info, setInfo] = useState(""); const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f, v: string) => setF((o) => ({ ...o, [k]: v }));
  const suite = () => { const s = new URLSearchParams(location.search).get("suite"); return s && s.startsWith("/") ? s : "/mon-espace"; };

  useEffect(() => { if (user) router.replace(suite()); }, [user, router]);

  async function run(fn: () => Promise<void>) {
    setErr(""); setInfo(""); setBusy(true);
    try { await fn(); } catch (e) { setErr(authMessage((e as { code?: string }).code, en)); }
    setBusy(false);
  }
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "register") {
      if (f.nom.trim().length < 2) return setErr(L("Indiquez votre nom complet.", "Please enter your full name."));
      if (!telOk(f.tel)) return setErr(L("Indiquez un numéro de téléphone valide.", "Please enter a valid phone number."));
      if (f.pass.length < 6) return setErr(L("Le mot de passe doit contenir au moins 6 caractères.", "The password must be at least 6 characters."));
      run(() => register({ ...f, nom: f.nom.trim(), tel: f.tel.trim() }));
    } else run(() => login(f.email, f.pass));
  };

  return (
    <main className="page grid max-w-[560px] gap-6 py-10">
      <PageHead eyebrow={L("Compte fidèle", "Member account")} title={mode === "login" ? L("Se connecter", "Sign in") : L("Créer mon compte", "Create my account")}>
        {L("Votre compte vous permet de prendre rendez-vous, de réserver des livres, de vous inscrire comme membre et de suivre les réponses de l'église.", "Your account lets you book appointments, reserve books, register as a member and follow the church's replies.")}
      </PageHead>
      <div className="flex gap-2" role="tablist">
        <button className={mode === "login" ? "btn btn-sm" : "btn-ghost btn-sm"} onClick={() => setMode("login")} role="tab" aria-selected={mode === "login"}>{L("J'ai déjà un compte", "I have an account")}</button>
        <button className={mode === "register" ? "btn btn-sm" : "btn-ghost btn-sm"} onClick={() => setMode("register")} role="tab" aria-selected={mode === "register"}>{L("Nouveau compte", "New account")}</button>
      </div>
      <form onSubmit={submit} noValidate className="panel grid gap-3.5">
        {mode === "register" && <>
          <label className="field">{L("Nom complet", "Full name")}<input className="input" value={f.nom} onChange={(e) => set("nom", e.target.value)} autoComplete="name" /></label>
          <label className="field">{L("Téléphone", "Phone")}<input className="input" value={f.tel} onChange={(e) => set("tel", e.target.value)} inputMode="tel" placeholder="6XX XX XX XX" /></label>
          <div className="grid gap-3.5 sm:grid-cols-2">
            <label className="field">{L("Quartier", "District")}<input className="input" value={f.quartier} onChange={(e) => set("quartier", e.target.value)} /></label>
            <label className="field">{L("Centre fréquenté", "Centre attended")}<select className="input" value={f.centre} onChange={(e) => set("centre", e.target.value)}>
              <option value="">{L("Pas encore", "Not yet")}</option>{centres.data.map((c) => <option key={c.id}>{c.nom}</option>)}</select></label>
          </div>
        </>}
        <label className="field">E-mail<input className="input" type="email" value={f.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" /></label>
        <label className="field">{L("Mot de passe", "Password")}<input className="input" type="password" value={f.pass} onChange={(e) => set("pass", e.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} /></label>
        <div className="flex flex-wrap items-center gap-3">
          <button className="btn" disabled={busy}>{mode === "login" ? L("Se connecter", "Sign in") : L("Créer mon compte", "Create my account")}</button>
          {mode === "login" && <button type="button" className="text-sm font-semibold text-green" onClick={() => f.email ? run(async () => { await resetPassword(f.email); setInfo(L("Un e-mail de réinitialisation vient d'être envoyé.", "A reset e-mail has been sent.")); }) : setErr(L("Saisissez d'abord votre e-mail.", "Enter your e-mail first."))}>{L("Mot de passe oublié ?", "Forgot password?")}</button>}
        </div>
        <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-muted"><span className="h-px flex-1 bg-line" />{L("ou", "or")}<span className="h-px flex-1 bg-line" /></div>
        <button type="button" className="btn-ghost" disabled={busy} onClick={() => run(google)}>{L("Continuer avec Google", "Continue with Google")}</button>
        {err && <p role="alert" className="text-sm text-bad">{err}</p>}
        {info && <p className="text-sm text-ok">{info}</p>}
      </form>
    </main>
  );
}
