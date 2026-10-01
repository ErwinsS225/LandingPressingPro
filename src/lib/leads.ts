/**
 * Enregistrement des demandes d'essai.
 *
 * Deux canaux, dans cet ordre :
 *
 * 1. **Supabase** (principal). La demande est *insérée en base* — donc
 *    consultable, exportable en CSV, et jamais perdue. C'est l'avantage
 *    décisif sur un envoi de mail : un prospect qui écrit puis disparaît
 *    reste dans la table même si personne n'a lu la boîte au bon moment.
 *    Voir `supabase/schema.sql` pour la table et les politiques RLS, et
 *    `supabase/functions/notify-lead/` pour la notification par e-mail.
 *
 * 2. **Formspree** (secours). Utilisé seulement si les variables Supabase
 *    manquent, ou si la base refuse l'écriture. Mieux vaut un e-mail
 *    approximatif qu'un prospect perdu.
 *
 * `FORM_ENDPOINT` sert aussi d'attribut `action` du formulaire : sans
 * JavaScript, la soumission native prend le relais — une seule source de
 * vérité pour l'URL.
 */
import { readAttribution } from "./analytics";
import { lastPlan, type LeadData } from "./modal";
import { insertLead, supabaseConfigured, type LeadRow } from "./supabase";

/** Identifiant du formulaire Formspree, utilisé en secours. */
export const FORM_ENDPOINT = "https://formspree.io/f/mzezokna";

const SUBJECT = "Nouvelle demande d'essai — PressingPro";

/** Résume l'attribution en une seule chaîne stockable. */
function attributionToSource(): string | null {
  const attribution = readAttribution();
  const entries = Object.entries(attribution);
  if (entries.length === 0) return null;

  return entries
    .map(([key, value]) => `${key}=${value}`)
    .join(" · ")
    .slice(0, 500);
}

/** Construit la ligne à insérer, commune aux deux canaux. */
function toRow(data: LeadData): LeadRow {
  return {
    name: data.name.trim(),
    phone: data.phone.trim(),
    email: data.email?.trim() || null,
    plan: lastPlan() ?? null,
    page: location.pathname + location.search,
    source: attributionToSource(),
  };
}

/** Corps du mail de secours, lisible en texte brut. */
function leadBody(row: LeadRow): string {
  return [
    `Nom : ${row.name}`,
    `Téléphone : ${row.phone}`,
    `E-mail : ${row.email ?? "—"}`,
    row.plan ? `Plan demandé : ${row.plan}` : null,
    row.source ? `Origine : ${row.source}` : null,
    "",
    `Envoyé depuis : ${location.href}`,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}

/** Secours Formspree, si la base est indisponible. */
async function sendViaFormspree(row: LeadRow): Promise<void> {
  const response = await fetch(FORM_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      name: row.name,
      phone: row.phone,
      email: row.email,
      subject: SUBJECT,
      message: leadBody(row),
    }),
  });

  if (!response.ok) {
    throw new Error(`Formspree a répondu ${response.status}`);
  }
}

/**
 * Enregistre la demande.
 *
 * Supabase est le canal principal : les leads sont **stockés en base**, donc
 * consultables, exportables et jamais perdus. C'est ce qui manque à un
 * simple envoi de mail — un prospect qui écrit puis disparaît est
 * introuvable si personne n'a lu la boîte au bon moment.
 *
 * Formspree reste en secours pour ne pas perdre une demande si la base est
 * momentanément injoignable : mieux vaut un e-mail approximatif qu'un
 * prospect perdu.
 */
export async function sendLead(data: LeadData): Promise<void> {
  const row = toRow(data);

  if (supabaseConfigured) {
    // Une erreur ici est remontée telle quelle au visiteur : le message
    // de Supabase dit pourquoi (RLS refusée, table absente…), ce qui
    // évite de chercher trois heures si le formulaire ne part pas.
    await insertLead(row);
    return;
  }

  await sendViaFormspree(row);
}

