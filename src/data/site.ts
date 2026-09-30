import type { SiteMeta, NavLink } from "../types";

export const site: SiteMeta = {
  name: "PressIvoire",
  locale: "fr",
  title: "PressIvoire — Votre pressing, mieux organisé",
  description:
    "PressIvoire aide les pressings ivoiriens à suivre commandes, clients et paiements depuis leur téléphone.",
  themeColor: "#f8f7f2",
};

/**
 * Lien WhatsApp pré-rempli.
 *
 * `wa.me` attend le numéro au format international, sans « + » ni espaces.
 * Le message est encodé pour que les espaces et accents passent dans l'URL
 * sans casser le HTML — `escapeHtml` n'est pas nécessaire ici, un lien
 * construit par nos soins ne contient que des données déjà sérialisées.
 */
export function whatsappLink(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export const navLinks: NavLink[] = [
  { label: "Solution", href: "#solution" },
  { label: "Fonctionnalités", href: "#fonctionnalites" },
  { label: "Tarifs", href: "#tarifs" },
  { label: "Questions", href: "#faq" },
];

export const announcement = {
  highlight: "Offre de lancement",
  text: "30 jours pour essayer PressIvoire, sans carte bancaire",
  mobileSuffix: "Pensé pour les pressings de Côte d’Ivoire",
};

export const contact = {
  email: "bonjour@pressivoire.ci",
  mailtoSubject: "Demande de démonstration PressIvoire",

  /**
   * Numéro au format international sans « + » ni espaces, tel que
   * `wa.me` l'attend : 225 (Côte d'Ivoire) + le numéro mobile.
   */
  whatsapp: "2250585231985",
  /** Version lisible, affichée à l'utilisateur. */
  whatsappDisplay: "+225 05 85 23 19 85",

  /**
   * Message pré-rempli dans WhatsApp. Rédigé du point de vue d'un
   * pressings qui vient de voir le bouton : court, et il donne un motif
   * de réponse concret plutôt qu'un vague « bonjour ».
   */
  whatsappMessage:
    "Bonjour, je viens de voir votre site. Je suis propriétaire d'un pressing et j'aimerais en savoir plus sur PressIvoire.",

  hours: "Lundi – samedi, 8h – 19h",
};
