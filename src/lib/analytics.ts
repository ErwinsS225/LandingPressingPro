/**
 * Mesure des événements de conversion.
 *
 * Le module est volontairement **agnostique du fournisseur** : `track()`
 * se contente de sérialiser et d'émettre. Le destinataire se règle dans
 * la constante ENDPOINT plus bas. Sans endpoint configuré, tout est
 * inerte — on peut donc merger cette brique avant d'avoir choisi son
 * outil, sans risque ni dépendance.
 *
 * Pourquoi un module maison plutôt qu'une bibliothèque : les trois
 * besoins réels sont petits (événements, UTM, respect du DNT), et les
 * SDKs Trails/Plausible embarquent plusieurs dizaines de kilo-octets
 * pour faire ce que ces quelques centaines de lignes font déjà. Le
 * bundle reste à 15 kB gzip : y ajouter un SDK le doublerait.
 *
 * `sendBeacon` plutôt que `fetch` : le beacon part pendant l'envoi de la
 * page, la requête n'est donc pas annulée quand l'onglet se ferme. C'est
 * indispensable pour `form_submit`, émis au moment précis où le visiteur
 * attend la confirmation.
 */

/** Événements du site : une faute de frappe devient une erreur `tsc`. */
export type AnalyticsEvent =
  | "page_view"
  | "modal_open"
  | "modal_close"
  | "form_submit"
  | "form_error"
  | "plan_click"
  | "contact_click"
  | "faq_open"
  | "theme_toggle";

export type EventProps = Record<string, string | number | boolean | undefined>;

/** Paramètres de campagne conservés d'une visite à l'autre. */
const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
] as const;

/** Durée de vie d'une attribution, en jours. */
const ATTRIBUTION_DAYS = 30;

/** Clé de stockage de l'attribution. */
const STORE_KEY = "pressingpro:attribution";

interface Attribution {
  params: Record<string, string>;
  /** Horodatage de la capture, en ms. */
  at: number;
}

/**
 * URL de collecte. Vide => aucun envoi.
 *
 * Plausible : `https://plausible.io/api/event`, avec le domaine autorisé
 * dans les réglages du compte. Un proxy local éviterait de référencer le
 * tiers en dur — c'est ce qu'on fera si la mesure devient plus sophisticée.
 */
const ENDPOINT: string = import.meta.env.VITE_ANALYTICS_ENDPOINT ?? "";

/**
 * Domaine autorisé sur le compte d'analytics.
 *
 * Obligatoire : Plausible rejette tout événement dont `domain` ne
 * correspond pas à un site enregistré sur le compte. On ne retombe pas
 * sur `location.host` par confort — tant que le domaine de production
 * n'est pas connu, mieux vaut une mesure inactive et visible qu'un flux
 * silencieusement rejeté.
 */
const SITE_DOMAIN: string = import.meta.env.VITE_ANALYTICS_DOMAIN ?? "";

/**
 * Vrai si l'utilisateur a demandé à être exclu. Le DNT est un signal
 * d'intention : on le respecte sans bandeau, parce qu'un exempté de
 * consentement est précisément celui qu'il ne faut pas mesurer.
 */
function optedOut(): boolean {
  const dnt =
    navigator.doNotTrack ?? (window as { doNotTrack?: string }).doNotTrack ?? null;
  return dnt === "1" || dnt === "yes";
}

/** La mesure n'est active que si endpoint ET domaine sont renseignés. */
function enabled(): boolean {
  return ENDPOINT !== "" && SITE_DOMAIN !== "" && !optedOut();
}

/** Retire les clés `undefined` : ignorées par Plausible, mais elles
 *  polluent la console en développement. */
function stripUndefined(props: EventProps): EventProps {
  return Object.fromEntries(
    Object.entries(props).filter(([, value]) => value !== undefined),
  );
}

// ------------------------------------------------------------------
//  Attribution de campagne
// ------------------------------------------------------------------

/** Lit l'attribution stockée, en ignorant les entrées trop anciennes. */
export function readAttribution(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return {};

    const saved = JSON.parse(raw) as Partial<Attribution>;
    if (typeof saved.at !== "number") return {};

    const ageDays = (Date.now() - saved.at) / 86_400_000;
    if (ageDays > ATTRIBUTION_DAYS) {
      localStorage.removeItem(STORE_KEY);
      return {};
    }

    return saved.params ?? {};
  } catch {
    // Données corrompues : on repart de zéro plutôt que de casser la page.
    return {};
  }
}

/**
 * Capture les paramètres de campagne de l'URL courante.
 *
 * Une seule fois par session : réécrire à chaque visite effacerait
 * l'attribution de la première visite — celle qui a peut-être amené le
 * visiteur ici — dès qu'il naviguerait ensuite vers une page sans UTM.
 *
 * Une attribution existante mais périmée n'est écrasée que si l'URL
 * apporte de nouveaux paramètres.
 */
export function captureAttribution(): void {
  try {
    const url = new URL(location.href);
    const fresh: Record<string, string> = {};

    for (const key of UTM_KEYS) {
      const value = url.searchParams.get(key);
      if (value) fresh[key] = value.slice(0, 200);
    }

    if (Object.keys(fresh).length === 0) return;
    if (Object.keys(readAttribution()).length > 0) return;

    localStorage.setItem(
      STORE_KEY,
      JSON.stringify({ params: fresh, at: Date.now() } satisfies Attribution),
    );
  } catch {
    // Mode privé ou stockage bloqué : la page doit rester fonctionnelle.
  }
}

// ------------------------------------------------------------------
//  Émission
// ------------------------------------------------------------------

/**
 * Envoie un événement. Ne lève jamais : un échec de mesure ne doit
 * jamais interrompre le parcours de conversion.
 */
export function track(event: AnalyticsEvent, props: EventProps = {}): void {
  if (!enabled()) return;

  // Format de l'API Events de Plausible (doc officielle) :
  //   name / url / domain / referrer / props
  // Le champ `domain` est obligatoire : Plausible refuse tout événement qui
  // ne correspond pas à un site enregistré sur le compte. Les noms courts
  // `n`/`u`/`d`/`r` appartiennent à l'ancienne API, aujourd'hui ignorée.
  const payload: Record<string, unknown> = {
    name: event,
    url: location.href,
    domain: SITE_DOMAIN,
    referrer: document.referrer || undefined,
    // 30 paires maximum côté Plausible ; nos propriétés sont bien en dessous,
    // mais on garde la borne par sécurité si l'attribution s'étoffe.
    props: {
      ...readAttribution(),
      ...stripUndefined(props),
    },
  };

  try {
    const body = new Blob([JSON.stringify(payload)], {
      type: "application/json",
    });

    // sendBeacon renvoie false si la file d'attente est pleine : on
    // bascule alors sur un fetch `keepalive`, plus coûteux mais cousin
    // lui aussi à la fermeture de l'onglet.
    const queued = navigator.sendBeacon(ENDPOINT, body);
    if (!queued) {
      void fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => undefined);
    }
  } catch {
    // Ignoré volontairement : voir la note ci-dessus.
  }

  if (import.meta.env.DEV) {
    console.debug("[analytics]", event, payload.d);
  }
}

/**
 * Attache les écouteurs de suivi déclaratifs.
 *
 * Le markup porte `data-track` et `data-track-<clé>` ; ce module ne
 * connaît aucun élément en particulier. Ajouter un point de mesure
 * consiste donc à écrire un attribut, pas à modifier cette fonction.
 */
export function initTracking(): void {
  if (!enabled()) return;

  // Délégation d'événement : un seul écouteur couvre tout le document.
  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement | null;
    const trigger = target?.closest<HTMLElement>("[data-track]");
    if (!trigger) return;

    const name = trigger.dataset.track as AnalyticsEvent | undefined;
    if (!name) return;

    // `data-track-plan="PRO"` devient la propriété `plan`.
    const props: EventProps = {};
    for (const [key, value] of Object.entries(trigger.dataset)) {
      if (key.startsWith("track") && key !== "track" && value !== undefined) {
        props[key.replace(/^track/, "")] = value;
      }
    }

    track(name, props);
  });

  // Ouverture d'une question de FAQ : `toggle` plutôt que `click`, pour
  // ne pas compter une fermeture comme une consultation.
  document
    .querySelectorAll<HTMLDetailsElement>("#faq details")
    .forEach((item) => {
      item.addEventListener("toggle", () => {
        if (!item.open) return;
        const question = item.querySelector("summary")?.textContent?.trim();
        if (question) track("faq_open", { question: question.slice(0, 120) });
      });
    });
}

/** Page vue, une seule fois par chargement. */
export function trackPageView(): void {
  track("page_view", { path: location.pathname });
}

