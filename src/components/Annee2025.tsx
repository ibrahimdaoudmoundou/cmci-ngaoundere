"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ANNEE_2025, CHIFFRES, VIE_REGULIERE } from "@/lib/annee2025";
import { useLang } from "@/lib/i18n";

/** Chiffres en exergue, comme dans un bulletin. */
export function Chiffres() {
  const { en } = useLang();
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4">
      {CHIFFRES.map((c) => (
        <div key={c.v} className="grid content-start gap-1.5 border-t-[3px] border-ink pt-3">
          <span className="font-display text-[2.4rem] leading-none tabular-nums">{c.v.replace("+", "")}{c.v.endsWith("+") && <span className="font-sans font-light">+</span>}</span>
          <span className="text-sm text-muted">{en ? c.en : c.fr}</span>
        </div>
      ))}
    </div>
  );
}

/** Frise des douze mois de 2025. */
export function Frise2025() {
  const { L, en } = useLang();
  return (
    <section id="annee-2025" className="grid scroll-mt-24 gap-6">
      <div className="rubrique">
        <h2 className="h2">{L("La main du Seigneur dans l'Église à Ngaoundéré en 2025", "The hand of the Lord on the Ngaoundéré church in 2025")}</h2>
      </div>
      <ol className="relative m-0 grid list-none gap-x-8 gap-y-6 p-0 md:grid-cols-2">
        {ANNEE_2025.map((e) => (
          <li key={e.mois} className="grid gap-4 border-t border-ink pt-4 sm:grid-cols-[170px_minmax(0,1fr)]">
            {e.photo && (
              <div className="relative aspect-[4/3] max-w-full bg-surface-2 sm:aspect-auto">
                <img src={e.photo} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              </div>
            )}
            <div className="grid content-start gap-1.5">
              <span className="text-sm font-semibold text-accent">{en ? e.mois_en : e.mois} 2025</span>
              <h3 className="text-lg leading-snug">{en ? e.titre_en : e.titre}</h3>
              <p className="text-sm text-muted">{en ? e.texte_en : e.texte}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="grid gap-3 border-t-[3px] border-ink pt-3">
        <h3 className="text-[1.4rem]">{L("Tout au long de l'année", "All year round")}</h3>
        <ul className="m-0 grid list-none gap-x-6 gap-y-2 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {(en ? VIE_REGULIERE.en : VIE_REGULIERE.fr).map((x) => (
            <li key={x} className="flex items-start gap-2.5 text-sm"><span aria-hidden className="mt-[0.55em] h-px w-3 flex-none bg-ink" />{x}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Bandeau photo pour l'accueil. */
export function Apercu2025() {
  const { L } = useLang();
  const photos = ["/photos/2025-04-camp-jeunes.jpg", "/photos/enfants-haut-plateau.jpg", "/photos/jeunesse-evangelisation.jpg", "/photos/2025-12-jubile.jpg", "/photos/jeunesse-feu.jpg"];
  return (
    <section className="grid gap-6">
      <div className="rubrique flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="h2">{L("Ce que Dieu a fait en 2025", "What God did in 2025")}</h2>
        <Link className="lien text-[0.95rem] font-semibold" href="/eglise#annee-2025">{L("Voir l'année 2025", "See 2025")} →</Link>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {photos.map((p, i) => (
          <Link key={p} href="/eglise#annee-2025" className={`relative block overflow-hidden bg-surface-2 ${i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-[4/3]"}`}>
            <img src={p} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-[filter] duration-300 hover:brightness-110" />
          </Link>
        ))}
      </div>
    </section>
  );
}
