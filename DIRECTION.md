# Direction artistique — CMCI Ngaoundéré

**Direction** : `magazine-societe`, adaptée en **« Bulletin d'église »** (enregistrée dans `~/.ibtech-da/history.json`, 14/11/2026).

**Phrase-concept** : dans cette app, *le compte rendu « La main du Seigneur dans l'Église à Ngaoundéré » et le programme de la semaine* deviennent *la une d'un bulletin paroissial* : titre à empattements, culte en manchette, chiffres réels en exergue, rubriques séparées par des filets, sommaire numéroté.

Pourquoi : l'église produit déjà des comptes rendus, des programmes hebdomadaires et des affiches ; le site publie surtout des articles, des annonces, une rétrospective et des listes (centres, départements, localités). Le bulletin est le format naturel de ce contenu.

## Axes tirés
- Rayon : net, 0–2 px (le thème Tailwind ramène tous les `rounded-*` à 2 px ; `rounded-full` réservé aux points et repères de carte).
- Densité : dense (listes à filets, pas de cartes à fond).
- Navigation vitrine : titre + 3 rubriques (Vie de l'église, Actualités, Centres) + 1 action (Prendre rendez-vous) + bouton « Sommaire » qui ouvre le sommaire numéroté 01–10.
- Navigation gestion : rail d'icônes (lucide-react 1.64.0, une seule famille) + panneau ; barre horizontale défilante sur mobile.
- Boutons : contour épais 2 px (`.btn-ghost`), un seul bouton plein par vue (`.btn`, bleu CMCI).
- Rythme des sections : espace seul, aucune bande colorée ; chaque rubrique s'ouvre sur un filet de 3 px (`.rubrique`).

## Couleurs (OKLCH, `src/app/globals.css`)
| Token | Clair | Sombre | Contraste mesuré |
|---|---|---|---|
| bg (papier) | 0.985 0.003 250 | 0.19 0.008 260 | — |
| ink (encre) | 0.2 0.01 260 | 0.92 0.005 260 | 17.3:1 / 14.6:1 |
| muted | 0.46 0.01 260 | 0.7 0.01 260 | 6.8:1 / 6.9:1 |
| accent (bleu du logo #0060A4) | 0.47 0.14 250 | 0.74 0.11 245 | 6.5:1 / 8.1:1 |
| on-accent | 0.99 0 0 | 0.19 0.008 260 | 6.6:1 / 8.1:1 |
| field (bord des champs) | 0.62 0.01 260 | 0.55 0.01 260 | 3.6:1 / 3.4:1 |
| rule / line | 0.86 0.006 255 | 0.32 0.01 260 | décoratif |
| ok / warn / bad sur fond doux | — | — | 6.2 / 5.5 / 5.7:1 (clair), 8.0 / 7.7 / 7.3:1 (sombre) |

Les anciens noms (`green`, `gold`, `sun`, `band`…) restent dans `tailwind.config.ts` mais pointent tous vers ces tokens.

## Typographie (auto-hébergée via `next/font`)
- Titres : **Gloock** 400 — grands titres serrés, chiffres en exergue.
- Texte et interface : **Hanken Grotesk**.
- Lecture longue (vision, articles, œuvre missionnaire) : **Literata** (`.prose-read`, `font-read`).
- Chiffres : `tabular-nums` partout où un horaire, un montant ou un compte change.

## Signature et mouvement
- Signature : **la une** — date « Semaine du … », grand titre, photo légendée, colonne « Cette semaine à l'église centrale » séparée par un filet de colonne, chiffres 2025 en exergue.
- Entrée : morceaux de la une échelonnés (`.une-in`, 320 ms, translateY 12 px + flou 4 px, décalages 80 ms).
- Micro-interactions : boutons `scale(0.97)` à la pression ; liens de rubrique soulignés au survol (`.lien`) ; sommaire 180 ms.
- `prefers-reduced-motion` : toutes animations et transitions coupées.

## Ce qui est banni ici
Bandes pleines de couleur, dégradés, verre/flou, étiquettes en capitales espacées, pastilles arrondies, ombres décoratives, polices Marcellus / Public Sans / IBM Plex (ancien thème).

## Vérifications
- `slop_lint.py src` : 0 FAIL, 0 WARN.
- Captures 1440 / 768 / 390 px : aucun débordement horizontal à 390 px.

## À fournir par l'église
Photos récentes du culte et des centres (format paysage), portrait du pasteur, chiffres 2026 quand ils seront connus.
