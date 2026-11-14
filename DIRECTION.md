# Direction artistique — CMCI Ngaoundéré

**Style retenu par le client (14/11/2026)** : le style d'origine aux couleurs du logo CMCI — bandeaux bleu roi, bleu ciel du globe et de la colombe, fond bleuté très clair. Le style « Bulletin d'église » (encre noire, filets noirs) a été essayé puis abandonné à la demande du client : **aucune couleur noire** dans l'interface (l'encre et les fonds sombres sont des bleus marine).

## Couleurs (`src/app/globals.css`, triplets RGB)
- Bandeau : `--band 5 45 92` (bleu marine), panneau sur bandeau `--band-2 12 62 118`.
- Accent : `--green 0 96 164` (bleu du logo), `--sun 92 203 245` (bleu ciel), `--gold 0 120 190`.
- Fond `244 248 252`, texte `12 30 52` (marine, pas noir). Le voile des fenêtres est un marine translucide, pas du noir.

## Typographie (auto-hébergée via `next/font`)
Marcellus pour les titres, Public Sans pour le texte ; chiffres en `tabular-nums`. IBM Plex Mono retiré.

## Corrections anti-slop appliquées
- Plus d'effet verre (`backdrop-blur`) : barre de navigation et encadré du programme en aplats pleins.
- Plus d'étiquettes en petites capitales espacées : intertitres en phrase normale, bleu.
- Plus de halo lumineux ni de rayons décoratifs dans l'en-tête de l'accueil : une vraie photo de l'église (évangélisation, octobre 2025) à la place.
- Plus de dégradés : voile uni sur la photo de « Notre église », aplat bleu pour les vignettes d'articles sans image.
- `slop_lint.py src` : 0 FAIL, 0 WARN.
