"use client";
import { useEffect, useState, type ReactNode } from "react";
import { STATUTS, initials } from "@/lib/format";
import { useLang } from "@/lib/i18n";

export function StatutBadge({ statut }: { statut?: string }) {
  const { V } = useLang();
  const s = STATUTS[statut || "en_attente"] || STATUTS.en_attente;
  const cls = { ok: "badge-ok", warn: "badge-warn", bad: "badge-bad", gold: "badge-gold", neutral: "" }[s.tone];
  return <span className={`badge ${cls}`}>{V(s.label)}</span>;
}

export function ExampleBadge({ show }: { show?: boolean }) {
  const { L } = useLang();
  return show ? <span className="ml-2 inline-block rounded-full border border-dashed border-line px-2 py-0.5 align-middle text-[0.7rem] font-semibold text-muted">{L("exemple", "example")}</span> : null;
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return <div className="empty"><b className="font-semibold text-ink">{title}</b>{children && <span className="text-sm">{children}</span>}</div>;
}

export function PageHead({ eyebrow, title, children, aside }: { eyebrow: string; title: string; children?: ReactNode; aside?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="h2 mt-1">{title}</h1>
        {children && <p className="mt-2 max-w-[62ch] text-muted">{children}</p>}
      </div>
      {aside}
    </div>
  );
}

/** Image avec repli sur les initiales si le lien est absent ou cassé. */
export function Photo({ src, name, className = "", textClass = "text-2xl" }: { src?: string; name?: string; className?: string; textClass?: string }) {
  const [ok, setOk] = useState(true);
  useEffect(() => setOk(true), [src]);
  return (
    <div className={`relative grid place-items-center overflow-hidden bg-green font-display text-on-green ${className}`}>
      <span className={textClass}>{initials(name)}</span>
      {src && ok && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name || ""} onError={() => setOk(false)} className="absolute inset-0 h-full w-full object-cover" />
      )}
    </div>
  );
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    addEventListener("keydown", k);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { removeEventListener("keydown", k); document.body.style.overflow = prev; };
  }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4">
      <div className="grid max-h-full w-full max-w-[660px] gap-4 overflow-auto rounded-2xl bg-surface p-6 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl">{title}</h3>
          <button onClick={onClose} aria-label="×" className="px-2 text-2xl leading-none text-muted">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  const { L } = useLang();
  return <p className="py-6 text-center text-muted">{label || L("Chargement…", "Loading…")}</p>;
}
