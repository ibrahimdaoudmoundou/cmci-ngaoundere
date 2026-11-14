"use client";
import Link from "next/link";
import { useMemo } from "react";
import { PastorBlock } from "@/components/blocks";
import Logo from "@/components/Logo";
import { Chiffres, Frise2025 } from "@/components/Annee2025";
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
      <section className="page pt-8">
        <div className="une-in rubrique grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="grid content-start gap-4">
            <p className="text-[0.9rem] font-semibold text-muted">{L("Notre église · Province spirituelle de l'Adamaoua", "About us · Spiritual province of Adamawa")}</p>
            <h1 className="max-w-[16ch] text-[2.4rem] leading-[1.02] sm:text-[3.8rem]">{L("Une église locale au cœur d'une vision mondiale", "A local church at the heart of a worldwide vision")}</h1>
            <p className="max-w-[62ch] font-read text-[1.1rem] leading-[1.65]">{tr(v, "histoireLocale")}</p>
          </div>
          <figure className="m-0">
            <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/photos/2025-10-culte.jpg" alt={L("Culte à l'église centrale", "Service at the central church")} className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <figcaption className="mt-2 text-[0.82rem] text-muted">{L("Culte à l'église centrale, 2025.", "Service at the central church, 2025.")}</figcaption>
          </figure>
        </div>
        <div className="mt-10"><Chiffres /></div>
      </section>

      <div className="page grid gap-14 py-12">
        <section className="grid gap-8 md:grid-cols-2">
          <div className="grid content-start gap-3">
            <h2 className="rubrique text-[1.8rem]">{L("Vision", "Vision")}</h2>
            {paragraphs(tr(v, "vision")).map((p, i) => <p key={i} className="font-display text-[1.4rem] leading-snug sm:text-[1.65rem]">{p}</p>)}
          </div>
          <div className="grid content-start gap-3">
            <h2 className="rubrique text-[1.8rem]">{L("Mission", "Mission")}</h2>
            {paragraphs(tr(v, "mission")).map((p, i) => <p key={i} className="text-[1.05rem]">{p}</p>)}
            {valeurs.length > 0 && <>
              <h3 className="mt-4 text-[1.3rem]">{L("Ce qui nous caractérise", "What defines us")}</h3>
              <ul className="m-0 grid gap-2 p-0">
                {valeurs.map((x) => <li key={x} className="flex items-start gap-3 border-b border-line pb-2 last:border-0"><span aria-hidden className="mt-[0.75em] h-px w-3 flex-none bg-ink" />{x}</li>)}
              </ul>
            </>}
          </div>
        </section>

        <section className="grid items-center gap-8 border-y-[3px] border-ink py-8 md:grid-cols-[auto_minmax(0,1fr)]">
          <Logo size={128} />
          <div className="grid gap-3">
            <div className="intertitre">{L("La CMCI dans le monde", "CMFI worldwide")}</div>
            <h2 className="h2">{L("Membre d'une communauté missionnaire internationale", "Part of an international missionary fellowship")}</h2>
            <p className="max-w-[70ch]">{en ? CMCI_MONDIALE.en : CMCI_MONDIALE.fr}</p>
            <p className="max-w-[70ch] text-muted">{L(
              "L'église de Ngaoundéré partage cette vision et cet héritage : nous prions, nous évangélisons et nous formons des disciples ici, dans l'Adamaoua, en communion avec les églises de la CMCI à travers le Cameroun et le monde.",
              "The Ngaoundéré church shares this vision and heritage: we pray, evangelise and make disciples here in Adamawa, in fellowship with CMFI churches across Cameroon and the world.")}</p>
            <div><a href={mondial} target="_blank" rel="noopener" className="btn">{L("Site mondial de la CMCI", "CMFI worldwide website")} ↗</a></div>
          </div>
        </section>

        <section className="grid gap-5">
          <div className="intertitre">{L("Conduite de l'église", "Church leadership")}</div>
          <div className="panel">{pasteurs.loading ? <p className="text-muted">{L("Chargement…", "Loading…")}</p> : <PastorBlock p={ps[0]} big />}</div>
        </section>

        <Frise2025 />

        <section className="grid gap-4 sm:grid-cols-3">
          {[
            ["/centres", centres.data.length, L("centres de quartier", "neighbourhood centres")],
            ["/departements", deps.data.length, L("départements au service", "serving departments")],
            ["/missions", locs.data.length, L("localités et villages atteints", "localities and villages reached")],
          ].map(([href, n, l]) => (
            <Link key={String(href)} href={String(href)} className="grid gap-1 rounded-xl border border-line bg-surface p-6 text-ink no-underline hover:border-ink">
              <span className="font-display text-[2.6rem] leading-none text-green">{String(n)}</span><span className="text-muted">{String(l)}</span>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
