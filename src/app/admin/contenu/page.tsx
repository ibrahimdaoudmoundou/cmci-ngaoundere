"use client";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { useEffect, useState, type ReactNode } from "react";
import { useAdmin } from "@/components/AdminShell";
import { useToast } from "@/components/Providers";
import { ExampleBadge } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { fbDb } from "@/lib/firebase";
import { fcfa, fshort, num, nowIso } from "@/lib/format";
import { useCollection, useDocument } from "@/lib/hooks";
import { initialiserDonnees } from "@/lib/seed";
import { sortPasteurs, sortProgramme } from "@/lib/sort";
import type { SiteConfig, Vision } from "@/lib/types";
import { VISION_DEFAUT } from "@/lib/vision";
import { CMCI_GLOBAL_URL } from "@/lib/format";

type Col<T> = [string, (x: T) => ReactNode];
function Block<T extends { id: string }>({ title, entity, list, cols }: { title: string; entity: string; list: T[]; cols: Col<T>[] }) {
  const { edit } = useAdmin();
  return (
    <section className="grid gap-2.5">
      <div className="flex items-center justify-between gap-3"><h3 className="text-xl">{title}</h3><button className="btn btn-sm" onClick={() => edit(entity)}>Ajouter</button></div>
      <div className="tbl-box"><table className="tbl">
        {list.length ? <>
          <thead><tr>{cols.map(([h]) => <th key={h}>{h}</th>)}<th /></tr></thead>
          <tbody>{list.map((x) => <tr key={x.id}>{cols.map(([h, f]) => <td key={h}>{f(x)}</td>)}<td className="text-right"><button className="btn-ghost btn-sm" onClick={() => edit(entity, x)}>Modifier</button></td></tr>)}</tbody>
        </> : <tbody><tr><td className="text-muted">Rien pour le moment.</td></tr></tbody>}
      </table></div>
    </section>
  );
}

function ConfigForm() {
  const toast = useToast();
  const { data, loading } = useDocument<SiteConfig>("config/site");
  const [c, setC] = useState<SiteConfig>({});
  const [filled, setFilled] = useState(false);
  useEffect(() => { if (!loading && !filled) { setC(data || {}); setFilled(true); } }, [data, loading, filled]);
  const f = (k: keyof SiteConfig, l: string, hint?: string, full = false, area = false) => (
    <label className={`field ${full ? "sm:col-span-2" : ""}`}>{l}{hint && <span className="hint">{hint}</span>}
      {area ? <textarea className="input min-h-[80px]" value={c[k] || ""} onChange={(e) => setC({ ...c, [k]: e.target.value })} />
        : <input className="input" value={c[k] || ""} onChange={(e) => setC({ ...c, [k]: e.target.value })} />}</label>
  );
  return (
    <form className="panel grid gap-3.5 sm:grid-cols-2" onSubmit={async (e) => { e.preventDefault(); try { await setDoc(doc(fbDb(), "config", "site"), { ...c, maj: nowIso() }); toast("Coordonnées enregistrées"); } catch { toast("Enregistrement impossible"); } }}>
      <div className="sm:col-span-2"><h3 className="text-xl">Coordonnées de l'église</h3><p className="text-sm text-muted">Affichées sur la page d'accueil et en pied de page.</p></div>
      {f("tel", "Téléphone du secrétariat")}{f("whatsapp", "WhatsApp")}{f("email", "E-mail")}{f("horaires", "Horaires du secrétariat", " — ex. Lun–Sam, 9 h – 16 h")}
      {f("adresse", "Adresse du siège", undefined, true)}
      {f("momo", "Offrandes et dîmes par Mobile Money", " — numéros Orange Money / MTN MoMo et nom du titulaire", true)}
      {f("messageAccueil", "Verset ou message d'accueil", " — laisser vide pour Matthieu 28:19", true, true)}
      <div className="sm:col-span-2"><button className="btn">Enregistrer les coordonnées</button></div>
    </form>
  );
}

function VisionForm() {
  const toast = useToast();
  const { data, loading } = useDocument<Vision>("config/vision");
  const [v, setV] = useState<Vision>({});
  const [filled, setFilled] = useState(false);
  useEffect(() => { if (!loading && !filled) { setV({ ...VISION_DEFAUT, siteMondial: CMCI_GLOBAL_URL, ...Object.fromEntries(Object.entries(data || {}).filter(([, x]) => x)) }); setFilled(true); } }, [data, loading, filled]);
  const area = (k: keyof Vision, l: string, rows = 4) => (
    <label className="field">{l}<textarea className="input" style={{ minHeight: rows * 24 }} value={v[k] || ""} onChange={(e) => setV({ ...v, [k]: e.target.value })} /></label>
  );
  return (
    <form className="panel grid gap-3.5" onSubmit={async (e) => { e.preventDefault(); try { await setDoc(doc(fbDb(), "config", "vision"), { ...v, maj: nowIso() }); toast("Vision enregistrée"); } catch { toast("Enregistrement impossible"); } }}>
      <div><h3 className="text-xl">Vision de l&apos;église</h3><p className="text-sm text-muted">Présentée sur l&apos;accueil et la page « Notre église ». Un texte d&apos;ouverture est proposé : adaptez-le aux mots de votre église.</p></div>
      <div className="grid gap-3.5 md:grid-cols-2">
        {area("vision", "Vision")}{area("vision_en", "Vision en anglais")}
        {area("mission", "Mission")}{area("mission_en", "Mission en anglais")}
        {area("valeurs", "Ce qui nous caractérise (une valeur par ligne)", 6)}{area("valeurs_en", "Valeurs en anglais (une par ligne)", 6)}
        {area("histoireLocale", "Présentation de l'église locale de Ngaoundéré", 5)}{area("histoireLocale_en", "Présentation locale en anglais", 5)}
      </div>
      <label className="field">Adresse du site mondial de la CMCI<input className="input" value={v.siteMondial || ""} onChange={(e) => setV({ ...v, siteMondial: e.target.value })} /></label>
      <div><button className="btn">Enregistrer la vision</button></div>
    </form>
  );
}

function Admins() {
  const { user } = useAuth();
  const toast = useToast();
  const roles = useCollection<{ role: string; nom?: string }>("roles");
  const [uid, setUid] = useState(""); const [nom, setNom] = useState(""); const [armed, setArmed] = useState<string | null>(null);
  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (uid.trim().length < 10) return toast("Collez l'identifiant complet du compte (affiché dans son espace).");
    try { await setDoc(doc(fbDb(), "roles", uid.trim()), { role: "admin", nom: nom.trim(), cree: nowIso() }); setUid(""); setNom(""); toast("Administrateur ajouté"); } catch { toast("Ajout impossible"); }
  }
  return (
    <section className="panel grid gap-3">
      <h3 className="text-xl">Administrateurs</h3>
      <p className="text-sm text-muted">Chaque personne crée d'abord son compte sur le site ; son identifiant s'affiche en bas de « Mon espace ». Collez-le ici pour lui donner accès à la gestion.</p>
      <ul className="grid gap-2">
        {roles.data.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-2 last:border-0">
            <span><b className="font-semibold">{r.nom || "Administrateur"}</b> <code className="font-mono text-xs text-muted">{r.id}</code>{r.id === user?.uid && <span className="ml-2 text-xs text-muted">(vous)</span>}</span>
            {r.id !== user?.uid && <button className={armed === r.id ? "btn-danger btn-sm" : "btn-ghost btn-sm"} onClick={async () => { if (armed !== r.id) return setArmed(r.id); await deleteDoc(doc(fbDb(), "roles", r.id)); setArmed(null); toast("Accès retiré"); }}>{armed === r.id ? "Confirmer le retrait" : "Retirer l'accès"}</button>}
          </li>))}
      </ul>
      <form onSubmit={add} className="flex flex-wrap items-end gap-2.5">
        <label className="field flex-[1_1_220px]">Identifiant du compte<input className="input font-mono" value={uid} onChange={(e) => setUid(e.target.value)} /></label>
        <label className="field flex-[1_1_160px]">Nom<input className="input" value={nom} onChange={(e) => setNom(e.target.value)} /></label>
        <button className="btn">Donner l'accès</button>
      </form>
    </section>
  );
}

export default function Contenu() {
  const { pasteurs, centres, livres, programme } = useAdmin();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const vide = !pasteurs.length && !centres.length;
  return (
    <div className="grid gap-7">
      {vide && (
        <div className="notice">
          <span><b>Base vide.</b> Installez les données de départ : le pasteur Samuel Yadiaya, les centres Haut-Plateau, Baladji, Gadamabanga et Wakwa (positions approximatives à vérifier), les départements habituels (responsables à désigner), un programme d&apos;exemple et un premier article de bienvenue.</span>
          <button className="btn btn-sm" disabled={busy} onClick={async () => { setBusy(true); try { await initialiserDonnees(); toast("Données de départ installées"); } catch (e) { console.warn(e); toast("Installation impossible : vérifiez les règles Firestore."); } setBusy(false); }}>Installer les données de départ</button>
        </div>
      )}
      <VisionForm />
      <ConfigForm />
      <Block title="Pasteurs et responsables" entity="pasteurs" list={sortPasteurs(pasteurs)} cols={[
        ["Nom", (x) => <b className="font-semibold">{x.nom}</b>], ["Titre", (x) => x.titre], ["Centre", (x) => x.centre], ["Rendez-vous", (x) => (x.rdv === false ? "Non" : "Oui")]]} />
      <Block title="Centres rattachés" entity="centres" list={centres} cols={[
        ["Centre", (x) => <b className="font-semibold">{x.nom}</b>], ["Responsable", (x) => x.responsable || "—"], ["Horaires", (x) => x.horaires || "—"],
        ["Position", (x) => x.lat !== "" && x.lat != null ? <><span className="font-mono text-xs">{String(x.lat)}, {String(x.lng)}</span>{x.approx && <ExampleBadge show />}</> : "—"]]} />
      <Block title="Livres de la librairie" entity="livres" list={[...livres].sort((a, b) => a.titre.localeCompare(b.titre))} cols={[
        ["Titre", (x) => <b className="font-semibold">{x.titre}</b>], ["Prix", (x) => <span className="font-mono">{fcfa(x.prix)}</span>], ["Stock", (x) => <span className="font-mono">{num(x.stock)}</span>], ["Affichage", (x) => (x.visible === false ? "Masqué" : "En vente")]]} />
      <Block title="Programme et activités" entity="programme" list={sortProgramme(programme, true)} cols={[
        ["Activité", (x) => <><b className="font-semibold">{x.titre}</b><ExampleBadge show={x.exemple} /></>], ["Quand", (x) => `${x.date ? fshort(x.date) : x.jour || ""} ${x.heure || ""}`], ["Lieu", (x) => x.lieu]]} />
      <Admins />
    </div>
  );
}
