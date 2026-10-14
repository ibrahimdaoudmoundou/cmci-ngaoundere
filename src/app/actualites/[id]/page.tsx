"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Spinner } from "@/components/ui";
import { useDocument } from "@/lib/hooks";
import { useLang } from "@/lib/i18n";
import { fmonth } from "@/lib/format";
import { paragraphs } from "@/lib/sort";
import type { Article } from "@/lib/types";

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const { L, tr, locale } = useLang();
  const { data: a, loading, error } = useDocument<Article>(id ? `articles/${id}` : null);
  if (loading) return <main className="page py-10"><Spinner /></main>;
  if (!a || error) return (
    <main className="page grid gap-4 py-10">
      <h1 className="h2">{L("Publication introuvable", "Post not found")}</h1>
      <p className="text-muted">{L("Elle a peut-être été retirée.", "It may have been removed.")}</p>
      <div><Link className="btn-ghost" href="/actualites">← {L("Toutes les actualités", "All news")}</Link></div>
    </main>
  );
  return (
    <main className="pb-6">
      <header className="relative overflow-hidden bg-band text-band-ink">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {a.image && <img src={a.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" onError={(e) => (e.currentTarget.style.display = "none")} />}
        <div className="page relative grid max-w-[820px] gap-4 pb-12 pt-10">
          <Link href="/actualites" className="text-sm text-band-muted no-underline">← {L("Actualités", "News")}</Link>
          <span className="w-fit rounded-full bg-sun px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-[#1B140A]">{a.type === "annonce" ? L("Annonce", "Announcement") : "Article"}</span>
          <h1 className="text-[2rem] leading-tight sm:text-[2.8rem]">{tr(a, "titre")}</h1>
          <p className="font-mono text-sm text-band-muted">{fmonth(a.date, locale)}{a.auteur ? ` · ${a.auteur}` : ""}</p>
        </div>
      </header>
      <article className="page grid max-w-[820px] gap-5 py-10 text-[1.06rem] leading-[1.75]">
        {tr(a, "resume") && <p className="font-display text-[1.3rem] leading-snug">{tr(a, "resume")}</p>}
        {paragraphs(tr(a, "contenu")).map((p, i) => <p key={i} className="whitespace-pre-line">{p}</p>)}
        {a.expire && <p className="text-sm text-muted">{L("Valable jusqu'au", "Valid until")} {fmonth(a.expire, locale)}.</p>}
      </article>
    </main>
  );
}
