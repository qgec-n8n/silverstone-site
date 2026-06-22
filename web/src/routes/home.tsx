import { getPublicEnvironment } from "~/lib/environment";
import { buildMetadata } from "~/seo/metadata";
import { buildOrganizationSchema } from "~/seo/schema";

export function meta() {
  const environment = getPublicEnvironment();
  return buildMetadata({
    canonicalOrigin: environment.canonicalOrigin,
    description:
      "A staging-only React, Vite, and TypeScript foundation for the Silverstone transformation.",
    includeRobots: false,
    path: "/",
    title: "Silverstone web foundation",
  });
}

export default function Home() {
  const organizationSchema = buildOrganizationSchema({
    name: "Silverstone AI",
    url: "https://silverstone-ai.com",
  });

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-16 sm:py-24">
      <div className="flex max-w-2xl flex-col gap-4">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Silverstone web foundation
        </h1>
        <p className="text-lg leading-8 text-muted-foreground">
          This non-indexable staging application establishes routing, safety,
          accessibility, testing, and integration boundaries. Legacy page content has
          not been migrated.
        </p>
      </div>
      <dl className="grid max-w-2xl gap-4 border-t pt-6 sm:grid-cols-2">
        <div>
          <dt className="text-sm font-medium">Environment</dt>
          <dd className="text-sm text-muted-foreground">Staging only</dd>
        </div>
        <div>
          <dt className="text-sm font-medium">External side effects</dt>
          <dd className="text-sm text-muted-foreground">Disabled or mocked</dd>
        </div>
      </dl>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        type="application/ld+json"
      />
    </section>
  );
}
