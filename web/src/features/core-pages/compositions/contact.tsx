/**
 * /contact — calm, high-conversion inquiry experience.
 * Secondary-hero feature: SignalRouteSignature, a written inquiry traveling
 * through received/reviewed/routed checkpoints to a monitored inbox (built
 * for this page only).
 */
import { GitBranch, Mail, MapPin, MessageSquare } from "~/components/icons/lucide";
import { SignalRouteSignature } from "~/features/core-pages/signatures";
import { ContactForm } from "~/features/core-pages/contact-form";
import { MapPanel } from "~/features/core-pages/map-panel";
import {
  coreSectionStyle,
  CoreCardGrid,
  type CoreCard,
} from "~/features/core-pages/shared";
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
    body: "You want to *ask a question first*, need an accessible alternative to the calendar, or written context will make the reply more useful.",
  },
  {
    title: "Use Book when",
    body: "There is a *real process, customer journey or digital problem* and a live conversation will resolve the next step faster.",
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
        lead="Built for a written start: when to write rather than book, a short inquiry form and where to find the studio. Replies come across US and UK business hours."
        points={[
          { icon: GitBranch, text: "Contact or Book — which route fits your question" },
          { icon: Mail, text: "A short form, answered across US and UK hours" },
          { icon: MapPin, text: "The London studio, if you'd rather visit" },
        ]}
        primaryCtaLabel="Open the inquiry form"
        primaryCtaHref="/contact#contact-form"
        secondaryCtaLabel="Book a call instead"
        secondaryCtaHref="/book#booking-calendar"
        showcase={<SignalRouteSignature label="Direct correspondence" />}
      />
      <TrustStrip />

      <section
        className="ss-srv2-section"
        aria-labelledby="contact-choice"
        style={coreSectionStyle(0)}
      >
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
        style={coreSectionStyle(1)}
      >
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="Send an inquiry"
            icon={MessageSquare}
            heading="Tell Silverstone AI what is happening *now*"
            headingId="core-contact-form"
            lead="A concise message is enough. Explain *the current situation, the intended outcome* and anything that materially affects the decision."
          />
          <ContactForm />
        </div>
      </section>

      <section
        className="ss-srv2-section"
        aria-labelledby="core-contact-map"
        style={coreSectionStyle(2)}
      >
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

      <section className="ss-srv2-section" style={coreSectionStyle(3)}>
        <div className="ss-srv2__container" data-width="narrow">
          <FinalCta
            heading="Prefer a *conversation*?"
            body="Use Contact for a written question, partnership inquiry or scheduler fallback. Use Book when a focused 30-minute conversation is the more direct route, in your time zone."
            buttonLabel="Book a discovery call"
          />
        </div>
      </section>

      <section className="ss-srv2-section" style={coreSectionStyle(4)}>
        <div className="ss-srv2__container">
          <SectionHead eyebrow="Continue" heading="Where this *connects next*" />
          <RelatedRail links={related} />
        </div>
      </section>
    </div>
  );
}
