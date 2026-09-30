import { html } from "../lib/dom";
import { hero, orders, proof } from "../data/hero";

function PhoneMockup(): string {
  return html`
    <div
      class="phone relative z-[1] w-[min(320px,84%)] rotate-2 rounded-[35px] border-[7px] border-[#203a33] bg-white p-[13px] shadow-phone max-[650px]:w-[270px]"
    >
      <div
        class="flex items-center justify-between px-[7px] pb-[15px] pt-[5px] text-[11px] text-[#76847e]"
      >
        <span>9:41</span><span>●●● ▰</span>
      </div>

      <div
        class="rounded-[20px_20px_12px_12px] bg-deep px-[19px] py-[22px] text-white"
      >
        <small class="text-[#b9d5cb]">${hero.greeting}</small>
        <h3 class="my-0.5 text-lg">${hero.screenTitle}</h3>
        <p class="m-0 text-xs text-[#d4e2dc]">${hero.screenSubtitle}</p>
        <div
          class="mt-[18px] flex items-center justify-between rounded-[10px] bg-white/10 p-[10px] px-3"
        >
          <div>
            <strong class="text-[21px]">${hero.metric.value}</strong><br />
            <span class="text-[10px] text-[#d4e2dc]">${hero.metric.label}</span>
          </div>
          <span class="text-[10px] text-[#d4e2dc]">${hero.metric.delta}</span>
        </div>
      </div>

      <div class="px-2 py-[15px]">
        <div class="my-px mb-[11px] flex justify-between text-[11px] font-bold">
          <span>${hero.listLabel}</span
          ><a href="#fonctionnalites" class="text-green-fg">Tout voir →</a>
        </div>
        ${orders
          .map(
            (order) => html`
              <div
                class="flex items-center gap-2.5 border-t border-[#edf0eb] py-2.5"
              >
                <div
                  class="grid size-9 place-items-center rounded-[11px] bg-[#f4efe3] text-[18px]"
                  aria-hidden="true"
                >
                  ${order.emoji}
                </div>
                <div class="flex-1">
                  <b class="block text-[11px]">${order.reference}</b>
                  <small class="text-[10px] text-[#8a9690]"
                    >${order.detail}</small
                  >
                </div>
                <span
                  class="rounded-md px-[7px] py-[5px] text-[9px] font-bold ${order.statusVariant ===
                  "wash"
                    ? "bg-[#fff3dc] text-[#9a6910]"
                    : "bg-[#e7f5ec] text-[#16704d]"}"
                  >${order.status}</span
                >
              </div>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

export function HeroSection(): string {
  return html`
    <section
      id="accueil"
      class="overflow-hidden py-20 max-[650px]:pb-9 max-[650px]:pt-[52px] max-[900px]:py-[65px]"
      style="background: radial-gradient(ellipse at 76% 40%, #e8edcf 0, transparent 38%), var(--color-paper)"
    >
      <div
        class="wrap grid items-center gap-[52px] lg:grid-cols-[1.08fr_0.92fr] max-[650px]:grid-cols-1 max-[650px]:gap-3 max-[900px]:grid-cols-2 max-[900px]:gap-[15px]"
      >
        <div>
          <div class="eyebrow">${hero.eyebrow}</div>
          <h1>
            ${hero.titleLead}
            <span class="text-green-fg">${hero.titleHighlight}</span>
          </h1>
          <p
            class="mb-[27px] max-w-[565px] text-lg leading-[1.7] max-[650px]:text-base"
          >
            ${hero.copy}
          </p>

          <div class="flex flex-wrap gap-3 max-[650px]:grid">
            <button
              type="button"
              class="btn"
              data-open
              data-open-source="hero"
            >
              ${hero.primaryCta}
            </button>
            <a href="${hero.secondaryHref}" class="btn btn-light"
              >${hero.secondaryCta} <span>↗</span></a
            >
          </div>

          <ul class="trustline">
            ${hero.trustline.map((item) => html`<li>${item}</li>`).join("")}
          </ul>

          <div class="payments">
            <span>Paiements Mobile Money :</span>
            ${hero.payments
              .map((p) => html`<span class="pay-chip">${p}</span>`)
              .join("")}
          </div>
        </div>

        <div
          class="relative grid min-h-[480px] place-items-center max-[650px]:mx-[-10px] max-[650px]:min-h-[400px] max-[900px]:min-h-[410px]"
          aria-label="${hero.visualLabel}"
          role="img"
        >
          <div class="visual-orb"></div>
          <div class="visual-note">
            ${hero.visualNote.replaceAll("\n", "<br />")}
          </div>
          ${PhoneMockup()}
          <div class="float-card">
            <b>${hero.floatCard.title}</b
            ><span>${hero.floatCard.subtitle}</span>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function ProofSection(): string {
  return html`
    <section
      class="border-y border-border bg-card py-[23px] max-[650px]:py-[19px]"
      aria-label="Repères produit"
    >
      <div
        class="wrap flex flex-wrap items-center justify-between gap-6 max-[650px]:gap-x-3 max-[900px]:justify-center"
      >
        <p
          class="max-w-[200px] text-sm font-bold max-[900px]:w-full max-[900px]:max-w-none max-[900px]:text-center"
        >
          ${proof.intro}
        </p>
        ${proof.stats
          .map(
            (stat) => html`
              <div class="w-[calc(50%_-_12px)] text-center max-[900px]:w-auto">
                <strong
                  class="block font-display text-[21px] text-green-fg max-[650px]:text-[19px]"
                  >${stat.strong}</strong
                >
                <span class="text-xs text-muted max-[370px]:text-[11px]"
                  >${stat.span}</span
                >
              </div>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}
