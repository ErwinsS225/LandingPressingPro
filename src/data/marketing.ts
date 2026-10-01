import type { Plan, FaqItem, FooterColumn } from "../types";

export const pricing = {
  eyebrow: "Des tarifs en FCFA",
  title: "Commencez à votre rythme.",
  intro:
    "Choisissez une formule adaptée à votre pressing. L’essai de 30 jours ne demande pas de carte bancaire.",
  plans: [
    {
      name: "STARTER",
      price: "0",
      period: "FCFA / mois",
      annual: "Pour découvrir l’essentiel",
      description: "Démarrez simplement et prenez vos repères.",
      features: [
        "Jusqu’à 30 commandes / mois",
        "1 utilisateur",
        "Suivi des commandes",
        "Support par WhatsApp",
      ],
      cta: "Commencer gratuitement",
      ctaTriggersModal: true,
    },
    {
      name: "PRO",
      price: "5 500",
      period: "FCFA / mois",
      annual: "Ou 55 000 FCFA / an",
      description: "Pour les pressings qui veulent mieux s’organiser.",
      features: [
        "Commandes illimitées",
        "Jusqu’à 5 utilisateurs",
        "Suivi des paiements",
        "Notifications clients",
        "Collecte et livraison",
        "Accompagnement prioritaire",
      ],
      cta: "Essayer PRO pendant 30 jours",
      ctaTriggersModal: true,
      featured: true,
      ribbon: "RECOMMANDÉ",
      fine: "Sans carte bancaire · Sans engagement",
    },
    {
      name: "BUSINESS",
      price: "20 000",
      period: "FCFA / mois",
      annual: "Ou 200 000 FCFA / an",
      description: "Pour les équipes et les pressings multi-sites.",
      features: [
        "Tout le plan PRO",
        "Jusqu’à 5 boutiques",
        "Jusqu’à 20 utilisateurs",
        "Suivi des livreurs",
        "Statistiques avancées",
        "Accompagnement dédié",
      ],
      cta: "Parler de vos besoins",
      ctaHref: "#contact",
    },
  ] satisfies Plan[],
  guarantees: [
    "Essai 30 jours",
    "Aucun engagement pendant l’essai",
    "Tarifs affichés en FCFA",
  ],
};

export const faq = {
  eyebrow: "Questions fréquentes",
  title: "Vous voulez en savoir plus ?",
  items: [
    {
      question: "Je ne suis pas à l’aise avec l’informatique.",
      answer:
        "PressingPro est conçu pour rester simple. L’équipe peut vous accompagner pour découvrir les fonctions principales et démarrer.",
    },
    {
      question: "Est-ce que je peux essayer avant de payer ?",
      answer:
        "Oui, l’essai de 30 jours vous permet de découvrir l’offre PRO sans carte bancaire.",
    },
    {
      question: "Quels moyens de paiement sont disponibles ?",
      answer:
        "Les moyens actuellement prévus comprennent Wave, Orange Money et MTN MoMo. Confirmez leur disponibilité avec l’équipe avant votre souscription.",
    },
    {
      question: "Est-ce que je peux arrêter quand je veux ?",
      answer:
        "L’essai est sans engagement. Pour les conditions de résiliation des abonnements, demandez les conditions complètes à l’équipe avant de souscrire.",
    },
    {
      question: "Mes données sont-elles protégées ?",
      answer:
        "La protection des données doit être confirmée dans les conditions et la politique de confidentialité de PressingPro avant mise en service.",
    },
    {
      question: "PressingPro fonctionne-t-il partout en Côte d’Ivoire ?",
      answer:
        "Contactez l’équipe pour vérifier la compatibilité avec votre téléphone, votre connexion et votre organisation.",
    },
  ] satisfies FaqItem[],
};

export const footer = {
  intro:
    "Le pressing ivoirien, mieux organisé. Une solution pensée pour le quotidien des professionnels du pressing.",
  note: "Informations légales et coordonnées à compléter avant publication.",
  columns: [
    {
      title: "Découvrir",
      links: [
        { label: "La solution", href: "#solution" },
        { label: "Fonctionnalités", href: "#fonctionnalites" },
        { label: "Comment ça marche", href: "#comment" },
        { label: "Tarifs", href: "#tarifs" },
      ],
    },
    {
      title: "Accompagnement",
      links: [
        { label: "Questions fréquentes", href: "#faq" },
        { label: "Contacter l’équipe", href: "#contact" },
        { label: "Demander une démo", href: "#contact" },
      ],
    },
    {
      title: "À compléter",
      links: [
        { label: "Mentions légales", href: "#contact" },
        { label: "Confidentialité", href: "#contact" },
        { label: "Conditions d’utilisation", href: "#contact" },
      ],
    },
  ] satisfies FooterColumn[],
  copyright: "© 2026 PressingPro · Côte d’Ivoire",
  payments: ["Wave", "Orange Money", "MTN MoMo"],
};

export const leadForm = {
  eyebrow: "On vous recontacte",
  title: "Parlons de votre pressing.",
  intro:
    "Indiquez vos coordonnées pour demander un essai ou une démonstration.",
  submit: "Envoyer ma demande",
  sending: "Envoi en cours…",
  hint:
    "Vos coordonnées servent uniquement à vous recontacter. Rien n’est stocké sur ce site.",
  notice:
    "Demande envoyée. On revient vers vous dans les meilleurs délais.",
  error:
    "L’envoi a échoué. Vérifiez votre connexion et réessayez dans un instant.",
};
