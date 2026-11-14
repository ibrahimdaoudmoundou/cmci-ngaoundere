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
      <header className="page une-in grid max-w-[860px] gap-4 pt-8">
        <Link href="/actualites" className="lien w-fit text-sm text-muted">← {L("Actualités", "News")}</Link>
        <div className="rubrique grid gap-3">
          <p className="text-[0.9rem] font-semibold text-accent">{a.type === "annonce" ? L("Annonce", "Announcement") : "Article"} <span className="font-normal tabular-nums text-muted">· {fmonth(a.date, locale)}{a.auteur ? ` · ${a.auteur}` : ""}</span></p>
          <h1 className="text-[2.2rem] leading-[1.05] sm:text-[3.2rem]">{tr(a, "titre")}</h1>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {a.image && <img src={a.image} alt="" className="mt-2 aspect-[16/9] w-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />}
      </header>
      <article className="page prose-read grid max-w-[860px] gap-5 py-10">
        {tr(a, "resume") && <p className="font-display text-[1.45rem] leading-snug">{tr(a, "resume")}</p>}
        {paragraphs(tr(a, "contenu")).map((p, i) => <p key={i} className="whitespace-pre-line">{p}</p>)}
        {a.expire && <p className="text-sm text-muted">{L("Valable jusqu'au", "Valid until")} {fmonth(a.expire, locale)}.</p>}
      </article>
    </main>
  );
}
