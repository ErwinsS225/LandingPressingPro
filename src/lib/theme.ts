/**
 * Bascule clair / sombre.
 *
 * L'état est porté par `data-theme` sur <html>, que les tokens sémantiques
 * de `src/styles/theme.css` traduisent en couleurs concrètes. Le thème
 * choisi est persisté dans localStorage et, à défaut, on suit la
 * préférence système.
 */

import { track } from "./analytics";

export type Theme = "light" | "dark";

const STORAGE_KEY = "pressivoire:theme";

const isTheme = (value: string | null): value is Theme =>
  value === "light" || value === "dark";

/** Thème préféré par le visiteur, ou celui du système. */
function preferredTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (isTheme(stored)) return stored;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Applique un thème au document et memorise le choix. */
export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(STORAGE_KEY, theme);
}

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

/**
 * Branche le bouton de bascule.
 * Le thème est appliqué avant le premier rendu (cf. `initTheme`) afin
 * d'éviter un clignotement clair avant sombre.
 */
export function initThemeToggle(): void {
  const toggle = document.querySelector<HTMLButtonElement>(
    "[data-theme-toggle]",
  );
  if (!toggle) return;

  const paint = (): void => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    toggle.setAttribute(
      "aria-label",
      next === "dark" ? "Passer en thème clair" : "Passer en thème sombre",
    );
    toggle.setAttribute("aria-pressed", String(next === "dark"));
  };

  toggle.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    paint();
    track("theme_toggle", { theme: next });
  });

  paint();
}

/**
 * À appeler le plus tôt possible — dans le <head> via une balise script
 * inline, ou au tout début de main.ts. Restitue le thème pour éviter
 * le flash de la version claire.
 */
export function initTheme(): Theme {
  const theme = preferredTheme();
  applyTheme(theme);
  return theme;
}
