"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useState, type ReactNode } from "react";
import { Boxes, Church, Inbox, LayoutDashboard, Newspaper, Route, Settings2, Users, Wallet, type LucideIcon } from "lucide-react";
import EntityEditor from "@/components/EntityEditor";
import { Spinner } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { useCollection } from "@/lib/hooks";
import type { Activite, Article, Bien, Centre, Demande, Departement, Livre, Localite, Membre, Operation, Pasteur, WithId } from "@/lib/types";

type Rec = Record<string, unknown> & { id?: string };
interface AdminData {
  demandes: WithId<Demande>[]; membres: WithId<Membre>[]; biens: WithId<Bien>[]; finances: WithId<Operation>[];
  pasteurs: WithId<Pasteur>[]; centres: WithId<Centre>[]; livres: WithId<Livre>[]; programme: WithId<Activite>[];
  articles: WithId<Article>[]; departements: WithId<Departement>[]; localites: WithId<Localite>[];
  centreNames: string[]; loading: boolean;
  edit: (entity: string, item?: object | null) => void;
}
const Ctx = createContext<AdminData | null>(null);
export const useAdmin = () => useContext(Ctx)!;

type Droit = "secretariat" | "tresorerie" | "tous";
/** Onglets de gestion et droit requis (ADMIN voit tout ; SECRETARIAT et TRESORERIE voient leur partie). */
const TABS: [string, string, Droit, LucideIcon][] = [
  ["/admin", "Tableau de bord", "tous", LayoutDashboard], ["/admin/demandes", "Demandes", "secretariat", Inbox], ["/admin/publications", "Articles et annonces", "secretariat", Newspaper],
  ["/admin/membres", "Membres", "secretariat", Users], ["/admin/biens", "Biens", "tresorerie", Boxes], ["/admin/finances", "Finances", "tresorerie", Wallet],
  ["/admin/departements", "Départements", "secretariat", Church], ["/admin/missions", "Œuvre missionnaire", "secretariat", Route], ["/admin/contenu", "Site et vision", "secretariat", Settings2],
];

function AdminInner({ children }: { children: ReactNode }) {
  const path = usePathname();
  const { droits } = useAuth();
  const sec = droits.secretariat, tre = droits.tresorerie;
  const d = useCollection<Demande>(sec ? "demandes" : null), m = useCollection<Membre>(sec ? "membres" : null), b = useCollection<Bien>(tre ? "biens" : null),
    f = useCollection<Operation>(tre ? "finances" : null), p = useCollection<Pasteur>("pasteurs"), c = useCollection<Centre>("centres"),
    l = useCollection<Livre>("livres"), pr = useCollection<Activite>("programme"),
    ar = useCollection<Article>("articles"), dp = useCollection<Departement>("departements"), lo = useCollection<Localite>("localites");
  const [editing, setEditing] = useState<{ entity: string; item?: Rec | null } | null>(null);
  const pending = d.data.filter((x) => x.statut === "en_attente").length;
  const value: AdminData = {
    demandes: d.data, membres: m.data, biens: b.data, finances: f.data, pasteurs: p.data, centres: c.data, livres: l.data, programme: pr.data,
    articles: ar.data, departements: dp.data, localites: lo.data,
    centreNames: c.data.map((x) => x.nom), loading: d.loading || m.loading || f.loading,
    edit: (entity, item) => setEditing({ entity, item: item as Rec | null | undefined }),
  };
  return (
    <Ctx.Provider value={value}>
      <div className="page grid gap-6 py-6 lg:grid-cols-[96px_minmax(0,1fr)] lg:gap-8">
        {/* Rail de gestion : icônes + libellés courts ; le panneau occupe le reste */}
        <nav aria-label="Gestion" className="-mx-4 flex gap-0 overflow-x-auto border-b-[3px] border-ink px-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:sticky lg:top-[76px] lg:mx-0 lg:h-fit lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r lg:border-line lg:px-0 lg:pr-3">
          {TABS.filter(([, , dr]) => dr === "tous" || droits[dr]).map(([href, label, , Icon]) => {
            const on = href === "/admin" ? path === "/admin" : path.startsWith(href);
            return <Link key={href} href={href} aria-current={on ? "page" : undefined} title={label}
              className={`relative grid min-h-[56px] min-w-[84px] flex-none justify-items-center gap-1 px-2 py-2 text-center text-[0.7rem] font-semibold leading-tight no-underline lg:min-w-0 ${on ? "text-accent after:absolute after:inset-x-2 after:bottom-0 after:h-[3px] after:bg-accent lg:after:inset-x-auto lg:after:inset-y-2 lg:after:-right-[14px] lg:after:h-auto lg:after:w-[3px]" : "text-muted hover:text-ink"}`}>
              <Icon size={20} strokeWidth={1.75} aria-hidden />
              <span>{label}</span>
              {href === "/admin/demandes" && pending > 0 && <span className="absolute right-3 top-1 bg-accent px-1 text-[0.65rem] tabular-nums text-on-accent">{pending}</span>}
            </Link>;
          })}
        </nav>
        <main className="grid min-w-0 content-start gap-6">
          <div className="rubrique flex flex-wrap items-baseline justify-between gap-3">
            <h1 className="h2">Gestion de l&apos;église</h1>
            <p className="text-sm text-muted">Réservé à l&apos;administration</p>
          </div>
          {children}
        </main>
      </div>
      {editing && <EntityEditor entity={editing.entity} item={editing.item} centres={value.centreNames} onClose={() => setEditing(null)} />}
    </Ctx.Provider>
  );
}

export function AdminGate({ children }: { children: ReactNode }) {
  const { user, droits, loading } = useAuth();
  const path = usePathname();
  if (loading) return <main className="page py-10"><Spinner /></main>;
  if (!user) return (
    <main className="page grid gap-4 py-10"><h1 className="h2">Espace administration</h1>
      <div className="notice"><span>Connectez-vous avec un compte administrateur.</span><Link className="btn btn-sm" href="/connexion?suite=/admin">Se connecter</Link></div></main>
  );
  const tab = TABS.find(([href]) => href !== "/admin" && path.startsWith(href));
  if (droits.gestion && tab && tab[2] !== "tous" && !droits[tab[2]]) return (
    <main className="page grid gap-4 py-10"><h1 className="h2">Accès réservé</h1>
      <p className="max-w-[62ch] text-muted">Cette partie de la gestion n&apos;est pas ouverte à votre rôle.</p>
      <div><Link className="btn-ghost" href="/admin">Retour au tableau de bord</Link></div></main>
  );
  if (!droits.gestion) return (
    <main className="page grid gap-4 py-10"><h1 className="h2">Accès réservé</h1>
      <p className="max-w-[62ch] text-muted">Votre compte n'a pas encore de droits de gestion. Si vous vous connectez avec IBKEYS, demandez le rôle ADMIN, SECRETARIAT ou TRESORERIE de l'application « CMCI Ngaoundéré ». Sinon, un administrateur peut vous les donner dans Gestion › Site et vision › Administrateurs, avec votre identifiant :</p>
      <code className="w-fit select-all rounded-md bg-surface-2 px-3 py-2 font-mono text-sm">{user.uid}</code>
      <p className="text-sm text-muted">Premier administrateur : suivez l'étape « Devenir administrateur » du fichier README.</p></main>
  );
  return <AdminInner>{children}</AdminInner>;
}
