import { html } from "../lib/dom";
import { announcement, navLinks } from "../data/site";

export function AnnouncementBar(): string {
  return html`
    <div
      class="bg-deep px-4 py-[9px] text-center text-[13px] font-semibold text-white max-[650px]:text-[11px]"
    >
      <b class="text-lime">${announcement.highlight}</b> · ${announcement.text}
      <span class="max-[650px]:hidden">· ${announcement.mobileSuffix}</span>
    </div>
  `;
}

export function Brand(): string {
  return html`
    <a
      href="#accueil"
      class="flex items-center gap-2 font-display text-[22px] font-extrabold tracking-tight max-[650px]:text-[19px]"
    >
      <span
        class="grid size-8 place-items-center rounded-[10px] bg-green text-[19px] text-lime"
        aria-hidden="true"
        >P</span
      >
      Press<span class="text-green-fg">Ivoire</span>
    </a>
  `;
}

export function Header(): string {
  return html`
    <header
      class="sticky top-0 z-10 flex h-[76px] items-center border-b border-border/80 bg-header backdrop-blur-[14px] max-[650px]:h-[66px]"
    >
      <nav
        class="wrap flex items-center justify-between gap-7"
        aria-label="Navigation principale"
      >
        ${Brand()}
        <div
          class="hidden items-center gap-7 text-sm font-semibold text-fg-soft md:flex"
        >
          ${navLinks
            .map(
              (link) =>
                html`<a href="${link.href}" class="transition hover:text-green-fg"
                  >${link.label}</a
                >`,
            )
            .join("")}
        </div>
        <div class="flex items-center gap-2.5">
          <button
            type="button"
            data-theme-toggle
            aria-label="Passer en thème sombre"
            aria-pressed="false"
            class="grid size-[43px] shrink-0 cursor-pointer place-items-center rounded-xl border border-border bg-card text-[17px] text-fg transition duration-200 hover:-translate-y-0.5 hover:border-green hover:text-green-fg max-[650px]:size-[41px]"
          >
            <span data-theme-icon class="hidden dark:block" aria-hidden="true"
              >☀️</span
            >
            <span data-theme-icon class="block dark:hidden" aria-hidden="true"
              >🌙</span
            >
          </button>
          <button
            type="button"
            class="btn btn-sm"
            data-open
            data-open-source="header"
          >
            Essayer gratuitement <span>↗</span>
          </button>
        </div>
      </nav>
    </header>
  `;
}

export function FloatingContact(): string {
  return html`
    <a
      href="#contact"
      aria-label="Contacter l’équipe PressIvoire"
      data-track="contact_click"
      data-track-source="flottant"
      class="fixed bottom-5 right-5 z-[9] rounded-full bg-wa px-[17px] py-3 text-[13px] font-bold text-white shadow-wa transition hover:brightness-110 max-[650px]:bottom-[13px] max-[650px]:right-[13px] max-[650px]:px-[14px] max-[650px]:py-[11px]"
    >
      <span class="mr-[7px] text-[17px]">◉</span>Parler à l’équipe
    </a>
  `;
}
