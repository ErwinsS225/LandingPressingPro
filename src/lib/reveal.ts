/**
 * Animations d'apparition au défilement.
 * Désactivé si l'utilisateur préfère moins de animations.
 */

const SELECTOR = [
  ".section-head",
  ".icon-card",
  ".step",
  ".testimonial-box",
  ".compare-wrap",
  ".price-card",
  ".support-grid",
  ".final-cta .wrap",
].join(",");

/** Nombre d'éléments décalés dans le même lot d'apparition. */
const BATCH_SIZE = 4;
/** Durée du décalage entre deux éléments d'un même lot, en ms. */
const STAGGER_MS = 85;

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

export function initReveal(): void {
  if (prefersReducedMotion.matches || !("IntersectionObserver" in window))
    return;

  const targets = document.querySelectorAll<HTMLElement>(SELECTOR);

  if (targets.length === 0) return;

  document.documentElement.classList.add("reveal-ready");

  targets.forEach((item, index) => {
    item.classList.add("reveal");
    item.style.setProperty("--delay", `${(index % BATCH_SIZE) * STAGGER_MS}ms`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -35px 0px" },
  );

  targets.forEach((item) => observer.observe(item));
}
