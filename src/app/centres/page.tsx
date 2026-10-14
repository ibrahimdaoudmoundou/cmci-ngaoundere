"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { hasCoords } from "@/lib/geo";
import { Empty, PageHead } from "@/components/ui";
import { useCollection } from "@/lib/hooks";
import { useLang } from "@/lib/i18n";
import type { Centre } from "@/lib/types";

const MapPoints = dynamic(() => import("@/components/MapPoints"), { ssr: false, loading: () => <div className="h-[420px] rounded-xl bg-surface-2 sm:h-[520px]" /> });

export default function Centres() {
  const { L } = useLang();
  const { data, loading } = useCollection<Centre>("centres");
  const [sel, setSel] = useState<string | null>(null);
  useEffect(() => { const h = location.hash.slice(1); if (h) setSel(h); }, []);
  useEffect(() => { if (sel) document.getElementById(`c-${sel}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" }); }, [sel]);
  return (
    <main className="page grid gap-8 py-10">
      <PageHead eyebrow={L("Implantations", "Locations")} title={L("Centres rattachés", "Neighbourhood centres")}>
        {L("Chaque centre accueille les fidèles de son quartier pour les cultes, les prières et l'étude de la Parole. Touchez un repère pour voir le centre.",
          "Each centre welcomes believers from its neighbourhood for worship, prayer and Bible study. Tap a marker to see the centre.")}
      </PageHead>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="min-w-0 overflow-hidden rounded-xl border border-line"><MapPoints points={data.map((c) => ({ ...c, kind: "centre" as const }))} selected={sel} onSelect={setSel} /></div>
        <div className="grid gap-3">
          {data.length ? data.map((c) => (
            <article key={c.id} id={`c-${c.id}`} onClick={() => setSel(c.id)} className={`grid cursor-pointer gap-2 rounded-xl border bg-surface p-4 ${sel === c.id ? "border-sun ring-1 ring-sun" : "border-line"}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-xl">{c.nom}</h3>
                {c.approx && <span className="rounded-full border border-dashed border-line px-2 py-0.5 text-[0.7rem] font-semibold text-muted">{L("position approximative", "approximate location")}</span>}
              </div>
              <dl className="m-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-sm">
                {c.quartier && <><dt className="text-muted">{L("Quartier", "District")}</dt><dd className="m-0">{c.quartier}</dd></>}
                <dt className="text-muted">{L("Responsable", "Leader")}</dt><dd className="m-0">{c.responsable || L("À désigner", "To be appointed")}</dd>
                <dt className="text-muted">{L("Horaires", "Times")}</dt><dd className="m-0">{c.horaires || L("À communiquer", "To be announced")}</dd>
                {c.adresse && <><dt className="text-muted">{L("Repère", "Landmark")}</dt><dd className="m-0">{c.adresse}</dd></>}
                {c.tel && <><dt className="text-muted">Contact</dt><dd className="m-0 select-all">{c.tel}</dd></>}
              </dl>
              {hasCoords(c) && (
                <div className="flex flex-wrap gap-3 text-sm">
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`} target="_blank" rel="noopener">{L("Itinéraire", "Directions")} Google Maps ↗</a>
                  <a href={`https://www.openstreetmap.org/?mlat=${c.lat}&mlon=${c.lng}#map=17/${c.lat}/${c.lng}`} target="_blank" rel="noopener">OpenStreetMap ↗</a>
                  <span className="font-mono text-xs text-muted">{Number(c.lat).toFixed(5)}° N, {Number(c.lng).toFixed(5)}° E</span>
                </div>
              )}
            </article>
          )) : <Empty title={loading ? L("Chargement…", "Loading…") : L("Aucun centre enregistré", "No centre listed yet")} />}
        </div>
      </div>
    </main>
  );
}
