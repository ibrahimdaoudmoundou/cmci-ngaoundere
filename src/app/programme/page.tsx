"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Empty, ExampleBadge, PageHead } from "@/components/ui";
import { useCollection } from "@/lib/hooks";
import { useLang } from "@/lib/i18n";
import { JOURS, fdate, today } from "@/lib/format";
import { sortProgramme } from "@/lib/sort";
import type { Activite, Centre } from "@/lib/types";

export default function VieEglise() {
  const { L, V, tr, locale } = useLang();
  const { data, loading } = useCollection<Activite>("programme");
  const centres = useCollection<Centre>("centres");
  const [lieu, setLieu] = useState("Église centrale");
  const tabs = ["Église centrale", ...centres.data.map((c) => c.nom)];
  const ofLieu = (p: Activite) => (p.centre || "Église centrale") === lieu;
  const hebdo = useMemo(() => sortProgramme(data).filter((p) => !p.date && ofLieu(p)), [data, lieu]); // eslint-disable-line react-hooks/exhaustive-deps
  const events = useMemo(() => sortProgramme(data).filter((p) => p.date && p.date >= today()), [data]);
  const jourIdx = (p: Activite) => JOURS.findIndex((d) => String(p.jour || "").toLowerCase().startsWith(d.toLowerCase()));
  const todayIdx = (new Date().getDay() + 6) % 7;

  return (
    <main className="page grid gap-10 py-10">
      <PageHead eyebrow={L("Vie de l'église", "Church life")} title={L("Programme de l'église", "Church schedule")}>
        {L("Cultes, prières, études bibliques et rencontres de la semaine à l'église centrale et dans les centres, ainsi que les grands rendez-vous à venir.",
          "Weekly services, prayer meetings, Bible studies and gatherings at the central church and in the centres, plus upcoming special events.")}
      </PageHead>

      <section className="grid gap-5">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label={L("Lieu", "Place")}>
          {tabs.map((t) => <button key={t} role="tab" aria-selected={lieu === t} onClick={() => setLieu(t)} className={lieu === t ? "btn btn-sm" : "btn-ghost btn-sm"}>{t === "Église centrale" ? V(t) : `${L("Centre", "Centre")} ${t}`}</button>)}
        </div>
        {hebdo.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
            {JOURS.map((j, i) => {
              const items = hebdo.filter((p) => jourIdx(p) === i);
              return (
                <div key={j} className={`grid content-start gap-2 rounded-xl border p-3 ${i === todayIdx ? "border-sun bg-gold-soft/40" : "border-line bg-surface"} ${items.length ? "" : "hidden lg:grid"}`}>
                  <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wider text-muted">{V(j)}</span>{i === todayIdx && <span className="text-[0.65rem] font-bold uppercase text-gold">{L("aujourd'hui", "today")}</span>}</div>
                  {items.length ? items.map((p) => (
                    <div key={p.id} className="grid gap-0.5 rounded-lg bg-surface-2 p-2.5">
                      <span className="font-mono text-xs text-gold">{p.heure}{p.heureFin ? ` – ${p.heureFin}` : ""}</span>
                      <span className="text-sm font-semibold leading-snug">{tr(p, "titre")}<ExampleBadge show={p.exemple} /></span>
                      {p.lieu && <span className="text-xs text-muted">{V(p.lieu)}</span>}
                    </div>
                  )) : <span className="text-xs text-muted">—</span>}
                </div>
              );
            })}
          </div>
        ) : <Empty title={loading ? L("Chargement…", "Loading…") : L("Aucune activité régulière publiée pour ce lieu", "No regular activity published for this place")} />}
        {hebdo.some((p) => jourIdx(p) < 0) && (
          <div className="grid gap-2">{hebdo.filter((p) => jourIdx(p) < 0).map((p) => <p key={p.id} className="text-sm"><b>{tr(p, "titre")}</b> — {p.jour} {p.heure}</p>)}</div>
        )}
      </section>

      <section className="grid gap-4">
        <div><div className="eyebrow">{L("À venir", "Coming up")}</div><h2 className="h2 mt-1">{L("Événements et rendez-vous spéciaux", "Special events")}</h2></div>
        {events.length ? (
          <div className="overflow-hidden rounded-xl border border-line bg-surface">
            {events.map((p) => (
              <div key={p.id} className="grid items-baseline gap-x-5 gap-y-1 border-b border-line px-5 py-4 last:border-0 sm:grid-cols-[200px_minmax(0,1fr)_auto]">
                <div className="font-mono text-sm text-gold">{fdate(p.date, locale)}<br />{p.heure}</div>
                <div className="min-w-0"><h3 className="text-lg">{tr(p, "titre")}<ExampleBadge show={p.exemple} /></h3>{tr(p, "description") && <p className="mt-1 text-sm text-muted">{tr(p, "description")}</p>}</div>
                <div className="text-sm text-muted sm:text-right">{V(p.lieu || p.centre)}</div>
              </div>
            ))}
          </div>
        ) : <Empty title={L("Aucun événement annoncé pour le moment", "No events announced yet")} />}
      </section>

      <div className="notice"><span>{L("Chaque département a aussi ses propres rencontres : hommes, femmes, jeunesse, enfants, chorale…", "Each department also has its own meetings: men, women, youth, children, choir…")}</span><Link className="btn btn-sm" href="/departements">{L("Programmes des départements", "Department schedules")}</Link></div>
    </main>
  );
}
