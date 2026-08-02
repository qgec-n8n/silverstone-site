import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import { AppShell } from "~/app/components/app-shell";
import { LoadingBoundary, LoadingFallback } from "~/app/components/loading-boundary";
import { RouteLoadingIndicator } from "~/app/components/route-loading-indicator";
import { AppExperienceProvider } from "~/app/experience/app-experience";
import { DeepLinkScrollHandler } from "~/app/experience/deep-link-scroll";
import { RoutePreloadHandler } from "~/app/experience/route-preload";
import { CoreSpinLoader } from "~/components/ui/core-spin-loader";
import { CookieConsentManager } from "~/components/layout/shell/cookie-consent-manager";
import { DemosLauncher } from "~/components/layout/shell/demos-launcher";
import { Container } from "~/components/layout/container";
import { PageSection } from "~/components/layout/page-section";
import { Stack } from "~/components/layout/stack";
import { TextLink } from "~/components/ui/text-link";
import {
  GATE_FREE_DEEP_LINKS,
  GATE_FREE_ROUTE_PREFIXES,
  GATE_FREE_ROUTES,
} from "~/data/gate-free-routes";
import { getPublicEnvironment } from "~/lib/environment";
import { AnalyticsScripts } from "~/lib/integrations/analytics";
import { SeoJuiceScripts } from "~/lib/integrations/seojuice";
import { MotionProvider } from "~/motion";
import "./app.css";

/**
 * Global robots meta: staging builds carry a blanket noindex; production
 * builds omit it entirely so each route's own metadata (which emits
 * "index, follow" for production-indexable routes) is authoritative. A
 * malformed environment fails closed to noindex.
 */
function resolveGlobalRobotsMeta(): string | null {
  try {
    const environment = getPublicEnvironment();
    return environment.isStaging ? environment.robotsMeta : null;
  } catch {
    return "noindex,nofollow,noarchive";
  }
}

/*
 * Inlined verbatim into the pre-hydration boot script below, so the gate-free
 * check runs synchronously before first paint — Book must never flash the
 * loader/scroll-lock attributes even for a single frame. Kept in sync with
 * `GATE_FREE_ROUTES` via direct interpolation rather than a duplicated list.
 */
const gateFreeRoutesJson = JSON.stringify(GATE_FREE_ROUTES);
const gateFreeRoutePrefixesJson = JSON.stringify(GATE_FREE_ROUTE_PREFIXES);
/*
 * Same reasoning as above, for the floating demos launcher's deep links: a
 * direct load of a demo's path+hash must never flash the gate either.
 */
const gateFreeDeepLinksJson = JSON.stringify(GATE_FREE_DEEP_LINKS);

export function Layout({ children }: { children: React.ReactNode }) {
  const globalRobotsMeta = resolveGlobalRobotsMeta();

  return (
    <html className="dark" lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta
          content="width=device-width, initial-scale=1, viewport-fit=cover"
          name="viewport"
        />
        {globalRobotsMeta ? <meta content={globalRobotsMeta} name="robots" /> : null}
        <meta content="#05070a" name="theme-color" />
        <link href="/favicon.ico" rel="icon" sizes="48x48" />
        <link href="/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
        <link href="/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
        <link href="/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
        <link href="/site.webmanifest" rel="manifest" />
        <AnalyticsScripts />
        <script
          dangerouslySetInnerHTML={{
            // Set first-paint-safe experience flags before hydration so the
            // loader overlay, the locked-scroll gate and the hidden header are
            // already correct on the very first frame (no flash, no mismatch).
            // The AppExperienceProvider reconciles these after hydration.
            // Gate-free routes set only data-js and stop there — no loader,
            // no scroll lock, no hero/route-intro lock, ever.
            __html: `(function(){var d=document.documentElement;d.setAttribute("data-js","on");var p=location.pathname;var free=${gateFreeRoutesJson}.indexOf(p)!==-1||${gateFreeDeepLinksJson}.indexOf(p+location.hash)!==-1;var prefixes=${gateFreeRoutePrefixesJson};for(var i=0;i<prefixes.length;i++){if(p.indexOf(prefixes[i])===0&&p.length>prefixes[i].length){free=true;break;}}if(free){d.setAttribute("data-gate-free","on");return;}d.setAttribute("data-loader-active","on");d.setAttribute("data-scroll-lock","on");if(p==="/"){d.setAttribute("data-hero-locked","on");d.setAttribute("data-homepage-state","loading");}else{d.setAttribute("data-route-experience-state","loading");}})();`,
          }}
        />
        <Meta />
        <Links />
      </head>
      <body>
        <MotionProvider>
          <AppExperienceProvider>
            <CoreSpinLoader />
            <DeepLinkScrollHandler />
            <RoutePreloadHandler />
            {children}
            <DemosLauncher />
            <CookieConsentManager />
          </AppExperienceProvider>
        </MotionProvider>
        <ScrollRestoration />
        <Scripts />
        <SeoJuiceScripts />
      </body>
    </html>
  );
}

export function HydrateFallback() {
  return (
    <AppShell>
      <LoadingFallback />
    </AppShell>
  );
}

export default function App() {
  return (
    <AppShell pendingIndicator={<RouteLoadingIndicator />}>
      <LoadingBoundary>
        <Outlet />
      </LoadingBoundary>
    </AppShell>
  );
}

export function ErrorBoundary({ error }: { error: unknown }) {
  const isRouteError = isRouteErrorResponse(error);
  const title =
    isRouteError && error.status === 404
      ? "This address doesn't resolve."
      : "Something interrupted this route.";
  const message =
    isRouteError && error.status === 404
      ? "Nothing answers at this address. The homepage links to every live Silverstone system."
      : "The application could not render this route. The homepage is live and monitored.";

  return (
    <AppShell>
      <PageSection spacing="compact">
        <Container>
          <Stack className="max-w-3xl" gap="md">
            <span className="ss-eyebrow font-mono text-muted-foreground">
              {isRouteError && error.status === 404 ? "404" : "Error"} · Route recovery
            </span>
            <h1 className="text-h2">{title}</h1>
            <p className="text-body-lg text-muted-foreground">{message}</p>
            <TextLink href="/">Return to the homepage</TextLink>
          </Stack>
        </Container>
      </PageSection>
    </AppShell>
  );
}
