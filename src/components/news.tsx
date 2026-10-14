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
    <Link href={`/actualites/${a.id}`} className={`group grid overflow-hidden rounded-xl border border-line bg-surface text-ink no-underline transition hover:border-sun ${wide ? "md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]" : "grid-rows-[auto_1fr]"}`}>
      <div className="relative aspect-[16/9] max-w-full overflow-hidden bg-band">
        <svg viewBox="0 0 160 90" className="absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
          <defs><radialGradient id={`g${a.id}`} cx="0.5" cy="0" r="1"><stop offset="0" stopColor="#E2B65C" stopOpacity=".55" /><stop offset="1" stopColor="#163A29" stopOpacity="0" /></radialGradient></defs>
          <rect width="160" height="90" fill={`url(#g${a.id})`} />
          <path d="M80 18v40M66 32h28" stroke="#EEF3EC" strokeOpacity=".5" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {a.image && <img src={a.image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" onError={(e) => (e.currentTarget.style.display = "none")} />}
        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wider ${a.type === "annonce" ? "bg-sun text-[#1B140A]" : "bg-white/90 text-[#163A29]"}`}>
          {a.type === "annonce" ? L("Annonce", "Announcement") : L("Article", "Article")}
        </span>
      </div>
      <div className={`grid content-start gap-2 ${wide ? "p-6 md:p-8" : "p-5"}`}>
        <span className="font-mono text-xs text-muted">{fmonth(a.date, locale)}{a.auteur ? ` · ${a.auteur}` : ""}</span>
        <h3 className={wide ? "text-[1.7rem]" : "text-xl"}>{tr(a, "titre")}</h3>
        {tr(a, "resume") && <p className="text-[0.92rem] text-muted">{tr(a, "resume")}</p>}
        <span className="mt-1 text-sm font-semibold text-green">{L("Lire la suite", "Read more")} →</span>
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
        <Link key={a.id} href={`/actualites/${a.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-sun/50 bg-gold-soft px-4 py-3 text-ink no-underline hover:border-sun">
          <span className="rounded-full bg-sun px-2.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-wider text-[#1B140A]">{L("Annonce", "Notice")}</span>
          <strong className="min-w-0 flex-1 font-semibold">{tr(a, "titre")}</strong>
          <span className="font-mono text-xs text-muted">{fmonth(a.date, locale)}</span>
        </Link>
      ))}
    </div>
  );
}
