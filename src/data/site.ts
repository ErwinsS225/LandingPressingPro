import type { SiteMeta, NavLink } from "../types";

export const site: SiteMeta = {
  name: "PressIvoire",
  locale: "fr",
  title: "PressIvoire — Votre pressing, mieux organisé",
  description:
    "PressIvoire aide les pressings ivoiriens à suivre commandes, clients et paiements depuis leur téléphone.",
  themeColor: "#f8f7f2",
};

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
  note: "À configurer : adresse e-mail, numéro WhatsApp et horaires de réponse.",
};
