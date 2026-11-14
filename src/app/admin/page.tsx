"use client";
import Link from "next/link";
import { useAdmin } from "@/components/AdminShell";
import { StatutBadge } from "@/components/ui";
import { TYPES, fcfa, fshort, num, today, ym } from "@/lib/format";

export default function Tableau() {
  const { demandes, membres, biens, finances, livres } = useAdmin();
  const actifs = membres.filter((m) => (m.actif || "Actif") === "Actif");
  const pend = demandes.filter((d) => d.statut === "en_attente").sort((a, b) => b.cree.localeCompare(a.cree));
  const patr = biens.reduce((s, b) => s + (Number(b.valeur) || 0) * (Number(b.quantite) || 1), 0);
  const mois = ym(today());
  const fm = finances.filter((f) => ym(f.date) === mois);
  const inM = fm.filter((f) => f.type !== "sortie").reduce((s, f) => s + (Number(f.montant) || 0), 0);
  const outM = fm.filter((f) => f.type === "sortie").reduce((s, f) => s + (Number(f.montant) || 0), 0);
  const sol = finances.reduce((s, f) => s + (f.type === "sortie" ? -1 : 1) * (Number(f.montant) || 0), 0);
  const rdvs = demandes.filter((d) => d.type === "rdv" && d.statut === "confirme" && (d.date || "") >= today()).sort((a, b) => String(a.date).localeCompare(String(b.date))).slice(0, 6);
  const low = livres.filter((b) => Number(b.stock) <= 3);
  const byC: Record<string, number> = {};
  actifs.forEach((m) => { const c = m.centre || "Non rattaché"; byC[c] = (byC[c] || 0) + 1; });
  const maxC = Math.max(1, ...Object.values(byC));

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <div className="tile"><span className="text-sm text-muted">Membres actifs</span><span className="tile-v">{num(actifs.length)}</span><span className="text-xs text-muted">{num(membres.length)} fiches au total</span></div>
        <div className={`tile ${pend.length ? "border-warn" : ""}`}><span className="text-sm text-muted">Demandes en attente</span><span className="tile-v">{num(pend.length)}</span><Link href="/admin/demandes" className="text-xs">Traiter les demandes →</Link></div>
        <div className="tile"><span className="text-sm text-muted">Solde de caisse</span><span className={`tile-v ${sol < 0 ? "text-bad" : ""}`}>{fcfa(sol)}</span><span className="text-xs text-muted">Ce mois : <span className="text-ok">+{num(inM)}</span> / <span className="text-bad">−{num(outM)}</span></span></div>
        <div className="tile"><span className="text-sm text-muted">Valeur du patrimoine</span><span className="tile-v">{fcfa(patr)}</span><span className="text-xs text-muted">{num(biens.length)} biens inventoriés</span></div>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="panel grid content-start gap-3"><div className="eyebrow">Dernières demandes en attente</div>
          {pend.length ? pend.slice(0, 6).map((d) => (
            <div key={d.id} className="flex items-center justify-between gap-3 border-b border-line pb-2.5 last:border-0">
              <div className="min-w-0"><strong className="font-semibold">{d.nom}</strong><div className="text-xs text-muted">{TYPES[d.type]} · {fshort(d.cree)}</div></div><StatutBadge statut={d.statut} />
            </div>)) : <p className="text-muted">Aucune demande en attente.</p>}
        </div>
        <div className="panel grid content-start gap-3"><div className="eyebrow">Rendez-vous confirmés à venir</div>
          {rdvs.length ? rdvs.map((r) => (
            <div key={r.id} className="flex justify-between gap-3 border-b border-line pb-2.5 last:border-0">
              <div className="min-w-0"><strong className="font-semibold">{r.nom}</strong> <span className="text-muted">· {r.motif}</span><div className="text-sm text-muted">{(r.avecNom || "").split(" — ")[0]} · {r.lieu}</div>{r.note && <div className="text-sm">{r.note}</div>}</div>
              <span className="whitespace-nowrap text-right font-mono text-sm">{fshort(r.date)}<br />{String(r.creneau).split(" ")[0]}</span>
            </div>)) : <p className="text-muted">Aucun rendez-vous confirmé pour les jours à venir.</p>}
        </div>
        <div className="panel grid content-start gap-3"><div className="eyebrow">Membres actifs par centre</div>
          {Object.keys(byC).length ? Object.entries(byC).sort((a, b) => b[1] - a[1]).map(([c, n]) => (
            <div key={c} className="grid grid-cols-[120px_minmax(0,1fr)_40px] items-center gap-3 text-sm">
              <span className="truncate">{c}</span><div className="h-2.5 overflow-hidden rounded bg-surface-2"><div className="h-full rounded bg-green" style={{ width: `${(n / maxC) * 100}%` }} /></div><span className="text-right font-mono">{n}</span>
            </div>)) : <p className="text-muted">Aucun membre enregistré. Acceptez les inscriptions reçues ou ajoutez des membres.</p>}
        </div>
        <div className="panel grid content-start gap-3"><div className="eyebrow">Librairie — stock faible</div>
          {low.length ? low.map((b) => (
            <div key={b.id} className="flex justify-between gap-3"><span>{b.titre}</span><span className={`badge ${Number(b.stock) > 0 ? "badge-warn" : "badge-bad"}`}>{Number(b.stock) > 0 ? `${num(b.stock)} restant(s)` : "Épuisé"}</span></div>
          )) : <p className="text-muted">Tous les livres ont un stock suffisant.</p>}
        </div>
      </div>
    </div>
  );
}
