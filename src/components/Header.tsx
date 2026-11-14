"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/i18n";
import Logo from "./Logo";

/** Bandeau du bulletin : titre + trois rubriques + une action ; le reste est au sommaire. */
export default function Header() {
  const path = usePathname();
  const { user, droits, profil } = useAuth();
  const { L, lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); btn.current?.focus(); } };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [open]);

  const main: [string, string][] = [
    ["/programme", L("Vie de l'église", "Church life")],
    ["/actualites", L("Actualités", "News")],
    ["/centres", L("Centres", "Centres")],
  ];
  const sommaire: [string, string, string][] = [
    ["/", L("La une", "Front page"), L("Accueil du bulletin", "Home")],
    ["/eglise", L("Notre église", "About us"), L("Vision, mission, année 2025", "Vision, mission, 2025")],
    ["/programme", L("Vie de l'église", "Church life"), L("Cultes et réunions de la semaine", "Weekly services")],
    ["/departements", L("Départements", "Departments"), L("Responsables et programmes", "Leaders and schedules")],
    ["/actualites", L("Actualités", "News"), L("Articles et annonces", "Articles and notices")],
    ["/missions", L("Œuvre missionnaire", "Outreach"), L("Localités et villages", "Localities and villages")],
    ["/centres", L("Centres", "Centres"), L("Les quartiers sur la carte", "Neighbourhoods on the map")],
    ["/pasteurs", L("Pasteurs", "Pastors"), L("Ceux qui servent l'église", "Those who serve")],
    ["/librairie", L("Librairie", "Bookshop"), L("Livres pour grandir", "Books to grow")],
    ["/rendez-vous", L("Rendez-vous", "Appointments"), L("Rencontrer un pasteur", "Meet a pastor")],
  ];
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  const first = (profil?.nom || user?.displayName || "").split(" ")[0];

  return (
    <header className="sticky top-0 z-30 border-b-[3px] border-ink bg-bg">
      <div className="page flex items-center gap-3 py-2.5 sm:gap-5">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 text-ink no-underline">
          <Logo size={38} />
          <span className="min-w-0 leading-none">
            <span className="block font-display text-[1.2rem] sm:text-[1.35rem]">CMCI Ngaoundéré</span>
            <span className="mt-0.5 hidden text-[0.75rem] text-muted md:block">{L("Communauté Missionnaire Chrétienne Internationale", "Christian Missionary Fellowship International")}</span>
          </span>
        </Link>
        <nav aria-label={L("Rubriques", "Sections")} className="ml-auto hidden items-center lg:flex">
          {main.map(([href, label]) => (
            <Link key={href} href={href} aria-current={active(href) ? "page" : undefined}
              className={`px-3 py-2 text-[0.92rem] font-semibold no-underline ${active(href) ? "text-accent underline decoration-2 underline-offset-[10px]" : "text-ink hover:text-accent"}`}>{label}</Link>
          ))}
        </nav>
        <div className="ml-auto flex flex-none items-center gap-2 lg:ml-2">
          <div className="hidden border-2 border-ink text-xs font-semibold sm:flex" role="group" aria-label="Langue / Language">
            {(["fr", "en"] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l}
                className={`min-h-[32px] px-2.5 ${lang === l ? "bg-ink text-bg" : "text-ink hover:text-accent"}`}>{l.toUpperCase()}</button>
            ))}
          </div>
          <Link href="/rendez-vous" className="btn hidden sm:inline-flex">{L("Prendre rendez-vous", "Book a visit")}</Link>
          <button ref={btn} onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="sommaire"
            className="inline-flex min-h-[44px] items-center gap-2 border-2 border-ink px-3 text-sm font-semibold text-ink hover:text-accent">
            {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}{L("Sommaire", "Contents")}
          </button>
        </div>
      </div>
      {open && (
        <div id="sommaire" className="sommaire-in absolute inset-x-0 top-full max-h-[calc(100dvh-64px)] overflow-auto border-b-[3px] border-ink bg-bg">
          <div className="page grid gap-6 py-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <nav aria-label={L("Sommaire", "Contents")}>
              <ol className="m-0 grid list-none p-0 sm:grid-cols-2 sm:gap-x-8">
                {sommaire.map(([href, label, sub], i) => (
                  <li key={href} className="border-b border-line">
                    <Link href={href} aria-current={active(href) ? "page" : undefined}
                      className="group grid grid-cols-[2.2rem_minmax(0,1fr)] items-baseline gap-2 py-3 text-ink no-underline">
                      <span className="font-display text-xl tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
                      <span><span className={`block font-display text-[1.25rem] leading-tight group-hover:text-accent ${active(href) ? "text-accent" : ""}`}>{label}</span>
                        <span className="text-sm text-muted">{sub}</span></span>
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>
            <div className="grid content-start gap-3 border-t-[3px] border-ink pt-3 md:border-l md:border-t-0 md:border-line md:pl-6 md:pt-0">
              <div className="flex border-2 border-ink text-sm font-semibold sm:hidden" role="group" aria-label="Langue / Language">
                {(["fr", "en"] as const).map((l) => (
                  <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l}
                    className={`min-h-[44px] flex-1 ${lang === l ? "bg-ink text-bg" : "text-ink"}`}>{l === "fr" ? "Français" : "English"}</button>
                ))}
              </div>
              <Link href="/rendez-vous" className="btn sm:hidden">{L("Prendre rendez-vous", "Book a visit")}</Link>
              <Link href={user ? "/mon-espace" : "/connexion"} className="btn-ghost">
                {user ? (first ? `${L("Mon espace", "My space")} · ${first}` : L("Mon espace", "My space")) : L("Se connecter", "Sign in")}
              </Link>
              {droits.gestion && <Link href="/admin" className="btn-ghost">{L("Gestion de l'église", "Church admin")}</Link>}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
