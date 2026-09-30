import type { OrderPreview, ProofStat } from "../types";

export const hero = {
  eyebrow: "Le pressing ivoirien passe au digital",
  titleLead: "Votre pressing mérite mieux qu’un",
  titleHighlight: "cahier.",
  copy: "Commandes, clients, paiements et livraisons : gardez tout sous les yeux, directement sur votre téléphone. Simple à prendre en main, pensé pour votre quotidien.",
  primaryCta: "🚀 Démarrer mon essai gratuit",
  secondaryCta: "Parler à l’équipe",
  secondaryHref: "#contact",
  trustline: [
    "30 jours pour essayer",
    "Sans engagement",
    "Accompagnement en français",
  ],
  payments: ["Wave", "Orange Money", "MTN MoMo"],
  visualLabel: "Aperçu de l’application PressIvoire",
  visualNote: "FAIT POUR\nLA CÔTE\nD’IVOIRE 🇨🇮",
  greeting: "Bonjour, votre pressing 👋",
  screenTitle: "Tout est sous contrôle.",
  screenSubtitle: "Voici votre activité aujourd’hui",
  metric: {
    value: "18",
    label: "commandes en cours",
    delta: "↑ 4 aujourd’hui",
  },
  listLabel: "À suivre",
  floatCard: {
    title: "Vos commandes, au même endroit",
    subtitle: "Un aperçu de l’application",
  },
};

export const orders: OrderPreview[] = [
  {
    emoji: "👔",
    reference: "Commande #0248",
    detail: "2 chemises · Aujourd’hui",
    status: "Prête",
  },
  {
    emoji: "👗",
    reference: "Commande #0247",
    detail: "Robe · Demain",
    status: "En cours",
    statusVariant: "wash",
  },
  {
    emoji: "🧥",
    reference: "Commande #0246",
    detail: "Veste · Demain",
    status: "En cours",
    statusVariant: "wash",
  },
  {
    emoji: "👕",
    reference: "Commande #0245",
    detail: "3 pièces · Vendredi",
    status: "Prête",
  },
];

export const proof = {
  intro: "Un outil concret pour gérer votre activité au quotidien.",
  stats: [
    { strong: "En un coup d’œil", span: "suivez vos commandes" },
    { strong: "Sur téléphone", span: "au comptoir ou ailleurs" },
    { strong: "En français", span: "avec un accompagnement humain" },
  ] satisfies ProofStat[],
};
