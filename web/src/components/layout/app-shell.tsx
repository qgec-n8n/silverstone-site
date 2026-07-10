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
  const { homepageState, routeIntroLocked } = useAppExperience();
  const previousPathRef = useRef(location.pathname);
  usePageInView();

  const chromeVisible =
    (location.pathname !== "/" || homepageState === "body") && !routeIntroLocked;

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
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <SkipLink />
      {chromeVisible ? <SiteHeader pendingIndicator={pendingIndicator} /> : null}
      <main
        className={cn(
          "flex-1 outline-none",
          /*
           * The header is `fixed` at every breakpoint (see SiteHeader), so it
           * is out of flow and the main content compensates with top padding
           * equal to the header height. Mobile used to run a `sticky` header
           * (which occupies flow, needing no padding), but sticky + an animated
           * hide/show transform visibly flickered against iOS Safari's dynamic
           * URL-bar resize; `fixed` is immune (the bar only changes viewport
           * height, never its top edge — visualViewport.offsetTop stays 0).
           */
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
