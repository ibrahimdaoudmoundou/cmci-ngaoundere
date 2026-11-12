import type { Vision } from "./types";

/** Textes par défaut, affichés tant que l'administration ne les a pas personnalisés (Gestion › Vision). */
export const VISION_DEFAUT: Required<Omit<Vision, "siteMondial">> = {
  vision:
    "Faire de toutes les nations des disciples de Jésus-Christ. À Ngaoundéré, nous voulons conduire chaque habitant de la ville, de l'Adamaoua et des villages voisins à la connaissance du Seigneur, l'affermir dans la Parole et la prière, puis l'envoyer à son tour annoncer l'Évangile.",
  vision_en:
    "To make disciples of Jesus Christ in all nations. In Ngaoundéré, we seek to lead every person in the city, the Adamawa region and the surrounding villages to know the Lord, to establish them in the Word and in prayer, and to send them out in turn to proclaim the Gospel.",
  mission:
    "Évangéliser, faire des disciples, implanter des centres dans les quartiers et des communautés dans les villages, former des ouvriers consacrés et servir les plus pauvres par l'amour de Christ.",
  mission_en:
    "To evangelise, make disciples, plant centres in the neighbourhoods and fellowships in the villages, train consecrated workers and serve the poor with the love of Christ.",
  valeurs:
    "Prière et jeûne\nConsécration totale à Jésus-Christ\nÉtude et obéissance à la Parole de Dieu\nÉvangélisation et missions\nSainteté de vie\nAmour fraternel et service",
  valeurs_en:
    "Prayer and fasting\nTotal consecration to Jesus Christ\nStudy of and obedience to God's Word\nEvangelism and missions\nHoly living\nBrotherly love and service",
  histoireLocale:
    "L'Église à Ngaoundéré est une église locale de la Communauté Missionnaire Chrétienne Internationale, dans la province spirituelle de l'Adamaoua. Sous la conduite du Pasteur Samuel Yadiaya, elle rassemble les fidèles dans dix centres de la ville — Haut-Plateau, Baladji, Wakwa, Marza, Setuba, Selbé-Darang, Nord Cifan, Béka, Gada et Youkou — et porte l'Évangile dans les localités voisines, dans la vision d'une Méga Église à Ngaoundéré.",
  histoireLocale_en:
    "The Ngaoundéré church is a local church of the Christian Missionary Fellowship International, in the spiritual province of Adamawa. Led by Pastor Samuel Yadiaya, it gathers believers in ten city centres — Haut-Plateau, Baladji, Wakwa, Marza, Setuba, Selbé-Darang, Nord Cifan, Béka, Gada and Youkou — and carries the Gospel to the surrounding localities, with the vision of a Mega Church in Ngaoundéré.",
};

/** Présentation de la CMCI mondiale (fondation : 12 mai 1975, Yaoundé, Pr Zacharias Tanee Fomum). */
export const CMCI_MONDIALE = {
  fr: "La CMCI (en anglais CMFI, Christian Missionary Fellowship International) est née le 12 mai 1975 à Yaoundé, au Cameroun, sous le ministère du Professeur Zacharias Tanee Fomum (1945–2009). D'un petit groupe de prière, elle est devenue une communauté missionnaire présente dans de nombreuses nations, sur tous les continents, avec un même appel : la prière, la consécration, l'évangélisation et la formation de disciples.",
  en: "CMFI (Christian Missionary Fellowship International, known in French as CMCI) was born on 12 May 1975 in Yaoundé, Cameroon, through the ministry of Professor Zacharias Tanee Fomum (1945–2009). From a small prayer group it has grown into a missionary fellowship present in many nations on every continent, with one calling: prayer, consecration, evangelism and disciple-making.",
};
