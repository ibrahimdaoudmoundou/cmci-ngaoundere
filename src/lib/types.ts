export type WithId<T> = T & { id: string };

export interface SiteConfig {
  tel?: string; whatsapp?: string; email?: string; horaires?: string;
  adresse?: string; momo?: string; messageAccueil?: string; referenceVerset?: string;
}
export interface Pasteur {
  nom: string; titre?: string; centre?: string; tel?: string; bio?: string;
  photo?: string; ordre?: number; rdv?: boolean; exemple?: boolean; bio_en?: string;
}
export interface Centre {
  nom: string; quartier?: string; responsable?: string; tel?: string; horaires?: string;
  adresse?: string; lat?: number | ""; lng?: number | ""; approx?: boolean; photo?: string; exemple?: boolean;
}
export interface Livre {
  titre: string; auteur?: string; prix: number; stock: number; visible?: boolean;
  couverture?: string; description?: string; description_en?: string; exemple?: boolean;
}
export interface Activite {
  titre: string; titre_en?: string; jour?: string; date?: string; heure?: string; heureFin?: string; lieu?: string;
  centre?: string; description?: string; description_en?: string; exemple?: boolean;
}
export type DemandeType = "rdv" | "inscription" | "commande";
export type Statut = "en_attente" | "confirme" | "termine" | "refuse" | "annule";
export interface Demande {
  uid: string; type: DemandeType; statut: Statut; nom: string; tel: string;
  note?: string; message?: string; cree: string; maj?: string;
  // rendez-vous
  avec?: string; avecNom?: string; motif?: string; date?: string; creneau?: string; lieu?: string;
  // inscription
  sexe?: string; naissance?: string; quartier?: string; centre?: string; statutSpi?: string; profession?: string;
  // commande
  livreId?: string; titre?: string; prix?: number; qte?: number; total?: number; retrait?: string;
}
export interface Membre {
  nom: string; sexe?: string; tel?: string; naissance?: string; quartier?: string; centre?: string;
  role?: string; statutSpi?: string; dateAdhesion?: string; profession?: string; actif?: string;
  note?: string; source?: string;
}
export interface Bien {
  designation: string; categorie?: string; centre?: string; quantite?: number; valeur?: number;
  etat?: string; dateAcq?: string; origine?: string; reference?: string; note?: string;
}
export interface Operation {
  date: string; type: "entree" | "sortie"; categorie?: string; montant: number;
  centre?: string; mode?: string; libelle?: string; piece?: string;
}
export interface Profil { nom?: string; tel?: string; quartier?: string; centre?: string; email?: string; }

export interface Article {
  type: "article" | "annonce"; titre: string; titre_en?: string; resume?: string; resume_en?: string;
  contenu?: string; contenu_en?: string; image?: string; date: string; auteur?: string;
  publie: boolean; epingle?: boolean; expire?: string; exemple?: boolean;
}
export interface Departement {
  nom: string; nom_en?: string; description?: string; description_en?: string; responsable?: string; adjoint?: string;
  contact?: string; photo?: string; ordre?: number; programmes?: string; exemple?: boolean;
}
export interface Localite {
  nom: string; type?: string; distance?: number | ""; lat?: number | ""; lng?: number | ""; approx?: boolean;
  depuis?: string; frequence?: string; responsable?: string; fideles?: number | "";
  activites?: string; activites_en?: string; description?: string; description_en?: string; photo?: string;
}
export interface Vision {
  vision?: string; vision_en?: string; mission?: string; mission_en?: string; valeurs?: string; valeurs_en?: string;
  histoireLocale?: string; histoireLocale_en?: string; siteMondial?: string;
}
