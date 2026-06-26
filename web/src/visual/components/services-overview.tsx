import "~/styles/visual/visual.css";

import {
  MachinedSignalIcon,
  type MachinedSignalIconName,
} from "~/visual/icons/machined-signal-icons";

type FrameService = {
  key: MachinedSignalIconName;
  title: string;
  body: string;
  scope: string;
};

type BandService = {
  key: MachinedSignalIconName;
  title: string;
  body: string;
};

// The "2 + 4": three distinct delivery frames (web / app / content) and a
// connected three-segment graphite band (voice / receptionist / automation)
// — the always-on instrument plane behind the human-controlled signal.
const FRAME_SERVICES: FrameService[] = [
  {
    key: "web",
    title: "Web",
    body: "Marketing sites and funnels engineered for clarity, speed and measured conversion.",
    scope:
      "Design system, build, analytics wiring, conversion review — human-approved before launch.",
  },
  {
    key: "app",
    title: "App",
    body: "Product surfaces and internal tools that keep teams in flow rather than in tabs.",
    scope:
      "Discovery, UX, build, integration. Pricing and assurance stay subject to human approval.",
  },
  {
    key: "content",
    title: "Content",
    body: "An editorial engine that turns expertise into a steady, on-brand publishing rhythm.",
    scope:
      "Strategy, drafting, review queue. Nothing publishes without a human in the loop.",
  },
];

const BAND_SERVICES: BandService[] = [
  {
    key: "voice",
    title: "Voice agents",
    body: "Natural voice that answers, qualifies and routes — escalating to a person on demand.",
  },
  {
    key: "reception",
    title: "Receptionist",
    body: "A always-on front desk that captures intent and books the right next step.",
  },
  {
    key: "automation",
    title: "Automation",
    body: "Workflows that connect the surfaces above, with a human approving every consequential step.",
  },
];

/**
 * Asymmetric six-service field. The three frames read as separate, crafted
 * surfaces; the graphite band reads as one connected instrument — expressing
 * "a human always in control of the signal".
 */
export function ServicesOverview() {
  return (
    <section className="ss-services" id="services" aria-labelledby="ssServicesTitle">
      <div className="ss-services__head">
        <span className="ss-pill">
          <span className="ss-pill__dot" />
          One operating surface
        </span>
        <h2 className="ss-services__title" id="ssServicesTitle">
          Six capabilities, one signal
        </h2>
      </div>

      <div className="ss-services__frames">
        {FRAME_SERVICES.map((service) => (
          <article className="ss-service-frame" key={service.key} id={service.key}>
            <MachinedSignalIcon name={service.key} title={`${service.title} icon`} />
            <h3 className="ss-service-frame__title">{service.title}</h3>
            <p className="ss-service-frame__body">{service.body}</p>
            <details className="ss-scope">
              <summary>What&rsquo;s in scope</summary>
              <p>{service.scope}</p>
            </details>
          </article>
        ))}
      </div>

      <div className="ss-band ss-on-graphite">
        {BAND_SERVICES.map((service) => (
          <article className="ss-band__seg" key={service.key} id={service.key}>
            <MachinedSignalIcon name={service.key} title={`${service.title} icon`} />
            <h3>{service.title}</h3>
            <p>{service.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
