"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "fr" | "en";
const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "fr", setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cmci-lang");
      if (saved === "fr" || saved === "en") setLangState(saved);
      else if (navigator.language?.toLowerCase().startsWith("en")) setLangState("en");
    } catch { /* navigation privée : on reste en français */ }
  }, []);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("cmci-lang", l); } catch { /* ignore */ }
  }, []);
  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}

/** Valeurs enregistrées en français dans la base, affichées en anglais si besoin. */
const EN: Record<string, string> = {
  // jours
  Lundi: "Monday", Mardi: "Tuesday", Mercredi: "Wednesday", Jeudi: "Thursday", Vendredi: "Friday", Samedi: "Saturday", Dimanche: "Sunday",
  // statuts
  "En attente": "Pending", "Confirmée": "Confirmed", "Terminée": "Completed", "Refusée": "Declined", "Annulée": "Cancelled",
  // types
  "Rendez-vous": "Appointment", "Inscription": "Membership", "Commande de livre": "Book order",
  // motifs
  "Conseil pastoral": "Pastoral counselling", "Prière et délivrance": "Prayer and deliverance", "Préparation au mariage": "Marriage preparation",
  "Préparation au baptême": "Baptism preparation", "Visite à domicile ou à l'hôpital": "Home or hospital visit", "Présentation d'enfant": "Child dedication", Autre: "Other",
  // créneaux
  "Matin (8 h – 12 h)": "Morning (8 am – 12 pm)", "Après-midi (14 h – 17 h)": "Afternoon (2 pm – 5 pm)", "Soir (17 h – 19 h)": "Evening (5 pm – 7 pm)",
  // situations
  "Nouveau converti": "New convert", "Déjà baptisé(e)": "Already baptised", "Venant d'une autre église": "From another church", "Sympathisant(e)": "Friend of the church",
  Homme: "Male", Femme: "Female",
  // titres
  "Pasteur principal": "Senior Pastor", Pasteur: "Pastor", "Pasteur assistant": "Assistant Pastor", "Évangéliste": "Evangelist", Ancien: "Elder", Diacre: "Deacon",
  "Responsable de centre": "Centre leader", "Responsable des femmes": "Women's leader", "Responsable de la jeunesse": "Youth leader", "Secrétaire": "Secretary",
  // lieux
  "Au siège": "At the headquarters", "À domicile": "At home", "Siège": "Headquarters", "Église centrale": "Central church",
  Localité: "Locality", Village: "Village",
};

export function useLang() {
  const { lang, setLang } = useContext(Ctx);
  return useMemo(() => {
    const en = lang === "en";
    /** Texte d'interface : L("Bonjour", "Hello") */
    const L = (fr: string, enText: string) => (en ? enText : fr);
    /** Valeur stockée en français (jour, motif, titre…) traduite si possible. */
    const V = (v?: string) => (v && en ? EN[v] ?? v : v ?? "");
    /** Champ de contenu bilingue : tr(article, "titre") lit titre_en en anglais, sinon titre. */
    const tr = (o: object | null | undefined, k: string): string => {
      const r = (o || {}) as Record<string, unknown>;
      const vEn = r[`${k}_en`];
      return String(en && typeof vEn === "string" && vEn.trim() ? vEn : r[k] ?? "");
    };
    const locale = en ? "en-GB" : "fr-FR";
    return { lang, setLang, en, L, V, tr, locale };
  }, [lang, setLang]);
}
