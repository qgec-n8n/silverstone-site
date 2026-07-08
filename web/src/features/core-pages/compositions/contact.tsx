/**
 * /contact — calm, high-conversion enquiry experience.
 * Secondary-hero feature: SignalRouteSignature, a written enquiry travelling
 * through received/reviewed/routed checkpoints to a monitored inbox (built
 * for this page only).
 */
import { GitBranch, MapPin, MessageSquare } from "~/components/icons/lucide";
import { SignalRouteSignature } from "~/features/core-pages/signatures";
import { ContactForm } from "~/features/core-pages/contact-form";
import { MapPanel } from "~/features/core-pages/map-panel";
import { CoreCardGrid, type CoreCard } from "~/features/core-pages/shared";
import { SectionHead } from "~/features/services-v2/components/primitives";
import { SecondaryHero } from "~/features/services-v2/components/secondary-hero";
import {
  FinalCta,
  RelatedRail,
  type RelatedLink,
} from "~/features/services-v2/components/sections";
import { TrustStrip } from "~/visual/home-v2/sections/trust-strip";

const CHOICE_CARDS: CoreCard[] = [
  {
    title: "Use Contact when",
    body: "You want to ask a question first, need an accessible alternative to the calendar, or written context will make the reply more useful.",
  },
  {
    title: "Use Book when",
    body: "There is a real process, customer journey or digital problem and a live conversation will resolve the next step faster.",
    href: "/book#booking-calendar",
    label: "30 minutes",
  },
];

const related: RelatedLink[] = [
  { href: "/book#booking-calendar", label: "Live route", title: "Book a call" },
  { href: "/services", label: "Services", title: "Explore services" },
  { href: "/privacy-policy", label: "Governance", title: "Privacy policy" },
];

export function ContactComposition() {
  return (
    <div className="ss-srv2 ss-core" data-core-route="/contact">
      <SecondaryHero
        eyebrow="Direct correspondence"
        icon={MessageSquare}
        title="Start with the question that *matters*"
        titleId="core-contact-title"
        lead="Send concise written context about the process, journey or project question in front of you. The page is calm by design: no response-time promise, no pressure, no unnecessary data."
        points={[
          "Accessible written route for project and partnership questions",
          "Name, work email and message kept clear and required",
          "Your enquiry is routed straight to the Silverstone inbox",
        ]}
        primaryCtaLabel="Open the enquiry form"
        primaryCtaHref="/contact#contact-form"
        showcase={<SignalRouteSignature label="Direct correspondence" />}
      />
      <TrustStrip />

      <section className="ss-srv2-section" aria-labelledby="contact-choice">
        <div className="ss-srv2__container" data-width="narrow">
          <SectionHead
            eyebrow="Contact or Book?"
            icon={GitBranch}
            heading="Two routes to the *same team*"
            headingId="contact-choice"
          />
          <CoreCardGrid cards={CHOICE_CARDS} />
        </div>
      </section>

      {/* `id="contact-form"` is the site-wide contact deep-link target — every
          "Contact instead" CTA resolves to /contact#contact-form. */}
      <section
        className="ss-srv2-section"
        id="contact-form"
        aria-labelledby="core-contact-form"
      >
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="Send an enquiry"
            icon={MessageSquare}
            heading="Tell Silverstone what is happening *now*"
            headingId="core-contact-form"
            lead="A concise message is enough. Explain the current situation, the intended outcome and anything that materially affects the decision."
          />
          <ContactForm />
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="core-contact-map">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="Find us"
            icon={MapPin}
            heading="Visit *the studio*"
            headingId="core-contact-map"
          />
          <MapPanel />
        </div>
      </section>

      <section className="ss-srv2-section">
        <div className="ss-srv2__container" data-width="narrow">
          <FinalCta
            heading="Prefer a *conversation*?"
            body="Use Contact for a written question, partnership enquiry or scheduler fallback. Use Book when a focused 30-minute conversation is the more direct route."
            buttonLabel="Book a discovery call"
          />
        </div>
      </section>

      <section className="ss-srv2-section">
        <div className="ss-srv2__container">
          <SectionHead eyebrow="Continue" heading="Where this *connects next*" />
          <RelatedRail links={related} />
        </div>
      </section>
    </div>
  );
}
