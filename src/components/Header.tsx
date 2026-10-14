"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/i18n";
import Logo from "./Logo";

export default function Header() {
  const path = usePathname();
  const { user, isAdmin, profil } = useAuth();
  const { L, lang, setLang } = useLang();
  const links: [string, string][] = [
    ["/", L("Accueil", "Home")],
    ["/eglise", L("Notre église", "About us")],
    ["/programme", L("Vie de l'église", "Church life")],
    ["/departements", L("Départements", "Departments")],
    ["/actualites", L("Actualités", "News")],
    ["/missions", L("Œuvre missionnaire", "Outreach")],
    ["/centres", L("Centres", "Centres")],
    ["/pasteurs", L("Pasteurs", "Pastors")],
    ["/librairie", L("Librairie", "Bookshop")],
    ["/rendez-vous", L("Rendez-vous", "Appointments")],
  ];
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  const first = (profil?.nom || user?.displayName || "").split(" ")[0];
  return (
    <>
      <div className="bg-band text-band-ink">
        <div className="page flex items-center justify-between gap-3 py-3">
          <Link href="/" className="flex min-w-0 items-center gap-3 text-band-ink no-underline">
            <Logo size={36} />
            <span className="min-w-0 leading-tight">
              <span className="block font-display text-[1.05rem] tracking-wide">C.M.C.I. Ngaoundéré</span>
              <span className="hidden truncate text-[0.72rem] uppercase tracking-[0.1em] text-band-muted sm:block">
                {L("Communauté Missionnaire Chrétienne Internationale", "Christian Missionary Fellowship International")}
              </span>
            </span>
          </Link>
          <div className="flex flex-none items-center gap-2 text-sm">
            <div className="flex overflow-hidden rounded-full border border-white/30 text-xs font-semibold" role="group" aria-label="Langue / Language">
              {(["fr", "en"] as const).map((l) => (
                <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l}
                  className={`px-2.5 py-1.5 uppercase ${lang === l ? "bg-sun text-[#1B140A]" : "text-band-ink hover:bg-white/10"}`}>{l}</button>
              ))}
            </div>
            <Link href={user ? "/mon-espace" : "/connexion"} className="btn-band btn-sm">
              {user ? (first ? `${L("Mon espace", "My space")} · ${first}` : L("Mon espace", "My space")) : L("Se connecter", "Sign in")}
            </Link>
          </div>
        </div>
      </div>
      <nav aria-label={L("Navigation principale", "Main navigation")} className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
        <div className="page flex overflow-x-auto [scrollbar-width:none]">
          {links.map(([href, label]) => (
            <Link key={href} href={href} aria-current={active(href) ? "page" : undefined}
              className={`whitespace-nowrap border-b-2 px-3 pb-3 pt-3.5 text-[0.9rem] font-medium no-underline ${active(href) ? "border-sun text-green" : "border-transparent text-muted hover:text-ink"}`}>
              {label}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin" aria-current={active("/admin") ? "page" : undefined}
              className={`ml-auto whitespace-nowrap border-b-2 px-3 pb-3 pt-3.5 text-[0.9rem] font-semibold text-gold no-underline ${active("/admin") ? "border-sun" : "border-transparent"}`}>
              {L("Gestion", "Admin")}
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
