# PressIvoire — landing page

Landing page de **PressIvoire**, service de gestion pour pressings ivoiriens.
Refactorée depuis un fichier HTML unique de ~1 940 lignes vers une architecture
**Vite + TypeScript + Tailwind CSS v4**.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # vérifie les types puis build dans dist/
npm run preview  # sert le build
npm run typecheck
```

## Structure

```
index.html              Coquille minimale : métadonnées, polices, #app
src/
  main.ts               Point d'entrée : assemblage de la page + bootstrap
  types.ts              Types partagés du contenu (Plan, IconCard, FaqItem…)
  data/
    site.ts             Métadonnées, navigation, coordonnées de contact
    hero.ts             Contenu du hero, aperçu téléphone, repères
    sections.ts         Douleurs, fonctionnalités, étapes, témoignage,
                        comparatif, support, CTA final
    marketing.ts        Tarifs, FAQ, pied de page, formulaire
  components/
    layout.ts           Barre d'annonce, header, marque, bouton flottant
    footer.ts           Pied de page
    modal.ts            Modale de demande d'essai
    cards.ts            Carte à icône, en-tête de section, étape
  sections/
    hero.ts             Sections hero + repères
    content.ts          Sections éditoriales
    sales.ts            Sections tarifs + FAQ
  lib/
    dom.ts              Micro-helpers de rendu
    modal.ts            Comportement de la modale et du formulaire
    reveal.ts           Animations d'apparition au défilement
    theme.ts            Bascule clair / sombre (état + persistance)
    parallax.ts         Parallaxe liée au scroll dans le hero
    progress.ts         Barre de progression de lecture
  styles/
    theme.css           Design tokens (@theme) + base + composants
```

## Principes

- **Contenu séparé de la structure.** Tout le texte vit dans `src/data/*.ts`.
  Modifier un prix, une question ou un tarif n'oblige pas à toucher au HTML.
- **Types.** Chaque bloc de contenu a son interface (`src/types.ts`), vérifiée
  par `tsc` : un prix manquant ou une clé de nav erronée devient une erreur
  de compilation, pas un bug d'affichage.
- **Design tokens centralisés.** Les variables CSS de l'ancien fichier sont
  devenues des tokens `@theme` Tailwind (`--color-green`, `--font-display`,
  `--shadow-card`…). Changer la couleur de marque tient en une ligne.
- **Comportement isolé.** `src/lib/` ne contient que du comportement DOM, sans
  HTML. Il est testable indépendamment du rendu.
- **Accessibilité.** `data-modal-state` pilote l'affichage, la modale piège le
  focus, gère Échap et rend la focus à l'élément déclencheur ; le tableau
  comparatif utilise `scope`/`caption` ; les visuels décoratifs sont masqués.

## Thème clair / sombre

- Le bouton 🌙/☀️ du header bascule le thème.
- L'état est porté par `data-theme` sur `<html>` ; un script inline dans
  `index.html` l'applique **avant le premier rendu**, donc pas de clignotement.
- Le choix est persisté dans `localStorage` (`pressivoire:theme`) ; à défaut,
  on suit la préférence système.
- Les couleurs sont des **tokens de rôle** (`canvas`, `card`, `fg`, `border`,
  `fg-muted`…) redéfinis dans le bloc `[data-theme="dark"]`. Les classes
  utilitaires s'y réfèrent, donc aucune classe n'est dupliquée par thème.
- La palette de marque (vert, citron, orange) reste identique dans les deux
  thèmes ; seul `--color-green-fg` s'éclaircit en sombre, le vert de marque
  n'ayant pas assez de contraste sur fond sombre.

Pour ajouter une couleur qui suit le thème, ajoutez un token dans `@theme`
puis sa valeur sombre dans le bloc `[data-theme="dark"]`.

## Parallaxe du hero

`src/lib/parallax.ts` utilise `scroll()` de **motion** pour deplacer les
calques du visuel (orbe, téléphone, pastille, carte flottante) à des vitesses
differentes lors du défilement.

- Lies au scroll via `requestAnimationFrame` — aucune boucle d'animation permanente.
- Amplitudes faibles (4 a 10 vh) : au-dela, les elements sortent du cadre.
- Desactivee si `prefers-reduced-motion` est active.
- Limite au hero, ou la profondeur apporte quelque chose. Applique a toute la
  page, ce type d'effet devient un handicap (mouvement parasite, cout CPU).

Pour ajuster : le tableau `LAYERS` en tete de fichier regit les distances,
les axes et les sens.

## Barre de progression de lecture

`src/lib/progress.ts` affiche une barre de 4 px qui se remplit selon la
position de lecture. Deux detailis deliberes :

- `pointer-events: none` — elle n'intercepte aucun clic.
- `transform: scaleX()` uniquement — pas de reflow, rendu sur le compositor.
- `requestAnimationFrame` avec un garde anti-rebond : un seul calcul par
  image, quelle que soit la vitesse de defilement.
- `passive: true` sur les ecouteurs de scroll : pas de blocage du fil principal.
- Desactivee sous `prefers-reduced-motion`, et si la page est trop courte
  pour que la progression ait un sens.

Reglable via les constantes `HEIGHT` et `BOTTOM` en tete de fichier.

## À faire avant mise en production

1. **Brancher le formulaire.** `initLeadForm()` dans `src/lib/modal.ts` reçoit
   les données mais n'envoie rien. Connectez votre backend, Formspree, ou une
   URL `mailto:`/WhatsApp (marqueur `TODO` dans `src/main.ts`).
2. **Compléter les coordonnées.** E-mail, WhatsApp, mentions légales et
   politique de confidentialité (cf. `src/data/site.ts` et `src/data/marketing.ts`).
3. **Valider les chiffres.** Le tableau comparatif, les tarifs et le contenu
   de la FAQ sont des textes de démonstration, pas des données vérifiées.
