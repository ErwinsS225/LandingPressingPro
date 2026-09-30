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

/**
 * URL de l'application (Next.js), sur un autre déploiement.
 *
 * Tant qu'elle est vide — l'application n'est pas encore en ligne — les
 * boutons d'essai continuent d'ouvrir le formulaire de demande. Dès
 * qu'elle est renseignée, les mêmes boutons mènent à l'inscription.
 * C'est ce qui évite d'avoir à revenir modifier le code au déploiement.
 */
const APP_URL: string = (import.meta.env.VITE_APP_URL ?? "").replace(/\/+$/, "");

/** Vrai si l'application est déployée et donc joignable. */
export const appDeployed = APP_URL !== "";

/**
 * Lien vers une page de l'application.
 *
 * Renvoie `#` quand l'application n'est pas déployée : les boutons
 * doivent rester cliquables, l'ancre servant alors de repli plutôt que
 * d'un lien mort vers `undefined/register`.
 */
export function appLink(path = "/register"): string {
  return appDeployed ? `${APP_URL}${path}` : "#";
}

/** Marqueur discret pour distinguer un lien réel d'un repli. */
export const appUrl = APP_URL;

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
