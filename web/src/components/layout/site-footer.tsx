import { Link } from "react-router";
import { ArrowRightIcon } from "lucide-react";

import { Container } from "~/components/layout/container";
import {
  ctaPillClass,
  footerCompanyLinks,
  footerLegalLinks,
  industryLinks,
  primaryCta,
  serviceLinks,
  type NavLink,
} from "~/components/layout/nav-data";

function FooterColumn({ links, title }: { links: NavLink[]; title: string }) {
  return (
    <nav aria-label={title}>
      <p className="ss-mono-label text-muted-foreground">{title}</p>
      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              className="ss-focus-ring text-body-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
              to={link.href}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden border-t border-[var(--ss-v2-glass-border)] bg-[var(--ss-v2-ink-900)] text-foreground"
      role="contentinfo"
    >
      <div
        aria-hidden="true"
        className="ss-grid-overlay pointer-events-none absolute inset-0 opacity-[0.05]"
      />
      <Container className="relative" size="wide">
        <div className="ss-luminous-border my-12 grid gap-8 rounded-[var(--ss-radius-2xl)] p-8 md:my-16 md:grid-cols-[1.6fr_1fr] md:items-center md:p-12">
          <div>
            <p className="ss-mono-label text-[color:var(--ss-v2-cyan)]">
              Start the conversation
            </p>
            <h2 className="mt-3 font-display text-h3 leading-tight text-foreground">
              Put practical AI to work in your business
            </h2>
            <p className="mt-3 max-w-[52ch] text-body text-muted-foreground">
              A short discovery call is the fastest way to see where automation,
              AI agents and a sharper digital presence would move the needle —
              with no obligation and plain-English advice.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <Link className={ctaPillClass} to={primaryCta.href}>
              {primaryCta.label}
              <ArrowRightIcon aria-hidden="true" className="size-4" />
            </Link>
            <Link
              className="ss-focus-ring text-body-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
              to="/contact"
            >
              Or send us a message
            </Link>
          </div>
        </div>

        <div className="grid gap-10 pb-12 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <img
              alt="Silverstone AI"
              className="h-9 w-auto"
              loading="lazy"
              src="/brand/silverstone-logo-new.png"
              srcSet="/brand/silverstone-logo-new.png 1x, /brand/silverstone-logo-new@2x.png 2x"
            />
            <p className="mt-4 max-w-[38ch] text-body-sm text-muted-foreground">
              Websites, applications, content and AI workflow systems for
              ambitious UK businesses — designed, built and supported with care.
            </p>
            <p className="ss-mono-label mt-5 text-muted-foreground">
              London · Working with UK businesses nationwide
            </p>
          </div>
          <FooterColumn links={serviceLinks} title="Services" />
          <FooterColumn links={industryLinks} title="Industries" />
          <FooterColumn links={footerCompanyLinks} title="Company" />
        </div>

        <div className="ss-hairline" />

        <div className="flex flex-col gap-3 py-6 text-caption text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            <span suppressHydrationWarning>© {year}</span> Silverstone AI. All
            rights reserved.
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-4">
            {footerLegalLinks.map((link) => (
              <Link
                className="ss-focus-ring no-underline transition-colors hover:text-foreground"
                key={link.href}
                to={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </footer>
  );
}

export { SiteFooter };
