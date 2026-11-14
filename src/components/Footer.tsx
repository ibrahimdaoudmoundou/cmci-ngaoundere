"use client";
import Link from "next/link";
import { useDocument } from "@/lib/hooks";
import { useLang } from "@/lib/i18n";
import { CMCI_GLOBAL_URL } from "@/lib/format";
import type { SiteConfig, Vision } from "@/lib/types";
import Logo from "./Logo";

/** L'ours du bulletin : qui publie, où nous trouver. */
export default function Footer() {
  const { data: c } = useDocument<SiteConfig>("config/site");
  const { data: v } = useDocument<Vision>("config/vision");
  const { L } = useLang();
  const mondial = v?.siteMondial || CMCI_GLOBAL_URL;
  return (
    <footer className="mt-24">
      <div className="page">
        <div className="grid gap-8 border-t-[3px] border-ink py-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)] md:divide-x md:divide-line">
          <div className="grid content-start gap-3">
            <div className="flex items-center gap-3"><Logo size={40} /><span className="font-display text-xl">CMCI Ngaoundéré</span></div>
            <p className="max-w-[46ch] text-sm text-muted">
              {L("Église locale de la Communauté Missionnaire Chrétienne Internationale, Province spirituelle de l'Adamaoua.",
                "A local church of the Christian Missionary Fellowship International, spiritual province of Adamawa.")}
            </p>
            <a href={mondial} target="_blank" rel="noopener" className="text-sm font-semibold">{L("Site mondial de la CMCI", "CMFI worldwide website")} ↗</a>
          </div>
          <div className="grid content-start gap-2 text-sm md:pl-8">
            <h2 className="font-sans text-[0.95rem] font-semibold">{L("Découvrir", "Discover")}</h2>
            {[["/eglise", L("Notre vision", "Our vision")], ["/programme", L("Vie de l'église", "Church life")], ["/departements", L("Départements", "Departments")], ["/missions", L("Œuvre missionnaire", "Outreach")], ["/pasteurs", L("Pasteurs", "Pastors")], ["/librairie", L("Librairie", "Bookshop")]].map(([h, l]) => (
              <Link key={h} href={h} className="lien w-fit">{l}</Link>
            ))}
          </div>
          <div className="grid content-start gap-2 text-sm md:pl-8">
            <h2 className="font-sans text-[0.95rem] font-semibold">{L("Nous joindre", "Contact")}</h2>
            {c?.tel && <span className="select-all tabular-nums">{c.tel}</span>}
            {c?.email && <span className="select-all">{c.email}</span>}
            <span className="text-muted">{c?.adresse || "Ngaoundéré, Adamaoua, Cameroun"}</span>
            <Link href="/connexion?suite=/admin" className="lien mt-2 w-fit text-muted">{L("Espace administration", "Admin area")}</Link>
          </div>
        </div>
        <p className="border-t border-line py-4 text-xs text-muted">« {L("Allez, faites de toutes les nations des disciples", "Go and make disciples of all nations")} » · {L("Matthieu", "Matthew")} 28:19</p>
      </div>
    </footer>
  );
}
