import { Button } from "~/app/components/ui/button";
import { Skeleton } from "~/app/components/ui/skeleton";
import { getPublicEnvironment } from "~/lib/environment";
import { buildMetadata } from "~/seo/metadata";

export function meta() {
  const environment = getPublicEnvironment();
  return buildMetadata({
    canonicalOrigin: environment.canonicalOrigin,
    description: "Development-only component verification route.",
    includeRobots: false,
    path: "/__components",
    title: "Component lab | Silverstone staging",
  });
}

export default function ComponentLab() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold">Component lab</h1>
        <p className="text-muted-foreground">
          Development-only primitives and loading states.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button>Primary action</Button>
        <Button variant="outline">Secondary action</Button>
      </div>
      <div className="flex max-w-md flex-col gap-3" aria-label="Skeleton example">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-full" />
      </div>
    </section>
  );
}
