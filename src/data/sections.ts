import type { IconCard, Step, ComparisonColumn, ComparisonRow } from "../types";

export const pains = {
  eyebrow: "On connaît le quotidien",
  title: "Le cahier ne devrait pas vous coûter du temps et de l’argent.",
  intro:
    "Quand tout repose sur la mémoire et les notes, les petits oublis finissent par peser sur l’activité.",
  cards: [
    {
      icon: "📓",
      title: "Une commande introuvable",
      description:
        "Une page perdue, un numéro oublié… et impossible de retrouver le vêtement ou le client.",
    },
    {
      icon: "💸",
      title: "Des prix pas toujours clairs",
      description:
        "Les tarifs varient selon la personne au comptoir et les erreurs s’accumulent.",
    },
    {
      icon: "👕",
      title: "Un litige sans preuve",
      description:
        "Sans photo à la réception, difficile de se comprendre si un vêtement est abîmé.",
    },
    {
      icon: "⏰",
      title: "Des retards qui échappent",
      description:
        "On rappelle, on vérifie, on cherche : vous passez la journée à courir après l’information.",
    },
  ] satisfies IconCard[],
  bridgeLead:
    "Votre métier est exigeant. Votre outil de gestion, lui, devrait être",
  bridgeHighlight: "simple.",
};

export const features = {
  eyebrow: "Tout au même endroit",
  title: "PressingPro vous aide à garder le fil.",
  intro:
    "Les essentiels du pressing, accessibles depuis un écran clair et facile à utiliser.",
  cards: [
    {
      icon: "📱",
      title: "Commandes en quelques gestes",
      description:
        "Ajoutez les articles, les tarifs et la date de retrait sans tout réécrire.",
    },
    {
      icon: "📸",
      title: "Photos des vêtements",
      description:
        "Gardez une trace visuelle à la réception pour éviter les malentendus.",
    },
    {
      icon: "💰",
      title: "Suivi des paiements",
      description:
        "Notez les règlements et consultez l’état des paiements de chaque commande.",
    },
    {
      icon: "🚚",
      title: "Collecte et livraison",
      description:
        "Retrouvez les informations de livraison et organisez vos tournées.",
    },
    {
      icon: "📊",
      title: "Votre activité en vue",
      description:
        "Consultez les commandes et les encaissements depuis votre tableau de bord.",
    },
    {
      icon: "🔔",
      title: "Clients mieux informés",
      description:
        "Préparez des notifications pour prévenir le client quand sa commande est prête.",
    },
  ] satisfies IconCard[],
  cta: "Découvrir le fonctionnement",
};

export const steps = {
  eyebrow: "Prise en main sans prise de tête",
  title: "De la réception au retrait, en 4 étapes.",
  intro: "Un parcours simple pour vous et votre équipe.",
  items: [
    {
      title: "Créez la commande",
      description:
        "Ajoutez les vêtements, le client et la date prévue de retrait.",
    },
    {
      title: "Suivez le traitement",
      description:
        "Mettez à jour le statut pour savoir où en est chaque commande.",
    },
    {
      title: "Prévenez le client",
      description:
        "Informez-le lorsque ses vêtements sont prêts à être récupérés.",
    },
    {
      title: "Clôturez et encaissez",
      description:
        "Retrouvez le règlement et l’historique dans la fiche de commande.",
    },
  ] satisfies Step[],
};

export const testimonial = {
  eyebrow: "Du concret, pas de promesses en l’air",
  title: "À vous de voir si PressingPro vous convient.",
  intro:
    "Nous préférons vous montrer l’outil et répondre à vos questions plutôt que d’inventer des avis clients.",
  quote:
    "« Est-ce que ça correspond à mon pressing ? Je veux voir comment ça marche avant de me décider. »",
  caption:
    "La meilleure preuve : une démonstration adaptée à votre façon de travailler.",
  note: "Les témoignages clients seront ajoutés avec leur accord, après vérification de leur expérience.",
};

export const comparison = {
  eyebrow: "Le changement au quotidien",
  title: "Moins de recherche. Plus de visibilité.",
  columns: [
    { key: "pressing", label: "Au pressing" },
    { key: "papier", label: "Avec notes papier" },
    { key: "pressingpro", label: "Avec PressingPro" },
  ] satisfies ComparisonColumn[],
  rows: [
    {
      pressing: "Retrouver une commande",
      papier: "Feuilleter le cahier",
      pressingpro: "Rechercher dans la liste",
    },
    {
      pressing: "Connaître le statut",
      papier: "Demander à l’équipe",
      pressingpro: "Le consulter sur l’écran",
    },
    {
      pressing: "Garder une trace",
      papier: "Notes et mémoire",
      pressingpro: "Fiche de commande centralisée",
    },
    {
      pressing: "Suivre les règlements",
      papier: "Recompter les reçus",
      pressingpro: "Consulter l’historique",
    },
  ] satisfies ComparisonRow[],
};

export const support = {
  eyebrow: "Vous n’êtes pas seul",
  title: "Un coup de main pour démarrer.",
  copy: "Échangez avec l’équipe PressingPro pour découvrir l’application, poser vos questions et voir si elle convient à votre établissement.",
  cta: "Écrire à l’équipe",
  cards: [
    {
      icon: "🎓",
      title: "Une prise en main guidée",
      description:
        "Un premier échange pour vous familiariser avec les fonctions.",
    },
    {
      icon: "💬",
      title: "Un contact direct",
      description: "Posez vos questions à l’équipe avant de vous lancer.",
    },
    {
      icon: "📹",
      title: "Des explications claires",
      description: "Découvrez les étapes importantes en français.",
    },
    {
      icon: "⚙️",
      title: "Un démarrage accompagné",
      description:
        "Préparez votre catalogue et vos utilisateurs avec assistance.",
    },
  ] satisfies IconCard[],
};

export const finalCta = {
  eyebrow: "À vous de choisir",
  title: "Et si votre prochain cahier tenait dans votre téléphone ?",
  copy: "Essayez PressingPro pendant 30 jours et découvrez une autre façon de suivre votre pressing.",
  cta: "🚀 Démarrer mon essai gratuit",
  fine: "Sans carte bancaire · Prenez le temps de découvrir",
};
