"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ANNEE_2025, CHIFFRES, VIE_REGULIERE } from "@/lib/annee2025";
import { useLang } from "@/lib/i18n";

export function Chiffres({ onBand = false }: { onBand?: boolean }) {
  const { en } = useLang();
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {CHIFFRES.map((c) => (
        <div key={c.v} className={`grid gap-1 rounded-xl p-4 ${onBand ? "border border-white/15 bg-white/[0.06]" : "border border-line bg-surface"}`}>
          <span className={`font-display text-[2rem] leading-none ${onBand ? "text-sun" : "text-green"}`}>{c.v}</span>
          <span className={`text-sm ${onBand ? "text-band-muted" : "text-muted"}`}>{en ? c.en : c.fr}</span>
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
      <div>
        <div className="eyebrow">{L("Rétrospective", "Looking back")}</div>
        <h2 className="h2 mt-1">{L("La main du Seigneur dans l'Église à Ngaoundéré en 2025", "The hand of the Lord on the Ngaoundéré church in 2025")}</h2>
      </div>
      <ol className="relative m-0 grid list-none gap-5 p-0 md:grid-cols-2">
        {ANNEE_2025.map((e) => (
          <li key={e.mois} className="grid overflow-hidden rounded-xl border border-line bg-surface sm:grid-cols-[180px_minmax(0,1fr)]">
            {e.photo && (
              <div className="relative aspect-[4/3] max-w-full bg-surface-2 sm:aspect-auto">
                <img src={e.photo} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              </div>
            )}
            <div className="grid content-start gap-1.5 p-4">
              <span className="font-mono text-xs font-medium text-gold">{en ? e.mois_en : e.mois} 2025</span>
              <h3 className="text-lg leading-snug">{en ? e.titre_en : e.titre}</h3>
              <p className="text-sm text-muted">{en ? e.texte_en : e.texte}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="panel grid gap-3">
        <div className="eyebrow">{L("Tout au long de l'année", "All year round")}</div>
        <ul className="m-0 grid list-none gap-x-6 gap-y-2 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {(en ? VIE_REGULIERE.en : VIE_REGULIERE.fr).map((x) => (
            <li key={x} className="flex items-start gap-2.5 text-sm"><span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-sun" />{x}</li>
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
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><div className="eyebrow">{L("En images", "In pictures")}</div><h2 className="h2 mt-1">{L("Ce que Dieu a fait en 2025", "What God did in 2025")}</h2></div>
        <Link className="btn-ghost" href="/eglise#annee-2025">{L("Voir l'année 2025", "See 2025")}</Link>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {photos.map((p, i) => (
          <Link key={p} href="/eglise#annee-2025" className={`relative block overflow-hidden rounded-xl bg-surface-2 ${i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-[4/3]"}`}>
            <img src={p} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-500 hover:scale-[1.03]" />
          </Link>
        ))}
      </div>
      <Chiffres />
    </section>
  );
}
