import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
  pendingIndicator?: ReactNode;
};

export function AppShell({ children, pendingIndicator }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        className="sr-only fixed left-4 top-4 rounded-md bg-background px-3 py-2 text-sm font-medium shadow focus:not-sr-only"
        href="#main-content"
      >
        Skip to content
      </a>
      <header className="border-b">
        <div className="mx-auto flex min-h-16 w-full max-w-5xl items-center justify-between px-6">
          <a className="font-semibold" href="/">
            Silverstone
          </a>
          <nav aria-label="Primary">
            <a className="text-sm text-muted-foreground hover:text-foreground" href="/">
              Foundation
            </a>
          </nav>
        </div>
        {pendingIndicator}
      </header>
      <main className="flex-1" id="main-content">
        {children}
      </main>
      <footer className="border-t">
        <div className="mx-auto w-full max-w-5xl px-6 py-6 text-sm text-muted-foreground">
          Staging-only transformation workspace
        </div>
      </footer>
    </div>
  );
}
