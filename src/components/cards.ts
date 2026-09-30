import { html } from "../lib/dom";
import type { IconCard, Step } from "../types";

/** Carte à icône réutilisée par les sections « douleurs », « features » et « support ». */
export function IconCardView({ icon, title, description }: IconCard): string {
  return html`
    <article
      class="icon-card group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-card max-[650px]:px-[15px] max-[650px]:py-[18px]"
    >
      <div class="icon" aria-hidden="true">${icon}</div>
      <h3 class="text-lg max-[650px]:text-base">${title}</h3>
      <p class="mb-0 text-sm max-[650px]:text-[13px]">${description}</p>
    </article>
  `;
}

export function IconCardGrid({
  cards,
  className,
}: {
  cards: IconCard[];
  className: string;
}): string {
  return html`<div class="${className}">
    ${cards.map(IconCardView).join("")}
  </div>`;
}

/** En-tête centré d'une section : eyebrow + titre + intro optionnelle. */
export function SectionHead({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}): string {
  return html`
    <div class="section-head">
      <div class="eyebrow">${eyebrow}</div>
      <h2>${title}</h2>
      ${intro ? html`<p>${intro}</p>` : ""}
    </div>
  `;
}

/** Étape numérotée (compteur CSS dans .steps-grid). */
export function StepView({ title, description }: Step): string {
  return html`
    <article
      class="rail-card rounded-b-[15px] border-t-2 border-green bg-card p-6 max-[650px]:px-[18px] max-[650px]:py-[18px]"
    >
      <div class="stepno" aria-hidden="true"></div>
      <h3>${title}</h3>
      <p class="mb-0 text-sm max-[650px]:text-[13px]">${description}</p>
    </article>
  `;
}
