/**
 * Insertion des demandes d'essai dans Supabase, via son API REST.
 *
 * Pourquoi `fetch` plutôt que `@supabase/supabase-js` : le SDK pèse
 * **55 ko gzip** à lui seul, pour un appel qui tient en cinq lignes — on
 * passe la landing de 16 à 72 ko gzip. Sur une connexion mobile abidjanaise,
 * ce sont 55 ko de plus à télécharger avant même d'afficher le hero. C'est
 * aussi ce qui explique le choix symétrique côté analytics : aucun SDK.
 *
 * Le format de la requête est documenté par Supabase (PostgREST) :
 *   POST {url}/rest/v1/leads
 *   apikey + Authorization: Bearer <clé anon>
 *   Prefer: return=minimal   → on ne récupère pas la ligne insérée
 *
 * La clé `anon` est publique par conception : elle n'accorde aucun droit
 * par elle-même. Ce sont les politiques RLS de `supabase/schema.sql` qui
 * décident — ici, seul l'insertion est permise au rôle `anon`, et aucune
 * politique ne permet de lire la table. Ne jamais utiliser la clé
 * `service_role` côté navigateur : elle contourne ces politiques.
 */

const URL = import.meta.env.VITE_SUPABASE_URL ?? "";
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

/** Vrai si les variables d'environnement sont présentes. */
export const supabaseConfigured = URL !== "" && ANON_KEY !== "";

/** Ligne de la table `leads`, alignée sur `supabase/schema.sql`. */
export interface LeadRow {
  name: string;
  phone: string;
  email: string | null;
  /** Plan demandé, déduit du bouton sur lequel le visiteur a cliqué. */
  plan: string | null;
  /** Canal d'origine (`utm_source`, `gclid`…), s'il est connu. */
  source: string | null;
  /** Page depuis laquelle la demande a été envoyée. */
  page: string | null;
}

/**
 * Insère une demande.
 *
 * Lève une `Error` au message lisible si l'écriture est refusée — soit par
 * RLS, soit parce que la table n'existe pas encore.
 */
export async function insertLead(row: LeadRow): Promise<void> {
  if (!supabaseConfigured) {
    throw new Error("Supabase n'est pas configuré.");
  }

  const response = await fetch(`${URL}/rest/v1/leads`, {
    method: "POST",
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
      "Content-Type": "application/json",
      // `return=minimal` n'est pas qu'une optimisation : la valeur par
      // défaut ferait transiter la ligne insérée, donc les coordonnées du
      // prospect, vers le navigateur. Rien ne doit revenir au client.
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
  });

  if (response.ok) return;

  // PostgREST renvoie le détail de l'échec en JSON ; il est souvent plus
  // parlant que le code seul (« new row violates row-level security
  // policy »), donc on tente de le remonter.
  const detail = await response.text().catch(() => "");
  throw new Error(
    detail ? `Supabase ${response.status} : ${detail}` : `Supabase ${response.status}`,
  );
}

