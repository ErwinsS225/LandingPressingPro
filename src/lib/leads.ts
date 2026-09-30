/**
 * Acheminement des demandes d'essai vers Formspree.
 *
 * Formspree relaie chaque requête à l'adresse déclarée dans son tableau de
 * bord : le formulaire est donc le point de collecte, pas l'envoi. Son
 * identifiant est public (il apparaît dans le HTML de toute page statique),
 * ce qui permet de le garder en dur ici plutôt que dans un `.env` — rien à
 * penser au moment du build.
 *
 * L'échange est le même que celui du guide « Vanilla JS » de Formspree : un
 * `POST` JSON avec un en-tête `Accept: application/json`, qui fait renvoyer
 * les erreurs d'un format exploitable au lieu d'une page d'erreur. On n'ajoute
 * pas `@formspree/ajax` : ce SDK encapsule ce `fetch` et apporte l'état « en
 * cours », les bandeaux de succès et d'erreur — que `initLeadForm` gère déjà,
 * sans dépendance ni balise `data-fs-*` dans le markup.
 *
 * `FORM_ENDPOINT` sert aussi d'attribut `action` du formulaire : sans
 * JavaScript, la soumission native prend le relais. Une seule source de vérité
 * pour l'URL, donc.
 */
import type { LeadData } from "./modal";

/** Identifiant du formulaire Formspree (`https://formspree.io/f/…`). */
export const FORM_ENDPOINT = "https://formspree.io/f/mzezokna";

const SUBJECT = "Nouvelle demande d'essai — PressIvoire";

/** Corps du message, lisible en texte brut dans le mail reçu. */
function leadBody(data: LeadData): string {
  return [
    `Nom : ${data.name}`,
    `Téléphone : ${data.phone}`,
    `E-mail : ${data.email || "—"}`,
    "",
    `Envoyé depuis : ${location.href}`,
  ].join("\n");
}

/**
 * Envoie la demande. Ne résout que si Formspree a bien confirmé la
 * réception : toute autre réponse est une erreur à montrer au visiteur.
 */
export async function sendLead(data: LeadData): Promise<void> {
  const response = await fetch(FORM_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      name: data.name,
      phone: data.phone,
      email: data.email,
      subject: SUBJECT,
      message: leadBody(data),
    }),
  });

  if (!response.ok) {
    throw new Error(`Formspree a répondu ${response.status}`);
  }
}
