/**
 * Parallaxe liée au défilement, pour la section hero.
 *
 * Volontairement limité au visuel de droite : c'est le seul endroit où la
 * profondeur apporte quelque chose. Appliqué à toute la page, ce type
 * d'effet devient un handicap (mouvement parasite, coût CPU sur mobile).
 *
 * S'appuie sur `scroll()` de `motion` : l'animation est liée au scroll via
 * requestAnimationFrame, sans boucle d'animation permanente.
 */
import { scroll } from "motion";

interface ParallaxLayer {
  readonly el: HTMLElement;
  /** Distance parcourue en vh sur toute la durée de la section. */
  readonly distance: number;
  readonly axis: "x" | "y";
  /** Positive = vers la droite/bas, négative = vers la gauche/haut. */
  readonly direction: 1 | -1;
}

/**
 * Calques du hero, du plus lent au plus rapide (effet de profondeur).
 * Les distances restent faibles : au-delà, les éléments sortent du cadre et
 * la mise en page se disloque au lieu de donner de la profondeur.
 */
const LAYERS: ParallaxLayer[] = [
  {
    el: null as unknown as HTMLElement,
    distance: 4,
    axis: "y",
    direction: -1,
  }, // orbe
  { el: null as unknown as HTMLElement, distance: 10, axis: "y", direction: 1 }, // carte flottante
  {
    el: null as unknown as HTMLElement,
    distance: 6,
    axis: "x",
    direction: -1,
  }, // telephone
  { el: null as unknown as HTMLElement, distance: 9, axis: "x", direction: 1 }, // pastille
];

const SELECTORS: Record<number, string> = {
  0: ".visual-orb",
  1: ".float-card",
  2: ".phone",
  3: ".visual-note",
};

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

/**
 * Déplace `el` de `distance` vh sur toute la traversée de la section.
 *
 * `progress` va de 0 à 1 sur la durée de la section. Pour obtenir un
 * décalage de `distance` vh independamment de la taille de la section, on
 * utilise directement `progress * distance` en vh — pas de conversion en
 * pourcentage, qui introduirait un facteur `1 / hauteurSection` enorme.
 */
function linkToScroll(section: HTMLElement, layer: ParallaxLayer): void {
  scroll(
    (progress: number) => {
      const offset = progress * layer.distance * layer.direction;
      layer.el.style.translate =
        layer.axis === "x" ? `${offset}vw` : `0 ${offset}vh`;
    },
    { target: section, offset: ["start start", "end start"] },
  );
}

export function initParallax(): void {
  if (prefersReducedMotion.matches) return;

  const section = document.querySelector<HTMLElement>("#accueil");
  if (!section) return;

  LAYERS.forEach((layer, index) => {
    const el = section.querySelector<HTMLElement>(SELECTORS[index]);
    if (!el) return;
    linkToScroll(section, { ...layer, el });
  });
}
