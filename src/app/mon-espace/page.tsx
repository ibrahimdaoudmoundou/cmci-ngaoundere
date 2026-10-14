"use client";
import { useEffect, useMemo, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { LoginNeeded } from "@/components/blocks";
import { PageHead, StatutBadge, Spinner } from "@/components/ui";
import { useToast } from "@/components/Providers";
import { useAuth } from "@/lib/auth";
import { envoyerDemande } from "@/lib/demandes";
import { fbDb } from "@/lib/firebase";
import { TYPES, fcfa, fdate, fshort, nowIso, telOk } from "@/lib/format";
import { useCollection } from "@/lib/hooks";
import type { Centre, Demande } from "@/lib/types";
import { useLang } from "@/lib/i18n";

export default function MonEspace() {
  const { user, profil, loading, logout, saveProfil, isAdmin } = useAuth();
  const toast = useToast();
  const { L, V, locale } = useLang();
  const centres = useCollection<Centre>("centres");
  const mine = useCollection<Demande>(user ? "demandes" : null, user ? ["uid", "==", user.uid] : undefined);
  const list = useMemo(() => [...mine.data].sort((a, b) => b.cree.localeCompare(a.cree)), [mine.data]);
  const inscription = list.find((d) => d.type === "inscription" && d.statut !== "refuse" && d.statut !== "annule");

  const [p, setP] = useState({ nom: "", tel: "", quartier: "", centre: "" });
  useEffect(() => { if (profil || user) setP({ nom: profil?.nom || user?.displayName || "", tel: profil?.tel || "", quartier: profil?.quartier || "", centre: profil?.centre || "" }); }, [profil, user]);
  const [ins, setIns] = useState({ sexe: "Homme", naissance: "", statutSpi: "Nouveau converti", profession: "" });
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);

  if (loading) return <main className="page py-10"><Spinner /></main>;
  if (!user) return <main className="page grid gap-6 py-10"><PageHead eyebrow={L("Espace personnel", "Personal space")} title={L("Mon espace", "My space")} /><LoginNeeded fr="accéder à votre espace" en="access your space" suite="/mon-espace" /></main>;

  async function sendIns(e: React.FormEvent) {
    e.preventDefault(); setErr("");
    if (p.nom.trim().length < 2) return setErr(L("Indiquez votre nom complet dans votre profil.", "Enter your full name in your profile."));
    if (!telOk(p.tel)) return setErr(L("Indiquez un numéro de téléphone valide dans votre profil.", "Enter a valid phone number in your profile."));
    setBusy(true);
    try {
      await saveProfil(p);
      await envoyerDemande(user!.uid, { type: "inscription", nom: p.nom.trim(), tel: p.tel.trim(), quartier: p.quartier, centre: p.centre || "À définir", ...ins });
      toast(L("Inscription envoyée", "Registration sent"));
    } catch (e) { console.warn(e); setErr(L("L'inscription n'a pas pu être envoyée. Réessayez.", "The registration could not be sent. Please try again.")); }
    setBusy(false);
  }
  async function cancel(id: string) {
    try { await updateDoc(doc(fbDb(), "demandes", id), { statut: "annule", maj: nowIso() }); toast(L("Demande annulée", "Request cancelled")); }
    catch { toast(L("Annulation impossible", "Could not cancel")); }
  }

  return (
    <main className="page grid gap-8 py-10">
      <PageHead eyebrow={L("Espace personnel", "Personal space")} title={`${L("Bonjour", "Hello")} ${p.nom.split(" ")[0] || ""}`.trim()}
        aside={<button className="btn-ghost btn-sm" onClick={logout}>{L("Se déconnecter", "Sign out")}</button>}>
        {L("Suivez vos rendez-vous, réservations et votre inscription comme membre.", "Follow your appointments, reservations and membership registration.")}
      </PageHead>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="grid gap-6">
          <form className="panel grid gap-3.5 sm:grid-cols-2" onSubmit={async (e) => { e.preventDefault(); try { await saveProfil(p); toast(L("Profil enregistré", "Profile saved")); } catch { toast(L("Enregistrement impossible", "Could not save")); } }}>
            <h3 className="text-lg sm:col-span-2">{L("Mon profil", "My profile")}</h3>
            <label className="field sm:col-span-2">{L("Nom complet", "Full name")}<input className="input" value={p.nom} onChange={(e) => setP({ ...p, nom: e.target.value })} /></label>
            <label className="field">{L("Téléphone", "Phone")}<input className="input" value={p.tel} onChange={(e) => setP({ ...p, tel: e.target.value })} inputMode="tel" /></label>
            <label className="field">{L("Quartier", "District")}<input className="input" value={p.quartier} onChange={(e) => setP({ ...p, quartier: e.target.value })} /></label>
            <label className="field sm:col-span-2">{L("Centre fréquenté", "Centre attended")}<select className="input" value={p.centre} onChange={(e) => setP({ ...p, centre: e.target.value })}>
              <option value="">{L("Pas encore", "Not yet")}</option>{centres.data.map((c) => <option key={c.id}>{c.nom}</option>)}</select></label>
            <div className="sm:col-span-2"><button className="btn-ghost">{L("Enregistrer le profil", "Save profile")}</button></div>
          </form>

          {inscription ? (
            <div className="panel grid gap-2">
              <h3 className="text-lg">{L("Inscription comme membre", "Membership registration")}</h3>
              <div className="flex items-center gap-3"><StatutBadge statut={inscription.statut} /><span className="text-sm text-muted">{L("envoyée le", "sent on")} {fshort(inscription.cree, locale)}</span></div>
              {inscription.note && <p className="rounded-md bg-surface-2 px-3 py-2 text-sm">{inscription.note}</p>}
            </div>
          ) : (
            <form onSubmit={sendIns} className="panel grid gap-3.5 sm:grid-cols-2" noValidate>
              <div className="sm:col-span-2"><h3 className="text-lg">{L("Devenir membre", "Become a member")}</h3><p className="mt-1 text-sm text-muted">{L("Votre fiche est transmise au secrétariat, qui vous rattache à un centre. Les informations de votre profil sont utilisées.", "Your details are sent to the church office, which will attach you to a centre. Your profile information is used.")}</p></div>
              <label className="field">{L("Sexe", "Sex")}<select className="input" value={ins.sexe} onChange={(e) => setIns({ ...ins, sexe: e.target.value })}><option value="Homme">{V("Homme")}</option><option value="Femme">{V("Femme")}</option></select></label>
              <label className="field">{L("Date de naissance", "Date of birth")}<input className="input" type="date" value={ins.naissance} onChange={(e) => setIns({ ...ins, naissance: e.target.value })} /></label>
              <label className="field">{L("Situation", "Status")}<select className="input" value={ins.statutSpi} onChange={(e) => setIns({ ...ins, statutSpi: e.target.value })}>
                {["Nouveau converti", "Déjà baptisé(e)", "Venant d'une autre église", "Sympathisant(e)"].map((s) => <option key={s} value={s}>{V(s)}</option>)}</select></label>
              <label className="field">{L("Profession", "Occupation")}<input className="input" value={ins.profession} onChange={(e) => setIns({ ...ins, profession: e.target.value })} /></label>
              <div className="flex flex-wrap items-center gap-3 sm:col-span-2"><button className="btn" disabled={busy}>{L("Envoyer mon inscription", "Send my registration")}</button>{err && <span role="alert" className="text-sm text-bad">{err}</span>}</div>
            </form>
          )}
        </div>

        <div className="panel grid gap-1">
          <div className="eyebrow">{L("Mes demandes", "My requests")}</div>
          {mine.loading ? <Spinner /> : list.length === 0 ? (
            <p className="pt-2 text-sm text-muted">{L("Vous n'avez encore envoyé aucune demande. Vos rendez-vous et réservations s'afficheront ici avec la réponse de l'église.", "You have not sent any request yet. Your appointments and reservations will appear here with the church's reply.")}</p>
          ) : list.map((d) => (
            <div key={d.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1.5 border-b border-line py-3.5 last:border-0">
              <div className="min-w-0">
                <div className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-gold">{V(TYPES[d.type])}</div>
                <strong className="font-semibold">
                  {d.type === "rdv" ? `${(d.avecNom || "").split(" — ")[0]} · ${fdate(d.date, locale)}, ${V(d.creneau)}` : d.type === "commande" ? `${d.titre} × ${d.qte} · ${fcfa(d.total)}` : `${V("Inscription")} · ${d.centre}`}
                </strong>
                <div className="text-xs text-muted">{L("Envoyée le", "Sent on")} {fshort(d.cree, locale)}</div>
              </div>
              <div className="grid justify-items-end gap-1.5"><StatutBadge statut={d.statut} />
                {d.statut === "en_attente" && <button className="text-xs font-semibold text-muted underline" onClick={() => cancel(d.id)}>{L("Annuler", "Cancel")}</button>}</div>
              {d.note && <p className="col-span-2 rounded-md bg-surface-2 px-3 py-2 text-sm"><b>{L("Réponse de l'église :", "Church reply:")}</b> {d.note}</p>}
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-muted">
        {L("Identifiant du compte", "Account ID")} : <code className="select-all font-mono">{user.uid}</code>{isAdmin ? L(" · administrateur", " · administrator") : L(" — à communiquer à l'administrateur pour recevoir des droits de gestion.", " — give it to the administrator to receive management rights.")}
      </p>
    </main>
  );
}
