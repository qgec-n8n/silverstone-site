/**
 * /book — high-conviction discovery-call booking experience.
 * Secondary-hero feature: AgendaDialSignature, a 30-minute agenda dial with
 * a sweeping hand across four discussion sectors (built for this page only).
 */
import { CalendarCheck, MessageSquare, Target } from "~/components/icons/lucide";
import { AgendaDialSignature } from "~/features/core-pages/signatures";
import { BookingPanel } from "~/features/core-pages/booking-panel";
import {
  coreSectionStyle,
  CoreCardGrid,
  type CoreCard,
} from "~/features/core-pages/shared";
import { SectionHead } from "~/features/services-v2/components/primitives";
import { SecondaryHero } from "~/features/services-v2/components/secondary-hero";
import {
  FinalCta,
  ProcessTrack,
  RelatedRail,
  type RelatedLink,
} from "~/features/services-v2/components/sections";
import { TrustStrip } from "~/visual/home-v2/sections/trust-strip";

const FIT_CARDS: CoreCard[] = [
  {
    title: "A strong fit",
    body: "You can name a *process, journey or product decision* that affects time, response, conversion, delivery quality, visibility or control.",
  },
  {
    title: "Not ready yet",
    body: "The brief is only “we need AI”, there is *no process owner*, or the main aim is a generic price without discussing scope.",
  },
];

const AGENDA_STEPS = [
  {
    label: "Current reality",
    body: "What happens today, where *friction appears* and which systems or channels shape the journey.",
  },
  {
    label: "Commercial consequence",
    body: "Why the problem matters: *time, experience, response*, capacity, conversion, control or risk.",
  },
  {
    label: "Decision boundary",
    body: "What could be automated, built or redesigned, and *what should remain human*.",
  },
  {
    label: "Sensible next step",
    body: "Whether the opportunity merits a *defined scope*, advisory step, smaller release or no project.",
  },
];

const related: RelatedLink[] = [
  { href: "/how-we-work", label: "Process", title: "How we work" },
  { href: "/pricing", label: "Commercial", title: "Pricing model" },
  { href: "/contact#contact-form", label: "Fallback", title: "Contact" },
];

export function BookComposition() {
  return (
    <div className="ss-srv2 ss-core" data-core-route="/book">
      <SecondaryHero
        eyebrow="30-minute discovery"
        icon={CalendarCheck}
        title="Book a *30-minute* discovery call"
        titleId="core-book-title"
        lead="One page, one outcome: a booked call. Check the fit, preview the agenda, then calibrate the conversation and choose a verified time below."
        points={[
          { icon: Target, text: "A quick fit check — is now the right time?" },
          { icon: MessageSquare, text: "The four questions we cover in 30 minutes" },
          {
            icon: CalendarCheck,
            text: "A native booking console — choose a time, qualify and confirm",
          },
        ]}
        primaryCtaLabel="Continue to booking"
        secondaryCtaLabel="Email us instead"
        secondaryCtaHref="/contact#contact-form"
        showcase={<AgendaDialSignature label="30-minute discovery" />}
      />
      <TrustStrip />

      <section
        className="ss-srv2-section"
        aria-labelledby="book-fit"
        style={coreSectionStyle(0)}
      >
        <div className="ss-srv2__container" data-width="narrow">
          <SectionHead
            eyebrow="Who the call is for"
            icon={Target}
            heading="Is *now* the right time?"
            headingId="book-fit"
          />
          <CoreCardGrid cards={FIT_CARDS} />
        </div>
      </section>

      <section
        className="ss-srv2-section"
        aria-labelledby="book-agenda"
        style={coreSectionStyle(1)}
      >
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="What we'll discuss"
            icon={MessageSquare}
            heading="Four questions, *thirty minutes*"
            headingId="book-agenda"
          />
          <ProcessTrack steps={AGENDA_STEPS} />
        </div>
      </section>

      <section
        className="ss-srv2-section"
        aria-labelledby="core-booking"
        style={coreSectionStyle(2)}
      >
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="Secure your call"
            icon={CalendarCheck}
            heading="Bring *one real problem* to the calendar"
            headingId="core-booking"
            lead="Choose a verified time first, add four quick discovery cues, then confirm your details. Check the displayed timezone before confirming, and do not submit passwords, payment data or sensitive personal information."
          />
          <BookingPanel />
        </div>
      </section>

      <section className="ss-srv2-section" style={coreSectionStyle(3)}>
        <div className="ss-srv2__container" data-width="narrow">
          <FinalCta
            heading="Need a *written route* instead?"
            body="No technical preparation is required. Bring one process, journey or digital problem and enough context to decide the sensible next step."
            buttonLabel="Send a written inquiry"
            bookHref="/contact#contact-form"
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
