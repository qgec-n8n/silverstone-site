import { useEffect, useState } from "react";

import { useAppExperience } from "~/app/experience/app-experience";

/**
 * Silktide cookie consent manager (v2.0.1, via jsdelivr). Mounted only once
 * `headerHidden` clears — the same "loader/Aether-intro/expandable-hero gate
 * has fully cleared for the current route" signal `useDeepLinkScroll` relies
 * on — so the banner never appears over the loader or the route's hero
 * intro, only once the secondary hero/body content is actually showing.
 *
 * The stylesheet/override style/script are injected imperatively via
 * `document.createElement` rather than rendered as JSX: React does not
 * execute a `<script src>` it renders declaratively (verified — the tag
 * lands in the DOM but the browser never fetches/runs it), so an imperative
 * `document.head.append` is required for the script to actually load and
 * call `init`. Injection happens once, the first time the gate clears, and
 * is never torn down (a cookie banner is a page-level singleton; it must not
 * remount and re-fire on later route changes that re-gate a different
 * route's intro).
 */

type SilktideConsentType = {
  id: string;
  label: string;
  description: string;
  required?: boolean;
  defaultValue?: boolean;
  gtag?: string | string[];
  onAccept?: () => void;
};

type SilktideConsentConfig = {
  backdrop: { show: boolean };
  icon: { position: string };
  prompt: { position: string };
  consentTypes: SilktideConsentType[];
  text: {
    prompt: {
      description: string;
      acceptAllButtonText: string;
      acceptAllButtonAccessibleLabel: string;
      rejectNonEssentialButtonText: string;
      rejectNonEssentialButtonAccessibleLabel: string;
      preferencesButtonText: string;
      preferencesButtonAccessibleLabel: string;
    };
    preferences: {
      title: string;
      description: string;
      saveButtonText: string;
      saveButtonAccessibleLabel: string;
      creditLinkText: string;
      creditLinkAccessibleLabel: string;
    };
  };
};

declare global {
  // Global augmentation requires `interface` — a `type` alias cannot merge.
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    silktideConsentManager?: {
      init: (config: SilktideConsentConfig) => void;
    };
  }
}

const CONSENT_MANAGER_CONFIG: SilktideConsentConfig = {
  backdrop: {
    show: true,
  },
  icon: {
    position: "bottomLeft",
  },
  prompt: {
    position: "bottomLeft",
  },
  consentTypes: [
    {
      id: "essential",
      label: "Essential",
      description:
        "<p>These cookies are necessary for the website to function properly and cannot be switched off. They help with things like logging in and setting your privacy preferences.</p>",
      required: true,
      onAccept: () => {
        console.log("Add logic for the required Essential consent type here");
      },
    },
    {
      id: "analytics",
      label: "Analytics",
      description:
        "<p>These cookies help us improve the site by tracking which pages are most popular and how visitors move around the site.</p>",
      defaultValue: true,
      gtag: "analytics_storage",
    },
    {
      id: "marketing",
      label: "Marketing",
      description:
        "<p>These cookies are used by us and our advertising partners to show you relevant ads on this site and elsewhere, and to measure how those campaigns perform.</p>",
      gtag: ["ad_storage", "ad_user_data", "ad_personalization"],
    },
  ],
  text: {
    prompt: {
      description:
        "<p>We use cookies on our site to enhance your user experience, provide personalized content, and analyze our traffic.</p>",
      acceptAllButtonText: "Accept all",
      acceptAllButtonAccessibleLabel: "Accept all cookies",
      rejectNonEssentialButtonText: "Reject non-essential",
      rejectNonEssentialButtonAccessibleLabel: "Reject all non-essential cookies",
      preferencesButtonText: "Preferences",
      preferencesButtonAccessibleLabel: "Toggle preferences",
    },
    preferences: {
      title: "Customize your cookie preferences",
      description:
        "<p>We respect your right to privacy. You can choose not to allow some types of cookies. Your cookie preferences will apply across our website.</p>",
      saveButtonText: "Save and close",
      saveButtonAccessibleLabel: "Save your cookie preferences",
      creditLinkText: "Get this banner for free",
      creditLinkAccessibleLabel: "Get this banner for free",
    },
  },
};

const CSS_ID = "silktide-consent-manager-css";
const OVERRIDES_ID = "silktide-consent-manager-overrides";

const OVERRIDES_CSS = `
#stcm-wrapper {
  --boxShadow: -5px 5px 10px 0px #00000012, 0px 0px 50px 0px #0000001a;
  --fontFamily: Helvetica Neue, Segoe UI, Arial, sans-serif;
  --primaryColor: #22D3EE;
  --backgroundColor: #39454d;
  --textColor: #e9eaef;
  --backdropBackgroundColor: #05070A80;
  --backdropBackgroundBlur: 0px;
  --iconColor: #22D3EE;
  --iconBackgroundColor: #e9eaef;
}

/* Match the persistent icon to the site's floating icon-button family
   (.ss-demo-launcher__fab / .ss-hv2-return): same size, glass/blur
   treatment and spacing, instead of Silktide's flat default circle. The
   icon's SVG fill is repointed to --iconBackgroundColor above (platinum)
   for contrast now that the button background is dark, not solid cyan. */
#stcm-icon {
  width: 3.1rem;
  height: 3.1rem;
  bottom: calc(clamp(1rem, 0.5rem + 2vw, 1.75rem) + env(safe-area-inset-bottom, 0px));
  left: clamp(1rem, 0.5rem + 2vw, 1.75rem);
  border: 1px solid
    color-mix(in srgb, var(--ss-v2-signal-cyan) 38%, var(--ss-v2-hairline-strong));
  background:
    radial-gradient(
      120% 120% at 30% 0%,
      color-mix(in srgb, var(--ss-v2-signal-cyan) 22%, transparent),
      transparent 65%
    ),
    color-mix(in srgb, var(--ss-v2-graphite-raised) 88%, transparent);
  box-shadow: var(--ss-v2-glow-soft);
  backdrop-filter: blur(14px);
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.3s ease;
}

#stcm-icon:hover {
  transform: translateY(-2px);
}

#stcm-wrapper #stcm-icon:focus-visible {
  outline: 2px solid var(--ss-v2-signal-cyan);
  outline-offset: 4px;
  box-shadow: none;
}

/* The preferences title is re-tagged from h1 to h2 after init (see
   applyModalHeadingSemantics). Silktide's own stylesheet only targets
   \`#stcm-modal h1\`, so mirror that rule verbatim for the h2 — the vendor CSS
   is loaded from a pinned, SRI-checked URL and cannot be edited. */
#stcm-modal h2 {
  font-family: var(--fontFamily);
  color: var(--textColor);
  font-size: 24px;
  font-weight: 500;
  margin: 0px;
}

/*
 * Phones: the consent widget stays off the secondary hero.
 *
 * The phone hero is budgeted to exactly one screen and is the entire first
 * impression, so the three floating controls pinned to the viewport's bottom
 * corners — the demos launcher, the return-to-intro button and this widget —
 * are all held back until the visitor has scrolled past it. The shared gate is
 * \`src/app/experience/mobile-chrome-gate.tsx\`, which stamps
 * \`html[data-mobile-chrome="ready"]\`; the other two controls' rules live beside
 * them in styles/visual/home-v2.css. This half has to live here because the
 * vendor stylesheet is loaded from a pinned, SRI-checked URL and cannot be
 * edited — these overrides are injected immediately after it, so at equal
 * specificity they already win, and \`html:not([...]) #stcm-banner\` (1,1,1)
 * also outranks the vendor's own \`#stcm-banner.stcm-loaded { opacity: 1 }\`
 * (1,1,0).
 *
 * Note what this defers: on a first visit Silktide shows the PROMPT
 * (#stcm-banner) plus its #stcm-backdrop, not the persistent #stcm-icon, so on
 * a phone the cookie prompt now appears once the visitor scrolls past the hero
 * rather than on top of it. No cookie behaviour changes — the widget still
 * initialises at the same moment, sets nothing before a choice is made, and the
 * prompt is one short scroll away. It is deferred, never suppressed: the
 * attribute is set by a passive scroll listener that also fires on load, so a
 * deep link that lands mid-page shows it immediately.
 *
 * Only opacity / visibility / pointer-events move, so a shown control is
 * pixel-identical to today. The widget toggles \`style.display\` inline
 * (verified in the vendor script), which these rules deliberately never touch.
 */
@media (max-width: 40rem) {
  #stcm-icon,
  #stcm-banner,
  #stcm-backdrop {
    transition:
      opacity 240ms cubic-bezier(0.22, 1, 0.36, 1),
      visibility 240ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  /* Repeats #stcm-icon's own transitions above: the shorthand replaces them. */
  #stcm-icon {
    transition:
      transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
      border-color 0.3s ease,
      opacity 240ms cubic-bezier(0.22, 1, 0.36, 1),
      visibility 240ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  html:not([data-mobile-chrome="ready"]) #stcm-icon,
  html:not([data-mobile-chrome="ready"]) #stcm-banner,
  html:not([data-mobile-chrome="ready"]) #stcm-backdrop {
    /*
     * \`!important\` on opacity only, and only because the vendor runs
     * \`animation: stcm-fade-in 0.3s ease-in-out forwards\` on #stcm-icon (and a
     * slide-down on #stcm-banner): a forwards-filled animation's final value
     * sits in the animation origin of the cascade, which outranks any normal
     * author declaration however specific. Measured: without it the icon was
     * \`visibility: hidden\` but \`opacity: 1\`, so it popped instead of fading.
     * visibility and pointer-events are not animated by the vendor and need no
     * escalation.
     */
    opacity: 0 !important;
    visibility: hidden;
    pointer-events: none;
  }
}

/* Belt and braces: the site-wide reduced-motion reset already forces every
   transition to --ss-motion-reduced-duration. This states the intent locally,
   where a reader of the consent overrides can see it. */
@media (max-width: 40rem) and (prefers-reduced-motion: reduce) {
  #stcm-icon,
  #stcm-banner,
  #stcm-backdrop {
    transition: none;
  }
}
`;

const MODAL_ID = "stcm-modal";
const MODAL_TITLE_ID = "stcm-modal-title";

/**
 * Silktide v2.0.1 builds the preferences modal with `<header><h1>…</h1>` and
 * `init()` calls `createModal()` unconditionally, inserting the wrapper as
 * `document.body.firstChild` — so from the moment consent initialises, that h1
 * is the FIRST h1 in document order, ahead of the page's own title, even though
 * the modal itself is `display: none`. Measured: every route showed 2 h1s once
 * the gate cleared.
 *
 * The script is third-party and SRI-pinned, so the tag is corrected in place
 * afterwards. The same pass gives the modal the dialog semantics it ships
 * without: no `role`, no `aria-modal` and no accessible name.
 *
 * Note this closes the heading and naming gaps only. Silktide still does not
 * make the page behind the modal `inert`, so focus is not trapped — tracked
 * separately; fixing it means intervening in the vendor's focus handling.
 */
function applyModalHeadingSemantics(): void {
  const modal = document.getElementById(MODAL_ID);
  if (!modal) {
    return;
  }

  const title = modal.querySelector("h1");
  if (title) {
    const replacement = document.createElement("h2");
    replacement.id = MODAL_TITLE_ID;
    for (const attribute of title.attributes) {
      if (attribute.name !== "id") {
        replacement.setAttribute(attribute.name, attribute.value);
      }
    }
    replacement.innerHTML = title.innerHTML;
    title.replaceWith(replacement);
  }

  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  if (modal.querySelector(`#${MODAL_TITLE_ID}`)) {
    modal.setAttribute("aria-labelledby", MODAL_TITLE_ID);
  }
}

function injectConsentManager(): void {
  if (document.getElementById(CSS_ID)) {
    return;
  }

  const preconnect = document.createElement("link");
  preconnect.rel = "preconnect";
  preconnect.href = "https://cdn.jsdelivr.net";
  preconnect.crossOrigin = "anonymous";

  const stylesheet = document.createElement("link");
  stylesheet.id = CSS_ID;
  stylesheet.rel = "stylesheet";
  stylesheet.href =
    "https://cdn.jsdelivr.net/gh/silktide/consent-manager@v2.0.1/silktide-consent-manager.css";
  stylesheet.integrity =
    "sha384-EdMq+R+YOnsbelo08wPenoTlnxbAyxI11NMIxzugx/qAsbh64KcOkqxYqq6pfvO/";
  stylesheet.crossOrigin = "anonymous";

  const overrides = document.createElement("style");
  overrides.id = OVERRIDES_ID;
  overrides.textContent = OVERRIDES_CSS;

  const script = document.createElement("script");
  script.src =
    "https://cdn.jsdelivr.net/gh/silktide/consent-manager@v2.0.1/silktide-consent-manager.js";
  script.integrity =
    "sha384-5Pt34uiIbCsvfiiZXoLi4HRf/YBXjr9c8e+gYeVo9smUaInNHYVtc8NZ8wUnXJIq";
  script.crossOrigin = "anonymous";
  script.onload = () => {
    window.silktideConsentManager?.init(CONSENT_MANAGER_CONFIG);
    // `init` builds the whole widget synchronously, so the modal exists here.
    applyModalHeadingSemantics();
  };

  document.head.append(preconnect, stylesheet, overrides, script);
}

export function CookieConsentManager() {
  const { headerHidden } = useAppExperience();
  const [gateCleared, setGateCleared] = useState(false);

  // Latch true the moment the gate first clears, adjusting state during
  // render (same pattern as AppExperienceProvider/DemosLauncher) rather than
  // an effect that would trigger an extra cascading render. Never reverts,
  // so a later route change that re-gates a different route can't remount
  // (and re-fire) this page-level singleton widget.
  if (!headerHidden && !gateCleared) {
    setGateCleared(true);
  }

  useEffect(() => {
    if (gateCleared) {
      injectConsentManager();
    }
  }, [gateCleared]);

  return null;
}

export default CookieConsentManager;
