"use client";
import { useState } from "react";
import { useAdmin } from "@/components/AdminShell";
import { Empty } from "@/components/ui";
import { exportEntity } from "@/lib/export";
import { fcfa, fshort, niceMax, num, short, today, ym } from "@/lib/format";
import type { Operation } from "@/lib/types";

const sum = (l: Operation[], t: "entree" | "sortie") => l.filter((f) => (t === "sortie" ? f.type === "sortie" : f.type !== "sortie")).reduce((s, f) => s + (Number(f.montant) || 0), 0);

export default function Finances() {
  const { finances, centreNames, edit } = useAdmin();
  const [mois, setMois] = useState(ym(today()));
  const [centre, setCentre] = useState("");
  const all = finances.filter((f) => !centre || f.centre === centre);
  const fm = all.filter((f) => ym(f.date) === mois);
  const inM = sum(fm, "entree"), outM = sum(fm, "sortie");
  const sol = all.filter((f) => ym(f.date) <= mois).reduce((s, f) => s + (f.type === "sortie" ? -1 : 1) * (Number(f.montant) || 0), 0);

  // six derniers mois
  const [Y, M] = mois.split("-").map(Number);
  const months = Array.from({ length: 6 }, (_, i) => { const d = new Date(Y, M - 6 + i, 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; });
  const data = months.map((k) => { const l = all.filter((f) => ym(f.date) === k); return { k, i: sum(l, "entree"), o: sum(l, "sortie") }; });
  const nice = niceMax(Math.max(1, ...data.flatMap((d) => [d.i, d.o])));
  const W = 520, H = 230, L = 60, B = 30, T = 14, cw = (W - L - 10) / 6, bw = Math.min(22, cw / 3);
  const y = (v: number) => H - B - (v / nice) * (H - B - T);

  const cats: Record<string, { v: number; out: boolean }> = {};
  fm.forEach((f) => { const k = `${f.type}|${f.categorie || "Autre"}`; cats[k] = { v: (cats[k]?.v || 0) + (Number(f.montant) || 0), out: f.type === "sortie" }; });
  const cm = Math.max(1, ...Object.values(cats).map((c) => c.v));
  const rows = [...fm].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end gap-2.5">
        <label className="field">Mois<input type="month" className="input" value={mois} onChange={(e) => e.target.value && setMois(e.target.value)} /></label>
        <label className="field">Centre<select className="input" value={centre} onChange={(e) => setCentre(e.target.value)}><option value="">Tous</option>{["Siège", ...centreNames].map((n) => <option key={n}>{n}</option>)}</select></label>
        <button className="btn" onClick={() => edit("finances")}>Enregistrer une opération</button>
        <button className="btn-ghost" onClick={() => exportEntity("finances", rows)}>Exporter le mois (Excel/CSV)</button>
      </div>
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <div className="tile"><span className="text-sm text-muted">Entrées du mois</span><span className="tile-v text-ok">{fcfa(inM)}</span></div>
        <div className="tile"><span className="text-sm text-muted">Sorties du mois</span><span className="tile-v text-bad">{fcfa(outM)}</span></div>
        <div className="tile"><span className="text-sm text-muted">Résultat du mois</span><span className={`tile-v ${inM - outM < 0 ? "text-bad" : ""}`}>{fcfa(inM - outM)}</span></div>
        <div className="tile"><span className="text-sm text-muted">Solde cumulé fin de mois</span><span className={`tile-v ${sol < 0 ? "text-bad" : ""}`}>{fcfa(sol)}</span></div>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="panel grid gap-3"><div className="eyebrow">Six derniers mois</div>
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Entrées et sorties des six derniers mois" className="h-auto w-full">
            {[0, 1, 2, 3, 4].map((i) => { const v = (nice * i) / 4; return <g key={i}><line x1={L} x2={W - 6} y1={y(v)} y2={y(v)} className="stroke-line" /><text x={L - 8} y={y(v) + 4} textAnchor="end" fontSize="10.5" className="fill-muted font-mono">{short(v)}</text></g>; })}
            {data.map((d, i) => { const x = L + i * cw + cw / 2; const lab = new Date(`${d.k}-15`).toLocaleDateString("fr-FR", { month: "short" });
              return <g key={d.k}>
                <rect x={x - bw - 2} y={y(d.i)} width={bw} height={H - B - y(d.i)} rx="2" className="fill-green"><title>Entrées {fcfa(d.i)}</title></rect>
                <rect x={x + 2} y={y(d.o)} width={bw} height={H - B - y(d.o)} rx="2" className="fill-gold"><title>Sorties {fcfa(d.o)}</title></rect>
                <text x={x} y={H - 10} textAnchor="middle" fontSize="11" fontWeight={d.k === mois ? 700 : 400} className={d.k === mois ? "fill-ink" : "fill-muted"}>{lab}</text></g>; })}
          </svg>
          <div className="flex gap-4 text-xs text-muted"><span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-green" />Entrées</span><span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-gold" />Sorties</span></div>
        </div>
        <div className="panel grid content-start gap-2.5"><div className="eyebrow">Répartition du mois</div>
          {Object.keys(cats).length ? Object.entries(cats).sort((a, b) => b[1].v - a[1].v).map(([k, c]) => (
            <div key={k} className="grid grid-cols-[minmax(0,130px)_minmax(0,1fr)_100px] items-center gap-2.5 text-sm">
              <span className="truncate">{k.split("|")[1]}</span>
              <div className="h-2.5 overflow-hidden rounded bg-surface-2"><div className={`h-full rounded ${c.out ? "bg-gold" : "bg-green"}`} style={{ width: `${(c.v / cm) * 100}%` }} /></div>
              <span className={`text-right font-mono ${c.out ? "text-bad" : "text-ok"}`}>{c.out ? "−" : "+"}{num(c.v)}</span>
            </div>)) : <p className="text-muted">Aucune opération ce mois-ci.</p>}
        </div>
      </div>
      {rows.length ? (
        <div className="tbl-box"><table className="tbl">
          <thead><tr><th>Date</th><th>Libellé</th><th>Catégorie</th><th>Centre</th><th>Mode</th><th className="num">Montant</th><th /></tr></thead>
          <tbody>{rows.map((f) => (
            <tr key={f.id}>
              <td className="font-mono">{fshort(f.date)}</td>
              <td>{f.libelle || "—"}{f.piece && <div className="font-mono text-xs text-muted">{f.piece}</div>}</td>
              <td>{f.categorie}</td><td>{f.centre}</td><td>{f.mode}</td>
              <td className={`num ${f.type === "sortie" ? "text-bad" : "text-ok"}`}>{f.type === "sortie" ? "−" : "+"}{num(f.montant)}</td>
              <td className="text-right"><button className="btn-ghost btn-sm" onClick={() => edit("finances", f)}>Modifier</button></td>
            </tr>))}</tbody>
        </table></div>
      ) : <Empty title="Aucune opération pour ce mois">Enregistrez dîmes, offrandes, dons et dépenses pour tenir la caisse à jour.</Empty>}
    </div>
  );
}
