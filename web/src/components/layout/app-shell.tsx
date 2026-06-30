import { useEffect, useRef, type ReactNode } from "react";
import { useLocation } from "react-router";

import { useAppExperience } from "~/app/experience/app-experience";
import { SkipLink } from "~/components/accessibility/skip-link";
import { cn } from "~/lib/utils";
import { usePageInView } from "~/motion";

import { SiteFooter } from "./shell/site-footer";
import { SiteHeader } from "./shell/site-header";

type AppShellProps = {
  children: ReactNode;
  pendingIndicator?: ReactNode;
};

function AppShell({ children, pendingIndicator }: AppShellProps) {
  const location = useLocation();
  const { homepageState, serviceIntroLocked } = useAppExperience();
  const previousPathRef = useRef(location.pathname);
  usePageInView();

  const chromeVisible =
    (location.pathname !== "/" || homepageState === "body") && !serviceIntroLocked;

  useEffect(() => {
    if (previousPathRef.current === location.pathname) {
      return;
    }

    previousPathRef.current = location.pathname;
    window.requestAnimationFrame(() => {
      document.getElementById("main-content")?.focus({ preventScroll: true });
    });
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SkipLink />
      {chromeVisible ? <SiteHeader pendingIndicator={pendingIndicator} /> : null}
      <main
        className={cn(
          "flex-1 outline-none",
          chromeVisible ? "pt-[var(--ss-layout-header)]" : "pt-0",
        )}
        id="main-content"
        tabIndex={-1}
      >
        {children}
      </main>
      {chromeVisible ? <SiteFooter /> : null}
    </div>
  );
}

export { AppShell };
