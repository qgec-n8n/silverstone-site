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
import "./app.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content="noindex,nofollow,noarchive" name="robots" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
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
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-16">
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="max-w-xl text-muted-foreground">{message}</p>
        <a className="font-medium underline underline-offset-4" href="/">
          Return to the foundation
        </a>
      </section>
    </AppShell>
  );
}
