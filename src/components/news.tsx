"use client";
import Link from "next/link";
import { fmonth, today } from "@/lib/format";
import { useLang } from "@/lib/i18n";
import type { Article, WithId } from "@/lib/types";

export const visibles = (l: WithId<Article>[]) =>
  l.filter((a) => a.publie && (!a.expire || a.expire >= today()))
    .sort((a, b) => Number(!!b.epingle) - Number(!!a.epingle) || String(b.date).localeCompare(String(a.date)));

export function ArticleCard({ a, wide = false }: { a: WithId<Article>; wide?: boolean }) {
  const { L, tr, locale } = useLang();
  return (
    <Link href={`/actualites/${a.id}`} className={`group grid gap-3 border-t border-ink pt-3 text-ink no-underline ${wide ? "md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]" : "grid-rows-[auto_1fr]"}`}>
      <div className="relative aspect-[16/9] max-w-full overflow-hidden bg-surface-2">
        <svg viewBox="0 0 160 90" className="absolute inset-0 h-full w-full text-field" aria-hidden="true" preserveAspectRatio="xMidYMid slice"><path d="M80 26v38M64 40h32" stroke="currentColor" strokeWidth="2" /></svg>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {a.image && <img src={a.image} alt="" className="absolute inset-0 h-full w-full object-cover transition-[filter] duration-300 group-hover:brightness-110" onError={(e) => (e.currentTarget.style.display = "none")} />}
      </div>
      <div className={`grid content-start gap-2 ${wide ? "md:py-2" : ""}`}>
        <span className="text-[0.82rem] text-muted"><b className="font-semibold text-accent">{a.type === "annonce" ? L("Annonce", "Notice") : L("Article", "Article")}</b> · {fmonth(a.date, locale)}{a.auteur ? ` · ${a.auteur}` : ""}</span>
        <h3 className={`group-hover:text-accent ${wide ? "text-[2rem]" : "text-[1.45rem]"}`}>{tr(a, "titre")}</h3>
        {tr(a, "resume") && <p className="text-[0.92rem] text-muted">{tr(a, "resume")}</p>}
        <span className="mt-1 text-sm font-semibold">{L("Lire la suite", "Read more")} →</span>
      </div>
    </Link>
  );
}

export function AnnonceStrip({ list }: { list: WithId<Article>[] }) {
  const { L, tr, locale } = useLang();
  if (!list.length) return null;
  return (
    <div className="grid gap-2">
      {list.slice(0, 3).map((a) => (
        <Link key={a.id} href={`/actualites/${a.id}`} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-y-2 border-accent bg-accent-soft px-4 py-3 text-ink no-underline hover:text-accent">
          <span className="text-sm font-semibold text-accent">{L("Annonce", "Notice")}</span>
          <strong className="min-w-0 flex-1 font-semibold">{tr(a, "titre")}</strong>
          <span className="text-[0.82rem] text-muted"><b className="font-semibold text-accent">{a.type === "annonce" ? L("Annonce", "Notice") : L("Article", "Article")}</b> · {fmonth(a.date, locale)}</span>
        </Link>
      ))}
    </div>
  );
}
