import "./styles/theme.css";

import { AnnouncementBar, FloatingContact, Header } from "./components/layout";
import { SiteFooter } from "./components/footer";
import { LeadModal } from "./components/modal";
import { HeroSection, ProofSection } from "./sections/hero";
import {
  ComparisonSection,
  FinalCtaSection,
  FeaturesSection,
  PainSection,
  StepsSection,
  SupportSection,
  TestimonialSection,
} from "./sections/content";
import { FaqSection, PricingSection } from "./sections/sales";
import { initLeadForm, initModal } from "./lib/modal";
import { sendLead } from "./lib/leads";
import { initReveal } from "./lib/reveal";
import { initThemeToggle } from "./lib/theme";
import { initParallax } from "./lib/parallax";
import {
  captureAttribution,
  initTracking,
  trackPageView,
} from "./lib/analytics";

/** Assemble la page complète dans #app. */
function render(): void {
  const app = document.querySelector<HTMLElement>("#app");
  if (!app) throw new Error("Élément racine #app introuvable.");

  app.innerHTML = [
    AnnouncementBar(),
    Header(),
    "<main>",
    HeroSection(),
    ProofSection(),
    PainSection(),
    FeaturesSection(),
    StepsSection(),
    TestimonialSection(),
    ComparisonSection(),
    PricingSection(),
    FaqSection(),
    SupportSection(),
    FinalCtaSection(),
    "</main>",
    SiteFooter(),
    FloatingContact(),
    LeadModal(),
  ].join("");
}

function bootstrap(): void {
  render();
  initModal();
  initReveal();
  initThemeToggle();
  initParallax();

  // Mesure : l'attribution est capturée avant le premier événement, sinon
  // la `page_view` partirait sans elle. Les deux fonctions sont inertes
  // tant qu'aucun endpoint n'est configuré (cf. src/lib/analytics.ts).
  captureAttribution();
  initTracking();
  trackPageView();

  // Demande d'essai : voir `src/lib/leads.ts` pour le canal d'envoi et la
  // variable `VITE_LEAD_ENDPOINT` qui permet de brancher un vrai service de
  // collecte sans toucher au code.
  initLeadForm(sendLead);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
} else {
  bootstrap();
}
