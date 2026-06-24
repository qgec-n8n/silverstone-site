import { Suspense, type ReactNode } from "react";

import { Container } from "~/components/layout/container";
import { PageSection } from "~/components/layout/page-section";

type LoadingBoundaryProps = {
  children: ReactNode;
};

export function LoadingFallback() {
  return (
    <PageSection spacing="compact">
      <Container aria-live="polite" role="status">
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-6 text-center">
          <div className="ss-emblem-loader">
            <span aria-hidden="true" className="ss-emblem-loader__ring" />
            <img
              alt=""
              aria-hidden="true"
              className="ss-emblem-loader__emblem"
              src="/brand/silverstone-emblem.png"
            />
          </div>
          <p className="ss-eyebrow text-titanium">Calibrating</p>
          <span className="sr-only">Loading content</span>
        </div>
      </Container>
    </PageSection>
  );
}

export function LoadingBoundary({ children }: LoadingBoundaryProps) {
  return <Suspense fallback={<LoadingFallback />}>{children}</Suspense>;
}
