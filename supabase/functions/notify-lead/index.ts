/**
 * Notification par e-mail à chaque nouveau lead.
 *
 * Ne s'appelle jamais depuis le navigateur : elle est déclenchée par un
 * **Database Webhook** (Dashboard > Database > Webhooks) sur
 * `INSERT INTO public.leads`. C'est le mécanisme prévu par Supabase pour
 * réagir à une écriture faite depuis le site.
 *
 * Déploiement :
 *   supabase link --project-ref yeskczloikwljpdjaowh
 *   supabase functions deploy notify-lead --no-verify-jwt
 *
 * Variables secrètes (Dashboard > Edge Functions > Secrets) :
 *   RESEND_API_KEY      clé de l'API Resend
 *   NOTIFY_EMAIL        adresse qui reçoit les leads
 *   RESEND_FROM         expéditeur, doit être vérifié sur Resend
 *
 * Sécurité : déployée en `--no-verify-jwt`, la fonction accepte toute
 * requête — y compris de n'importe qui connaissant son URL. Le handler
 * compare donc l'en-tête `Authorization` à la clé `service_role` que
 * Supabase injecte dans l'environnement : seul le webhook légitime passe.
 */

/** Ligne reçue dans le corps du webhook. */
interface Lead {
  id: number;
  created_at: string;
  name: string;
  phone: string;
  email: string | null;
  plan: string | null;
  source: string | null;
  page: string | null;
}

// Les trois variables lues de l'environnement.
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const NOTIFY_EMAIL = Deno.env.get("NOTIFY_EMAIL") ?? "";
const RESEND_FROM = Deno.env.get("RESEND_FROM") ?? "PressIvoire <leads@resend.dev>";

/** Échappe le HTML : un nom contenant `<` casserait le mail. */
function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Ligne du tableau récapitulatif, masquée si la valeur est absente. */
function row(label: string, value: string | null): string {
  if (!value) return "";
  return `<tr><td style="padding:6px 16px 6px 0;color:#64736e">${escapeHtml(
    label,
  )}</td><td style="padding:6px 0;font-weight:600">${escapeHtml(value)}</td></tr>`;
}

function buildEmail(lead: Lead): { subject: string; html: string } {
  const plan = lead.plan ?? "non précisé";

  const rows = [
    row("Nom", lead.name),
    row("Téléphone", lead.phone),
    row("E-mail", lead.email),
    row("Plan demandé", plan),
    row("Origine", lead.source),
    row("Page", lead.page),
    row("Reçue le", new Date(lead.created_at).toUTCString()),
  ].join("");

  return {
    // L'objet porte le numéro et le plan : on trie la boîte sans l'ouvrir.
    subject: `[PressIvoire] ${plan} — ${lead.name} — ${lead.phone}`,
    html: `<div style="font-family:system-ui,sans-serif;max-width:560px">
  <p style="font-size:20px;font-weight:800;margin:0 0 4px">Nouvelle demande d'essai</p>
  <p style="color:#64736e;margin:0 0 20px">Reçue depuis ${escapeHtml(
    lead.page ?? "le site",
  )}</p>
  <table style="border-collapse:collapse;width:100%">${rows}</table>
  <p style="margin-top:24px">
    <a href="tel:${escapeHtml(
      lead.phone.replaceAll(" ", ""),
    )}" style="background:#126c54;color:#fff;padding:11px 22px;border-radius:8px;text-decoration:none;font-weight:600">Rappeler ${escapeHtml(
      lead.name,
    )}</a>
  </p>
</div>`,
  };
}

/**
 * Vrai si l'appel provient bien du webhook de la base.
 *
 * La fonction est déployée en `--no-verify-jwt` : sans ce garde, quiconque
 * découvrirait son URL pourrait déclencher autant d'envois qu'il le souhaite.
 * On compare donc l'en-tête `Authorization` aux clés secrètes que Supabase
 * injecte dans l'environnement.
 *
 * Les deux noms sont essayés parce que les projets récents exposent
 * `SUPABASE_SECRET_KEYS` (un dictionnaire JSON) plutôt que l'historique
 * `SUPABASE_SERVICE_ROLE_KEY`. On échoue si aucune n'est disponible : mieux
 * vaut une notification en moins qu'un envoi accessible à tous.
 */
function isFromWebhook(request: Request): boolean {
  const token = (request.headers.get("authorization") ?? "")
    .replace(/^Bearer\s+/i, "")
    .trim();
  if (!token) return false;

  const secrets = new Set<string>();

  const legacy = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (legacy) secrets.add(legacy);

  try {
    const dict = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}");
    for (const value of Object.values(dict)) {
      if (typeof value === "string") secrets.add(value);
    }
  } catch {
    // Dictionnaire absent ou illisible : les autres sources suffisent.
  }

  return secrets.has(token);
}

Deno.serve(async (request) => {
  // Sonde de déploiement : confirme que la fonction répond, sans mail.
  if (request.method === "GET") {
    return Response.json({
      ok: true,
      configured: Boolean(RESEND_API_KEY && NOTIFY_EMAIL),
    });
  }

  if (request.method !== "POST") {
    return new Response("Méthode non autorisée", { status: 405 });
  }

  if (!isFromWebhook(request)) {
    return new Response("Non autorisé", { status: 401 });
  }

  const key = RESEND_API_KEY;
  const to = NOTIFY_EMAIL;

  if (!key || !to) {
    console.error("RESEND_API_KEY ou NOTIFY_EMAIL manquant.");
    return new Response("Configuration incomplète", { status: 500 });
  }


  // Le webhook peut être configuré pour n'envoyer que certaines colonnes.
  const body = await request.json();
  const lead = (body.record ?? body) as Lead;

  if (!lead?.phone || !lead?.name) {
    return new Response("Payload incomplet", { status: 400 });
  }

  const { subject, html } = buildEmail(lead);

  const resend = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: RESEND_FROM, to: [to], subject, html }),
  });

  if (!resend.ok) {
    // La ligne est déjà en base : un échec d'e-mail ne perd rien. On le
    // signale pour pouvoir rejouer l'envoi depuis le dashboard.
    console.error("Resend a échoué :", resend.status, await resend.text());
    return new Response("Envoi impossible", { status: 502 });
  }

  return new Response("OK", { status: 200 });
});
