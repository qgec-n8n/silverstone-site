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
  bottom: clamp(1rem, 0.5rem + 2vw, 1.75rem);
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
`;

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
  script.integrity = "sha384-5Pt34uiIbCsvfiiZXoLi4HRf/YBXjr9c8e+gYeVo9smUaInNHYVtc8NZ8wUnXJIq";
  script.crossOrigin = "anonymous";
  script.onload = () => {
    window.silktideConsentManager?.init(CONSENT_MANAGER_CONFIG);
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
