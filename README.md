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
    analytics.ts        Événements de conversion + attribution UTM
    leads.ts            Envoi des demandes d'essai (Formspree)
    reveal.ts           Animations d'apparition au défilement
    theme.ts            Bascule clair / sombre (état + persistance)
    parallax.ts         Parallaxe liée au scroll dans le hero
  styles/
    theme.css           Design tokens (@theme) + base + composants
public/
    favicon.svg         Icône du site
    og-image.svg/.png   Image de partage réseaux sociaux (1200×630)
    robots.txt          Autorise l'indexation, déclare le sitemap
    sitemap.xml         Liste des URL à indexer
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

## Mesure de la conversion

`src/lib/analytics.ts` suit ce qui compte pour une page de vente : les
visiteurs qui convertissent, et d'où ils viennent.

**Événements** : `page_view`, `modal_open` / `modal_close`, `plan_click`
(avec le nom du tarif), `form_submit` / `form_error` (avec le plan demandé),
`contact_click`, `faq_open`, `theme_toggle`.

**Attribution.** Les paramètres `utm_*`, `gclid` et `fbclid` sont lus dans
l'URL au premier chargement puis conservés 30 jours (`localStorage`). Un
visiteur qui clique sur un lien de campagne, navigue trois jours puis
demande un essai est donc rattaché à sa source d'origine. L'attribution est
ajoutée à chaque événement **et** au corps du mail envoyé par Formspree :
sans cela, impossible de savoir si les leads viennent de WhatsApp, d'un
partenaire ou de Google.

**Deux parti pris délibérés :**

- **Module maison plutôt qu'un SDK.** Un SDK Plausible/Umami ferait le même
  travail pour plusieurs dizaines de kilo-octets. Ici, tout coûte ~1 kB gzip.
- **Sans endpoint configuré, tout est inerte** — aucun envoi, aucune
  requête, aucun risque. On peut merger avant d'avoir choisi son outil.

### Activer la mesure

```bash
cp .env.example .env    # puis renseigner VITE_ANALYTICS_ENDPOINT
```

| Variable | Rôle |
|---|---|
| `VITE_ANALYTICS_ENDPOINT` | Point de collecte. Plausible : `https://plausible.io/api/event`. |
| `VITE_ANALYTICS_DOMAIN` | **Le domaine de production**, enregistré sur le compte. Ex. `pressivoire.ci`. |

> Les deux variables sont **nécessaires**. Un événement sans `domain` est
> rejeté : Plausible refuse tout ce qui ne correspond pas à un site connu
> de son compte. Sans les deux, la mesure reste inactive.

**Attention à l'ordre des opérations :** le domaine doit être celui où le
site est réellement déployé. Tant que vous n'avez pas votre URL Vercel,
laissez ces variables vides — la mesure ne fonctionne pas, mais le reste
du site est intact.

Sur Vercel, ces variables se définissent dans **Settings → Environment
Variables** — un `.env` local n'est pas déployé.

`navigator.doNotTrack` est respecté : un visiteur ayant activé le DNT
n'est jamais mesuré, sans bandeau.

### Ajouter un point de mesure

Le markup porte l'intention, `lib/` porte le comportement — le même
principe que `data-open`. Un attribut suffit :

```html
<button data-track="plan_click" data-track-plan="PRO">Essayer PRO</button>
```

`data-track-plan` devient la propriété `plan` de l'événement. Ajouter un
attribut ne demande aucune modification du module.

## Demandes d'essai (Supabase)

Les demandes du formulaire sont **insérées en base** : consultables,
exportables en CSV, jamais perdues. C'est l'avantage sur un simple envoi de
mail — un prospect qui écrit puis disparaît reste dans la table même si
personne n'a lu la boîte au bon moment.

Deux canaux, dans cet ordre : Supabase (principal), puis Formspree
(secours, si les variables manquent ou si la base refuse l'écriture).

### Mise en place

1. **Un seul projet Supabase**, à [supabase.com](https://supabase.com) —
   gratuit sur le palier Starter. Il servira aussi, plus tard, à
   l'application (authentification, commandes, clients) : les mêmes quotas,
   les mêmes sauvegardes, et surtout la possibilité de relier un lead à son
   futur compte. **Un projet unique, pas un par besoin.**
2. **Créer la table** : Dashboard → SQL Editor, coller le contenu de
   `supabase/schema.sql`, puis *Run*. Le script est idempotent.
3. **Récupérer les clés** : Project Settings → Data API. Copier l'URL et la
   clé `anon` dans `.env` :

   ```bash
   cp .env.example .env
   # VITE_SUPABASE_URL=https://xxxx.supabase.co
   # VITE_SUPABASE_ANON_KEY=eyJhbGci…
   ```

   La clé `anon` est publique par conception : c'est le rôle `anon`, et les
   politiques RLS de `schema.sql` qui protègent la table. **Ne mettez jamais
   la clé `service_role` dans le front** : elle contourne ces politiques.
4. **Tester** : soumettre le formulaire, puis Dashboard → Table Editor →
   `leads`. La ligne doit apparaître.

### Recevoir les leads par e-mail

La table seule ne vous prévient de rien. Pour un e-mail à chaque nouvelle
demande, Supabase fournit les *Database Webhooks* :

1. Créer une clé et un domaine d'envoi sur [resend.com](https://resend.com)
   (300 e-mails/mois gratuits).
2. Déployer la fonction :

   ```bash
   supabase functions deploy notify-lead --no-verify-jwt
   ```

3. Ajouter les secrets (Dashboard → Edge Functions → Secrets) :
   `RESEND_API_KEY`, `NOTIFY_EMAIL`, `RESEND_FROM`.
4. Créer le webhook (Dashboard → Database → Webhooks) :
   table `leads`, opération **INSERT**, type **Supabase Database
   Webhook**, URL `https://<projet>.functions.supabase.co/notify-lead`.

Le code de la fonction est dans `supabase/functions/notify-lead/`. Si le
mail échoue, **la ligne reste en base** : rien n'est perdu.

> Conservez le webhook même en cas de doute : c'est le filet de sécurité.

### Sécurité

`schema.sql` n'ouvre que l'insertion au rôle `anon`. Aucune politique
`SELECT` n'est créée : RLS refuse donc par défaut toute lecture depuis le
navigateur. Sans ce script, la table serait lisible par quiconque possède
l'URL du projet — c'est-à-dire tout le monde.

Restreint au spam par les contraintes `CHECK` (longueurs maximales). Si le
formulaire devient une cible, ajoutez un champ leurre (*honeypot*) ou
Cloudflare Turnstile.

### Pourquoi pas le SDK officiel

`@supabase/supabase-js` pèse **55 ko gzip** pour un appel qui tient en
cinq lignes : la landing passait de 16 à 72 ko gzip. `src/lib/supabase.ts`
utilise donc l'API REST directement — même effet, 0,04 ko. C'est cohérent
avec le choix d'aucun SDK pour l'analytics.


- `index.html` porte `canonical`, les balises Open Graph / Twitter et deux
  blocs JSON-LD (`SoftwareApplication`, `FAQPage`).
- `public/og-image.png` (1200×630) est l'image affichée quand un lien est
  partagé sur WhatsApp ou Facebook.

**Point important :** la page est rendue côté client (`innerHTML` dans
`src/main.ts`). WhatsApp, Facebook et LinkedIn **n'exécutent pas de
JavaScript** : ils ne lisent que le `<head>`, où se trouvent les balises OG.
C'est pourquoi un lien partagé s'affiche correctement malgré le rendu
client. Google, lui, doit exécuter le JS pour indexer les titres, les
tarifs et la FAQ : le pré-rendu améliorerait le SEO local.

Quand vous ajoutez une page, pensez à la déclarer dans `public/sitemap.xml`.

## Déploiement

Le build est un site statique (`dist/`) : Vercel, Netlify ou Cloudflare
Pages le servent sans configuration particulière.

| | Valeur |
|---|---|
| Build command | `npm run build` |
| Output directory | `dist` |
| Framework preset | Vite (détecté automatiquement) |

Sur Vercel, le domaine apex (par exemple `pressivoire.ci`) s'ajoute dans
**Settings → Domains** ; Vercel affiche les enregistrements DNS à créer
chez le registrar. Les domaines `.ci` sont gérés par NIC.CI.

## À faire avant mise en production

1. **Compléter les coordonnées.** E-mail, WhatsApp, mentions légales et
   politique de confidentialité (cf. `src/data/site.ts` et
   `src/data/marketing.ts`). Les liens « Mentions légales »,
   « Confidentialité » et « Conditions » du pied de page pointent encore
   vers `#contact`.
2. **Valider les chiffres.** Le tableau comparatif, les tarifs et le
   contenu de la FAQ sont des textes de démonstration, pas des données
   vérifiées.
3. **Répondre précisément en FAQ.** Quatre réponses renvoient encore vers
   « contactez l'équipe » — à un moment précis où le visiteur hésite.
4. **Remplacer `https://pressivoire.ci`** dans `index.html` et
   `public/sitemap.xml` si le domaine définitif diffère.
5. **Activer la mesure** (voir plus haut) avant de lancer une campagne :
   sans elle, aucun canal n'est attribuable.

