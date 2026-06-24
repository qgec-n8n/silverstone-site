import type { ReactNode } from "react";

import { SkipLink } from "~/components/accessibility/skip-link";

import { SiteFooter } from "./shell/site-footer";
import { SiteHeader } from "./shell/site-header";

type AppShellProps = {
  children: ReactNode;
  pendingIndicator?: ReactNode;
};

function AppShell({ children, pendingIndicator }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SkipLink />
      <SiteHeader pendingIndicator={pendingIndicator} />
      <main className="flex-1 pt-[var(--ss-layout-header)]" id="main-content">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

export { AppShell };
