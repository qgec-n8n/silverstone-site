import { Suspense, type ReactNode } from "react";

import { Skeleton } from "~/app/components/ui/skeleton";

type LoadingBoundaryProps = {
  children: ReactNode;
};

export function LoadingFallback() {
  return (
    <div
      aria-label="Loading content"
      className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-16"
      role="status"
    >
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-4 w-full max-w-xl" />
      <span className="sr-only">Loading content</span>
    </div>
  );
}

export function LoadingBoundary({ children }: LoadingBoundaryProps) {
  return <Suspense fallback={<LoadingFallback />}>{children}</Suspense>;
}
