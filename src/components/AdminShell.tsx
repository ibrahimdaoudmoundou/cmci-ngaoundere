"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useState, type ReactNode } from "react";
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

const TABS = [["/admin", "Tableau de bord"], ["/admin/demandes", "Demandes"], ["/admin/publications", "Articles et annonces"], ["/admin/membres", "Membres"], ["/admin/biens", "Biens"], ["/admin/finances", "Finances"], ["/admin/departements", "Départements"], ["/admin/missions", "Œuvre missionnaire"], ["/admin/contenu", "Site et vision"]] as const;

function AdminInner({ children }: { children: ReactNode }) {
  const path = usePathname();
  const d = useCollection<Demande>("demandes"), m = useCollection<Membre>("membres"), b = useCollection<Bien>("biens"),
    f = useCollection<Operation>("finances"), p = useCollection<Pasteur>("pasteurs"), c = useCollection<Centre>("centres"),
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
      <main className="page grid gap-6 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><div className="eyebrow">Réservé à l'administration</div><h1 className="h2 mt-1">Gestion de l'église</h1></div>
          <nav className="flex flex-wrap gap-1.5" aria-label="Gestion">
            {TABS.map(([href, label]) => {
              const on = href === "/admin" ? path === "/admin" : path.startsWith(href);
              return <Link key={href} href={href} className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold no-underline ${on ? "border-green bg-green text-on-green" : "border-line bg-surface text-muted hover:text-ink"}`}>
                {label}{href === "/admin/demandes" && pending > 0 && <span className="ml-1.5 font-mono text-xs">{pending}</span>}
              </Link>;
            })}
          </nav>
        </div>
        {children}
      </main>
      {editing && <EntityEditor entity={editing.entity} item={editing.item} centres={value.centreNames} onClose={() => setEditing(null)} />}
    </Ctx.Provider>
  );
}

export function AdminGate({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <main className="page py-10"><Spinner /></main>;
  if (!user) return (
    <main className="page grid gap-4 py-10"><h1 className="h2">Espace administration</h1>
      <div className="notice"><span>Connectez-vous avec un compte administrateur.</span><Link className="btn btn-sm" href="/connexion?suite=/admin">Se connecter</Link></div></main>
  );
  if (!isAdmin) return (
    <main className="page grid gap-4 py-10"><h1 className="h2">Accès réservé</h1>
      <p className="max-w-[62ch] text-muted">Votre compte n'a pas encore les droits d'administration. Un administrateur peut vous les donner dans Gestion › Contenu du site › Administrateurs, avec votre identifiant :</p>
      <code className="w-fit select-all rounded-md bg-surface-2 px-3 py-2 font-mono text-sm">{user.uid}</code>
      <p className="text-sm text-muted">Premier administrateur : suivez l'étape « Devenir administrateur » du fichier README.</p></main>
  );
  return <AdminInner>{children}</AdminInner>;
}
