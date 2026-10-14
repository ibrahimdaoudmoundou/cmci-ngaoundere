"use client";
import { useMemo, useState } from "react";
import { ArticleCard, visibles } from "@/components/news";
import { Empty, PageHead } from "@/components/ui";
import { useCollection } from "@/lib/hooks";
import { useLang } from "@/lib/i18n";
import type { Article } from "@/lib/types";

export default function Actualites() {
  const { L } = useLang();
  const { data, loading } = useCollection<Article>("articles", ["publie", "==", true]);
  const [f, setF] = useState<"" | "article" | "annonce">("");
  const list = useMemo(() => visibles(data).filter((a) => !f || a.type === f), [data, f]);
  const [first, ...rest] = list;
  return (
    <main className="page grid gap-8 py-10">
      <PageHead eyebrow={L("Actualités", "News")} title={L("Articles et annonces", "Articles and announcements")}>
        {L("Témoignages, enseignements, comptes rendus de missions et annonces de la vie de l'église.", "Testimonies, teachings, mission reports and church announcements.")}
      </PageHead>
      <div className="flex flex-wrap gap-2" role="tablist">
        {([["", L("Tout", "All")], ["annonce", L("Annonces", "Announcements")], ["article", L("Articles", "Articles")]] as const).map(([k, l]) => (
          <button key={k} role="tab" aria-selected={f === k} onClick={() => setF(k)} className={f === k ? "btn btn-sm" : "btn-ghost btn-sm"}>{l}</button>
        ))}
      </div>
      {first ? (
        <>
          <ArticleCard a={first} wide />
          {rest.length > 0 && <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{rest.map((a) => <ArticleCard key={a.id} a={a} />)}</div>}
        </>
      ) : <Empty title={loading ? L("Chargement…", "Loading…") : L("Aucune publication pour le moment", "Nothing published yet")} />}
    </main>
  );
}
