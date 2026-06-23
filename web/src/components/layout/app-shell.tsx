import type { ReactNode } from "react";

import { SkipLink } from "~/components/accessibility/skip-link";
import { Cluster } from "~/components/layout/cluster";
import { Container } from "~/components/layout/container";
import {
  SiteNav,
  SiteNavItem,
  SiteNavLink,
  SiteNavList,
} from "~/components/layout/site-nav";

type AppShellProps = {
  children: ReactNode;
  pendingIndicator?: ReactNode;
};

function AppShell({ children, pendingIndicator }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SkipLink />
      <header className="sticky top-0 z-[400] border-b border-border bg-background/95 backdrop-blur">
        <Container>
          <div className="flex min-h-20 items-center justify-between gap-4">
            <Cluster className="min-w-0" gap="md">
              <a
                className="ss-focus-ring rounded-[var(--ss-radius-pill)] px-1 py-1 font-display text-h6 tracking-[var(--ss-type-track-heading)] text-foreground no-underline"
                href="/"
              >
                Silverstone
              </a>
              <SiteNav>
                <SiteNavList>
                  <SiteNavItem>
                    <SiteNavLink current href="/">
                      Foundation
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
          <div className="py-6 text-body-sm text-muted-foreground">
            Staging-only transformation workspace
          </div>
        </Container>
      </footer>
    </div>
  );
}

export { AppShell };
