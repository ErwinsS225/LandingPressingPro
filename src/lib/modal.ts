/**
 * Comportement de la modale de demande d'essai.
 * L'état est porté par l'attribut `data-modal-state` sur #modal,
 * ce qui garde l'affichage piloté par le CSS.
 */
import { leadForm } from "../data/marketing";

const FOCUSABLE = "input, button, [href], select, textarea";

function getModal(): HTMLElement | null {
  return document.querySelector<HTMLElement>("#modal");
}

export function initModal(): void {
  const modal = getModal();
  if (!modal) return;

  const nameInput = modal.querySelector<HTMLInputElement>("#name");
  let lastFocused: HTMLElement | null = null;

  const open = (): void => {
    lastFocused = document.activeElement as HTMLElement | null;
    modal.dataset.modalState = "open";
    document.body.classList.add("overflow-hidden");
    nameInput?.focus();
  };

  const close = (): void => {
    delete modal.dataset.modalState;
    document.body.classList.remove("overflow-hidden");
    lastFocused?.focus();
  };

  document.querySelectorAll<HTMLElement>("[data-open]").forEach((trigger) => {
    trigger.addEventListener("click", open);
  });

  modal
    .querySelector<HTMLElement>("[data-modal-close]")
    ?.addEventListener("click", close);

  // Clic sur l'arrière-plan.
  modal.addEventListener("click", (event) => {
    if (event.target === modal) close();
  });

  document.addEventListener("keydown", (event) => {
    if (!modal.dataset.modalState) return;

    if (event.key === "Escape") {
      close();
      return;
    }

    // Piège de focus : la tabulation reste dans la modale.
    if (event.key === "Tab") {
      const items = [...modal.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => !el.hasAttribute("disabled"),
      );
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}

export interface LeadData {
  name: string;
  phone: string;
  email: string;
}

/** Classes du bandeau de retour, selon l'issue de l'envoi. */
const NOTICE_OK = ["border-green/30", "bg-green/10", "text-green-fg"];
const NOTICE_ERROR = ["border-red-200", "bg-red-50", "text-red-700"];

export function initLeadForm(send: (data: LeadData) => Promise<void>): void {
  const form = document.querySelector<HTMLFormElement>("#lead-form");
  const notice = document.querySelector<HTMLElement>("#notice");
  if (!form) return;

  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');

  const say = (message: string, failed = false): void => {
    if (!notice) return;
    notice.textContent = message;
    notice.classList.remove("hidden", ...NOTICE_OK, ...NOTICE_ERROR);
    notice.classList.add(...(failed ? NOTICE_ERROR : NOTICE_OK));
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // La validation native reste la source de vérité.
    if (!form.reportValidity()) return;

    const data = Object.fromEntries(new FormData(form)) as unknown as LeadData;
    const label = submit?.textContent;

    // Le bouton est neutralisé pendant l'envoi : sans cela, un second clic
    // part avant que la première requête soit terminée.
    submit?.setAttribute("disabled", "");
    if (submit) submit.textContent = leadForm.sending;
    notice?.classList.add("hidden");

    send(data)
      .then(() => {
        say(leadForm.notice);
        form.reset();
      })
      .catch((error: unknown) => {
        console.error(error);
        say(leadForm.error, true);
      })
      .finally(() => {
        submit?.removeAttribute("disabled");
        if (submit && label) submit.textContent = label;
      });
  });
}
