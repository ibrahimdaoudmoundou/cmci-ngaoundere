"use client";
import Link from "next/link";
import { useMemo } from "react";
import { PastorBlock } from "@/components/blocks";
import Logo from "@/components/Logo";
import { useCollection, useDocument } from "@/lib/hooks";
import { useLang } from "@/lib/i18n";
import { CMCI_GLOBAL_URL } from "@/lib/format";
import { paragraphs, sortPasteurs } from "@/lib/sort";
import { CMCI_MONDIALE, VISION_DEFAUT } from "@/lib/vision";
import type { Centre, Departement, Localite, Pasteur, Vision } from "@/lib/types";

export default function Eglise() {
  const { L, tr, en } = useLang();
  const { data: vision } = useDocument<Vision>("config/vision");
  const pasteurs = useCollection<Pasteur>("pasteurs");
  const centres = useCollection<Centre>("centres");
  const deps = useCollection<Departement>("departements");
  const locs = useCollection<Localite>("localites");
  const ps = useMemo(() => sortPasteurs(pasteurs.data), [pasteurs.data]);
  const v = { ...VISION_DEFAUT, ...Object.fromEntries(Object.entries(vision || {}).filter(([, x]) => x)) };
  const mondial = vision?.siteMondial || CMCI_GLOBAL_URL;
  const valeurs = tr(v, "valeurs").split(/\r?\n/).map((s) => s.trim()).filter(Boolean);

  return (
    <main>
      <section className="relative overflow-hidden bg-band text-band-ink">
        <div className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-sun/20 blur-3xl" aria-hidden="true" />
        <div className="page relative grid gap-5 pb-14 pt-12">
          <div className="eyebrow text-sun">{L("Notre église", "About us")}</div>
          <h1 className="max-w-[18ch] text-[2.2rem] leading-[1.08] sm:text-[3.2rem]">{L("Une église locale au cœur d'une vision mondiale", "A local church at the heart of a worldwide vision")}</h1>
          <p className="max-w-[62ch] text-band-muted">{tr(v, "histoireLocale")}</p>
        </div>
      </section>

      <div className="page grid gap-14 py-12">
        <section className="grid gap-8 md:grid-cols-2">
          <div className="grid content-start gap-3">
            <div className="eyebrow">{L("Vision", "Vision")}</div>
            {paragraphs(tr(v, "vision")).map((p, i) => <p key={i} className="font-display text-[1.4rem] leading-snug sm:text-[1.65rem]">{p}</p>)}
          </div>
          <div className="grid content-start gap-3">
            <div className="eyebrow">{L("Mission", "Mission")}</div>
            {paragraphs(tr(v, "mission")).map((p, i) => <p key={i} className="text-[1.05rem]">{p}</p>)}
            {valeurs.length > 0 && <>
              <div className="eyebrow mt-4">{L("Ce qui nous caractérise", "What defines us")}</div>
              <ul className="m-0 grid gap-2 p-0">
                {valeurs.map((x) => <li key={x} className="flex items-start gap-3 border-b border-line pb-2 last:border-0"><span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-sun" />{x}</li>)}
              </ul>
            </>}
          </div>
        </section>

        <section className="grid items-center gap-8 rounded-2xl border border-line bg-surface p-6 sm:p-10 md:grid-cols-[auto_minmax(0,1fr)]">
          <Logo size={128} />
          <div className="grid gap-3">
            <div className="eyebrow">{L("La CMCI dans le monde", "CMFI worldwide")}</div>
            <h2 className="h2">{L("Membre d'une communauté missionnaire internationale", "Part of an international missionary fellowship")}</h2>
            <p className="max-w-[70ch]">{en ? CMCI_MONDIALE.en : CMCI_MONDIALE.fr}</p>
            <p className="max-w-[70ch] text-muted">{L(
              "L'église de Ngaoundéré partage cette vision et cet héritage : nous prions, nous évangélisons et nous formons des disciples ici, dans l'Adamaoua, en communion avec les églises de la CMCI à travers le Cameroun et le monde.",
              "The Ngaoundéré church shares this vision and heritage: we pray, evangelise and make disciples here in Adamawa, in fellowship with CMFI churches across Cameroon and the world.")}</p>
            <div><a href={mondial} target="_blank" rel="noopener" className="btn">{L("Site mondial de la CMCI", "CMFI worldwide website")} ↗</a></div>
          </div>
        </section>

        <section className="grid gap-5">
          <div className="eyebrow">{L("Conduite de l'église", "Church leadership")}</div>
          <div className="panel">{pasteurs.loading ? <p className="text-muted">{L("Chargement…", "Loading…")}</p> : <PastorBlock p={ps[0]} big />}</div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {[
            ["/centres", centres.data.length, L("centres de quartier", "neighbourhood centres")],
            ["/departements", deps.data.length, L("départements au service", "serving departments")],
            ["/missions", locs.data.length, L("localités et villages atteints", "localities and villages reached")],
          ].map(([href, n, l]) => (
            <Link key={String(href)} href={String(href)} className="grid gap-1 rounded-xl border border-line bg-surface p-6 text-ink no-underline hover:border-sun">
              <span className="font-display text-[2.6rem] leading-none text-green">{String(n)}</span><span className="text-muted">{String(l)}</span>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
