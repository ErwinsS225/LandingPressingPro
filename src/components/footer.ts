import { html } from "../lib/dom";
import { footer } from "../data/marketing";
import { Brand } from "./layout";

export function SiteFooter(): string {
  return html`
    <footer class="bg-deep-2 py-12 text-[#eaf0eb] max-[650px]:pt-12">
      <div class="wrap">
        <div
          class="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] max-[650px]:gap-x-[18px] max-[650px]:gap-y-[26px]"
        >
          <div class="max-[650px]:col-span-full lg:col-span-1">
            ${Brand()}
            <p class="mt-3.5 max-w-[270px] text-[13px] text-[#b5c7bf]">
              ${footer.intro}
            </p>
            <p class="!text-[11px] !text-[#f3cc75]">${footer.note}</p>
          </div>
          ${footer.columns
            .map(
              (column) => html`
                <div>
                  <h3 class="my-1.5 mb-[15px] text-[13px] tracking-[0.03em]">
                    ${column.title}
                  </h3>
                  <div class="grid gap-2.5 text-[13px] text-[#b5c7bf]">
                    ${column.links
                      .map(
                        (link) =>
                          html`<a
                            href="${link.href}"
                            class="transition hover:text-lime"
                            >${link.label}</a
                          >`,
                      )
                      .join("")}
                  </div>
                </div>
              `,
            )
            .join("")}
        </div>
        <div
          class="mt-[38px] flex justify-between gap-3 border-t border-white/15 pt-5 text-xs text-[#b5c7bf] max-[650px]:block"
        >
          <span>${footer.copyright}</span>
          <span class="max-[650px]:mt-[7px] max-[650px]:block"
            >${footer.payments.join(" · ")}</span
          >
        </div>
      </div>
    </footer>
  `;
}
