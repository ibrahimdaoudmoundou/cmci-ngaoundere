"use client";
import { useState } from "react";
import { useAdmin } from "@/components/AdminShell";
import { Empty } from "@/components/ui";
import { exportEntity } from "@/lib/export";
import { BIEN_CATS, fcfa, num } from "@/lib/format";

const val = (b: { valeur?: number; quantite?: number }) => (Number(b.valeur) || 0) * (Number(b.quantite) || 1);

export default function Biens() {
  const { biens, centreNames, edit } = useAdmin();
  const [q, setQ] = useState(""); const [cat, setCat] = useState(""); const [ce, setCe] = useState("");
  const tot = biens.reduce((s, b) => s + val(b), 0);
  const imm = biens.filter((b) => b.categorie === "Terrains et bâtiments").reduce((s, b) => s + val(b), 0);
  const rep = biens.filter((b) => b.etat === "À réparer").length, hs = biens.filter((b) => b.etat === "Hors service").length;
  const list = biens.filter((b) => (!cat || b.categorie === cat) && (!ce || b.centre === ce)
    && (!q || [b.designation, b.reference, b.note].join(" ").toLowerCase().includes(q.toLowerCase())))
    .sort((a, b) => String(a.categorie).localeCompare(String(b.categorie)) || a.designation.localeCompare(b.designation));
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <div className="tile"><span className="text-sm text-muted">Valeur totale</span><span className="tile-v">{fcfa(tot)}</span></div>
        <div className="tile"><span className="text-sm text-muted">Terrains et bâtiments</span><span className="tile-v">{fcfa(imm)}</span></div>
        <div className="tile"><span className="text-sm text-muted">Biens inventoriés</span><span className="tile-v">{num(biens.length)}</span></div>
        <div className={`tile ${rep + hs ? "border-warn" : ""}`}><span className="text-sm text-muted">À réparer / hors service</span><span className="tile-v">{rep} / {hs}</span></div>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        <input type="search" className="input flex-[1_1_220px]" placeholder="Rechercher un bien" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Rechercher un bien" />
        <select className="input w-auto" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Catégorie"><option value="">Toutes les catégories</option>{BIEN_CATS.map((n) => <option key={n}>{n}</option>)}</select>
        <select className="input w-auto" value={ce} onChange={(e) => setCe(e.target.value)} aria-label="Emplacement"><option value="">Tous les emplacements</option>{["Siège", ...centreNames].map((n) => <option key={n}>{n}</option>)}</select>
        <button className="btn" onClick={() => edit("biens")}>Ajouter un bien</button>
        <button className="btn-ghost" onClick={() => exportEntity("biens", list)}>Exporter (Excel/CSV)</button>
      </div>
      {list.length ? (
        <div className="tbl-box"><table className="tbl">
          <thead><tr><th>Désignation</th><th>Catégorie</th><th>Emplacement</th><th className="num">Qté</th><th className="num">Valeur unit.</th><th className="num">Valeur totale</th><th>État</th><th /></tr></thead>
          <tbody>{list.map((b) => (
            <tr key={b.id}>
              <td><span className="font-semibold">{b.designation}</span>{b.reference && <div className="font-mono text-xs text-muted">{b.reference}</div>}</td>
              <td>{b.categorie}</td><td>{b.centre}</td><td className="num">{num(b.quantite || 1)}</td><td className="num">{num(b.valeur)}</td><td className="num">{num(val(b))}</td>
              <td><span className={`badge ${b.etat === "Bon état" ? "badge-ok" : b.etat === "À réparer" ? "badge-warn" : "badge-bad"}`}>{b.etat}</span></td>
              <td className="text-right"><button className="btn-ghost btn-sm" onClick={() => edit("biens", b)}>Modifier</button></td>
            </tr>))}</tbody>
        </table></div>
      ) : <Empty title="Aucun bien inventorié">Enregistrez terrains, bâtiments, sonorisation, instruments, véhicules et mobilier de l'église.</Empty>}
    </div>
  );
}
