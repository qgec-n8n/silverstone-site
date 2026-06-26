import "~/styles/visual/visual.css";

import {
  MachinedSignalIcon,
  type MachinedSignalIconName,
} from "~/visual/icons/machined-signal-icons";

type CapabilityRow = {
  key: MachinedSignalIconName;
  capability: string;
  chooseWhen: string;
  youGet: string;
  pairsWith: string;
  slug: string;
};

// Canonical six-capability decision matrix. Descriptive only — no metrics,
// guarantees or outcomes are claimed.
const ROWS: CapabilityRow[] = [
  {
    key: "web",
    capability: "Web design & development",
    chooseWhen: "Your site is the first conversation and it loses people.",
    youGet: "A conversion-path site that stays fast and measurable.",
    pairsWith: "Content, Automation",
    slug: "web-design-development",
  },
  {
    key: "app",
    capability: "Custom app development",
    chooseWhen: "Spreadsheets and tabs have become the product.",
    youGet: "A product surface that holds real state.",
    pairsWith: "Automation, Voice",
    slug: "app-development",
  },
  {
    key: "content",
    capability: "Content creation",
    chooseWhen: "Expertise exists but publishing is sporadic.",
    youGet: "A source-to-channel editorial rhythm.",
    pairsWith: "Web, Automation",
    slug: "content-creation",
  },
  {
    key: "voice",
    capability: "AI voice agents",
    chooseWhen: "Calls go unanswered outside the desk's hours.",
    youGet: "Deterministic call flows that escalate to a person.",
    pairsWith: "Reception, Automation",
    slug: "ai-voice-agents",
  },
  {
    key: "reception",
    capability: "AI receptionists",
    chooseWhen: "Enquiries arrive across too many channels.",
    youGet: "One front desk that captures and routes intent.",
    pairsWith: "Voice, Automation",
    slug: "ai-receptionists",
  },
  {
    key: "automation",
    capability: "AI automation",
    chooseWhen: "Repeatable work quietly eats the week.",
    youGet: "Exception-aware workflows with human approval.",
    pairsWith: "App, Content",
    slug: "ai-automation",
  },
  {
    key: "consulting",
    capability: "AI & automation consulting",
    chooseWhen: "The opportunity is clear but the first project is not.",
    youGet: "An audit, roadmap and build-versus-buy decision route.",
    pairsWith: "Automation, App",
    slug: "ai-consulting",
  },
];

export type ServicesDecisionMatrixProps = {
  /**
   * Production route base for the capability links. Defaults to the live
   * `/services` route — never the prototype surface — so the primitive is
   * mount-ready. Pass a different base if routes are nested elsewhere.
   */
  basePath?: string;
};

/**
 * Services decision matrix — the services directory signature. A scannable map
 * of when to choose each capability, what it delivers and what it pairs with.
 * Rendered as an accessible table on wide viewports.
 */
export function ServicesDecisionMatrix({
  basePath = "/services",
}: ServicesDecisionMatrixProps = {}) {
  return (
    <div className="ss-matrix">
      <table className="ss-matrix__table">
        <caption className="ss-matrix__caption">
          Seven capabilities, one operating surface — choose by the friction you feel.
        </caption>
        <thead>
          <tr>
            <th scope="col">Capability</th>
            <th scope="col">Choose when</th>
            <th scope="col">What you get</th>
            <th scope="col">Pairs with</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.key}>
              <th scope="row" className="ss-matrix__capability">
                <MachinedSignalIcon name={row.key} title={`${row.capability} icon`} />
                <a className="ss-matrix__link" href={`${basePath}/${row.slug}`}>
                  {row.capability}
                </a>
              </th>
              <td>{row.chooseWhen}</td>
              <td>{row.youGet}</td>
              <td>{row.pairsWith}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
