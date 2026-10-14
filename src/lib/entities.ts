import { BIEN_CATS, ETATS, FIN_IN, FIN_OUT, ROLES } from "./format";

export type Opt = string | { v: string; l: string };
export interface Field {
  k: string; l: string;
  t?: "text" | "number" | "date" | "select" | "textarea" | "image" | "bool" | "email" | "tel" | "long";
  o?: Opt[] | ((centres: string[]) => Opt[]);
  req?: boolean; full?: boolean; hint?: string; step?: string; boolLabels?: [string, string];
}
export interface Entity { path: string; label: string; fields: Field[] }

const withSiege = (c: string[]) => ["Siège", ...c];

export const ENTITIES: Record<string, Entity> = {
  membres: {
    path: "membres", label: "membre", fields: [
      { k: "nom", l: "Nom complet", req: true, full: true },
      { k: "sexe", l: "Sexe", t: "select", o: ["Homme", "Femme"] },
      { k: "tel", l: "Téléphone", t: "tel" },
      { k: "naissance", l: "Date de naissance", t: "date" },
      { k: "quartier", l: "Quartier" },
      { k: "centre", l: "Centre", t: "select", o: (c) => ["", ...c] },
      { k: "role", l: "Fonction", t: "select", o: ROLES },
      { k: "statutSpi", l: "Situation", t: "select", o: ["Baptisé(e)", "Nouveau converti", "Venant d'une autre église", "Sympathisant(e)"] },
      { k: "dateAdhesion", l: "Date d'adhésion", t: "date" },
      { k: "profession", l: "Profession" },
      { k: "actif", l: "Statut", t: "select", o: ["Actif", "Inactif", "Transféré", "Décédé"] },
      { k: "note", l: "Observations", t: "textarea", full: true },
    ],
  },
  biens: {
    path: "biens", label: "bien", fields: [
      { k: "designation", l: "Désignation", req: true, full: true },
      { k: "categorie", l: "Catégorie", t: "select", o: BIEN_CATS },
      { k: "centre", l: "Emplacement", t: "select", o: withSiege },
      { k: "quantite", l: "Quantité", t: "number" },
      { k: "valeur", l: "Valeur unitaire (FCFA)", t: "number" },
      { k: "etat", l: "État", t: "select", o: ETATS },
      { k: "dateAcq", l: "Date d'acquisition", t: "date" },
      { k: "origine", l: "Origine", t: "select", o: ["Achat", "Don", "Legs", "Construction"] },
      { k: "reference", l: "N° d'inventaire / titre foncier" },
      { k: "note", l: "Observations", t: "textarea", full: true },
    ],
  },
  finances: {
    path: "finances", label: "opération", fields: [
      { k: "date", l: "Date", t: "date", req: true },
      { k: "type", l: "Sens", t: "select", o: [{ v: "entree", l: "Entrée d'argent" }, { v: "sortie", l: "Sortie d'argent" }] },
      { k: "categorie", l: "Catégorie", t: "select", o: [...FIN_IN, ...FIN_OUT] },
      { k: "montant", l: "Montant (FCFA)", t: "number", req: true },
      { k: "centre", l: "Centre", t: "select", o: withSiege },
      { k: "mode", l: "Mode de paiement", t: "select", o: ["Espèces", "Orange Money", "MTN MoMo", "Banque", "Chèque"] },
      { k: "libelle", l: "Libellé", full: true },
      { k: "piece", l: "N° de pièce / reçu" },
    ],
  },
  pasteurs: {
    path: "pasteurs", label: "pasteur ou responsable", fields: [
      { k: "nom", l: "Nom", req: true },
      { k: "titre", l: "Titre", t: "select", o: ["Pasteur principal", "Pasteur", "Pasteur assistant", "Évangéliste", "Ancien", "Diacre", "Responsable de centre", "Responsable des femmes", "Responsable de la jeunesse", "Secrétaire"] },
      { k: "centre", l: "Centre", t: "select", o: withSiege },
      { k: "tel", l: "Téléphone", hint: "non affiché au public" },
      { k: "ordre", l: "Ordre d'affichage", t: "number", hint: "1 = en premier" },
      { k: "rdv", l: "Rendez-vous", t: "bool", boolLabels: ["Accepte les rendez-vous", "Pas de rendez-vous"] },
      { k: "photo", l: "Photo", t: "image", full: true },
      { k: "bio", l: "Présentation", t: "textarea", full: true },
      { k: "bio_en", l: "Présentation en anglais", t: "textarea", full: true, hint: "facultatif" },
    ],
  },
  centres: {
    path: "centres", label: "centre", fields: [
      { k: "nom", l: "Nom du centre", req: true },
      { k: "quartier", l: "Quartier" },
      { k: "responsable", l: "Responsable" },
      { k: "tel", l: "Contact du centre" },
      { k: "horaires", l: "Horaires des cultes", full: true },
      { k: "adresse", l: "Repère / adresse", full: true },
      { k: "lat", l: "Latitude", t: "number", step: "0.00001", hint: "ex. 7.32260" },
      { k: "lng", l: "Longitude", t: "number", step: "0.00001", hint: "ex. 13.58470" },
      { k: "approx", l: "Précision", t: "bool", boolLabels: ["Position approximative", "Position vérifiée"] },
      { k: "photo", l: "Photo du lieu", t: "image", full: true },
    ],
  },
  livres: {
    path: "livres", label: "livre", fields: [
      { k: "titre", l: "Titre", req: true, full: true },
      { k: "auteur", l: "Auteur" },
      { k: "prix", l: "Prix (FCFA)", t: "number", req: true },
      { k: "stock", l: "Stock", t: "number" },
      { k: "visible", l: "Affichage", t: "bool", boolLabels: ["En vente", "Masqué"] },
      { k: "couverture", l: "Couverture", t: "image", full: true },
      { k: "description", l: "Description", t: "textarea", full: true },
      { k: "description_en", l: "Description en anglais", t: "textarea", full: true, hint: "facultatif" },
    ],
  },
  programme: {
    path: "programme", label: "activité", fields: [
      { k: "titre", l: "Activité", req: true },
      { k: "titre_en", l: "Activité en anglais", hint: "facultatif" },
      { k: "centre", l: "Où", t: "select", o: (c) => ["Église centrale", ...c] },
      { k: "jour", l: "Jour (activité chaque semaine)", t: "select", o: ["", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"] },
      { k: "date", l: "ou date précise (événement)", t: "date" },
      { k: "lieu", l: "Lieu précis", hint: "ex. Grande salle" },
      { k: "heure", l: "Heure de début", hint: "ex. 08 h 30" },
      { k: "heureFin", l: "Heure de fin", hint: "facultatif" },
      { k: "description", l: "Description", t: "textarea", full: true },
      { k: "description_en", l: "Description en anglais", t: "textarea", full: true, hint: "facultatif" },
    ],
  },
  articles: {
    path: "articles", label: "publication", fields: [
      { k: "type", l: "Type", t: "select", o: [{ v: "article", l: "Article" }, { v: "annonce", l: "Annonce" }] },
      { k: "date", l: "Date de publication", t: "date", req: true },
      { k: "titre", l: "Titre", req: true, full: true },
      { k: "titre_en", l: "Titre en anglais", full: true, hint: "facultatif" },
      { k: "resume", l: "Résumé (une ou deux phrases)", t: "textarea", full: true },
      { k: "resume_en", l: "Résumé en anglais", t: "textarea", full: true, hint: "facultatif" },
      { k: "contenu", l: "Texte complet", t: "long", full: true, hint: "laissez une ligne vide entre deux paragraphes" },
      { k: "contenu_en", l: "Texte complet en anglais", t: "long", full: true, hint: "facultatif" },
      { k: "image", l: "Image", t: "image", full: true },
      { k: "auteur", l: "Auteur" },
      { k: "expire", l: "Retirer automatiquement après le", t: "date", hint: "utile pour les annonces" },
      { k: "epingle", l: "Mise en avant", t: "bool", boolLabels: ["Normale", "Épinglée en haut"] },
      { k: "publie", l: "Visibilité", t: "bool", boolLabels: ["Publiée sur le site", "Brouillon (non visible)"] },
    ],
  },
  departements: {
    path: "departements", label: "département", fields: [
      { k: "nom", l: "Nom du département", req: true },
      { k: "nom_en", l: "Nom en anglais", hint: "facultatif" },
      { k: "responsable", l: "Responsable" },
      { k: "adjoint", l: "Adjoint(e)" },
      { k: "contact", l: "Contact", hint: "affiché au public" },
      { k: "ordre", l: "Ordre d'affichage", t: "number" },
      { k: "description", l: "Présentation", t: "textarea", full: true },
      { k: "description_en", l: "Présentation en anglais", t: "textarea", full: true, hint: "facultatif" },
      { k: "programmes", l: "Programme du département", t: "long", full: true, hint: "une activité par ligne : Jour | Heure | Activité | Lieu" },
      { k: "photo", l: "Photo du responsable", t: "image", full: true },
    ],
  },
  localites: {
    path: "localites", label: "localité ou village", fields: [
      { k: "nom", l: "Nom", req: true },
      { k: "type", l: "Type", t: "select", o: ["Village", "Localité"] },
      { k: "distance", l: "Distance de Ngaoundéré (km)", t: "number" },
      { k: "depuis", l: "Œuvre commencée en", hint: "ex. 2019" },
      { k: "frequence", l: "Fréquence des visites", hint: "ex. chaque 1er samedi du mois" },
      { k: "responsable", l: "Responsable de l'œuvre" },
      { k: "fideles", l: "Nombre de fidèles", t: "number" },
      { k: "lat", l: "Latitude", t: "number", step: "0.00001" },
      { k: "lng", l: "Longitude", t: "number", step: "0.00001" },
      { k: "approx", l: "Précision", t: "bool", boolLabels: ["Position approximative", "Position vérifiée"] },
      { k: "activites", l: "Activités menées", full: true, hint: "ex. évangélisation, culte de maison, aide aux familles" },
      { k: "activites_en", l: "Activités en anglais", full: true, hint: "facultatif" },
      { k: "description", l: "Présentation", t: "textarea", full: true },
      { k: "description_en", l: "Présentation en anglais", t: "textarea", full: true, hint: "facultatif" },
      { k: "photo", l: "Photo", t: "image", full: true },
    ],
  },
};

export const DEFAULTS: Record<string, Record<string, unknown>> = {
  membres: { role: "Membre", actif: "Actif", sexe: "Homme" },
  biens: { quantite: 1, etat: "Bon état", categorie: BIEN_CATS[0], centre: "Siège", origine: "Achat" },
  finances: { type: "entree", categorie: FIN_IN[0], mode: "Espèces", centre: "Siège" },
  pasteurs: { rdv: true, titre: "Pasteur" },
  centres: { approx: false },
  livres: { visible: true, stock: 0 },
  programme: { centre: "Église centrale", jour: "Dimanche" },
  articles: { type: "article", publie: true, epingle: false },
  departements: {},
  localites: { type: "Village", approx: true },
};
