"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Apercu2025 } from "@/components/Annee2025";
import { CHIFFRES } from "@/lib/annee2025";
import { BookCard, BuyModal, ContactBlock, PastorBlock } from "@/components/blocks";
import { AnnonceStrip, ArticleCard, visibles } from "@/components/news";
import { Empty } from "@/components/ui";
import { useCollection, useDocument } from "@/lib/hooks";
import { useLang } from "@/lib/i18n";
import { sortPasteurs, sortProgramme } from "@/lib/sort";
import { CMCI_GLOBAL_URL, fshort } from "@/lib/format";
import { VISION_DEFAUT } from "@/lib/vision";
import type { Activite, Article, Centre, Departement, Livre, Localite, Pasteur, SiteConfig, Vision, WithId } from "@/lib/types";

/** Tête de rubrique du bulletin : filet épais, titre, renvoi. */
function Rubrique({ title, href, cta, children }: { title: string; href?: string; cta?: string; children?: React.ReactNode }) {
  return (
    <div className="rubrique flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
      <h2 className="h2">{title}</h2>
      {href && <Link className="lien text-[0.95rem] font-semibold" href={href}>{cta} →</Link>}
      {children}
    </div>
  );
}

/** Lundi de la semaine en cours, pour la date du bulletin. */
function semaine(locale: string) {
  const d = new Date(); d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
}

export default function Accueil() {
  const { L, V, tr, en, locale } = useLang();
  const { data: config } = useDocument<SiteConfig>("config/site");
  const { data: vision } = useDocument<Vision>("config/vision");
  const pasteurs = useCollection<Pasteur>("pasteurs");
  const centres = useCollection<Centre>("centres");
  const livres = useCollection<Livre>("livres");
  const prog = useCollection<Activite>("programme");
  const articles = useCollection<Article>("articles", ["publie", "==", true]);
  const deps = useCollection<Departement>("departements");
  const locs = useCollection<Localite>("localites");
  const [buy, setBuy] = useState<WithId<Livre> | null>(null);

  const ps = useMemo(() => sortPasteurs(pasteurs.data), [pasteurs.data]);
  const pr = useMemo(() => sortProgramme(prog.data).filter((p) => !p.centre || p.centre === "Église centrale").slice(0, 5), [prog.data]);
  const pub = useMemo(() => visibles(articles.data), [articles.data]);
  const annonces = pub.filter((a) => a.type === "annonce");
  const news = pub.filter((a) => a.type === "article").slice(0, 3);
  const books = livres.data.filter((b) => b.visible !== false).slice(0, 4);
  const v = { ...VISION_DEFAUT, ...Object.fromEntries(Object.entries(vision || {}).filter(([, x]) => x)) };
  const visionText = tr(v, "vision");

  return (
    <main>
      {/* ---------- La une ---------- */}
      <section className="page pt-6 sm:pt-8">
        <div className="une-in flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-ink pb-2 text-[0.85rem] text-muted">
          <span>Ngaoundéré · Adamaoua · {L("Cameroun", "Cameroon")}</span>
          <span suppressHydrationWarning>{L("Semaine du", "Week of")} {semaine(locale)}</span>
        </div>
        <h1 className="une-in une-in-2 mt-5 text-[2.5rem] leading-[0.98] sm:text-[4.2rem] lg:text-[5.4rem]">
          {en ? <>Christian Missionary Fellowship International</> : <>Communauté Missionnaire Chrétienne Internationale</>}
        </h1>
        <p className="une-in une-in-2 mt-3 text-[1.05rem] text-muted">{L("Église de Ngaoundéré · Pasteur Samuel Yadiaya · 11 centres dans les quartiers", "Ngaoundéré church · Pastor Samuel Yadiaya · 11 neighbourhood centres")}</p>

        <div className="une-in une-in-3 mt-6 grid gap-8 border-t-[3px] border-ink pt-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:divide-x lg:divide-line">
          <article className="grid content-start gap-4">
            <figure className="m-0">
              <div className="relative aspect-[16/9] overflow-hidden bg-surface-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/photos/2025-10-evangelisation.jpg" alt={L("Évangélisation de l'Église dans les rues de Ngaoundéré", "Church-wide evangelism in the streets of Ngaoundéré")} className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <figcaption className="mt-2 text-[0.82rem] text-muted">{L("Octobre 2025 : toute l'église est sortie annoncer l'Évangile, en ville et dans les localités.", "October 2025: the whole church went out to preach the Gospel, in town and in the localities.")}</figcaption>
            </figure>
            <blockquote className="m-0 font-display text-[1.5rem] leading-[1.2] sm:text-[2rem]">
              {config?.messageAccueil ? config.messageAccueil : L(
                "« Allez, faites de toutes les nations des disciples, les baptisant au nom du Père, du Fils et du Saint-Esprit. »",
                "“Go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.”")}
              {!config?.messageAccueil && <footer className="mt-2 font-sans text-[0.95rem] font-semibold text-accent">{L("Matthieu 28:19", "Matthew 28:19")}</footer>}
            </blockquote>
            <div className="flex flex-wrap gap-2.5">
              <Link className="btn" href="/programme">{L("Venir au culte cette semaine", "Come to worship this week")}</Link>
              <Link className="btn-ghost" href="/eglise">{L("Lire notre vision", "Read our vision")}</Link>
            </div>
          </article>

          <aside className="grid content-start gap-3 lg:pl-8" aria-labelledby="cette-semaine">
            <h2 id="cette-semaine" className="text-[1.6rem]">{L("Cette semaine à l'église centrale", "This week at the central church")}</h2>
            <ul className="m-0 grid list-none p-0">
              {pr.length ? pr.map((p) => (
                <li key={p.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3 border-b border-line py-2.5">
                  <span className="font-semibold">{tr(p, "titre")}</span>
                  <span className="whitespace-nowrap text-sm tabular-nums text-muted">{p.date ? fshort(p.date) : V(p.jour)} {p.heure}</span>
                </li>
              )) : <li className="py-3 text-muted">{prog.loading ? L("Chargement…", "Loading…") : L("Le programme sera publié ici.", "The schedule will be published here.")}</li>}
            </ul>
            <Link href="/programme" className="lien w-fit text-[0.95rem] font-semibold">{L("Tout le programme", "Full schedule")} →</Link>
            <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-5 border-t-[3px] border-ink pt-4">
              {CHIFFRES.map((c) => (
                <div key={c.v} className="grid gap-1">
                  <span className="font-display text-[2rem] leading-none tabular-nums">{c.v.replace("+", "")}{c.v.endsWith("+") && <span className="font-sans font-light">+</span>}</span>
                  <span className="text-[0.82rem] leading-snug text-muted">{en ? c.en : c.fr}</span>
                </div>
              ))}
            </div>
            <p className="text-[0.78rem] text-muted">{L("Chiffres de l'année 2025.", "Figures for 2025.")}</p>
          </aside>
        </div>
      </section>

      <div className="page grid gap-16 py-14">
        <AnnonceStrip list={annonces} />

        {/* ---------- Vision + CMCI mondiale ---------- */}
        <section className="grid gap-6">
          <Rubrique title={L("Notre vision", "Our vision")} href="/eglise" cta={L("Découvrir notre église", "Discover our church")} />
          <div className="grid gap-8 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:divide-x md:divide-line">
            <p className="font-read text-[1.3rem] leading-[1.55] sm:text-[1.5rem]">{visionText}</p>
            <div className="grid content-start gap-3 md:pl-8">
              <h3 className="text-[1.3rem]">{L("Une église locale, une famille mondiale", "A local church, a worldwide family")}</h3>
              <p className="text-[0.95rem] text-muted">{L(
                "L'église de Ngaoundéré fait partie de la Communauté Missionnaire Chrétienne Internationale, née à Yaoundé en 1975 et présente aujourd'hui dans de nombreuses nations.",
                "The Ngaoundéré church belongs to the Christian Missionary Fellowship International, founded in Yaoundé in 1975 and present today in many nations.")}</p>
              <a href={vision?.siteMondial || CMCI_GLOBAL_URL} target="_blank" rel="noopener" className="text-sm font-semibold">{L("Visiter le site mondial de la CMCI", "Visit the CMFI worldwide website")} ↗</a>
            </div>
          </div>
        </section>

        <Apercu2025 />

        {/* ---------- Pasteur + contact ---------- */}
        <section className="grid gap-6">
          <Rubrique title={L("Notre pasteur", "Our pastor")} href="/pasteurs" cta={L("Tous les pasteurs", "All pastors")} />
          <div className="grid gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:divide-x md:divide-line">
            <div>{pasteurs.loading ? <p className="text-muted">{L("Chargement…", "Loading…")}</p> : <PastorBlock p={ps[0]} />}</div>
            <div className="grid content-start gap-4 md:pl-8"><h3 className="text-[1.3rem]">{L("Nous joindre", "Contact us")}</h3><ContactBlock c={config} /></div>
          </div>
        </section>

        {/* ---------- Actualités ---------- */}
        {news.length > 0 && (
          <section className="grid gap-6">
            <Rubrique title={L("Ce que Dieu fait parmi nous", "What God is doing among us")} href="/actualites" cta={L("Toutes les actualités", "All news")} />
            <div className="grid gap-8 md:grid-cols-3">{news.map((a) => <ArticleCard key={a.id} a={a} />)}</div>
          </section>
        )}

        {/* ---------- Départements ---------- */}
        <section className="grid gap-6">
          <Rubrique title={L("Chacun a sa place pour servir", "There is a place for everyone to serve")} href="/departements" cta={L("Voir les départements", "See departments")} />
          {deps.data.length ? (
            <ul className="m-0 grid list-none gap-x-8 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {[...deps.data].sort((a, b) => (Number(a.ordre) || 99) - (Number(b.ordre) || 99)).map((d) => (
                <li key={d.id} className="border-b border-line">
                  <Link href={`/departements#${d.id}`} className="flex min-h-[48px] items-center justify-between gap-3 py-2 font-display text-[1.2rem] text-ink no-underline hover:text-accent">{tr(d, "nom")}<span aria-hidden className="font-sans text-muted">→</span></Link>
                </li>
              ))}
            </ul>
          ) : <Empty title={deps.loading ? L("Chargement…", "Loading…") : L("Les départements seront présentés ici", "Departments will be presented here")} />}
        </section>

        {/* ---------- Œuvre missionnaire ---------- */}
        <section className="grid gap-6">
          <Rubrique title={L("Au-delà de la ville : les localités et les villages", "Beyond the city: localities and villages")} href="/missions" cta={L("Découvrir l'œuvre", "Discover the outreach")} />
          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:divide-x md:divide-line">
            <p className="max-w-[56ch] font-read text-[1.1rem] leading-[1.65]">{L(
              "L'église de Ngaoundéré porte l'Évangile dans les localités et les villages voisins : évangélisation, communion fraternelle, prière et soutien aux familles.",
              "The Ngaoundéré church carries the Gospel to neighbouring localities and villages: evangelism, fellowship, prayer and support for families.")}</p>
            <ul className="m-0 grid list-none content-start p-0 md:pl-8">
              {locs.data.slice(0, 6).map((l) => (
                <li key={l.id} className="flex items-baseline justify-between gap-3 border-b border-line py-2.5">
                  <span className="font-semibold">{l.nom}</span><span className="text-sm tabular-nums text-muted">{V(l.type)}{l.distance ? ` · ${l.distance} km` : ""}</span>
                </li>
              ))}
              {!locs.data.length && <li className="py-3 text-muted">{locs.loading ? L("Chargement…", "Loading…") : L("Les lieux d'implantation seront présentés ici.", "Outreach places will be listed here.")}</li>}
            </ul>
          </div>
        </section>

        {/* ---------- Centres ---------- */}
        <section className="grid gap-6">
          <Rubrique title={L("L'église dans les quartiers de Ngaoundéré", "The church in Ngaoundéré's neighbourhoods")} href="/centres" cta={L("Voir la carte", "See the map")} />
          {centres.data.length ? (
            <ol className="m-0 grid list-none gap-x-8 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {centres.data.map((c, i) => (
                <li key={c.id} className="border-b border-line">
                  <Link href={`/centres#${c.id}`} className="group grid grid-cols-[2.4rem_minmax(0,1fr)] items-baseline gap-2 py-3 text-ink no-underline">
                    <span className="font-display text-xl tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <span><span className="block font-display text-[1.25rem] leading-tight group-hover:text-accent">{c.nom}</span>
                      <span className="text-sm text-muted">{c.horaires || L("Horaires à venir", "Times to be announced")}</span></span>
                  </Link>
                </li>
              ))}
            </ol>
          ) : <Empty title={centres.loading ? L("Chargement…", "Loading…") : L("Les centres apparaîtront ici", "Centres will appear here")} />}
        </section>

        {/* ---------- Librairie ---------- */}
        {books.length > 0 && (
          <section className="grid gap-6">
            <Rubrique title={L("Livres pour grandir dans la foi", "Books to grow in faith")} href="/librairie" cta={L("Toute la librairie", "Whole bookshop")} />
            <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(210px,1fr))]">{books.map((b) => <BookCard key={b.id} b={b} onBuy={setBuy} />)}</div>
          </section>
        )}
      </div>
      {buy && <BuyModal b={buy} centres={centres.data.map((c) => c.nom)} onClose={() => setBuy(null)} />}
    </main>
  );
}
