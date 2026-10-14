"use client";
import { collection, doc, increment, updateDoc, writeBatch } from "firebase/firestore";
import { useState } from "react";
import { useAdmin } from "@/components/AdminShell";
import { useToast } from "@/components/Providers";
import { Empty, StatutBadge } from "@/components/ui";
import { fbDb } from "@/lib/firebase";
import { TYPES, fcfa, fdate, fshort, num, nowIso, today } from "@/lib/format";
import type { Demande, WithId } from "@/lib/types";

function Card({ d }: { d: WithId<Demande> }) {
  const toast = useToast();
  const [note, setNote] = useState(d.note || "");
  const [busy, setBusy] = useState(false);

  async function run(fn: () => Promise<void>, ok: string) {
    setBusy(true);
    try { await fn(); toast(ok); } catch (e) { console.warn(e); toast("Action impossible. Réessayez."); }
    setBusy(false);
  }
  const setStatut = (statut: string, n = note) => updateDoc(doc(fbDb(), "demandes", d.id), { statut, note: n, maj: nowIso() });

  const accepterMembre = () => run(async () => {
    const b = writeBatch(fbDb());
    b.set(doc(collection(fbDb(), "membres")), {
      nom: d.nom, sexe: d.sexe || "", tel: d.tel, naissance: d.naissance || "", quartier: d.quartier || "",
      centre: d.centre === "À définir" ? "" : d.centre || "", role: "Membre",
      statutSpi: d.statutSpi === "Déjà baptisé(e)" ? "Baptisé(e)" : d.statutSpi || "", dateAdhesion: today(),
      profession: d.profession || "", actif: "Actif", source: d.id, cree: nowIso(),
    });
    b.update(doc(fbDb(), "demandes", d.id), { statut: "confirme", note: note || "Bienvenue dans la famille de la CMCI !", maj: nowIso() });
    await b.commit();
  }, "Fiche membre créée");

  const venteFaite = () => run(async () => {
    const b = writeBatch(fbDb());
    if (d.livreId) b.update(doc(fbDb(), "livres", d.livreId), { stock: increment(-(Number(d.qte) || 0)) });
    b.set(doc(collection(fbDb(), "finances")), {
      date: today(), type: "entree", categorie: "Ventes librairie", montant: Number(d.total) || 0,
      centre: String(d.retrait || "").replace(/^Centre /, "").replace(/^Au siège$/, "Siège"),
      mode: "Espèces", libelle: `Vente : ${d.titre} × ${d.qte} — ${d.nom}`, piece: d.id, cree: nowIso(),
    });
    b.update(doc(fbDb(), "demandes", d.id), { statut: "termine", note: note || "Livré et payé. Merci !", maj: nowIso() });
    await b.commit();
  }, "Vente enregistrée en caisse et stock mis à jour");

  const rows: [string, string | undefined][] = [["Téléphone", d.tel]];
  if (d.type === "rdv") rows.push(["Avec", d.avecNom], ["Motif", d.motif], ["Souhaité", `${fdate(d.date)} · ${d.creneau}`], ["Lieu", d.lieu]);
  if (d.type === "inscription") rows.push(["Sexe", d.sexe], ["Centre", d.centre], ["Quartier", d.quartier || "—"], ["Situation", d.statutSpi], ["Naissance", fshort(d.naissance) || "—"], ["Profession", d.profession || "—"]);
  if (d.type === "commande") rows.push(["Livre", `${d.titre} × ${num(d.qte)}`], ["Total", fcfa(d.total)], ["Retrait", d.retrait]);

  const placeholder = d.type === "rdv" ? "Réponse (ex. confirmé à 10 h au siège)" : d.type === "commande" ? "Message (ex. disponible au siège dès lundi)" : "Message de bienvenue (facultatif)";
  return (
    <article className="grid gap-3 rounded-xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div><div className="eyebrow">{TYPES[d.type]}</div><h3 className="text-lg">{d.nom}</h3></div>
        <div className="flex items-center gap-2"><span className="text-xs text-muted">reçue le {fshort(d.cree)}</span><StatutBadge statut={d.statut} /></div>
      </div>
      <dl className="m-0 grid gap-x-5 gap-y-1.5 text-sm [grid-template-columns:repeat(auto-fill,minmax(180px,1fr))]">
        {rows.map(([k, v]) => <div key={k}><dt className="text-[0.7rem] uppercase tracking-wide text-muted">{k}</dt><dd className="m-0 select-all [overflow-wrap:anywhere]">{v}</dd></div>)}
      </dl>
      {d.message && <p className="rounded-md bg-surface-2 px-3 py-2 text-sm">{d.message}</p>}
      {(d.statut === "en_attente" || d.statut === "confirme") && (
        <div className="flex flex-wrap items-center gap-2">
          <input className="input flex-[1_1_220px] py-1.5 text-sm" placeholder={placeholder} value={note} onChange={(e) => setNote(e.target.value)} />
          {d.type === "rdv" && d.statut === "en_attente" && <button className="btn btn-sm" disabled={busy} onClick={() => run(() => setStatut("confirme"), "Rendez-vous confirmé")}>Confirmer</button>}
          {d.type === "rdv" && d.statut === "confirme" && <button className="btn btn-sm" disabled={busy} onClick={() => run(() => setStatut("termine"), "Rendez-vous marqué comme tenu")}>Marquer comme tenu</button>}
          {d.type === "inscription" && d.statut === "en_attente" && <button className="btn btn-sm" disabled={busy} onClick={accepterMembre}>Accepter et créer la fiche membre</button>}
          {d.type === "commande" && d.statut === "en_attente" && <button className="btn btn-sm" disabled={busy} onClick={() => run(() => setStatut("confirme"), "Réservation confirmée")}>Confirmer la réservation</button>}
          {d.type === "commande" && d.statut === "confirme" && <button className="btn btn-sm" disabled={busy} onClick={venteFaite}>Livré et payé (stock + caisse)</button>}
          <button className="btn-ghost btn-sm" disabled={busy} onClick={() => run(() => setStatut("refuse"), "Demande refusée")}>{d.statut === "confirme" ? "Annuler" : "Refuser"}</button>
        </div>
      )}
      {d.note && d.statut !== "en_attente" && <p className="text-sm text-muted">Réponse envoyée : {d.note}</p>}
    </article>
  );
}

export default function Demandes() {
  const { demandes, loading } = useAdmin();
  const [type, setType] = useState("");
  const [stat, setStat] = useState("en_attente");
  const list = demandes.filter((d) => (!type || d.type === type) && (!stat || d.statut === stat || (stat === "refuse" && d.statut === "annule")))
    .sort((a, b) => b.cree.localeCompare(a.cree));
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="field">Type<select className="input" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Tous</option><option value="rdv">Rendez-vous</option><option value="inscription">Inscriptions</option><option value="commande">Commandes de livres</option></select></label>
        <label className="field">Statut<select className="input" value={stat} onChange={(e) => setStat(e.target.value)}>
          <option value="en_attente">En attente</option><option value="confirme">Confirmées</option><option value="termine">Terminées</option><option value="refuse">Refusées / annulées</option><option value="">Toutes</option></select></label>
        <p className="max-w-[46ch] text-sm text-muted">Demande reçue par téléphone ? Remplissez le formulaire public (Rendez-vous ou Librairie) au nom de la personne, depuis votre compte.</p>
      </div>
      {list.length ? list.map((d) => <Card key={d.id} d={d} />) : <Empty title={loading ? "Chargement…" : "Aucune demande dans cette liste"}>Les rendez-vous, inscriptions et réservations envoyés depuis le site arrivent ici.</Empty>}
    </div>
  );
}
