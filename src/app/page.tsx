"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import Logo from "@/components/Logo";
import { BookCard, BuyModal, ContactBlock, PastorBlock } from "@/components/blocks";
import { AnnonceStrip, ArticleCard, visibles } from "@/components/news";
import { Empty } from "@/components/ui";
import { useCollection, useDocument } from "@/lib/hooks";
import { useLang } from "@/lib/i18n";
import { sortPasteurs, sortProgramme } from "@/lib/sort";
import { CMCI_GLOBAL_URL, fshort } from "@/lib/format";
import { VISION_DEFAUT } from "@/lib/vision";
import type { Activite, Article, Centre, Departement, Livre, Localite, Pasteur, SiteConfig, Vision, WithId } from "@/lib/types";

function SectionHead({ eyebrow, title, href, cta }: { eyebrow: string; title: string; href?: string; cta?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><div className="eyebrow">{eyebrow}</div><h2 className="h2 mt-1">{title}</h2></div>
      {href && <Link className="btn-ghost" href={href}>{cta}</Link>}
    </div>
  );
}

export default function Accueil() {
  const { L, V, tr, en } = useLang();
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
      {/* ---------- Ouverture ---------- */}
      <section className="relative overflow-hidden bg-band text-band-ink">
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMin slice" viewBox="0 0 1200 600">
          <defs>
            <radialGradient id="glow" cx="0.72" cy="-0.05" r="0.75"><stop offset="0" stopColor="#5CCBF5" stopOpacity=".38" /><stop offset=".55" stopColor="#5CCBF5" stopOpacity=".05" /><stop offset="1" stopColor="#5CCBF5" stopOpacity="0" /></radialGradient>
          </defs>
          <rect width="1200" height="600" fill="url(#glow)" />
          {Array.from({ length: 14 }, (_, i) => <line key={i} x1="860" y1="-20" x2={360 + i * 70} y2="640" stroke="#5CCBF5" strokeOpacity=".07" strokeWidth="1.2" />)}
          <path d="M0 520 C 180 470 330 500 470 470 S 760 420 900 455 1100 430 1200 445 V600 H0Z" fill="#04244A" opacity=".55" />
          <path d="M0 560 C 220 530 380 555 560 528 S 900 505 1200 530 V600 H0Z" fill="#031B38" opacity=".7" />
        </svg>
        <div className="page relative grid items-end gap-8 pb-14 pt-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-[0.78rem] uppercase tracking-[0.12em] text-band-muted">
              <Logo size={64} /> Ngaoundéré · Adamaoua · {L("Cameroun", "Cameroon")}
            </div>
            <h1 className="mt-6 text-[2.2rem] leading-[1.08] tracking-[0.01em] sm:text-[3.5rem]">
              {en ? <>Christian Missionary<br />Fellowship <span className="text-sun">International</span></> : <>Communauté Missionnaire<br />Chrétienne <span className="text-sun">Internationale</span></>}
            </h1>
            <p className="mt-5 max-w-[56ch] font-display text-[1.15rem] leading-snug text-band-ink/90">
              {config?.messageAccueil ? config.messageAccueil : L(
                "« Allez, faites de toutes les nations des disciples, les baptisant au nom du Père, du Fils et du Saint-Esprit. »",
                "“Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost.”")}
              {!config?.messageAccueil && <span className="ml-2 font-sans text-sm font-semibold text-sun">{L("Matthieu 28:19", "Matthew 28:19")}</span>}
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <Link className="btn-gold" href="/programme">{L("Nous rejoindre au culte", "Join us for worship")}</Link>
              <Link className="btn-band" href="/rendez-vous">{L("Prendre rendez-vous", "Book an appointment")}</Link>
              <Link className="btn-band" href="/eglise">{L("Notre vision", "Our vision")}</Link>
            </div>
          </div>
          <aside className="min-w-0 rounded-2xl border border-white/15 bg-white/[0.06] p-5 backdrop-blur-sm" aria-label={L("Programme", "Schedule")}>
            <div className="flex items-center justify-between gap-3"><div className="eyebrow text-sun">{L("Église centrale · cette semaine", "Central church · this week")}</div><Link href="/programme" className="text-xs text-band-muted">{L("Tout voir", "See all")} →</Link></div>
            <ul className="mt-3 grid gap-2.5">
              {pr.length ? pr.map((p) => (
                <li key={p.id} className="flex justify-between gap-3 border-b border-dashed border-white/15 pb-2.5 last:border-0 last:pb-0">
                  <span>{tr(p, "titre")}</span><span className="whitespace-nowrap font-mono text-sm text-sun">{p.date ? fshort(p.date) : V(p.jour)} {p.heure}</span>
                </li>
              )) : <li className="text-band-muted">{prog.loading ? L("Chargement…", "Loading…") : L("Le programme sera publié ici.", "The schedule will be published here.")}</li>}
            </ul>
          </aside>
        </div>
      </section>

      <div className="page grid gap-14 py-12">
        <AnnonceStrip list={annonces} />

        {/* ---------- Vision + CMCI mondiale ---------- */}
        <section className="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="grid content-start gap-4">
            <div className="eyebrow">{L("Notre vision", "Our vision")}</div>
            <p className="font-display text-[1.45rem] leading-snug sm:text-[1.8rem]">{visionText}</p>
            <div><Link href="/eglise" className="btn-ghost">{L("Découvrir notre église", "Discover our church")}</Link></div>
          </div>
          <div className="panel grid content-start gap-3 bg-surface-2">
            <div className="eyebrow">{L("Une église locale, une famille mondiale", "A local church, a worldwide family")}</div>
            <p className="text-[0.95rem]">{L(
              "L'église de Ngaoundéré fait partie de la Communauté Missionnaire Chrétienne Internationale, née à Yaoundé en 1975 et présente aujourd'hui dans de nombreuses nations.",
              "The Ngaoundéré church belongs to the Christian Missionary Fellowship International, founded in Yaoundé in 1975 and present today in many nations.")}</p>
            <a href={vision?.siteMondial || CMCI_GLOBAL_URL} target="_blank" rel="noopener" className="text-sm font-semibold">{L("Visiter le site mondial de la CMCI", "Visit the CMFI worldwide website")} ↗</a>
          </div>
        </section>

        {/* ---------- Pasteur + contact ---------- */}
        <section className="grid gap-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="panel grid gap-4"><div className="eyebrow">{L("Notre pasteur", "Our pastor")}</div>{pasteurs.loading ? <p className="text-muted">{L("Chargement…", "Loading…")}</p> : <PastorBlock p={ps[0]} />}</div>
          <div className="panel grid content-start gap-4"><div className="eyebrow">{L("Nous joindre", "Contact us")}</div><ContactBlock c={config} /></div>
        </section>

        {/* ---------- Actualités ---------- */}
        {news.length > 0 && (
          <section className="grid gap-6">
            <SectionHead eyebrow={L("Actualités", "News")} title={L("Ce que Dieu fait parmi nous", "What God is doing among us")} href="/actualites" cta={L("Toutes les actualités", "All news")} />
            <div className="grid gap-5 md:grid-cols-3">{news.map((a) => <ArticleCard key={a.id} a={a} />)}</div>
          </section>
        )}

        {/* ---------- Départements ---------- */}
        <section className="grid gap-6">
          <SectionHead eyebrow={L("Départements", "Departments")} title={L("Chacun a sa place pour servir", "There is a place for everyone to serve")} href="/departements" cta={L("Voir les départements", "See departments")} />
          {deps.data.length ? (
            <div className="flex flex-wrap gap-2.5">
              {[...deps.data].sort((a, b) => (Number(a.ordre) || 99) - (Number(b.ordre) || 99)).map((d) => (
                <Link key={d.id} href={`/departements#${d.id}`} className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink no-underline hover:border-sun">{tr(d, "nom")}</Link>
              ))}
            </div>
          ) : <Empty title={deps.loading ? L("Chargement…", "Loading…") : L("Les départements seront présentés ici", "Departments will be presented here")} />}
        </section>

        {/* ---------- Œuvre missionnaire ---------- */}
        <section className="grid items-center gap-6 overflow-hidden rounded-2xl bg-band p-6 text-band-ink sm:p-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="grid gap-3">
            <div className="eyebrow text-sun">{L("Œuvre missionnaire", "Outreach")}</div>
            <h2 className="h2">{L("Au-delà de la ville : les localités et les villages", "Beyond the city: localities and villages")}</h2>
            <p className="max-w-[56ch] text-band-muted">{L(
              "L'église de Ngaoundéré porte l'Évangile dans les localités et les villages voisins : évangélisation, communion fraternelle, prière et soutien aux familles.",
              "The Ngaoundéré church carries the Gospel to neighbouring localities and villages: evangelism, fellowship, prayer and support for families.")}</p>
            <div><Link href="/missions" className="btn-gold">{L("Découvrir l'œuvre", "Discover the outreach")}</Link></div>
          </div>
          <ul className="grid gap-2">
            {locs.data.slice(0, 5).map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-3 rounded-lg border border-white/15 px-4 py-2.5">
                <span className="font-semibold">{l.nom}</span><span className="text-sm text-band-muted">{V(l.type)}{l.distance ? ` · ${l.distance} km` : ""}</span>
              </li>
            ))}
            {!locs.data.length && <li className="rounded-lg border border-dashed border-white/20 px-4 py-6 text-center text-band-muted">{L("Les lieux d'implantation seront présentés ici.", "Outreach places will be listed here.")}</li>}
          </ul>
        </section>

        {/* ---------- Centres ---------- */}
        <section className="grid gap-6">
          <SectionHead eyebrow={L("Centres rattachés", "Neighbourhood centres")} title={L("L'église dans les quartiers de Ngaoundéré", "The church in Ngaoundéré's neighbourhoods")} href="/centres" cta={L("Voir la carte", "See the map")} />
          {centres.data.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {centres.data.map((c) => (
                <Link key={c.id} href={`/centres#${c.id}`} className="grid gap-1.5 rounded-xl border border-line bg-surface p-5 text-ink no-underline hover:border-sun">
                  <div className="eyebrow text-muted">{L("Quartier", "District")} {c.quartier || c.nom}</div>
                  <h3 className="text-xl">{c.nom}</h3>
                  <p className="text-sm text-muted">{c.horaires || L("Horaires à venir", "Times to be announced")}</p>
                </Link>
              ))}
            </div>
          ) : <Empty title={centres.loading ? L("Chargement…", "Loading…") : L("Les centres apparaîtront ici", "Centres will appear here")} />}
        </section>

        {/* ---------- Librairie ---------- */}
        {books.length > 0 && (
          <section className="grid gap-6">
            <SectionHead eyebrow={L("Librairie", "Bookshop")} title={L("Livres pour grandir dans la foi", "Books to grow in faith")} href="/librairie" cta={L("Toute la librairie", "Whole bookshop")} />
            <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(210px,1fr))]">{books.map((b) => <BookCard key={b.id} b={b} onBuy={setBuy} />)}</div>
          </section>
        )}
      </div>
      {buy && <BuyModal b={buy} centres={centres.data.map((c) => c.nom)} onClose={() => setBuy(null)} />}
    </main>
  );
}
