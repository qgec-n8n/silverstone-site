/**
 * Web Design & Development demo — two reserved live-website showcases presented
 * as premium browser frames. Copy is the approved customer-facing text; the
 * frames are honestly labelled as reserved (no fake URL, status, or client
 * work). Each frame carries its integration slot as a typed data attribute — a
 * production-ready activation point — never as visible raw copy.
 */
import { Globe } from "~/components/icons/lucide";

import { Reveal, TextLink } from "../components/primitives";

type Showcase = {
  index: number;
  title: string;
  status: string;
  configSlot: string;
};

const showcases: Showcase[] = [
  {
    index: 1,
    title: "A complete customer journey, ready to explore",
    status: "Showcase reserved. No live client website is connected yet.",
    configSlot: "futureWebsitePreviewPrimaryUrl",
  },
  {
    index: 2,
    title: "A second system with a different commercial task",
    status:
      "Showcase reserved. Awaiting an approved second URL and permission to display it.",
    configSlot: "futureWebsitePreviewSecondaryUrl",
  },
];

function BrowserFrame({ index, title, status, configSlot }: Showcase) {
  return (
    <Reveal kind="card" delayMs={index * 90}>
      <article
        className="ss-srv2-browser ss-srv2-beam-border"
        data-config-slot={configSlot}
      >
        <div className="ss-srv2-browser__bar">
          <span className="ss-srv2-browser__dots" aria-hidden="true">
            <i /> <i /> <i />
          </span>
          <span className="ss-srv2-browser__addr">
            <Globe aria-hidden="true" />
            reserved
          </span>
          <span className="ss-srv2-browser__badge">
            Showcase {String(index).padStart(2, "0")}
          </span>
        </div>
        <div className="ss-srv2-browser__screen">
          <div className="ss-srv2-browser__scaffold" aria-hidden="true">
            <span /> <span /> <span /> <span />
          </div>
          <span className="ss-srv2-browser__pill">Reserved</span>
          <h3 className="ss-srv2-browser__title">{title}</h3>
          <p className="ss-srv2-browser__status">{status}</p>
        </div>
      </article>
    </Reveal>
  );
}

export function BrowserShowcase() {
  return (
    <div className="ss-srv2-showcase">
      <div className="ss-srv2-showcase__frames">
        {showcases.map((showcase) => (
          <BrowserFrame key={showcase.configSlot} {...showcase} />
        ))}
      </div>
      <Reveal kind="section" className="ss-srv2-showcase__note">
        <p className="ss-srv2-showcase__aphorism">
          A portfolio image shows the surface. A live route shows the decisions
          underneath.
        </p>
        <p className="ss-srv2-showcase__body">
          Until the approved websites are connected, these frames remain intentionally
          inactive. Explore the process behind the work, or book a discovery call to
          discuss the commercial system your site needs to support.
        </p>
        <TextLink href="/how-we-work">See how Silverstone works</TextLink>
      </Reveal>
    </div>
  );
}
