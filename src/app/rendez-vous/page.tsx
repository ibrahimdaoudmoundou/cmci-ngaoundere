"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { LoginNeeded } from "@/components/blocks";
import { PageHead } from "@/components/ui";
import { useToast } from "@/components/Providers";
import { useAuth } from "@/lib/auth";
import { envoyerDemande } from "@/lib/demandes";
import { CRENEAUX, MOTIFS, fdate, telOk, today } from "@/lib/format";
import { useCollection } from "@/lib/hooks";
import { sortPasteurs } from "@/lib/sort";
import type { Centre, Pasteur } from "@/lib/types";
import { useLang } from "@/lib/i18n";

export default function RendezVous() {
  const { user, profil } = useAuth();
  const toast = useToast();
  const { L, V, locale } = useLang();
  const pasteurs = useCollection<Pasteur>("pasteurs");
  const centres = useCollection<Centre>("centres");
  const avecOpts = useMemo(() => [
    ...sortPasteurs(pasteurs.data).filter((p) => p.rdv !== false).map((p) => ({ v: `p:${p.id}`, l: `${p.nom} — ${V(p.titre) || L("Pasteur", "Pastor")}` })),
    ...centres.data.filter((c) => c.responsable).map((c) => ({ v: `c:${c.id}`, l: `${c.responsable} — ${L("responsable du centre", "leader, centre")} ${c.nom}` })),
    { v: "secretariat", l: L("Le secrétariat de l'église", "The church office") },
  ], [pasteurs.data, centres.data, L, V]);

  const [f, setF] = useState({ avec: "", motif: MOTIFS[0], lieu: "Au siège", date: "", creneau: CRENEAUX[0], nom: "", tel: "", message: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const set = (k: keyof typeof f, v: string) => setF((o) => ({ ...o, [k]: v }));

  useEffect(() => {
    const a = new URLSearchParams(location.search).get("avec");
    if (a) setF((o) => ({ ...o, avec: `p:${a}` }));
  }, []);
  useEffect(() => { if (!f.avec && avecOpts.length) setF((o) => ({ ...o, avec: avecOpts[0].v })); }, [avecOpts, f.avec]);
  useEffect(() => { setF((o) => ({ ...o, nom: o.nom || profil?.nom || user?.displayName || "", tel: o.tel || profil?.tel || "" })); }, [profil, user]);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr("");
    if (!user) return;
    if (f.nom.trim().length < 2) return setErr(L("Indiquez votre nom.", "Please enter your name."));
    if (!telOk(f.tel)) return setErr(L("Indiquez un numéro de téléphone valide (au moins 8 chiffres).", "Please enter a valid phone number (at least 8 digits)."));
    if (!f.date || f.date < today()) return setErr(L("Choisissez une date à partir d'aujourd'hui.", "Choose a date from today onwards."));
    const avecNom = avecOpts.find((o) => o.v === f.avec)?.l || "Secrétariat";
    setBusy(true);
    try {
      await envoyerDemande(user.uid, { type: "rdv", avec: f.avec, avecNom, motif: f.motif, lieu: f.lieu, date: f.date, creneau: f.creneau, nom: f.nom.trim(), tel: f.tel.trim(), message: f.message.trim() });
      setSent(`${avecNom.split(" — ")[0]} · ${fdate(f.date, locale)}, ${V(f.creneau)}`);
      setF((o) => ({ ...o, message: "" }));
      toast(L("Demande de rendez-vous envoyée", "Appointment request sent"));
    } catch (e) { console.warn(e); setErr(L("La demande n'a pas pu être envoyée. Vérifiez votre connexion et réessayez.", "The request could not be sent. Check your connection and try again.")); }
    setBusy(false);
  }

  return (
    <main className="page grid gap-8 py-10">
      <PageHead eyebrow={L("Accompagnement", "Pastoral care")} title={L("Prendre rendez-vous", "Book an appointment")}>
        {L("Conseil, prière, préparation au mariage ou au baptême, visite à domicile : choisissez la personne, le jour et le moment. L'église vous confirme l'heure exacte.", "Counselling, prayer, marriage or baptism preparation, home visits: choose the person, the day and the time. The church will confirm the exact time.")}
      </PageHead>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <form onSubmit={submit} noValidate className="panel grid gap-3.5 sm:grid-cols-2">
          {!user && <div className="sm:col-span-2"><LoginNeeded fr="envoyer une demande de rendez-vous" en="send an appointment request" suite="/rendez-vous" /></div>}
          <label className="field sm:col-span-2">{L("Avec qui ?", "With whom?")}
            <select className="input" value={f.avec} onChange={(e) => set("avec", e.target.value)}>{avecOpts.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}</select></label>
          <label className="field">{L("Motif", "Reason")}<select className="input" value={f.motif} onChange={(e) => set("motif", e.target.value)}>{MOTIFS.map((m) => <option key={m} value={m}>{V(m)}</option>)}</select></label>
          <label className="field">{L("Lieu", "Place")}<select className="input" value={f.lieu} onChange={(e) => set("lieu", e.target.value)}>
            {["Au siège", "À domicile", ...centres.data.map((c) => `Centre ${c.nom}`)].map((m) => <option key={m} value={m}>{V(m)}</option>)}</select></label>
          <label className="field">{L("Date souhaitée", "Preferred date")}<input className="input" type="date" min={today()} value={f.date} onChange={(e) => set("date", e.target.value)} /></label>
          <label className="field">{L("Moment", "Time of day")}<select className="input" value={f.creneau} onChange={(e) => set("creneau", e.target.value)}>{CRENEAUX.map((m) => <option key={m} value={m}>{V(m)}</option>)}</select></label>
          <label className="field">{L("Votre nom complet", "Your full name")}<input className="input" value={f.nom} onChange={(e) => set("nom", e.target.value)} autoComplete="name" /></label>
          <label className="field">{L("Téléphone", "Phone")}<input className="input" value={f.tel} onChange={(e) => set("tel", e.target.value)} inputMode="tel" placeholder="6XX XX XX XX" /></label>
          <label className="field sm:col-span-2">Message <span className="hint">{L("facultatif — ce que vous souhaitez confier à l'avance", "optional — anything you wish to share beforehand")}</span>
            <textarea className="input min-h-[90px]" value={f.message} onChange={(e) => set("message", e.target.value)} /></label>
          <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
            <button className="btn" disabled={busy || !user}>{L("Envoyer la demande", "Send request")}</button>
            {err && <span role="alert" className="text-sm text-bad">{err}</span>}
          </div>
        </form>
        <aside className="panel grid gap-3">
          <div className="eyebrow">{L("Comment ça se passe", "How it works")}</div>
          <ol className="m-0 grid list-decimal gap-1.5 pl-5">
            <li>{L("Vous envoyez votre demande.", "You send your request.")}</li>
            <li>{L("Le secrétariat la transmet au pasteur ou au responsable.", "The office passes it to the pastor or leader.")}</li>
            <li>{L("Vous recevez la confirmation dans", "You receive the confirmation in")} <Link href="/mon-espace">{L("Mon espace", "My space")}</Link>.</li>
          </ol>
          {sent && <div className="notice bg-ok-soft"><span><b>{L("Demande envoyée.", "Request sent.")}</b> {sent}.</span></div>}
        </aside>
      </div>
    </main>
  );
}
