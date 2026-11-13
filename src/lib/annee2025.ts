/** « La main du Seigneur dans l'Église à Ngaoundéré en 2025 » — tiré de la présentation de l'église. */
export interface Etape { mois: string; mois_en: string; titre: string; titre_en: string; texte: string; texte_en: string; photo?: string }

export const ANNEE_2025: Etape[] = [
  { mois: "Janvier", mois_en: "January", photo: "/photos/2025-01-festival.jpg",
    titre: "Festival et rassemblement", titre_en: "Festival and gathering",
    texte: "Ouverture de l'année par le festival et le grand rassemblement au hall de Haut-Plateau.",
    texte_en: "The year opened with the festival and a large gathering at the Haut-Plateau hall." },
  { mois: "Février", mois_en: "February", photo: "/photos/2025-02-ecsd.jpg",
    titre: "Sept frères envoyés à l'ECSD", titre_en: "Seven brothers sent to the ECSD",
    texte: "Sept frères et sœurs de Baladji, Gada-Mabanga, Haut-Plateau et Marza envoyés aux sessions de 21 et 42 jours de l'ECSD. Semaine de la jeunesse : évangélisation de masse, service chez les dirigeants, soirées « Autour du feu ».",
    texte_en: "Seven brothers and sisters from Baladji, Gada-Mabanga, Haut-Plateau and Marza sent to the 21- and 42-day ECSD sessions. Youth week: mass evangelism, service to leaders and “Around the fire” evenings." },
  { mois: "Mars", mois_en: "March", photo: "/photos/2025-03-cote-ivoire.jpg",
    titre: "Envoi en Côte d'Ivoire", titre_en: "Mission to Côte d'Ivoire",
    texte: "Envoi de frères en mission en Côte d'Ivoire.", texte_en: "Brothers sent on mission to Côte d'Ivoire." },
  { mois: "Avril", mois_en: "April", photo: "/photos/2025-04-camp-jeunes.jpg",
    titre: "Camp provincial des jeunes", titre_en: "Provincial youth camp",
    texte: "Orateur principal : Pasteur Séverin Lontsi. 18 localités représentées, 303 participants, 178 conversions, 55 délivrances, 61 guérisons et 72 baptêmes dans le Saint-Esprit.",
    texte_en: "Main speaker: Pastor Séverin Lontsi. 18 localities, 303 participants, 178 conversions, 55 deliverances, 61 healings and 72 baptisms in the Holy Spirit." },
  { mois: "Mai", mois_en: "May", photo: "/photos/2025-05-retour.jpg",
    titre: "Retour de Côte d'Ivoire et croisade", titre_en: "Return from Côte d'Ivoire and crusade",
    texte: "Accueil des frères au hall de Haut-Plateau, ministère reçu par le Pasteur Samuel Yadiaya et les missionnaires (Pasteur Baha), croisade de brisement des liens.",
    texte_en: "Welcome of the brothers at the Haut-Plateau hall, ministry received by Pastor Samuel Yadiaya and the missionaries (Pastor Baha), crusade for the breaking of bonds." },
  { mois: "Juin", mois_en: "June", photo: "/photos/2025-06-retraite.jpg",
    titre: "Retraite des dirigeants", titre_en: "Leaders' retreat",
    texte: "Retraite des dirigeants aînés et des missionnaires du 26 au 29 juin, avec le compte rendu des missionnaires.",
    texte_en: "Retreat of senior leaders and missionaries from 26 to 29 June, with the missionaries' report." },
  { mois: "Juillet", mois_en: "July", photo: "/photos/2025-07-camp-fondation.jpg",
    titre: "Camp de la Fondation", titre_en: "Foundation camp",
    texte: "Participation de l'église au Camp de la Fondation.", texte_en: "The church took part in the Foundation camp." },
  { mois: "Août", mois_en: "August", photo: "/photos/2025-08-camps.jpg",
    titre: "Camp des leaders, UMPJ et ZMA", titre_en: "Leaders' camp, UMPJ and ZMA",
    texte: "Participation au Camp des Leaders, à l'UMPJ et à la ZMA.", texte_en: "Participation in the Leaders' camp, the UMPJ and the ZMA." },
  { mois: "Septembre", mois_en: "September", photo: "/photos/2025-09-croisade.jpg",
    titre: "Croisade avec le Provincial", titre_en: "Crusade with the Provincial",
    texte: "Croisade de trois jours avec le Provincial, puis ministère avec le frère JDW du 17 au 21 septembre.",
    texte_en: "Three-day crusade with the Provincial, then ministry with brother JDW from 17 to 21 September." },
  { mois: "Octobre", mois_en: "October", photo: "/photos/2025-10-evangelisation.jpg",
    titre: "Évangélisation de l'Église", titre_en: "Church-wide evangelism",
    texte: "Toute l'église est sortie annoncer l'Évangile, en ville et dans les localités.",
    texte_en: "The whole church went out to proclaim the Gospel, in the city and the localities." },
  { mois: "Novembre", mois_en: "November", photo: "/photos/2025-11-croisade-40j.jpg",
    titre: "Croisade de 40 jours du Ministère", titre_en: "The Ministry's 40-day crusade",
    texte: "Participation à la croisade de 40 jours : plus de mille heures de prière investies et plus de six mille participants à Ngaoundéré et dans ses localités.",
    texte_en: "Taking part in the 40-day crusade: over a thousand hours of prayer invested and more than six thousand participants in Ngaoundéré and its localities." },
  { mois: "Décembre", mois_en: "December", photo: "/photos/2025-12-jubile.jpg",
    titre: "Jubilé du Ministère et retraite", titre_en: "Ministry jubilee and retreat",
    texte: "Participation au Jubilé du Ministère à Yaoundé du 12 au 14 décembre, puis retraite de 26 heures.",
    texte_en: "Participation in the Ministry's Jubilee in Yaoundé from 12 to 14 December, followed by a 26-hour retreat." },
];

/** Vie régulière de l'église (diapositive « Autres évènements »). */
export const VIE_REGULIERE = {
  fr: ["Voyages du Pasteur Samuel Yadiaya dans les localités", "Ministères du Pasteur dans les centres de la ville", "Évangélisation dans les différents centres", "Nuits de prière de l'église et de la vision", "Enseignement les mardis", "Intercession les mercredis", "Réunions des dirigeants et des jeunes", "Sièges provinciaux à Ngaoundal", "Services communs (joint services)", "Cultes dans les centres", "Sièges de prière de 12 h, 24 h et 72 h", "Sièges de louange"],
  en: ["Pastor Samuel Yadiaya's visits to the localities", "The Pastor's ministry in the city centres", "Evangelism in every centre", "Church and vision prayer nights", "Teaching on Tuesdays", "Intercession on Wednesdays", "Leaders' and youth meetings", "Provincial sieges in Ngaoundal", "Joint services", "Services in the centres", "12-, 24- and 72-hour prayer sieges", "Praise sieges"],
};

/** Chiffres clés tirés des documents de l'église. */
export const CHIFFRES = [
  { v: "11", fr: "centres dans la ville", en: "centres in the city" },
  { v: "6 000+", fr: "participants à la croisade", en: "crusade participants" },
  { v: "1 000+", fr: "heures de prière investies", en: "hours of prayer invested" },
  { v: "1 517", fr: "enfants suivis par 47 ministres", en: "children cared for by 47 ministers" },
];
