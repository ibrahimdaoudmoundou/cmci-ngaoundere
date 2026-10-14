"use client";
import { useMemo } from "react";
import { Empty, ExampleBadge, PageHead, Photo } from "@/components/ui";
import { useCollection } from "@/lib/hooks";
import { useLang } from "@/lib/i18n";
import { parseLignes } from "@/lib/sort";
import type { Departement } from "@/lib/types";

export default function Departements() {
  const { L, V, tr } = useLang();
  const { data, loading } = useCollection<Departement>("departements");
  const list = useMemo(() => [...data].sort((a, b) => (Number(a.ordre) || 99) - (Number(b.ordre) || 99) || a.nom.localeCompare(b.nom)), [data]);
  return (
    <main className="page grid gap-8 py-10">
      <PageHead eyebrow={L("Servir ensemble", "Serving together")} title={L("Départements de l'église", "Church departments")}>
        {L("Chaque département rassemble des frères et sœurs autour d'un service. Découvrez qui les dirige et leurs programmes, puis rejoignez celui où Dieu vous appelle.",
          "Each department gathers brothers and sisters around a ministry. See who leads them and their programmes, then join the one God is calling you to.")}
      </PageHead>
      {list.length > 1 && (
        <nav className="flex flex-wrap gap-2" aria-label={L("Départements", "Departments")}>
          {list.map((d) => <a key={d.id} href={`#${d.id}`} className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm font-semibold text-ink no-underline hover:border-sun">{tr(d, "nom")}</a>)}
        </nav>
      )}
      {list.length ? (
        <div className="grid gap-6">
          {list.map((d) => {
            const prog = parseLignes(d.programmes);
            return (
              <article key={d.id} id={d.id} className="grid scroll-mt-24 gap-6 rounded-2xl border border-line bg-surface p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                <div className="grid content-start gap-4">
                  <h2 className="text-[1.8rem]">{tr(d, "nom")}<ExampleBadge show={d.exemple} /></h2>
                  {tr(d, "description") && <p className="text-[1.02rem]">{tr(d, "description")}</p>}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <Photo src={d.photo} name={d.responsable || "?"} className="h-14 w-14 flex-none rounded-full" textClass="text-lg" />
                      <div><div className="text-xs uppercase tracking-wider text-muted">{L("Responsable", "Leader")}</div><div className="font-semibold">{d.responsable || L("À désigner", "To be appointed")}</div></div>
                    </div>
                    {d.adjoint && <div className="self-center"><div className="text-xs uppercase tracking-wider text-muted">{L("Adjoint(e)", "Assistant")}</div><div className="font-semibold">{d.adjoint}</div></div>}
                  </div>
                  {d.contact && <p className="text-sm text-muted">{L("Contact", "Contact")} : <span className="select-all">{d.contact}</span></p>}
                </div>
                <div className="grid content-start gap-3">
                  <div className="eyebrow">{L("Programme du département", "Department schedule")}</div>
                  {prog.length ? (
                    <div className="overflow-hidden rounded-xl border border-line">
                      {prog.map((p, i) => (
                        <div key={i} className="grid grid-cols-[minmax(0,110px)_minmax(0,1fr)] gap-3 border-b border-line px-4 py-3 last:border-0">
                          <div className="font-mono text-sm text-gold">{V(p.jour)}<br />{p.heure}</div>
                          <div><div className="font-semibold">{p.activite}</div>{p.lieu && <div className="text-sm text-muted">{V(p.lieu)}</div>}</div>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-muted">{L("Le programme sera communiqué prochainement.", "The schedule will be announced soon.")}</p>}
                </div>
              </article>
            );
          })}
        </div>
      ) : <Empty title={loading ? L("Chargement…", "Loading…") : L("Les départements seront présentés ici", "Departments will be presented here")} />}
    </main>
  );
}
