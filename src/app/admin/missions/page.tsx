"use client";
import { useAdmin } from "@/components/AdminShell";
import { Empty } from "@/components/ui";
import { num } from "@/lib/format";

export default function AdminMissions() {
  const { localites, edit } = useAdmin();
  const list = [...localites].sort((a, b) => (Number(a.distance) || 999) - (Number(b.distance) || 999));
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-[70ch] text-sm text-muted">Localités et villages voisins de Ngaoundéré où l&apos;église mène l&apos;œuvre. Pour placer un lieu sur la carte : Google Maps, appui long sur le village, copiez les deux nombres (latitude, longitude).</p>
        <button className="btn" onClick={() => edit("localites")}>Ajouter une localité ou un village</button>
      </div>
      {list.length ? (
        <div className="tbl-box"><table className="tbl">
          <thead><tr><th>Lieu</th><th>Type</th><th className="num">Distance</th><th>Responsable</th><th>Fréquence</th><th className="num">Fidèles</th><th>Carte</th><th /></tr></thead>
          <tbody>{list.map((l) => (
            <tr key={l.id}>
              <td className="font-semibold">{l.nom}</td><td>{l.type}</td><td className="num">{l.distance ? `${l.distance} km` : "—"}</td>
              <td>{l.responsable || "—"}</td><td>{l.frequence || "—"}</td><td className="num">{l.fideles ? num(l.fideles) : "—"}</td>
              <td>{l.lat !== "" && l.lat != null ? <span className={`badge ${l.approx ? "badge-warn" : "badge-ok"}`}>{l.approx ? "approx." : "vérifiée"}</span> : <span className="text-muted">non placée</span>}</td>
              <td className="text-right"><button className="btn-ghost btn-sm" onClick={() => edit("localites", l)}>Modifier</button></td>
            </tr>))}</tbody>
        </table></div>
      ) : <Empty title="Aucune localité enregistrée">Ajoutez les villages et localités où l&apos;église évangélise ou tient des communautés.</Empty>}
    </div>
  );
}
