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

  const isHome = location.pathname === "/";
  const chromeVisible = (!isHome || homepageState === "body") && !routeIntroLocked;
  /*
   * The footer is ALWAYS mounted — never gated on `chromeVisible`.
   *
   * Every gated route prerenders in its "loading" state, so a footer gated on
   * chrome visibility is simply absent from the static document. That cost the
   * homepage every internal link it had, and left the 23 other gated routes
   * (both hubs, all service and industry pages, the company pages) carrying
   * only the handful of links inside their own body copy. The footer is the
   * site's canonical link graph, so it must be in the HTML on every page.
   *
   * `hidden` keeps the live experience identical: inert + aria-hidden here,
   * and experience-gate.css drops it from layout while a loader or intro owns
   * the screen, so those routes stay the single non-scrollable viewport their
   * intros promise. Gate-free routes (blog articles, /book) are unaffected —
   * they already rendered it.
   */

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
      <SiteFooter hidden={!chromeVisible} />
    </div>
  );
}

export { AppShell };
