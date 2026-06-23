import { Suspense, type ReactNode } from "react";

import { Skeleton } from "~/app/components/ui/skeleton";
import { Container } from "~/components/layout/container";
import { PageSection } from "~/components/layout/page-section";
import { Stack } from "~/components/layout/stack";

type LoadingBoundaryProps = {
  children: ReactNode;
};

export function LoadingFallback() {
  return (
    <PageSection spacing="compact">
      <Container aria-label="Loading content" role="status">
        <Stack className="max-w-3xl" gap="md">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-5 w-full max-w-xl" />
          <span className="sr-only">Loading content</span>
        </Stack>
      </Container>
    </PageSection>
  );
}

export function LoadingBoundary({ children }: LoadingBoundaryProps) {
  return <Suspense fallback={<LoadingFallback />}>{children}</Suspense>;
}
