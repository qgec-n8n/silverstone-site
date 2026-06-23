import "~/styles/visual/visual.css";

type AtlasEntry = {
  slug: string;
  sector: string;
  pattern: string;
  detail: string;
};

// Operating-pattern atlas. Each entry names the shape of the work, not an
// outcome — descriptive only, no metrics or client claims.
const ENTRIES: AtlasEntry[] = [
  {
    slug: "estate-agents",
    sector: "Estate agents",
    pattern: "Property-enquiry switchboard",
    detail: "Many listings, many enquiries, one routed conversation.",
  },
  {
    slug: "hospitality",
    sector: "Hospitality",
    pattern: "Guest-journey service bell",
    detail: "Pre-stay to post-stay touchpoints kept on one bell.",
  },
  {
    slug: "salons-barbers",
    sector: "Salons & barbers",
    pattern: "Chair-and-calendar weave",
    detail: "Chairs, stylists and the day's calendar woven together.",
  },
  {
    slug: "trades",
    sector: "Trades & home services",
    pattern: "Job-intake dispatch board",
    detail: "Quote requests triaged onto a clear dispatch board.",
  },
  {
    slug: "ecommerce",
    sector: "eCommerce brands",
    pattern: "Order-state conveyor",
    detail: "Order, fulfilment and support states on one conveyor.",
  },
  {
    slug: "physios-chiropractors",
    sector: "Physio & chiropractic",
    pattern: "Non-clinical intake boundary",
    detail: "Admin intake handled up to a strict clinical boundary.",
  },
  {
    slug: "dentists",
    sector: "Dental practices",
    pattern: "Patient-admin recall orbit",
    detail: "Recalls and patient admin kept on a steady orbit.",
  },
  {
    slug: "gyms-fitness-studios",
    sector: "Gyms & fitness studios",
    pattern: "Trial-to-membership roster",
    detail: "Trials, classes and members on one moving roster.",
  },
  {
    slug: "fitness-coaches",
    sector: "Fitness coaches",
    pattern: "DM-to-consultation pathway",
    detail: "Inbound messages guided to a consultation pathway.",
  },
];

export type IndustriesAtlasProps = {
  /**
   * Production route base for the sector links. Defaults to the live
   * `/industries` route — never the prototype surface — so the primitive is
   * mount-ready. Pass a different base if routes are nested elsewhere.
   */
  basePath?: string;
};

/**
 * Industries atlas — the industries directory signature. A grid of operating
 * patterns, each linking to the matching sector instrument page.
 */
export function IndustriesAtlas({ basePath = "/industries" }: IndustriesAtlasProps = {}) {
  return (
    <ul className="ss-atlas">
      {ENTRIES.map((entry) => (
        <li className="ss-atlas__item" key={entry.slug}>
          <a className="ss-atlas__card" href={`${basePath}/${entry.slug}`}>
            <span className="ss-atlas__sector">{entry.sector}</span>
            <span className="ss-atlas__pattern">{entry.pattern}</span>
            <span className="ss-atlas__detail">{entry.detail}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
