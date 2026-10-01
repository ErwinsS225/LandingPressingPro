/**
 * Types partagés du contenu et des composants.
 */

/** Lien interne vers une section de la page. */
export type SectionId =
  | "accueil"
  | "solution"
  | "fonctionnalites"
  | "comment"
  | "tarifs"
  | "faq"
  | "contact";

export interface NavLink {
  label: string;
  href: `#${SectionId}`;
}

export interface IconCard {
  icon: string;
  title: string;
  description: string;
}

export interface ProofStat {
  strong: string;
  span: string;
}

export interface OrderPreview {
  emoji: string;
  reference: string;
  detail: string;
  status: string;
  statusVariant?: "default" | "wash";
}

export interface Step {
  title: string;
  description: string;
}

export interface ComparisonRow {
  pressing: string;
  papier: string;
  pressingpro: string;
}

export interface ComparisonColumn {
  key: "pressing" | "papier" | "pressingpro";
  label: string;
}

export interface Plan {
  name: string;
  price: string;
  period: string;
  annual?: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
  ribbon?: string;
  /** `true` => bouton ouvrant la modale, sinon lien. */
  ctaTriggersModal?: boolean;
  ctaHref?: string;
  fine?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export interface SiteMeta {
  name: string;
  title: string;
  description: string;
  themeColor: string;
  locale: string;
}
