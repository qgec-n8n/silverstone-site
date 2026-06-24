import { ArrowUpRight, MapPin } from "lucide-react";
import { Link } from "react-router";

import { Container } from "~/components/layout/container";

import { BrandLockup } from "./brand-lockup";
import { FOOTER_COLUMNS, PRIMARY_CTA } from "./nav-data";

const CURRENT_YEAR = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="ss-void-bg relative border-t border-[color:var(--ss-v2-hairline)]">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-[image:var(--ss-v2-gradient-signal)] opacity-60"
      />
      <Container className="py-16 lg:py-20" size="wide">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <BrandLockup emblemSize={40} />
            <p className="mt-5 text-body-sm text-titanium">
              Web, app, content and AI workflow systems for ambitious UK businesses —
              designed, engineered and assured in-house.
            </p>
            <p className="mt-6 inline-flex items-center gap-2 text-body-sm text-titanium">
              <MapPin aria-hidden className="size-4 text-[var(--ss-v2-signal-cyan)]" />
              London, United Kingdom
            </p>
            <Link
              className="ss-focus-ring ss-transition-interactive mt-6 inline-flex min-h-11 items-center gap-1.5 rounded-[var(--ss-radius-pill)] border border-[color:var(--ss-v2-hairline)] px-5 text-sm font-semibold text-platinum no-underline hover:bg-[var(--ss-v2-glass)]"
              to={PRIMARY_CTA.href}
            >
              {PRIMARY_CTA.label}
              <ArrowUpRight aria-hidden className="size-4" />
            </Link>
          </div>
          {FOOTER_COLUMNS.map((column) => (
            <nav aria-label={column.title} key={column.title}>
              <h2 className="ss-eyebrow text-titanium">{column.title}</h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.href}`}>
                    <Link
                      className="ss-focus-ring ss-transition-interactive rounded-[var(--ss-radius-xs)] text-body-sm text-titanium no-underline hover:text-platinum"
                      to={link.href}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="ss-hairline-t mt-14 flex flex-col gap-3 pt-6 text-caption text-titanium sm:flex-row sm:items-center sm:justify-between">
          <p>© {CURRENT_YEAR} Silverstone AI. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              className="ss-focus-ring ss-transition-interactive rounded-[var(--ss-radius-xs)] no-underline hover:text-platinum"
              to="/privacy-policy"
            >
              Privacy policy
            </Link>
            <Link
              className="ss-focus-ring ss-transition-interactive rounded-[var(--ss-radius-xs)] no-underline hover:text-platinum"
              to="/contact"
            >
              Contact
            </Link>
            <span>Staging environment — not for production use.</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
