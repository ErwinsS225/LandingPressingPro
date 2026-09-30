import { html } from "../lib/dom";
import { faq, pricing } from "../data/marketing";
import { SectionHead } from "../components/cards";
import { TrialCta } from "../components/cta";
import type { Plan } from "../types";

function PlanCard({ plan }: { plan: Plan }): string {
  // `data-plan` est repris par la modale (mémorisé puis renvoyé dans le
  // mail) et `data-track` par le module analytics. Le nom du plan sert
  // donc de clé unique aux deux.
  //
  // Les formules STARTER et PRO ouvrent l'inscription ; BUSINESS renvoie
  // vers le contact, faute de palier multi-sites dans l'application.
  const cta = plan.ctaTriggersModal
    ? TrialCta(plan.cta, {
        source: `plan_${plan.name.toLowerCase()}`,
        variant: "w-full text-[13px]",
        plan: plan.name,
      })
    : html`<a
        href="${plan.ctaHref ?? "#contact"}"
        class="btn btn-light w-full text-[13px]"
        data-track="plan_click"
        data-track-plan="${plan.name}"
        >${plan.cta}</a
      >`;

  return html`
    <article
      class="price-card rail-card relative rounded-[18px] border border-border py-[27px] px-6 max-[650px]:p-6 ${plan.featured
        ? "price-card--featured"
        : ""}"
    >
      ${plan.ribbon ? html`<span class="ribbon">${plan.ribbon}</span>` : ""}
      <div class="plan">${plan.name}</div>
      <div class="price">${plan.price} <small>${plan.period}</small></div>
      <div class="annual">${plan.annual ?? ""}</div>
      <p class="plan-desc">${plan.description}</p>
      <ul>
        ${plan.features.map((feature) => html`<li>${feature}</li>`).join("")}
      </ul>
      ${cta} ${plan.fine ? html`<p class="fine">${plan.fine}</p>` : ""}
    </article>
  `;
}

export function PricingSection(): string {
  return html`
    <section class="section bg-surface-2" id="tarifs">
      <div class="wrap">${SectionHead(pricing)}</div>
      <div class="wrap">
        <div class="grid-cards-3 items-stretch gap-[17px]">
          ${pricing.plans.map((plan) => PlanCard({ plan })).join("")}
        </div>
      </div>
      <div class="wrap">
        <div class="guarantees">
          ${pricing.guarantees
            .map((item) => html`<span>${item}</span>`)
            .join("")}
        </div>
      </div>
    </section>
  `;
}

export function FaqSection(): string {
  return html`
    <section class="section" id="faq">
      <div class="wrap">
        ${SectionHead({ eyebrow: faq.eyebrow, title: faq.title })}
        <div class="faq-grid">
          ${faq.items
            .map(
              (item) => html`
                <details class="rounded-[13px] border border-border p-5">
                  <summary
                    class="flex cursor-pointer justify-between gap-2.5 font-bold"
                  >
                    ${item.question}
                  </summary>
                  <p class="mt-3.5 text-sm">${item.answer}</p>
                </details>
              `,
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}
