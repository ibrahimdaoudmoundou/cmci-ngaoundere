"use client";
import { useAdmin } from "@/components/AdminShell";
import { Empty } from "@/components/ui";
import { parseLignes } from "@/lib/sort";

export default function AdminDepartements() {
  const { departements, edit } = useAdmin();
  const list = [...departements].sort((a, b) => (Number(a.ordre) || 99) - (Number(b.ordre) || 99) || a.nom.localeCompare(b.nom));
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-[70ch] text-sm text-muted">Pour chaque département : le responsable, son adjoint et son programme. Écrivez une activité par ligne sous la forme <code className="font-mono">Samedi | 15 h | Répétition | Église centrale</code>.</p>
        <button className="btn" onClick={() => edit("departements")}>Ajouter un département</button>
      </div>
      {list.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((d) => (
            <div key={d.id} className="grid gap-2 rounded-xl border border-line bg-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div><h3 className="text-lg">{d.nom}</h3><p className="text-sm text-muted">Responsable : {d.responsable || <span className="text-warn">à désigner</span>}{d.adjoint ? ` · Adjoint(e) : ${d.adjoint}` : ""}</p></div>
                <button className="btn-ghost btn-sm" onClick={() => edit("departements", d)}>Modifier</button>
              </div>
              <p className="text-xs text-muted">{parseLignes(d.programmes).length} activité(s) au programme{d.nom_en ? " · version anglaise" : ""}</p>
            </div>
          ))}
        </div>
      ) : <Empty title="Aucun département">Ajoutez les départements ou installez les données de départ depuis « Site et vision ».</Empty>}
    </div>
  );
}
