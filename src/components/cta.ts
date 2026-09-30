/**
 * Bouton d'essai : ouvre l'inscription si l'application est déployée,
 * sinon la modale de demande.
 *
 * Un seul point de décision plutôt qu'une condition répétée dans le hero,
 * le CTA final, l'en-tête et les cartes de tarifs : le comportement ne
 * peut pas diverger d'un bouton à l'autre, et le passage en production se
 * résume à renseigner `VITE_APP_URL` — sans toucher au markup.
 */
import { html } from "../lib/dom";
import { appDeployed, appLink } from "../data/site";

interface TrialCtaOptions {
  /** Emplacement du bouton, transmis à la mesure. */
  source: string;
  /** Classes additionnelles (largeur, variante de couleur). */
  variant?: string;
  /** Ajoute la flèche `↗`. */
  arrow?: boolean;
  /** Nom du plan, joint au lead pour savoir quel tarif a converti. */
  plan?: string;
}

export function TrialCta(
  label: string,
  { source, variant = "", arrow = false, plan }: TrialCtaOptions,
): string {
  const suffix = arrow ? " <span>↗</span>" : "";
  const cls = `btn ${variant}`.trim();

  // Application déployée : on envoie vers l'inscription, le formulaire
  // ne servant plus qu'à ceux qui veulent être rappelés.
  if (appDeployed) {
    return html`<a
      href="${appLink("/register")}"
      class="${cls}"
      data-track="trial_click"
      data-track-source="${source}"
      data-plan="${plan ?? ""}"
      >${label}${suffix}</a
    >`;
  }

  return html`<button
    type="button"
    class="${cls}"
    data-open
    data-open-source="${source}"
    data-plan="${plan ?? ""}"
    data-track="trial_click"
    data-track-source="${source}"
  >
    ${label}${suffix}
  </button>`;
}
