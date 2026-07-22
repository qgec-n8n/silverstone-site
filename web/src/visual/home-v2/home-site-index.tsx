import { Link } from "react-router";

import {
  INDUSTRIES_MENU,
  PRIMARY_LINKS,
  SERVICES_MENU,
} from "~/components/layout/shell/nav-data";

/**
 * Crawlable homepage site index. Rendered unconditionally (outside the
 * loader/intro/body experience gates) so the prerendered homepage document
 * carries its H1, positioning copy and links to every secondary page and
 * hub child — the intro journey previously left the prerendered homepage
 * with no headings and no internal links at all
 * (reports/seo/visible-content-recommendations.md §1).
 *
 * `homepageState` starts as `"loading"` (~app/experience/app-experience.tsx)
 * during prerendering and first paint — `introVisible`/`bodyVisible` in
 * home-v2.tsx are both false then, so neither the Hero nor the body sections
 * exist in the static document at all. This component is deliberately the
 * only thing guaranteed to render regardless of state.
 *
 * Styled as a quiet, low-profile "capability index" (small heading, pill
 * links) rather than a second boxed nav grid — it sits directly above the
 * real global footer, so it must read as a distinct closing note, not a
 * duplicate of the footer's own column layout. Same content for users and
 * crawlers — no hidden text.
 *
 * Link lists come from the shared navigation data so this section can never
 * drift from the header/footer route surface.
 */

const INDEX_COLUMNS = [
  {
    title: "Services",
    links: [
      ...SERVICES_MENU.items,
      { href: SERVICES_MENU.href, label: "All services" },
    ],
  },
  {
    title: "Industries",
    links: [
      ...INDUSTRIES_MENU.items.map(({ href, label }) => ({
        href,
        label: label.replace(/^For /u, ""),
      })),
      { href: INDUSTRIES_MENU.href, label: "All industries" },
    ],
  },
  {
    title: "Company",
    links: PRIMARY_LINKS,
  },
] as const;

export function HomeSiteIndex() {
  return (
    <section aria-labelledby="ss-hv2-site-index-title" className="ss-hv2-site-index">
      <div className="ss-hv2-site-index__inner">
        <span className="ss-eyebrow ss-hv2-site-index__eyebrow font-mono">
          Silverstone AI
        </span>
        <h1 className="ss-hv2-site-index__title" id="ss-hv2-site-index-title">
          Websites, apps and AI automation for UK businesses
        </h1>
        <p className="ss-hv2-site-index__lead">
          Silverstone designs and engineers bespoke websites, applications, AI
          receptionists, voice agents and workflow automation for nine UK industries —
          from dental practices and estate agencies to hospitality venues and eCommerce
          brands. Every system is specified, built and reviewed around one measurable
          commercial outcome.
        </p>
        <div className="ss-hv2-site-index__groups">
          {INDEX_COLUMNS.map((column) => (
            <nav
              aria-label={`${column.title} pages`}
              className="ss-hv2-site-index__group"
              key={column.title}
            >
              <span className="ss-hv2-site-index__group-label">{column.title}</span>
              <ul className="ss-hv2-site-index__chips">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link className="ss-hv2-site-index__chip" to={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
    </section>
  );
}
