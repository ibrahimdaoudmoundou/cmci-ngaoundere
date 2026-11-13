"use client";
import { collection, doc, getDoc, getDocs, query, where, writeBatch, type DocumentData } from "firebase/firestore";
import { fbDb } from "./firebase";
import { nowIso } from "./format";

/**
 * Contenu de l'église tiré de ses documents (présentation 2025, semaine de la jeunesse 2026,
 * rapport du ministère aux enfants 2025, fardeaux des camps).
 *
 * L'import est sans risque : un élément déjà modifié dans « Gestion » (champ « maj ») n'est jamais écrasé.
 * Les positions de centres et de localités marquées « approx » sont à vérifier sur place.
 */
type Docs = Record<string, DocumentData>;

const P = (s: string) => s.trim().replace(/\n +/g, "\n");

const CONFIG: DocumentData = { adresse: "Hall de Haut-Plateau, Ngaoundéré, Adamaoua, Cameroun" };

const resp = (nom: string, centre: string, ordre: number, titre = "Pasteur") =>
  ({ nom, titre, centre, ordre, rdv: true, photo: "", tel: "", bio: `${titre} du centre ${centre}.`, bio_en: `${titre === "Pasteur" ? "Pastor" : "Leader"} of the ${centre} centre.` });

const PASTEURS: Docs = {
  "paul-elanga": resp("Paul Elanga", "Haut-Plateau", 3),
  "alain-afnassa": resp("Alain Afnassa", "Béka", 4, "Responsable de centre"),
  "alphonse-gada": resp("Alphonse", "Gada-Mabanga", 5, "Responsable de centre"),
  "enoh-robert": resp("Enoh Robert", "Gada-Mabanga", 6, "Responsable de centre"),
  "paul-ania": resp("Paul Ania", "Repyanga", 7, "Responsable de centre"),
  konai: resp("Konaï", "Wakwa", 8, "Responsable de centre"),
  "samuel-yadiaya": {
    nom: "Samuel Yadiaya", titre: "Pasteur principal", centre: "Siège", ordre: 1, rdv: true, photo: "", tel: "",
    bio: "Pasteur principal de l'Église de la CMCI à Ngaoundéré, dans la province spirituelle de l'Adamaoua. Il conduit l'église centrale et ses centres de quartier, visite les localités voisines et exerce le ministère dans chaque centre de la ville.",
    bio_en: "Senior Pastor of the CMFI church in Ngaoundéré, in the spiritual province of Adamawa. He leads the central church and its neighbourhood centres, visits the surrounding localities and ministers in every centre of the city.",
  },
  "baha-jacques": {
    nom: "Baha Jacques", titre: "Pasteur", centre: "Siège", ordre: 2, rdv: true, photo: "", tel: "",
    bio: "Missionnaire et responsable du Ministère aux Jeunes et Étudiants. Il accompagne les jeunes dans l'évangélisation, les camps et la préparation au mariage.",
    bio_en: "Missionary and leader of the Youth and Students Ministry. He guides young people in evangelism, camps and marriage preparation.",
  },
};

/** Centres de la ville (rapport du ministère aux enfants 2025, complété par le secrétariat). */
const CENTRES: Docs = {
  "haut-plateau": { nom: "Haut-Plateau", quartier: "Haut-Plateau", responsable: "Pasteur Paul Elanga", lat: 7.315, lng: 13.599, approx: true, adresse: "Centre chrétien de Haut-Plateau (hall de l'église)" },
  baladji: { nom: "Baladji", quartier: "Baladji", lat: 7.333, lng: 13.577, approx: true },
  gadamabanga: { nom: "Gada-Mabanga", quartier: "Gada-Mabanga", responsable: "Alphonse et Enoh Robert", lat: 7.336, lng: 13.596, approx: true },
  wakwa: { nom: "Wakwa", quartier: "Wakwa", responsable: "Konaï", lat: 7.266, lng: 13.552, approx: true },
  marza: { nom: "Marza", quartier: "Marza", lat: "", lng: "" },
  setuba: { nom: "Setuba", quartier: "Setuba", lat: "", lng: "" },
  "selbe-darang": { nom: "Selbé-Darang", quartier: "Selbé-Darang", lat: "", lng: "" },
  "nord-cifan": { nom: "Nord Cifan", quartier: "Nord Cifan", lat: "", lng: "" },
  beka: { nom: "Béka", quartier: "Béka", responsable: "Alain Afnassa", lat: "", lng: "" },
  youkou: { nom: "Youkou", quartier: "Youkou", lat: "", lng: "" },
  repyanga: { nom: "Repyanga", quartier: "Repyanga", responsable: "Paul Ania", lat: "", lng: "" },
};

const PROGRAMME: Docs = {
  "culte-dimanche": { titre: "Cultes dans les centres", titre_en: "Services in the centres", centre: "Église centrale", jour: "Dimanche", heure: "", lieu: "Dans chaque centre", description: "Chaque dimanche, les fidèles se réunissent dans le centre de leur quartier.", description_en: "Every Sunday, believers meet in their neighbourhood centre." },
  "enseignement-mardi": { titre: "Enseignement", titre_en: "Teaching", centre: "Église centrale", jour: "Mardi", heure: "", lieu: "", description: "Enseignement de la Parole de Dieu.", description_en: "Teaching of God's Word." },
  "intercession-mercredi": { titre: "Intercession", titre_en: "Intercession", centre: "Église centrale", jour: "Mercredi", heure: "", lieu: "", description: "L'église porte la ville, la province et les nations dans la prière.", description_en: "The church carries the city, the province and the nations in prayer." },
};

const DEPARTEMENTS: Docs = {
  jeunesse: {
    nom: "Ministère aux Jeunes et Étudiants (MINJE)", nom_en: "Youth and Students Ministry (MINJE)", ordre: 1,
    responsable: "Pasteur Baha Jacques",
    description: "Former des jeunes « Juda », des flèches pour l'accomplissement du but de l'église : évangélisation dans les lycées, collèges et universités, nuits de prière, camps, retraites dans les localités, soirées « Autour du feu » et « Jeunesse, parlons-en », journées sportives et rencontres « Cœur à cœur » avec les seniors.",
    description_en: "Raising young “Judah” believers, arrows for the church's purpose: evangelism in schools and universities, prayer nights, camps, retreats in the localities, “Around the fire” and “Youth, let's talk” evenings, sports days and “Heart to heart” meetings with seniors.",
    programmes: "Février | | Semaine de la jeunesse | Ngaoundéré\nAvril | | Camp provincial des jeunes | Ngaoundéré\nChaque semaine | | Évangélisation : une personne par jour en semaine, cinq le week-end | Ville et localités",
    photo: "",
  },
  "school-conquest": {
    nom: "School Conquest (évangélisation scolaire)", nom_en: "School Conquest (school evangelism)", ordre: 2, responsable: "",
    description: "Prêcher l'Évangile dans les lycées, collèges, universités et grandes écoles de Ngaoundéré, avec l'objectif de gagner cinq personnes pour former une assemblée dans chaque établissement.",
    description_en: "Preaching the Gospel in Ngaoundéré's high schools, colleges and universities, aiming to win five people to start a fellowship in each school.",
    programmes: "Février | Matin | Conférences dans les lycées et collèges | Ville de Ngaoundéré", photo: "",
  },
  enfants: {
    nom: "Ministère aux enfants", nom_en: "Children's ministry", ordre: 3, responsable: "",
    description: "Présent dans les 10 centres de la ville avec 47 ministres : 1 517 enfants suivis, dont 457 réguliers, répartis en 36 groupes de proximité. Journées de louange de 12 heures, retraites, camps des agneaux et participation à l'UMPJ pour les moins de 14 ans.",
    description_en: "Active in all 10 city centres with 47 ministers: 1,517 children, 457 of them regular, in 36 neighbourhood groups. 12-hour praise days, retreats, lamb camps and the UMPJ for under-14s.",
    programmes: "Mars | 12 h | Journée de louange des enfants | Église centrale\nJuillet | 12 h | Journée de louange des enfants | Église centrale\nSeptembre | | Retraite des enfants | \nDécembre | | Retraite des ministres aux enfants | ",
    photo: "/photos/enfants-haut-plateau.jpg",
  },
  misericorde: {
    nom: "Œuvres de miséricorde", nom_en: "Works of mercy", ordre: 4, responsable: "",
    description: "Apporter le royaume des cieux aux personnes dans le besoin : visites à la prison centrale de Ngaoundéré, aux malades, aide aux démunis, consolation et prière.",
    description_en: "Bringing the kingdom of heaven to people in need: visits to Ngaoundéré central prison and to the sick, help for the poor, comfort and prayer.",
    programmes: "Février | | Visite à la prison centrale | Ngaoundéré", photo: "",
  },
  intercession: {
    nom: "Intercession", nom_en: "Intercession", ordre: 5, responsable: "",
    description: "Porter l'église, la ville et les nations dans la prière : intercession du mercredi, nuits de prière de l'église et de la vision, sièges de prière de 12, 24 et 72 heures.",
    description_en: "Carrying the church, the city and the nations in prayer: Wednesday intercession, church and vision prayer nights, 12-, 24- and 72-hour prayer sieges.",
    programmes: "Mercredi | | Intercession | Église centrale", photo: "",
  },
  "evangelisation": {
    nom: "Évangélisation et missions", nom_en: "Evangelism and missions", ordre: 6, responsable: "",
    description: "Évangélisation dans les centres et les localités, croisades, campagnes et envoi de missionnaires (court terme, temporaires et à plein temps), jusqu'en Côte d'Ivoire.",
    description_en: "Evangelism in the centres and localities, crusades, campaigns and sending of missionaries (short-term, temporary and full-time), as far as Côte d'Ivoire.",
    programmes: "Octobre | | Évangélisation de l'église | Ville et localités", photo: "",
  },
};

const LOCALITES: Docs = {
  meiganga: { nom: "Meiganga", type: "Localité", lat: 6.517, lng: 14.3, approx: true, fideles: "", distance: "", depuis: "", frequence: "",
    activites: "Ministère de plein salut, exhortation sur le but quinquennal, évangélisation des jeunes", activites_en: "Full-salvation ministry, exhortation on the five-year goal, youth evangelism",
    description: "Mission de la jeunesse en février 2026 : 42 participants, 28 repentances et 40 jeunes engagés pour l'accomplissement du but quinquennal.",
    description_en: "Youth mission in February 2026: 42 participants, 28 repentances and 40 young people committed to the five-year goal." },
  mbaka: { nom: "Mbaka", type: "Village", lat: "", lng: "", approx: true, fideles: "", distance: "", depuis: "", frequence: "",
    activites: "Ministère de plein salut, évangélisation", activites_en: "Full-salvation ministry, evangelism",
    description: "Mission de la jeunesse en février 2026 : 50 participants venus de 3 localités, 28 repentances et 10 engagements.",
    description_en: "Youth mission in February 2026: 50 participants from 3 localities, 28 repentances and 10 commitments." },
  tignere: { nom: "Tignère", type: "Localité", lat: 7.367, lng: 12.65, approx: true, fideles: "", distance: "", depuis: "", frequence: "",
    responsable: "Pasteur Emmanuel Djaryang",
    activites: "Retraite spirituelle des jeunes du Faro-et-Déo, guérison et délivrance", activites_en: "Youth spiritual retreat for Faro-et-Déo, healing and deliverance",
    description: "Retraite des 7 et 8 février 2026 : 56 disciples de 2 localités, 22 jeunes engagés à prêcher à 600 personnes par an, 26 délivrances, 13 guérisons et 22 personnes remplies du Saint-Esprit.",
    description_en: "Retreat on 7–8 February 2026: 56 disciples from 2 localities, 22 young people committed to preach to 600 people a year, 26 deliverances, 13 healings and 22 people filled with the Holy Spirit." },
  ngaoundal: { nom: "Ngaoundal", type: "Localité", lat: 6.467, lng: 13.267, approx: true, fideles: "", distance: "", depuis: "", frequence: "",
    activites: "Sièges provinciaux de prière", activites_en: "Provincial prayer sieges",
    description: "L'église participe aux sièges provinciaux organisés à Ngaoundal.",
    description_en: "The church takes part in the provincial sieges held in Ngaoundal." },
};

const ARTICLES: Docs = {
  "bilan-2025": {
    type: "article", publie: true, epingle: true, date: "2026-01-04", auteur: "Église à Ngaoundéré", image: "/photos/2025-10-culte.jpg",
    titre: "La main du Seigneur dans l'Église à Ngaoundéré en 2025", titre_en: "The hand of the Lord on the Ngaoundéré church in 2025",
    resume: "Croisades, camps, envois missionnaires et plus de six mille participants : retour sur une année de grâce.",
    resume_en: "Crusades, camps, missionaries sent and over six thousand participants: looking back on a year of grace.",
    contenu: P(`L'année 2025 a commencé par le festival et le grand rassemblement au hall de Haut-Plateau. En février, sept frères et sœurs de Baladji, Gada-Mabanga, Haut-Plateau et Marza ont été envoyés aux sessions de 21 et 42 jours de l'ECSD, pendant que la semaine de la jeunesse mobilisait les jeunes pour l'évangélisation de masse.

      En mars, des frères sont partis en mission en Côte d'Ivoire ; ils ont été accueillis en mai au hall de Haut-Plateau, avant la croisade de brisement des liens. En avril, le camp provincial des jeunes a réuni 303 participants de 18 localités : 178 conversions, 55 délivrances, 61 guérisons et 72 baptêmes dans le Saint-Esprit.

      L'été a été marqué par la retraite des dirigeants aînés et des missionnaires (26–29 juin), le Camp de la Fondation, le Camp des Leaders, l'UMPJ et la ZMA. En septembre, la croisade de trois jours avec le Provincial et le ministère du frère JDW (17–21 septembre) ; en octobre, l'évangélisation de toute l'église.

      En novembre, la croisade de 40 jours du Ministère : plus de mille heures de prière investies et plus de six mille participants à Ngaoundéré et dans ses localités. L'année s'est achevée par le Jubilé du Ministère à Yaoundé (12–14 décembre) et une retraite de 26 heures.

      Tout au long de l'année : voyages du Pasteur Samuel Yadiaya dans les localités, ministères dans les centres, enseignement le mardi, intercession le mercredi, nuits de prière et sièges de 12, 24 et 72 heures. À Dieu seul soit la gloire.`),
    contenu_en: P(`2025 opened with the festival and a large gathering at the Haut-Plateau hall. In February, seven brothers and sisters were sent to the ECSD sessions while youth week mobilised young people for mass evangelism.

      In March, brothers left on mission to Côte d'Ivoire and were welcomed back in May before the crusade for the breaking of bonds. In April, the provincial youth camp gathered 303 participants from 18 localities: 178 conversions, 55 deliverances, 61 healings and 72 baptisms in the Holy Spirit.

      In November, the Ministry's 40-day crusade saw over a thousand hours of prayer and more than six thousand participants in Ngaoundéré and its localities. The year ended with the Ministry's Jubilee in Yaoundé and a 26-hour retreat. To God alone be the glory.`),
  },
  "semaine-jeunesse-2026": {
    type: "article", publie: true, epingle: false, date: "2026-02-15", auteur: "Ministère aux Jeunes et Étudiants", image: "/photos/jeunesse-feu.jpg",
    titre: "Semaine de la jeunesse 2026 : sept jours pour Christ", titre_en: "Youth week 2026: seven days for Christ",
    resume: "Du 8 au 14 février : culte de lancement, nuit de prière, conférences dans les lycées, évangélisation de masse, visite à la prison et journée sportive.",
    resume_en: "8–14 February: launch service, prayer night, school conferences, mass evangelism, prison visit and sports day.",
    contenu: P(`Dimanche 8 février, le culte de lancement a présenté les rapports des missions de la jeunesse : Maroua, Baladji, Haut-Plateau, Meiganga et Mbaka, et la retraite des jeunes du Faro-et-Déo à Tignère (56 disciples, 22 jeunes engagés à prêcher à 600 personnes par an).

      Lundi 9 février, la nuit de prière avait pour thème la responsabilité des jeunes dans l'accomplissement du but de la Méga Église de Ngaoundéré : 52 frères et sœurs de Baladji, Selbé-Darang, Haut-Plateau et Marza. « Et nous, nous continuerons à nous appliquer à la prière et au ministère de la parole » (Actes 6.4).

      Mardi et jeudi, le département School Conquest a porté l'Évangile dans les lycées et collèges ; le soir, « Autour du feu » a rassemblé les jeunes autour des témoignages et d'un échange sur la pureté.

      Mercredi 11 février, l'évangélisation de masse sur les lieux du défilé (Béka, stade Ndoumbé Omar, Lycée classique) : 100 âmes atteintes, 10 conversions et 1 100 traités distribués par 33 frères. Le soir, « Jeunesse, parlons-en » a abordé les réseaux sociaux, la pression scolaire et le partage de la foi.

      Jeudi, les jeunes ont visité la prison centrale de Ngaoundéré avec le département des œuvres de miséricorde. Samedi 14 février, la journée sportive a renforcé la communion fraternelle, et la soirée « Cœur à cœur » avec le Pasteur Baha Jacques a porté sur le choix du conjoint.`),
    contenu_en: P(`The week opened on Sunday 8 February with reports from the youth missions, including the Faro-et-Déo youth retreat in Tignère. Monday's prayer night focused on young people's role in the church's purpose.

      The School Conquest department preached in high schools and colleges, and “Around the fire” evenings gathered testimonies. Mass evangelism on 11 February reached 100 people, with 10 conversions and 1,100 tracts handed out by 33 brothers and sisters.

      The week also included a visit to Ngaoundéré central prison, a sports day for fellowship and a “Heart to heart” evening with Pastor Baha Jacques on choosing a spouse.`),
  },
  "ministere-enfants-2025": {
    type: "article", publie: true, epingle: false, date: "2026-01-10", auteur: "Ministère aux enfants", image: "/photos/enfants-haut-plateau.jpg",
    titre: "Ministère aux enfants : 1 517 enfants dans 10 centres", titre_en: "Children's ministry: 1,517 children in 10 centres",
    resume: "Journées de louange de 12 heures, retraites et camps : le bilan 2025 du ministère aux enfants de la Méga Église de Ngaoundéré.",
    resume_en: "12-hour praise days, retreats and camps: the 2025 report of the Ngaoundéré children's ministry.",
    contenu: P(`En 2025, le ministère aux enfants a travaillé dans les 10 centres de la ville : Haut-Plateau, Baladji, Wakwa, Marza, Setuba, Selbé-Darang, Nord Cifan, Béka, Gada et Youkou.

      Le 15 mars, une journée de louange de 12 heures a réuni près de 130 enfants et plus de 15 ministres ; le 12 juillet, une deuxième journée en a réuni près de 70. Le 23 septembre, plus de 80 enfants ont vécu une retraite. Plusieurs parents ont témoigné de l'impact de ces sièges et retraites sur leurs enfants.

      Chaque centre a organisé sa propre journée de louange et sa retraite, en reprenant les messages du camp des agneaux. Une délégation de 18 enfants a participé à l'UMPJ des moins de 14 ans à Koumé, puis 25 enfants au camp des agneaux de juillet. Au camp biblique d'avril à Ngaoundéré, plus de 40 % de l'auditoire avait entre 1 et 14 ans.

      Les ministres ont tenu quatre nuits de prière, suivi la session de l'ECSD pour parents et ministres, et terminé l'année par leur retraite de décembre.

      En chiffres : 47 ministres, 1 517 enfants, dont 457 réguliers, et 36 groupes de proximité. « À Dieu seul soit la gloire pour les merveilles accomplies dans le ministère aux enfants. »`),
    contenu_en: P(`In 2025 the children's ministry served all 10 city centres. Two 12-hour praise days gathered about 130 and 70 children, and a September retreat welcomed over 80. Each centre held its own praise day and retreat.

      Children also took part in the UMPJ in Koumé and the July lamb camp. The ministry counts 47 ministers, 1,517 children (457 regular) and 36 neighbourhood groups. To God alone be the glory.`),
  },
  "camp-provincial-2025": {
    type: "article", publie: true, epingle: false, date: "2025-04-30", auteur: "Église à Ngaoundéré", image: "/photos/2025-04-camp-biblique.jpg",
    titre: "Camp provincial des jeunes : 178 conversions", titre_en: "Provincial youth camp: 178 conversions",
    resume: "303 participants de 18 localités autour du Pasteur Séverin Lontsi.",
    resume_en: "303 participants from 18 localities with Pastor Séverin Lontsi.",
    contenu: P(`En avril 2025, Ngaoundéré a accueilli le camp provincial des jeunes de l'Adamaoua, avec pour orateur principal le Pasteur Séverin Lontsi.

      18 localités étaient représentées, pour 303 participants. Le Seigneur a donné 178 conversions, 55 délivrances, 61 guérisons et 72 baptêmes dans le Saint-Esprit.`),
    contenu_en: P(`In April 2025, Ngaoundéré hosted the Adamawa provincial youth camp with Pastor Séverin Lontsi as main speaker: 303 participants from 18 localities, 178 conversions, 55 deliverances, 61 healings and 72 baptisms in the Holy Spirit.`),
  },
  "fardeaux-camps": {
    type: "annonce", publie: true, epingle: false, date: "2026-04-15", auteur: "Ministère aux Jeunes et Étudiants", image: "/photos/jeunesse-evangelisation.jpg",
    titre: "Après le camp : nos fardeaux et engagements", titre_en: "After the camp: our burdens and commitments",
    resume: "Suivi des camps dans les localités, but quinquennal, missionnaires et évangélisation des écoles.",
    resume_en: "Camp follow-up in the localities, the five-year goal, missionaries and school evangelism.",
    contenu: P(`Par rapport aux camps : chaque jeune du camp de Ngaoundéré 2026 rentre réunir les jeunes de sa localité pour partager ce qui s'est passé. Lire le Nouveau Testament en 24 heures. Susciter des missionnaires à court terme, temporaires et à plein temps. Évangéliser les lycées, universités et grandes écoles, en prêchant à cinq personnes pour former une assemblée dans chaque établissement. Organiser une campagne d'évangélisation le jour de son anniversaire. Jeûner pour l'accomplissement du but de la province spirituelle de l'Adamaoua et déclencher le réveil dans les localités.

      Sujet de prière quotidien : « Seigneur, crée dans mon cœur la faim et la soif de toi et de ta parole. »

      Par rapport au but quinquennal : préparer son plan pour sa localité — personnes à atteindre et à gagner, églises de maison à implanter, personnes à baptiser — avec le message de Bertoua et un compte rendu.

      Imiter le leader fondateur : dans quel domaine, et comment ?`),
    contenu_en: P(`After the camp, each young person returns to share with the youth of their locality, reads the New Testament in 24 hours, raises missionaries, evangelises schools and fasts for the goal of the spiritual province of Adamawa. Daily prayer: “Lord, create in my heart a hunger and thirst for you and your word.” Each one also plans their part in the five-year goal for their locality.`),
  },
};

/** Écrit chaque document s'il n'existe pas, ou s'il n'a jamais été modifié dans la gestion. */
export async function importerContenu() {
  const db = fbDb();
  const t = nowIso();
  const groups: [string, Docs][] = [
    ["pasteurs", PASTEURS], ["centres", CENTRES], ["programme", PROGRAMME],
    ["departements", DEPARTEMENTS], ["localites", LOCALITES], ["articles", ARTICLES],
  ];
  let ecrits = 0, gardes = 0;
  const batch = writeBatch(db);
  for (const [col, docs] of groups) {
    for (const [id, data] of Object.entries(docs)) {
      const ref = doc(db, col, id);
      const snap = await getDoc(ref);
      if (snap.exists() && snap.data().maj) { gardes++; continue; }
      batch.set(ref, { ...(snap.exists() ? snap.data() : {}), ...data, exemple: false, cree: snap.exists() ? snap.data().cree ?? t : t });
      ecrits++;
    }
  }
  const cfg = await getDoc(doc(db, "config", "site"));
  if (!cfg.exists() || !cfg.data().adresse) batch.set(doc(db, "config", "site"), CONFIG, { merge: true });
  // Les activités d'exemple installées au départ sont remplacées par le programme réel.
  const ex = await getDocs(query(collection(db, "programme"), where("exemple", "==", true)));
  ex.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  return { ecrits, gardes, exemplesRetires: ex.size };
}

/** Ancien nom conservé pour la page de gestion. */
export const initialiserDonnees = importerContenu;
