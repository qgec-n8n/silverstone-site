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
import { CoreSpinLoader } from "~/components/vendor/silverstone/core-spin-loader";
import { Container } from "~/components/layout/container";
import { PageSection } from "~/components/layout/page-section";
import { Stack } from "~/components/layout/stack";
import { TextLink } from "~/components/ui/text-link";
import "./app.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html className="dark" lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content="noindex,nofollow,noarchive" name="robots" />
        <script
          dangerouslySetInnerHTML={{
            // Set first-paint-safe experience flags before hydration so the
            // loader overlay, the locked-scroll gate and the hidden header are
            // already correct on the very first frame (no flash, no mismatch).
            // The AppExperienceProvider reconciles these after hydration.
            __html:
              '(function(){var d=document.documentElement;d.setAttribute("data-js","on");d.setAttribute("data-loader-active","on");d.setAttribute("data-scroll-lock","on");if(location.pathname==="/"){d.setAttribute("data-hero-locked","on");d.setAttribute("data-homepage-state","loading");}})();',
          }}
        />
        <Meta />
        <Links />
      </head>
      <body>
        <AppExperienceProvider>
          <CoreSpinLoader />
          {children}
        </AppExperienceProvider>
        <ScrollRestoration />
        <Scripts />
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
    isRouteError && error.status === 404 ? "Page not found" : "Application error";
  const message =
    isRouteError && error.status === 404
      ? "The requested staging route does not exist."
      : "The staging application could not render this route.";

  return (
    <AppShell>
      <PageSection spacing="compact">
        <Container>
          <Stack className="max-w-3xl" gap="md">
            <h1 className="text-h2">{title}</h1>
            <p className="text-body-lg text-muted-foreground">{message}</p>
            <TextLink href="/">Return to the foundation</TextLink>
          </Stack>
        </Container>
      </PageSection>
    </AppShell>
  );
}
