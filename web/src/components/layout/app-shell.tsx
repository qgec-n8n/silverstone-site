import type { ReactNode } from "react";
import { useLocation } from "react-router";

import { SkipLink } from "~/components/accessibility/skip-link";
import { Cluster } from "~/components/layout/cluster";
import { Container } from "~/components/layout/container";
import {
  SiteNav,
  SiteNavDisclosure,
  SiteNavItem,
  SiteNavLink,
  SiteNavList,
} from "~/components/layout/site-nav";

type AppShellProps = {
  children: ReactNode;
  pendingIndicator?: ReactNode;
};

const serviceLinks = [
  { href: "/services/web-design-development", label: "Web Design & Development" },
  { href: "/services/app-development", label: "Custom App Development" },
  { href: "/services/ai-voice-agents", label: "AI Voice Agents" },
  { href: "/services/ai-receptionists", label: "AI Receptionists" },
  { href: "/services/content-creation", label: "Content Creation & Repurposing" },
  { href: "/services/ai-automation", label: "AI Automation & Agent Workflows" },
];

const industryLinks = [
  { href: "/services/estate-agents", label: "Estate Agents" },
  { href: "/services/hospitality", label: "Hospitality" },
  { href: "/services/salons-barbers", label: "Salons & Barbers" },
  { href: "/services/trades", label: "Trades & Home Services" },
  { href: "/services/ecommerce", label: "eCommerce Brands" },
  { href: "/services/physios-chiropractors", label: "Physio & Chiropractic Clinics" },
  { href: "/services/dentists", label: "Dental Practices" },
  { href: "/services/gyms-fitness-studios", label: "Gyms & Fitness Studios" },
  { href: "/services/fitness-coaches", label: "Fitness Coaches" },
];

function AppShell({ children, pendingIndicator }: AppShellProps) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SkipLink />
      <header className="sticky top-0 z-[400] border-b border-border bg-background/95 backdrop-blur">
        <Container>
          <div className="flex min-h-20 flex-wrap items-center justify-between gap-4 py-3">
            <Cluster className="min-w-0 flex-1" gap="md">
              <a
                className="ss-focus-ring rounded-[var(--ss-radius-pill)] px-1 py-1 font-display text-h6 tracking-[var(--ss-type-track-heading)] text-foreground no-underline"
                href="/"
              >
                Silverstone
              </a>
              <SiteNav>
                <SiteNavList className="gap-1">
                  <SiteNavItem>
                    <SiteNavDisclosure
                      label="Services"
                      links={serviceLinks.map((link) => ({
                        ...link,
                        current: location.pathname === link.href,
                      }))}
                    >
                      Capability-led services
                    </SiteNavDisclosure>
                  </SiteNavItem>
                  <SiteNavItem>
                    <SiteNavDisclosure
                      label="Industries"
                      links={industryLinks.map((link) => ({
                        ...link,
                        current: location.pathname === link.href,
                      }))}
                    >
                      Sector-specific context
                    </SiteNavDisclosure>
                  </SiteNavItem>
                  <SiteNavItem>
                    <SiteNavLink current={location.pathname === "/how-we-work"} href="/how-we-work">
                      How we work
                    </SiteNavLink>
                  </SiteNavItem>
                  <SiteNavItem>
                    <SiteNavLink current={location.pathname === "/blog"} href="/blog">
                      Insights
                    </SiteNavLink>
                  </SiteNavItem>
                  <SiteNavItem>
                    <SiteNavLink current={location.pathname === "/about"} href="/about">
                      About
                    </SiteNavLink>
                  </SiteNavItem>
                  <SiteNavItem>
                    <SiteNavLink current={location.pathname === "/book"} href="/book">
                      Book a discovery call
                    </SiteNavLink>
                  </SiteNavItem>
                </SiteNavList>
              </SiteNav>
            </Cluster>
          </div>
        </Container>
        {pendingIndicator}
      </header>
      <main className="flex-1" id="main-content">
        {children}
      </main>
      <footer className="border-t border-border bg-[var(--ss-color-surface-subtle)]">
        <Container>
          <div className="grid gap-4 py-6 text-body-sm text-muted-foreground md:grid-cols-[2fr_1fr_1fr]">
            <div>
              Web, app, content and AI workflow services for UK businesses.
              Content, pricing and assurance remain subject to human approval before
              production publication.
            </div>
            <div className="flex flex-col gap-2">
              <a href="/services">Services</a>
              <a href="/industries">Industries</a>
              <a href="/how-we-work">How we work</a>
              <a href="/blog">Insights</a>
            </div>
            <div className="flex flex-col gap-2">
              <a href="/about">About</a>
              <a href="/book">Book</a>
              <a href="/contact">Contact</a>
              <a href="/privacy-policy">Privacy policy</a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}

export { AppShell };
