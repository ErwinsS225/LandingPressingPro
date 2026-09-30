import { html } from "../lib/dom";
import {
  comparison,
  features,
  finalCta,
  pains,
  steps,
  support,
  testimonial,
} from "../data/sections";
import { contact, whatsappLink } from "../data/site";
import { IconCardGrid, SectionHead, StepView } from "../components/cards";

export function PainSection(): string {
  return html`
    <section class="section" id="solution">
      <div class="wrap">
        ${SectionHead(pains)}
        ${IconCardGrid({ cards: pains.cards, className: "grid-cards-4" })}
        <p class="bridge">
          ${pains.bridgeLead}
          <span class="text-green-fg">${pains.bridgeHighlight}</span>
        </p>
      </div>
    </section>
  `;
}

export function FeaturesSection(): string {
  return html`
    <section class="section bg-surface" id="fonctionnalites">
      <div class="wrap">
        ${SectionHead(features)}
        ${IconCardGrid({ cards: features.cards, className: "grid-cards-3" })}
        <div class="mt-[35px] text-center">
          <a href="#comment" class="btn">${features.cta} <span>↓</span></a>
        </div>
      </div>
    </section>
  `;
}

export function StepsSection(): string {
  return html`
    <section class="section" id="comment">
      <div class="wrap">${SectionHead(steps)}</div>
      <div class="wrap">
        <div class="steps-grid">${steps.items.map(StepView).join("")}</div>
      </div>
    </section>
  `;
}

export function TestimonialSection(): string {
  return html`
    <section class="section bg-deep text-white">
      <div class="wrap">
        <div class="section-head">
          <div class="eyebrow !text-lime">${testimonial.eyebrow}</div>
          <h2>${testimonial.title}</h2>
          <p class="!text-[#bbcec7]">${testimonial.intro}</p>
        </div>
        <div class="testimonial-box">
          <div class="quote-mark" aria-hidden="true">“</div>
          <div>
            <blockquote>${testimonial.quote}</blockquote>
            <p class="mt-3 text-[13px] !text-[#bfd1c8]">
              ${testimonial.caption}
            </p>
          </div>
        </div>
        <p class="testimonial-note">${testimonial.note}</p>
      </div>
    </section>
  `;
}

export function ComparisonSection(): string {
  return html`
    <section class="section">
      <div class="wrap">
        ${SectionHead({ eyebrow: comparison.eyebrow, title: comparison.title })}
        <div class="compare-wrap">
          <table class="compare">
            <caption class="sr-only">
              Comparaison du suivi au pressing
            </caption>
            <thead>
              <tr>
                ${comparison.columns
                  .map((col) => html`<th scope="col">${col.label}</th>`)
                  .join("")}
              </tr>
            </thead>
            <tbody>
              ${comparison.rows
                .map(
                  (row) => html`
                    <tr>
                      <th scope="row" class="font-normal">${row.pressing}</th>
                      <td>${row.papier}</td>
                      <td>${row.pressivoire}</td>
                    </tr>
                  `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

export function SupportSection(): string {
  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(contact.mailtoSubject)}`;
  return html`
    <section class="section bg-surface-3" id="contact">
      <div class="wrap support-grid">
        <div>
          <div class="eyebrow">${support.eyebrow}</div>
          <h2>${support.title}</h2>
          <p>${support.copy}</p>
          <div class="flex flex-wrap gap-3 max-[650px]:grid">
            <a
              href="${whatsappLink(contact.whatsapp, contact.whatsappMessage)}"
              target="_blank"
              rel="noopener noreferrer"
              class="btn"
              data-track="contact_click"
              data-track-source="section_contact"
              data-track-canal="whatsapp"
              >WhatsApp <span>↗</span></a
            >
            <a
              href="${mailto}"
              class="btn btn-light"
              data-track="contact_click"
              data-track-source="section_contact"
              data-track-canal="email"
              >${support.cta} <span>↗</span></a
            >
          </div>
          <p class="contact-note">
            ${contact.whatsappDisplay} · ${contact.hours}
          </p>
        </div>
        ${IconCardGrid({ cards: support.cards, className: "support-cards" })}
      </div>
    </section>
  `;
}

export function FinalCtaSection(): string {
  return html`
    <section
      class="final-cta relative overflow-hidden py-[75px] text-center text-white max-[650px]:py-16"
    >
      <div class="wrap">
        <div
          class="eyebrow !text-[15px] !text-red-600 dark:!text-red-400 max-[650px]:!text-[13px]"
        >
          ${finalCta.eyebrow}
        </div>
        <h2 class="mx-auto mb-[18px] max-w-[750px]">${finalCta.title}</h2>
        <p class="!text-[#c5d4ce]">${finalCta.copy}</p>
        <button
          type="button"
          class="btn btn-lime mt-3"
          data-open
          data-open-source="cta_final"
        >
          ${finalCta.cta}
        </button>
        <p class="fine">${finalCta.fine}</p>
      </div>
    </section>
  `;
}
