import { getPublicEnvironment } from "~/lib/environment";
import { buildMetadata } from "~/seo/metadata";
import { buildOrganizationSchema, serializeJsonLd } from "~/seo/schema";
import { Cluster } from "~/components/layout/cluster";
import { Container } from "~/components/layout/container";
import { PageSection } from "~/components/layout/page-section";
import { Stack } from "~/components/layout/stack";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { StatusMessage } from "~/components/ui/status-message";

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
    <PageSection spacing="hero">
      <Container>
        <Stack gap="xl">
          <Stack className="max-w-3xl" gap="lg">
            <span className="ss-eyebrow text-muted-foreground">Foundation</span>
            <h1 className="text-h1">Silverstone web foundation</h1>
            <p className="ss-lead text-muted-foreground">
              This non-indexable staging application establishes routing, safety,
              accessibility, testing, and reusable design-system boundaries. Legacy page
              content has not been migrated.
            </p>
          </Stack>
          <StatusMessage
            description="Search indexing remains disabled and external integrations stay mocked in this branch."
            title="Staging safety remains active"
            tone="info"
          />
          <Cluster className="items-stretch" gap="md">
            <Card className="min-w-[18rem] flex-1">
              <CardHeader>
                <CardTitle>Environment</CardTitle>
                <CardDescription>
                  Execution boundary for the transformation.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-body-sm text-muted-foreground">
                Staging only
              </CardContent>
            </Card>
            <Card className="min-w-[18rem] flex-1">
              <CardHeader>
                <CardTitle>External side effects</CardTitle>
                <CardDescription>
                  Production integrations remain outside this workstream.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-body-sm text-muted-foreground">
                Disabled or mocked
              </CardContent>
            </Card>
          </Cluster>
        </Stack>
        <script
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationSchema) }}
          type="application/ld+json"
        />
      </Container>
    </PageSection>
  );
}
