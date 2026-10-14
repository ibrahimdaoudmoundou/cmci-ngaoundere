"use client";
import { doc, writeBatch, collection } from "firebase/firestore";
import { fbDb } from "./firebase";
import { nowIso } from "./format";

/**
 * Données de départ fournies par l'église. Les coordonnées des centres sont APPROXIMATIVES :
 * vérifiez-les sur place (Google Maps > appui long > copier les coordonnées) puis corrigez-les dans Gestion › Contenu.
 */
export async function initialiserDonnees() {
  const db = fbDb();
  const b = writeBatch(db);
  const t = nowIso();
  b.set(doc(db, "config", "site"), { tel: "", whatsapp: "", email: "", horaires: "", adresse: "Ngaoundéré, Adamaoua, Cameroun", momo: "", messageAccueil: "", maj: t }, { merge: true });
  b.set(doc(db, "pasteurs", "samuel-yadiaya"), {
    nom: "Samuel Yadiaya", titre: "Pasteur principal", centre: "Siège", ordre: 1, rdv: true, photo: "", tel: "",
    bio: "Pasteur principal de la Communauté Missionnaire Chrétienne Internationale à Ngaoundéré. Il conduit l'église et accompagne les centres de quartier.",
    cree: t,
  });
  const centres = [
    { id: "haut-plateau", nom: "Haut-Plateau", lat: 7.315, lng: 13.599 },
    { id: "baladji", nom: "Baladji", lat: 7.333, lng: 13.577 },
    { id: "gadamabanga", nom: "Gadamabanga", lat: 7.336, lng: 13.596 },
    { id: "wakwa", nom: "Wakwa", lat: 7.266, lng: 13.552 },
  ];
  for (const c of centres) {
    b.set(doc(db, "centres", c.id), { nom: c.nom, quartier: c.nom, lat: c.lat, lng: c.lng, approx: true, responsable: "", horaires: "", adresse: "", tel: "", photo: "", cree: t });
  }
  const prog = [
    { titre: "Culte d'adoration", jour: "Dimanche", heure: "08 h 30", lieu: "Siège et centres" },
    { titre: "Étude biblique", jour: "Mercredi", heure: "17 h 30", lieu: "Dans chaque centre" },
    { titre: "Réunion de prière", jour: "Vendredi", heure: "17 h 30", lieu: "Siège" },
  ];
  for (const p of prog) b.set(doc(collection(db, "programme")), { ...p, centre: "Église centrale", description: "", exemple: true, cree: t });

  const deps: [string, string, string, string][] = [
    ["hommes", "Département des hommes", "Men's department", "Rassemble les hommes de l'église pour la prière, l'étude de la Parole et le service."],
    ["femmes", "Département des femmes", "Women's department", "Rassemble les sœurs pour la prière, l'enseignement et l'entraide entre familles."],
    ["jeunesse", "Jeunesse", "Youth", "Accompagne les jeunes et les étudiants dans la foi, la consécration et l'évangélisation."],
    ["enfants", "École du dimanche (enfants)", "Sunday school (children)", "Enseigne la Parole de Dieu aux enfants pendant le culte."],
    ["louange", "Chorale et louange", "Choir and worship", "Conduit l'église dans la louange et l'adoration."],
    ["evangelisation", "Évangélisation et missions", "Evangelism and missions", "Organise l'évangélisation dans les quartiers et l'œuvre dans les localités et villages voisins."],
    ["intercession", "Intercession", "Intercession", "Porte l'église, la ville et les nations dans la prière."],
    ["accueil", "Accueil et protocole", "Welcome and hospitality", "Accueille les fidèles et les visiteurs et veille au bon déroulement des réunions."],
  ];
  deps.forEach(([id, nom, nom_en, description], i) =>
    b.set(doc(db, "departements", id), { nom, nom_en, description, description_en: "", responsable: "", adjoint: "", contact: "", ordre: i + 1, programmes: "", photo: "", cree: t }));

  b.set(doc(db, "articles", "bienvenue"), {
    type: "article", publie: true, epingle: false, date: t.slice(0, 10), auteur: "Secrétariat",
    titre: "Bienvenue sur le nouveau site de l'église", titre_en: "Welcome to the church's new website",
    resume: "Programme, rendez-vous avec les pasteurs, librairie, départements et œuvre missionnaire : l'église de Ngaoundéré est désormais en ligne.",
    resume_en: "Schedule, appointments with the pastors, bookshop, departments and outreach: the Ngaoundéré church is now online.",
    contenu: "Ce site vous permet de suivre la vie de l'église centrale et des centres de quartier, de découvrir nos départements et l'œuvre que nous menons dans les localités et villages voisins.\n\nCréez votre compte pour demander un rendez-vous avec un pasteur, réserver un livre ou vous inscrire comme membre. Vous suivrez ensuite la réponse de l'église dans votre espace.",
    contenu_en: "This website lets you follow the life of the central church and the neighbourhood centres, and discover our departments and the outreach we carry out in neighbouring localities and villages.\n\nCreate your account to request an appointment with a pastor, reserve a book or register as a member. You will then follow the church's reply in your personal space.",
    image: "", cree: t,
  });
  await b.commit();
}
