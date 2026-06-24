import type { ReactNode } from "react";

import { SkipLink } from "~/components/accessibility/skip-link";
import { SiteFooter } from "~/components/layout/site-footer";
import { SiteHeader } from "~/components/layout/site-header";

type AppShellProps = {
  children: ReactNode;
  pendingIndicator?: ReactNode;
};

function AppShell({ children, pendingIndicator }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SkipLink />
      <SiteHeader />
      <main className="flex-1" id="main-content">
        {children}
      </main>
      <SiteFooter />
      {pendingIndicator}
    </div>
  );
}

export { AppShell };
