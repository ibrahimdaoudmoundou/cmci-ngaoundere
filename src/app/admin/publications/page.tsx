"use client";
import { doc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { useState } from "react";
import { useAdmin } from "@/components/AdminShell";
import { useToast } from "@/components/Providers";
import { Empty } from "@/components/ui";
import { fbDb } from "@/lib/firebase";
import { fshort, nowIso, today } from "@/lib/format";

export default function Publications() {
  const { articles, edit } = useAdmin();
  const toast = useToast();
  const [type, setType] = useState("");
  const list = articles.filter((a) => !type || a.type === type).sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const etat = (a: (typeof list)[number]) => !a.publie ? ["Brouillon", ""] : a.expire && a.expire < today() ? ["Expirée", "badge-bad"] : ["En ligne", "badge-ok"];
  async function toggle(id: string, publie: boolean) {
    try { await updateDoc(doc(fbDb(), "articles", id), { publie, maj: nowIso() }); toast(publie ? "Publiée sur le site" : "Retirée du site"); } catch { toast("Action impossible"); }
  }
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2.5">
        <select className="input w-auto" value={type} onChange={(e) => setType(e.target.value)} aria-label="Type"><option value="">Articles et annonces</option><option value="article">Articles</option><option value="annonce">Annonces</option></select>
        <button className="btn" onClick={() => edit("articles", { type: "article", publie: true, epingle: false, date: today() })}>Écrire un article</button>
        <button className="btn-gold" onClick={() => edit("articles", { type: "annonce", publie: true, epingle: true, date: today() })}>Publier une annonce</button>
        <Link href="/actualites" className="text-sm font-semibold">Voir la page publique ↗</Link>
      </div>
      <p className="text-sm text-muted">Les annonces épinglées s&apos;affichent en haut de la page d&apos;accueil. Indiquez une date de retrait pour qu&apos;une annonce disparaisse d&apos;elle-même après l&apos;événement.</p>
      {list.length ? (
        <div className="tbl-box"><table className="tbl">
          <thead><tr><th>Date</th><th>Titre</th><th>Type</th><th>État</th><th>Anglais</th><th /></tr></thead>
          <tbody>{list.map((a) => { const [lab, cls] = etat(a); return (
            <tr key={a.id}>
              <td className="font-mono">{fshort(a.date)}</td>
              <td><span className="font-semibold">{a.titre}</span>{a.epingle && <span className="badge badge-gold ml-2">épinglée</span>}{a.expire && <div className="text-xs text-muted">retrait le {fshort(a.expire)}</div>}</td>
              <td>{a.type === "annonce" ? "Annonce" : "Article"}</td>
              <td><span className={`badge ${cls}`}>{lab}</span></td>
              <td>{a.titre_en ? "Oui" : <span className="text-muted">—</span>}</td>
              <td className="whitespace-nowrap text-right">
                <button className="btn-ghost btn-sm mr-1.5" onClick={() => toggle(a.id, !a.publie)}>{a.publie ? "Retirer" : "Publier"}</button>
                <button className="btn-ghost btn-sm" onClick={() => edit("articles", a)}>Modifier</button>
              </td>
            </tr>); })}</tbody>
        </table></div>
      ) : <Empty title="Aucune publication">Écrivez un premier article (témoignage, enseignement, compte rendu de mission) ou publiez une annonce.</Empty>}
    </div>
  );
}
