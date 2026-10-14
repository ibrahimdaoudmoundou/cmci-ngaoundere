import { today } from "./format";
import type { Activite, Pasteur, WithId } from "./types";

export const sortPasteurs = (l: WithId<Pasteur>[]) =>
  [...l].sort((a, b) => (Number(a.ordre) || 99) - (Number(b.ordre) || 99) || a.nom.localeCompare(b.nom));

const JOURS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
const key = (p: Activite) =>
  p.date ? `1${p.date}` : `0${String(JOURS.findIndex((d) => String(p.jour || "").toLowerCase().startsWith(d))).padStart(2, "0")}`;

/** Activités régulières (par jour de la semaine) puis événements datés à venir. */
export const sortProgramme = (l: WithId<Activite>[], withPast = false) => {
  const t = today();
  return l.filter((p) => withPast || !p.date || p.date >= t)
    .sort((a, b) => key(a).localeCompare(key(b)) || String(a.heure).localeCompare(String(b.heure)));
};

/** Programme d'un département, une activité par ligne : « Jour | Heure | Activité | Lieu ». */
export function parseLignes(txt?: string) {
  return String(txt || "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean).map((l) => {
    const [jour = "", heure = "", activite = "", lieu = ""] = l.split("|").map((x) => x.trim());
    return activite ? { jour, heure, activite, lieu } : { jour: "", heure: "", activite: jour, lieu: "" };
  });
}
export const paragraphs = (t?: string) => String(t || "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
