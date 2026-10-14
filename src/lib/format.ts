export const num = (n: unknown) =>
  (Number(n) || 0).toLocaleString("fr-FR").replace(/[  ]/g, " ");
export const fcfa = (n: unknown) => `${num(n)} FCFA`;
export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
export const nowIso = () => new Date().toISOString();
export const ym = (d?: string) => String(d || "").slice(0, 7);
const parse = (d: string) => new Date(d.length === 10 ? `${d}T12:00:00` : d);
export const fdate = (d?: string, locale = "fr-FR") => {
  if (!d) return "";
  const x = parse(d);
  return isNaN(+x) ? d : x.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
};
export const fshort = (d?: string, locale = "fr-FR") => {
  if (!d) return "";
  const x = parse(d);
  return isNaN(+x) ? d : x.toLocaleDateString(locale, { day: "2-digit", month: "2-digit", year: "numeric" });
};
export const fmonth = (d?: string, locale = "fr-FR") => {
  if (!d) return "";
  const x = parse(d);
  return isNaN(+x) ? d : x.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
};
export const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
export const CMCI_GLOBAL_URL = "https://cmfinternational.org";
export const initials = (n?: string) =>
  String(n || "?").trim().split(/\s+/).slice(0, 2).map((w) => w[0] || "").join("").toUpperCase();
export const telOk = (t: string) => t.replace(/\D/g, "").length >= 8;
export const short = (v: number) =>
  v >= 1e6 ? `${(v / 1e6).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} M`
  : v >= 1e3 ? `${(v / 1e3).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} k` : String(v);
export const niceMax = (v: number) => {
  const p = Math.pow(10, Math.floor(Math.log10(Math.max(v, 1))));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
};

export const STATUTS: Record<string, { label: string; tone: "warn" | "ok" | "gold" | "bad" | "neutral" }> = {
  en_attente: { label: "En attente", tone: "warn" },
  confirme: { label: "Confirmée", tone: "ok" },
  termine: { label: "Terminée", tone: "gold" },
  refuse: { label: "Refusée", tone: "bad" },
  annule: { label: "Annulée", tone: "neutral" },
};
export const TYPES: Record<string, string> = { rdv: "Rendez-vous", inscription: "Inscription", commande: "Commande de livre" };

export const ROLES = ["Membre", "Ouvrier", "Choriste", "Responsable de cellule", "Diacre / Diaconesse", "Ancien", "Évangéliste", "Pasteur"];
export const BIEN_CATS = ["Terrains et bâtiments", "Mobilier", "Sonorisation", "Instruments de musique", "Véhicules", "Informatique et bureau", "Cuisine et réception", "Autre"];
export const ETATS = ["Bon état", "À réparer", "Hors service"];
export const FIN_IN = ["Dîmes", "Offrandes", "Dons", "Ventes librairie", "Collectes spéciales", "Autres entrées"];
export const FIN_OUT = ["Loyer et charges", "Électricité et eau", "Salaires et primes", "Évangélisation et missions", "Œuvres sociales", "Entretien et réparations", "Achat de matériel", "Transport", "Autres dépenses"];
export const MOTIFS = ["Conseil pastoral", "Prière et délivrance", "Préparation au mariage", "Préparation au baptême", "Visite à domicile ou à l'hôpital", "Présentation d'enfant", "Autre"];
export const CRENEAUX = ["Matin (8 h – 12 h)", "Après-midi (14 h – 17 h)", "Soir (17 h – 19 h)"];
export const CITY = { lat: 7.3226, lng: 13.5847 };
