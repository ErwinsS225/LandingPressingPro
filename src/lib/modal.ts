/**
 * Comportement de la modale de demande d'essai.
 * L'état est porté par l'attribut `data-modal-state` sur #modal,
 * ce qui garde l'affichage piloté par le CSS.
 */
import { leadForm } from "../data/marketing";
import { track } from "./analytics";

const FOCUSABLE = "input, button, [href], select, textarea";

function getModal(): HTMLElement | null {
  return document.querySelector<HTMLElement>("#modal");
}

export function initModal(): void {
  const modal = getModal();
  if (!modal) return;

  const nameInput = modal.querySelector<HTMLInputElement>("#name");
  let lastFocused: HTMLElement | null = null;

  const open = (event: Event): void => {
    lastFocused = document.activeElement as HTMLElement | null;
    modal.dataset.modalState = "open";
    document.body.classList.add("overflow-hidden");
    nameInput?.focus();

    // On note l'ouverture ici plutôt que via `data-track` : le même
    // déclencheur sert aussi à la fermeture, et l'événement doit
    // refléter l'état réel de la modale, pas le bouton.
    const trigger = event.currentTarget as HTMLElement | null;
    setPlan(trigger?.dataset.plan);

    // `data-open-source` porte l'emplacement du bouton. On ne peut pas
    // réutiliser `data-open` pour ça : le HTML ignore le second attribut
    // de même nom, et la source deviendrait toujours vide.
    track("modal_open", { source: trigger?.dataset.openSource ?? "inconnu" });
  };

  const close = (): void => {
    delete modal.dataset.modalState;
    document.body.classList.remove("overflow-hidden");
    lastFocused?.focus();
    track("modal_close");
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

/**
 * Dernier plan d'intérêt, mémorisé à l'ouverture de la modale.
 *
 * Le formulaire ne demande que trois champs : on ne va pas ajouter une
 * question de plus « quel plan vous intéresse ? ». À la place, on
 * retient le bouton sur lequel le visiteur a cliqué et on l'attache à la
 * demande. Un lead PRO devient donc identifiable comme tel dans le mail
 * reçu, sans une seule question supplémentaire côté visiteur.
 */
let plan: string | undefined;

/** Plan associé à la demande en cours, s'il y en a un. */
export function lastPlan(): string | undefined {
  return plan;
}

/** Mémorise le plan avant d'ouvrir la modale. */
export function setPlan(value: string | undefined): void {
  plan = value;
}

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
        track("form_submit", { plan: lastPlan() });
      })
      .catch((error: unknown) => {
        console.error(error);
        say(leadForm.error, true);
        track("form_error", { plan: lastPlan() });
      })
      .finally(() => {
        submit?.removeAttribute("disabled");
        if (submit && label) submit.textContent = label;
      });
  });
}
