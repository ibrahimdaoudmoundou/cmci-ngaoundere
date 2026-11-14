"use client";
import Link from "next/link";
import { useDocument } from "@/lib/hooks";
import { useLang } from "@/lib/i18n";
import { CMCI_GLOBAL_URL } from "@/lib/format";
import type { SiteConfig, Vision } from "@/lib/types";
import Logo from "./Logo";

export default function Footer() {
  const { data: c } = useDocument<SiteConfig>("config/site");
  const { data: v } = useDocument<Vision>("config/vision");
  const { L } = useLang();
  const mondial = v?.siteMondial || CMCI_GLOBAL_URL;
  return (
    <footer className="mt-20 bg-band text-band-ink">
      <div className="page grid gap-8 py-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div className="grid content-start gap-3">
          <div className="flex items-center gap-3"><Logo size={34} /><span className="font-display text-lg">C.M.C.I. Ngaoundéré</span></div>
          <p className="max-w-[46ch] text-sm text-band-muted">
            {L("Église locale de la Communauté Missionnaire Chrétienne Internationale, présente dans de nombreuses nations.",
              "A local church of the Christian Missionary Fellowship International, present in many nations.")}
          </p>
          <a href={mondial} target="_blank" rel="noopener" className="text-sm font-semibold text-sun">{L("Site mondial de la CMCI", "CMFI worldwide website")} ↗</a>
        </div>
        <div className="grid content-start gap-2 text-sm">
          <div className="eyebrow text-sun">{L("Découvrir", "Discover")}</div>
          {[["/eglise", L("Notre vision", "Our vision")], ["/programme", L("Vie de l'église", "Church life")], ["/departements", L("Départements", "Departments")], ["/missions", L("Œuvre missionnaire", "Outreach")], ["/actualites", L("Actualités et annonces", "News and announcements")]].map(([h, l]) => (
            <Link key={h} href={h} className="text-band-ink no-underline hover:text-sun">{l}</Link>
          ))}
        </div>
        <div className="grid content-start gap-2 text-sm">
          <div className="eyebrow text-sun">{L("Nous joindre", "Contact")}</div>
          {c?.tel && <span className="select-all">{c.tel}</span>}
          {c?.email && <span className="select-all">{c.email}</span>}
          <span className="text-band-muted">{c?.adresse || "Ngaoundéré, Adamaoua, Cameroun"}</span>
          <Link href="/connexion?suite=/admin" className="mt-2 text-band-muted no-underline hover:text-sun">{L("Espace administration", "Admin area")}</Link>
        </div>
      </div>
    </footer>
  );
}
