import { html } from "../lib/dom";
import { FORM_ENDPOINT } from "../lib/leads";
import { leadForm } from "../data/marketing";

/**
 * Modale de demande d'essai. La logique d'ouverture/fermeture
 * est gérée par `src/lib/modal.ts` via les attributs `data-modal-*`.
 */
export function LeadModal(): string {
  return html`
    <div
      id="modal"
      class="fixed inset-0 z-30 hidden place-items-center bg-[#0b241f]/85 p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        class="modal-card relative w-[min(470px,100%)] rounded-[20px] p-[30px] max-[650px]:px-5 max-[650px]:py-6"
      >
        <button
          type="button"
          data-modal-close
          aria-label="Fermer"
          class="absolute right-[18px] top-[15px] cursor-pointer border-0 bg-transparent text-[25px] text-muted"
        >
          ×
        </button>
        <div class="eyebrow">${leadForm.eyebrow}</div>
        <h2 id="modal-title" class="text-[27px]">${leadForm.title}</h2>
        <p>${leadForm.intro}</p>

        <!-- action + method : le formulaire se soumet tout seul si le
             JavaScript ne s'exécute pas. novalidate est retiré pour que la
             validation native s'applique aussi sur ce chemin de secours. -->
        <form
          id="lead-form"
          action="${FORM_ENDPOINT}"
          method="POST"
        >
          <label for="name" class="modal-label">Votre nom</label>
          <input
            id="name"
            name="name"
            autocomplete="name"
            required
            placeholder="Ex. Aïssata Koné"
          />

          <label for="phone" class="modal-label">Votre téléphone</label>
          <input
            id="phone"
            name="phone"
            autocomplete="tel"
            inputmode="tel"
            required
            placeholder="+225 07 00 00 00 00"
          />

          <label for="email" class="modal-label">
            Votre e-mail
            <span class="font-normal text-fg-faint">(facultatif)</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            placeholder="vous@exemple.ci"
          />

          <button type="submit" class="btn mt-[19px] w-full">
            ${leadForm.submit}
          </button>
          <p class="mt-2.5 text-xs">${leadForm.hint}</p>
          <div
            id="notice"
            role="status"
            class="mt-[13px] hidden rounded-[9px] border border-green/30 bg-green/10 p-[13px] text-[13px] text-green-fg"
          >
            ${leadForm.notice}
          </div>
        </form>
      </div>
    </div>
  `;
}
