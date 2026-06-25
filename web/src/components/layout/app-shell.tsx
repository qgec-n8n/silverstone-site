import type { ReactNode } from "react";
import { useLocation } from "react-router";

import { useAppExperience } from "~/app/experience/app-experience";
import { SkipLink } from "~/components/accessibility/skip-link";
import { cn } from "~/lib/utils";

import { SiteFooter } from "./shell/site-footer";
import { SiteHeader } from "./shell/site-header";

type AppShellProps = {
  children: ReactNode;
  pendingIndicator?: ReactNode;
};

function AppShell({ children, pendingIndicator }: AppShellProps) {
  const location = useLocation();
  const { homepageState } = useAppExperience();
  const homepageChromeVisible = location.pathname !== "/" || homepageState === "body";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SkipLink />
      {homepageChromeVisible ? (
        <SiteHeader pendingIndicator={pendingIndicator} />
      ) : null}
      <main
        className={cn(
          "flex-1",
          homepageChromeVisible ? "pt-[var(--ss-layout-header)]" : "pt-0",
        )}
        id="main-content"
      >
        {children}
      </main>
      {homepageChromeVisible ? <SiteFooter /> : null}
    </div>
  );
}

export { AppShell };
