"use client";
import Link from "next/link";
import { Fragment, useState } from "react";
import { useAuth } from "@/lib/auth";
import { envoyerDemande } from "@/lib/demandes";
import { fcfa, num, telOk } from "@/lib/format";
import { useLang } from "@/lib/i18n";
import type { Livre, Pasteur, SiteConfig, WithId } from "@/lib/types";
import { ExampleBadge, Modal, Photo } from "./ui";
import { useToast } from "./Providers";

export function PastorBlock({ p, big = false }: { p?: WithId<Pasteur>; big?: boolean }) {
  const { L, V, tr } = useLang();
  if (!p) return <div className="empty"><b className="text-ink">{L("Aucun pasteur enregistré", "No pastor listed yet")}</b></div>;
  return (
    <div className={`grid items-start gap-6 ${big ? "sm:grid-cols-[200px_minmax(0,1fr)]" : "grid-cols-[96px_minmax(0,1fr)] sm:grid-cols-[120px_minmax(0,1fr)]"}`}>
      <Photo src={p.photo} name={p.nom} className="aspect-[4/5] w-full max-w-[220px] rounded-xl" textClass={big ? "text-6xl" : "text-4xl"} />
      <div className="grid min-w-0 gap-2.5">
        <div>
          <div className="eyebrow text-muted">{V(p.titre) || L("Pasteur", "Pastor")}</div>
          <h2 className={big ? "text-[2rem]" : "text-[1.55rem]"}>{p.nom}</h2>
        </div>
        {tr(p, "bio") && <p className="max-w-[62ch]">{tr(p, "bio")}</p>}
        {p.centre && <p className="text-sm text-muted">{L("Centre", "Centre")} : {V(p.centre)}</p>}
        {p.rdv !== false && <div><Link className="btn" href={`/rendez-vous?avec=${p.id}`}>{L("Demander un rendez-vous", "Request an appointment")}</Link></div>}
      </div>
    </div>
  );
}

export function ContactBlock({ c }: { c: SiteConfig | null }) {
  const { L } = useLang();
  const rows = ([[L("Téléphone", "Phone"), c?.tel], ["WhatsApp", c?.whatsapp], ["E-mail", c?.email], [L("Secrétariat", "Office hours"), c?.horaires], [L("Siège", "Headquarters"), c?.adresse], [L("Offrandes Mobile Money", "Mobile Money offerings"), c?.momo]] as const).filter((r) => r[1]);
  if (!rows.length) return <p className="text-muted">{L("Les coordonnées du secrétariat seront affichées ici.", "The church office contact details will appear here.")}</p>;
  return (
    <dl className="m-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2">
      {rows.map(([k, val]) => (<Fragment key={k}><dt className="text-muted">{k}</dt><dd className="m-0 select-all [overflow-wrap:anywhere]">{val}</dd></Fragment>))}
    </dl>
  );
}

export function BookCard({ b, onBuy }: { b: WithId<Livre>; onBuy: (b: WithId<Livre>) => void }) {
  const { L, tr } = useLang();
  const out = !(Number(b.stock) > 0);
  return (
    <article className="grid grid-rows-[auto_1fr] overflow-hidden rounded-xl border border-line bg-surface">
      <div className="relative grid aspect-[3/2] max-w-full place-items-center overflow-hidden bg-green p-4 text-center font-display text-lg text-on-green">
        <span className="absolute bottom-0 left-3.5 top-0 w-[3px] bg-sun/80" />
        {b.titre}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {b.couverture && <img src={b.couverture} alt={b.titre} className="absolute inset-0 h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />}
      </div>
      <div className="grid content-start gap-2 p-4">
        <h3 className="text-[1.05rem]">{b.titre}<ExampleBadge show={b.exemple} /></h3>
        {b.auteur && <p className="text-sm text-muted">{b.auteur}</p>}
        {tr(b, "description") && <p className="text-sm">{tr(b, "description")}</p>}
        <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono font-medium">{fcfa(b.prix)}</span>
          {out ? <span className="badge badge-bad">{L("Épuisé", "Sold out")}</span> : <button className="btn btn-sm" onClick={() => onBuy(b)}>{L("Réserver", "Reserve")}</button>}
        </div>
        {!out && <p className="font-mono text-xs text-muted">{L("En stock", "In stock")} : {num(b.stock)}</p>}
      </div>
    </article>
  );
}

export function LoginNeeded({ fr, en, suite }: { fr: string; en: string; suite: string }) {
  const { L } = useLang();
  return (
    <div className="notice">
      <span>{L(`Pour ${fr}, connectez-vous ou créez votre compte en une minute.`, `To ${en}, sign in or create your account in a minute.`)}</span>
      <Link className="btn btn-sm" href={`/connexion?suite=${encodeURIComponent(suite)}`}>{L("Se connecter", "Sign in")}</Link>
    </div>
  );
}

export function BuyModal({ b, centres, onClose }: { b: WithId<Livre>; centres: string[]; onClose: () => void }) {
  const { user, profil } = useAuth();
  const { L, V } = useLang();
  const toast = useToast();
  const [qte, setQte] = useState(1);
  const [nom, setNom] = useState(profil?.nom || user?.displayName || "");
  const [tel, setTel] = useState(profil?.tel || "");
  const [retrait, setRetrait] = useState("Au siège");
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const prix = Number(b.prix) || 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr("");
    if (!user) return;
    if (!(qte >= 1)) return setErr(L("La quantité doit être au moins 1.", "Quantity must be at least 1."));
    if (qte > Number(b.stock)) return setErr(L(`Il ne reste que ${num(b.stock)} exemplaire(s).`, `Only ${num(b.stock)} copy(ies) left.`));
    if (nom.trim().length < 2) return setErr(L("Indiquez votre nom.", "Please enter your name."));
    if (!telOk(tel)) return setErr(L("Indiquez un numéro de téléphone valide (au moins 8 chiffres).", "Please enter a valid phone number (at least 8 digits)."));
    setBusy(true);
    try {
      await envoyerDemande(user.uid, { type: "commande", livreId: b.id, titre: b.titre, prix, qte, total: qte * prix, nom: nom.trim(), tel: tel.trim(), retrait });
      setDone(true); toast(L("Réservation envoyée", "Reservation sent"));
    } catch (e) { console.warn(e); setErr(L("La réservation n'a pas pu être envoyée. Réessayez.", "The reservation could not be sent. Please try again.")); }
    setBusy(false);
  }

  return (
    <Modal title={`${L("Réserver", "Reserve")} « ${b.titre} »`} onClose={onClose}>
      {!user ? <LoginNeeded fr="réserver un livre" en="reserve a book" suite="/librairie" /> : done ? (
        <div className="grid gap-3">
          <div className="notice bg-ok-soft">{L("Votre réservation est enregistrée. Le secrétariat vous confirmera la disponibilité.", "Your reservation is recorded. The church office will confirm availability.")}</div>
          <div className="flex gap-2"><Link className="btn" href="/mon-espace">{L("Suivre dans Mon espace", "Track it in My space")}</Link><button className="btn-ghost" onClick={onClose}>{L("Fermer", "Close")}</button></div>
        </div>
      ) : (
        <form onSubmit={submit} className="grid gap-3.5 sm:grid-cols-2" noValidate>
          <label className="field">{L("Quantité", "Quantity")}<input className="input" type="number" min={1} max={Number(b.stock) || 1} value={qte} onChange={(e) => setQte(Math.floor(Number(e.target.value)))} /></label>
          <label className="field">Total<input className="input font-mono" readOnly value={fcfa(qte * prix)} /></label>
          <label className="field">{L("Votre nom", "Your name")}<input className="input" value={nom} onChange={(e) => setNom(e.target.value)} autoComplete="name" /></label>
          <label className="field">{L("Téléphone", "Phone")}<input className="input" value={tel} onChange={(e) => setTel(e.target.value)} inputMode="tel" placeholder="6XX XX XX XX" /></label>
          <label className="field sm:col-span-2">{L("Lieu de retrait", "Pick-up point")}
            <select className="input" value={retrait} onChange={(e) => setRetrait(e.target.value)}>
              {["Au siège", ...centres.map((c) => `Centre ${c}`)].map((o) => <option key={o} value={o}>{V(o)}</option>)}
            </select></label>
          <p className="text-sm text-muted sm:col-span-2">{L("Le paiement se fait au retrait, en espèces ou par Mobile Money.", "Payment is made on pick-up, in cash or by Mobile Money.")}</p>
          <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
            <button className="btn" disabled={busy}>{L("Envoyer la réservation", "Send reservation")}</button>
            {err && <span role="alert" className="text-sm text-bad">{err}</span>}
          </div>
        </form>
      )}
    </Modal>
  );
}
