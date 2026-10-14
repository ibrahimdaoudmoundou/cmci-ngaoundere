# CMCI Ngaoundéré — site et plateforme de gestion

Site de la **Communauté Missionnaire Chrétienne Internationale** à Ngaoundéré (pasteur principal : **Samuel Yadiaya**).

Site **bilingue français / anglais** (bouton FR | EN en haut de chaque page).

| Partie publique | Espace fidèle (compte) | Gestion (administrateurs) |
|---|---|---|
| Accueil, **Notre église** (vision, mission, lien avec la CMCI mondiale), **Vie de l'église** (programme hebdomadaire de l'église centrale et des centres, événements), **Départements** (responsables et programmes), **Actualités** (articles et annonces), **Œuvre missionnaire** (localités et villages voisins sur carte), centres, pasteurs, librairie, rendez-vous | Création de compte (e-mail ou Google), rendez-vous avec un pasteur ou un responsable, réservation de livres, inscription comme membre, suivi des réponses | Tableau de bord, demandes, **articles et annonces**, membres, biens, caisse, **départements**, **œuvre missionnaire**, **vision** et coordonnées, administrateurs, exports Excel (CSV) |

L'espace de gestion est en français. Pour chaque contenu, un champ « en anglais » facultatif permet d'afficher une traduction ; s'il est vide, le texte français s'affiche.

**Technologies :** Next.js 16 (App Router, TypeScript), React 19, Tailwind CSS, Firebase (Authentication, Cloud Firestore, Storage optionnel), Leaflet + OpenStreetMap pour la carte. Hébergement : GitHub + Vercel (gratuit).

---

## 1. Créer le projet Firebase (gratuit, forfait Spark)

1. Allez sur <https://console.firebase.google.com> → **Ajouter un projet** (ex. `cmci-ngaoundere`). Google Analytics n'est pas nécessaire.
2. **Authentication** → *Commencer* → onglet *Méthode de connexion* : activez **Adresse e-mail/Mot de passe** et **Google**.
3. **Firestore Database** → *Créer une base de données* → mode **production** → emplacement `europe-west1` (le plus proche du Cameroun).
4. **Règles Firestore** : onglet *Règles*, remplacez tout par le contenu du fichier `firestore.rules` de ce projet, puis **Publier**.
5. **Paramètres du projet** (roue dentée) → *Vos applications* → icône **Web `</>`** → nommez l'application → copiez les valeurs de `firebaseConfig`.

> **Photos (facultatif).** Firebase Storage demande désormais le forfait *Blaze* (paiement à l'usage, avec une part gratuite). Sans lui, tout fonctionne : les photos des pasteurs et couvertures de livres se renseignent par **lien d'image**. Si vous activez Storage, publiez `storage.rules` dans l'onglet *Rules* de Storage et mettez `NEXT_PUBLIC_STORAGE_ENABLED=true`.

## 2. Tester sur votre ordinateur

Prérequis : [Node.js 20.9 ou plus](https://nodejs.org).

```bash
npm install
cp .env.example .env.local      # sous Windows : copy .env.example .env.local
# ouvrez .env.local et collez les valeurs de firebaseConfig
npm run dev
```

Ouvrez <http://localhost:3000>.

## 3. Mettre le code sur GitHub

```bash
git init
git add .
git commit -m "Site CMCI Ngaoundéré"
git branch -M main
git remote add origin https://github.com/VOTRE-COMPTE/cmci-ngaoundere.git
git push -u origin main
```

Le fichier `.env.local` n'est **jamais** envoyé sur GitHub (il est dans `.gitignore`).

## 4. Déployer sur Vercel

1. <https://vercel.com> → connectez-vous avec GitHub → **Add New… › Project** → importez `cmci-ngaoundere`.
2. Le framework **Next.js** est détecté automatiquement.
3. Dans **Environment Variables**, ajoutez les 7 variables de `.env.example` avec vos valeurs.
4. **Deploy**. Votre site est en ligne sur `https://cmci-ngaoundere.vercel.app` (ou similaire).
5. **Important :** dans Firebase → Authentication → *Paramètres* → **Domaines autorisés**, ajoutez votre domaine Vercel (et plus tard votre nom de domaine), sinon la connexion Google sera refusée.

Chaque `git push` sur `main` redéploie automatiquement le site.

## 4 bis. Utiliser votre sous-domaine

Dans Vercel : *Project › Settings › Domains › Add*, saisissez par ex. `cmci.votredomaine.com`. Vercel affiche un enregistrement **CNAME** à ajouter dans la zone DNS de votre gestionnaire de domaine. Ajoutez aussi ce sous-domaine dans Firebase › Authentication › Domaines autorisés.

## 5. Devenir le premier administrateur

1. Sur le site en ligne, créez votre compte (**Se connecter › Nouveau compte**).
2. Dans **Mon espace**, copiez l'**identifiant du compte** affiché en bas de page.
3. Console Firebase → **Firestore Database** → *Démarrer une collection* :
   - ID de la collection : `roles`
   - ID du document : *collez votre identifiant*
   - Champ : `role` (type *string*) = `admin`
4. Rechargez le site : l'onglet **Gestion** apparaît.
5. Dans **Gestion › Site et vision**, cliquez sur **Installer les données de départ** (pasteur Samuel Yadiaya, centres Haut-Plateau, Baladji, Gadamabanga, Wakwa, départements habituels, programme d'exemple, article de bienvenue), puis relisez la vision proposée et renseignez les coordonnées de l'église.

Les administrateurs suivants s'ajoutent directement depuis **Gestion › Contenu du site › Administrateurs**.

> Les positions des centres installées au départ sont **approximatives**. Sur place, ouvrez Google Maps, faites un appui long sur le lieu exact, copiez les coordonnées et corrigez-les dans *Gestion › Contenu du site › Centres rattachés*, en choisissant « Position vérifiée ».

## 6. Utilisation au quotidien

- **Articles et annonces** : une annonce épinglée apparaît en haut de l'accueil ; avec une date de retrait, elle disparaît seule après l'événement. Un brouillon n'est pas visible du public.
- **Programme** : chaque activité est rattachée à l'église centrale ou à un centre, avec un jour de la semaine (activité régulière) ou une date précise (événement).
- **Départements** : responsable, adjoint et programme (une activité par ligne : `Samedi | 15 h | Répétition | Église centrale`).
- **Œuvre missionnaire** : chaque localité ou village avec sa distance, sa fréquence de visite, son responsable et sa position (Google Maps › appui long › copier les coordonnées).

- **Demandes** : chaque rendez-vous, inscription ou réservation arrive en « En attente ». Écrivez une réponse (ex. « confirmé à 10 h au siège ») puis *Confirmer* ; le fidèle la voit dans son espace.
- **Inscription acceptée** → la fiche membre est créée automatiquement.
- **Livre « Livré et payé »** → le stock baisse et la vente est inscrite en caisse automatiquement.
- **Finances** : enregistrez dîmes, offrandes, dons et dépenses ; le tableau donne le résultat du mois et le solde cumulé, par centre si besoin.
- **Exports** : membres, biens et opérations du mois s'ouvrent dans Excel (bouton *Exporter*).
- **Demande reçue par téléphone** : connecté à votre compte, remplissez le formulaire public au nom de la personne.

## Sécurité

Les règles (`firestore.rules`) garantissent que :
- le public lit seulement le contenu du site (pasteurs, centres, livres, programme, coordonnées) ;
- un fidèle ne voit et ne crée que **ses propres** demandes, et peut seulement annuler celles en attente ;
- membres, biens et finances ne sont lisibles et modifiables **que par les administrateurs**.

## Structure du projet

```
src/app/              pages (accueil, pasteurs, centres, programme, librairie, rendez-vous, connexion, mon-espace)
src/app/admin/        gestion (tableau de bord, demandes, membres, biens, finances, contenu)
src/components/       en-tête, carte Leaflet, formulaires, éditeur générique
src/lib/              Firebase, authentification, types, formats (FCFA, dates), données de départ
firestore.rules       règles de sécurité de la base
storage.rules         règles des images (si Storage activé)
```

Commandes utiles : `npm run dev` (développement), `npm run build` (vérifier avant de publier), `npm run deploy:rules` (publier les règles avec l'outil `firebase-tools`, facultatif).
