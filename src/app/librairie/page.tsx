"use client";
import { useState } from "react";
import { BookCard, BuyModal } from "@/components/blocks";
import { Empty, PageHead } from "@/components/ui";
import { useCollection } from "@/lib/hooks";
import { useLang } from "@/lib/i18n";
import type { Centre, Livre, WithId } from "@/lib/types";

export default function Librairie() {
  const { L } = useLang();
  const { data, loading } = useCollection<Livre>("livres");
  const centres = useCollection<Centre>("centres");
  const [q, setQ] = useState("");
  const [buy, setBuy] = useState<WithId<Livre> | null>(null);
  const list = data.filter((b) => b.visible !== false && (!q || `${b.titre} ${b.auteur}`.toLowerCase().includes(q.toLowerCase()))).sort((a, b) => a.titre.localeCompare(b.titre));
  return (
    <main className="page grid gap-8 py-10">
      <PageHead eyebrow={L("Librairie chrétienne", "Christian bookshop")} title={L("Livres à vendre", "Books for sale")}
        aside={<input type="search" className="input max-w-[300px]" placeholder={L("Rechercher un titre ou un auteur", "Search a title or author")} value={q} onChange={(e) => setQ(e.target.value)} />}>
        {L("Réservez un livre en ligne, puis retirez-le et réglez-le au siège ou dans le centre de votre choix.", "Reserve a book online, then collect and pay for it at the headquarters or the centre of your choice.")}
      </PageHead>
      {list.length ? <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(210px,1fr))]">{list.map((b) => <BookCard key={b.id} b={b} onBuy={setBuy} />)}</div>
        : <Empty title={loading ? L("Chargement…", "Loading…") : q ? L("Aucun livre ne correspond", "No matching book") : L("Aucun livre en vente pour le moment", "No books for sale yet")} />}
      {buy && <BuyModal b={buy} centres={centres.data.map((c) => c.nom)} onClose={() => setBuy(null)} />}
    </main>
  );
}
