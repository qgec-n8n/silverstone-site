/**
 * /pricing — the two price-on-application engagements.
 *
 * Deliberately quieter than the implementation row: no beam, no badge, a mono
 * "Price on application" plate instead of a display figure. Each card carries
 * its own small instrument so the two read as different kinds of work — a
 * release ladder for product development, a depth scale for advisory.
 */
import { Layers, Search, type LucideIcon } from "~/components/icons/lucide";
import {
  PanelReveal,
  ServiceButton,
} from "~/features/services-v2/components/primitives";

import { BESPOKE_ENGAGEMENTS, type PricingCssVars } from "./pricing-content";

const ENGAGEMENT_ICONS: Record<string, LucideIcon> = {
  "app-development": Layers,
  "ai-consulting": Search,
};

export function BespokeEngagementCards() {
  return (
    <div className="ss-pri-bespoke">
      {BESPOKE_ENGAGEMENTS.map((engagement, index) => {
        const Icon = ENGAGEMENT_ICONS[engagement.id] ?? Layers;
        return (
          <PanelReveal className="ss-pri-poa" delayMs={index * 140} key={engagement.id}>
            <span className="ss-pri-poa__icon" aria-hidden="true">
              <Icon />
            </span>

            <h3 className="ss-pri-poa__title">{engagement.title}</h3>
            <p className="ss-pri-poa__price">{engagement.price}</p>
            <p className="ss-pri-poa__body">{engagement.body}</p>
            <p className="ss-pri-poa__supporting">{engagement.supporting}</p>

            <ul className="ss-pri-poa__scope">
              {engagement.scope.map((label, scopeIndex) => (
                <li key={label} style={{ "--pri-i": scopeIndex } as PricingCssVars}>
                  <span className="ss-pri-poa__scope-bar" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>

            <ServiceButton href={engagement.ctaHref} variant="ghost">
              {engagement.ctaLabel}
            </ServiceButton>
          </PanelReveal>
        );
      })}
    </div>
  );
}
