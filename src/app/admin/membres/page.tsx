"use client";
import { useState } from "react";
import { useAdmin } from "@/components/AdminShell";
import { Empty } from "@/components/ui";
import { exportEntity } from "@/lib/export";
import { ROLES, fshort } from "@/lib/format";

export default function Membres() {
  const { membres, centreNames, edit } = useAdmin();
  const [q, setQ] = useState(""); const [c, setC] = useState(""); const [r, setR] = useState(""); const [a, setA] = useState("Actif");
  const list = membres.filter((m) => (!c || m.centre === c) && (!r || m.role === r) && (!a || (m.actif || "Actif") === a)
    && (!q || [m.nom, m.tel, m.quartier, m.profession].join(" ").toLowerCase().includes(q.toLowerCase())))
    .sort((x, y) => x.nom.localeCompare(y.nom));
  const h = list.filter((m) => m.sexe === "Homme").length;
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2.5">
        <input type="search" className="input flex-[1_1_220px]" placeholder="Nom, téléphone, quartier…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Rechercher un membre" />
        <select className="input w-auto" value={c} onChange={(e) => setC(e.target.value)} aria-label="Centre"><option value="">Tous les centres</option>{centreNames.map((n) => <option key={n}>{n}</option>)}</select>
        <select className="input w-auto" value={r} onChange={(e) => setR(e.target.value)} aria-label="Fonction"><option value="">Toutes les fonctions</option>{ROLES.map((n) => <option key={n}>{n}</option>)}</select>
        <select className="input w-auto" value={a} onChange={(e) => setA(e.target.value)} aria-label="Statut"><option value="">Tous statuts</option>{["Actif", "Inactif", "Transféré", "Décédé"].map((n) => <option key={n}>{n}</option>)}</select>
        <button className="btn" onClick={() => edit("membres")}>Ajouter un membre</button>
        <button className="btn-ghost" onClick={() => exportEntity("membres", list)}>Exporter (Excel/CSV)</button>
      </div>
      <p className="text-sm text-muted">{list.length} membre(s) affiché(s) · {h} homme(s), {list.length - h} femme(s)</p>
      {list.length ? (
        <div className="tbl-box"><table className="tbl">
          <thead><tr><th>Nom</th><th>Téléphone</th><th>Centre</th><th>Fonction</th><th>Quartier</th><th>Adhésion</th><th>Statut</th><th /></tr></thead>
          <tbody>{list.map((m) => (
            <tr key={m.id}>
              <td className="font-semibold">{m.nom}</td><td className="whitespace-nowrap font-mono">{m.tel}</td><td>{m.centre || "—"}</td><td>{m.role}</td>
              <td>{m.quartier}</td><td className="font-mono">{fshort(m.dateAdhesion)}</td>
              <td><span className={`badge ${(m.actif || "Actif") === "Actif" ? "badge-ok" : ""}`}>{m.actif || "Actif"}</span></td>
              <td className="text-right"><button className="btn-ghost btn-sm" onClick={() => edit("membres", m)}>Modifier</button></td>
            </tr>))}</tbody>
        </table></div>
      ) : <Empty title={membres.length ? "Aucun membre ne correspond" : "Le registre des membres est vide"}>Ajoutez un membre ou acceptez une inscription reçue en ligne.</Empty>}
    </div>
  );
}
