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
 * Visually the section sits at the very end of the homepage flow: during the
 * loader/intro states it is below the locked viewport, and once the visitor
 * opens the system view it reads as the closing capability map before the
 * global footer. Same content for users and crawlers — no hidden text.
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
        <header className="ss-hv2-site-index__header">
          <span className="ss-eyebrow font-mono text-muted-foreground">
            Silverstone AI
          </span>
          <h1 className="ss-hv2-site-index__title" id="ss-hv2-site-index-title">
            Websites, apps and AI automation for UK businesses
          </h1>
          <p className="ss-hv2-site-index__lead">
            Silverstone AI designs and engineers bespoke websites, applications, AI
            receptionists, voice agents and workflow automation for nine UK industries —
            from dental practices and estate agencies to hospitality venues and
            eCommerce brands. Every system is specified, built and reviewed around one
            measurable commercial outcome.
          </p>
        </header>
        <div className="ss-hv2-site-index__columns">
          {INDEX_COLUMNS.map((column) => (
            <nav
              aria-label={`${column.title} pages`}
              className="ss-hv2-site-index__column"
              key={column.title}
            >
              <h2 className="ss-hv2-site-index__column-title">{column.title}</h2>
              <ul className="ss-hv2-site-index__list">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link className="ss-hv2-site-index__link" to={link.href}>
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
