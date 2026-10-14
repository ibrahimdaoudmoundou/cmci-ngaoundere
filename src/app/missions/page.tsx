"use client";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { hasCoords } from "@/lib/geo";
import { Empty, PageHead, Photo } from "@/components/ui";
import { useCollection } from "@/lib/hooks";
import { useLang } from "@/lib/i18n";
import type { Localite } from "@/lib/types";

const MapPoints = dynamic(() => import("@/components/MapPoints"), { ssr: false, loading: () => <div className="h-[420px] rounded-xl bg-surface-2" /> });

export default function Missions() {
  const { L, V, tr } = useLang();
  const { data, loading } = useCollection<Localite>("localites");
  const [sel, setSel] = useState<string | null>(null);
  const list = useMemo(() => [...data].sort((a, b) => (Number(a.distance) || 999) - (Number(b.distance) || 999)), [data]);
  const fideles = list.reduce((s, l) => s + (Number(l.fideles) || 0), 0);
  const points = [
    { id: "__ngaoundere", nom: "Ngaoundéré", lat: 7.3226, lng: 13.5847, kind: "eglise" as const },
    ...list.map((l) => ({ id: l.id, nom: l.nom, lat: l.lat, lng: l.lng, kind: "localite" as const })),
  ];
  return (
    <main className="page grid gap-8 py-10">
      <PageHead eyebrow={L("Œuvre missionnaire", "Outreach")} title={L("L'Évangile dans les localités et les villages", "The Gospel in localities and villages")}>
        {L("Fidèle à l'appel missionnaire de la CMCI, l'église de Ngaoundéré se rend régulièrement dans les localités et les villages voisins pour annoncer Jésus-Christ, prier avec les familles et affermir les nouveaux croyants.",
          "Faithful to CMFI's missionary calling, the Ngaoundéré church regularly goes to neighbouring localities and villages to proclaim Jesus Christ, pray with families and strengthen new believers.")}
      </PageHead>
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
        <div className="tile"><span className="tile-v">{list.length}</span><span className="text-sm text-muted">{L("localités et villages", "localities and villages")}</span></div>
        <div className="tile"><span className="tile-v">{fideles || "—"}</span><span className="text-sm text-muted">{L("fidèles dans ces communautés", "believers in these fellowships")}</span></div>
        <div className="tile col-span-2 sm:col-span-1"><span className="tile-v">{list.filter(hasCoords).length}</span><span className="text-sm text-muted">{L("lieux sur la carte", "places on the map")}</span></div>
      </div>
      <div className="min-w-0 overflow-hidden rounded-xl border border-line"><MapPoints points={points} selected={sel} onSelect={setSel} height="h-[380px] sm:h-[460px]" /></div>
      {list.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((l) => (
            <article key={l.id} onClick={() => setSel(l.id)} className={`grid cursor-pointer gap-3 rounded-xl border bg-surface p-5 ${sel === l.id ? "border-sun ring-1 ring-sun" : "border-line"}`}>
              <div className="flex items-start gap-4">
                <Photo src={l.photo} name={l.nom} className="h-14 w-14 flex-none rounded-xl" textClass="text-lg" />
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-wider text-gold">{V(l.type) || L("Localité", "Locality")}{l.distance ? ` · ${l.distance} km ${L("de Ngaoundéré", "from Ngaoundéré")}` : ""}</div>
                  <h3 className="text-xl">{l.nom}</h3>
                </div>
              </div>
              {tr(l, "description") && <p>{tr(l, "description")}</p>}
              <dl className="m-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-sm">
                {tr(l, "activites") && <><dt className="text-muted">{L("Activités", "Activities")}</dt><dd className="m-0">{tr(l, "activites")}</dd></>}
                {l.frequence && <><dt className="text-muted">{L("Fréquence", "Frequency")}</dt><dd className="m-0">{l.frequence}</dd></>}
                {l.responsable && <><dt className="text-muted">{L("Responsable", "Leader")}</dt><dd className="m-0">{l.responsable}</dd></>}
                {l.depuis && <><dt className="text-muted">{L("Depuis", "Since")}</dt><dd className="m-0">{l.depuis}</dd></>}
                {l.fideles ? <><dt className="text-muted">{L("Fidèles", "Believers")}</dt><dd className="m-0">{l.fideles}</dd></> : null}
              </dl>
            </article>
          ))}
        </div>
      ) : <Empty title={loading ? L("Chargement…", "Loading…") : L("Les lieux d'implantation seront présentés ici", "Outreach places will be listed here")}>{L("L'administration les ajoute depuis Gestion › Œuvre missionnaire.", "The church office adds them from the admin area.")}</Empty>}
    </main>
  );
}
