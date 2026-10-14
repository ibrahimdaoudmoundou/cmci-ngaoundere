"use client";
import Link from "next/link";
import { useMemo } from "react";
import { PastorBlock } from "@/components/blocks";
import { PageHead, Photo } from "@/components/ui";
import { useCollection } from "@/lib/hooks";
import { useLang } from "@/lib/i18n";
import { sortPasteurs } from "@/lib/sort";
import type { Pasteur } from "@/lib/types";

export default function Pasteurs() {
  const { L, V, tr } = useLang();
  const { data, loading } = useCollection<Pasteur>("pasteurs");
  const ps = useMemo(() => sortPasteurs(data), [data]);
  return (
    <main className="page grid gap-8 py-10">
      <PageHead eyebrow={L("Encadrement spirituel", "Spiritual leadership")} title={L("Pasteurs et responsables", "Pastors and leaders")}>
        {L("Les serviteurs qui conduisent l'église et ses centres de quartier. Chacun peut vous recevoir sur rendez-vous.", "The servants who lead the church and its neighbourhood centres. Each can meet you by appointment.")}
      </PageHead>
      <div className="panel">{loading ? <p className="text-muted">{L("Chargement…", "Loading…")}</p> : <PastorBlock p={ps[0]} big />}</div>
      {ps.length > 1 && (
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(250px,1fr))]">
          {ps.slice(1).map((p) => (
            <div key={p.id} className="grid grid-cols-[60px_minmax(0,1fr)] items-start gap-4 rounded-xl border border-line bg-surface p-4">
              <Photo src={p.photo} name={p.nom} className="h-[60px] w-[60px] rounded-full" textClass="text-xl" />
              <div className="grid min-w-0 gap-1">
                <h3 className="text-lg">{p.nom}</h3>
                <p className="text-sm text-muted">{V(p.titre)}{p.centre ? ` · ${V(p.centre)}` : ""}</p>
                {tr(p, "bio") && <p className="text-sm">{tr(p, "bio")}</p>}
                {p.rdv !== false && <Link href={`/rendez-vous?avec=${p.id}`} className="text-sm font-semibold">{L("Rendez-vous", "Appointment")} →</Link>}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
