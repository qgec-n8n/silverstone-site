import { Container } from "~/components/layout/container";
import { PageSection } from "~/components/layout/page-section";
import { Stack } from "~/components/layout/stack";
import { TextLink } from "~/components/ui/text-link";
import { notFoundRouteExperience } from "~/data/route-experiences";
import { RouteExperienceFrame } from "~/routes/templates/route-experience-frame";
import { PageEntry } from "~/visual/components/page-entry";
import { RevealSection } from "~/visual/components/reveal-section";

export default function NotFoundRoute() {
  return (
    <RouteExperienceFrame experience={notFoundRouteExperience}>
      <PageEntry>
        <PageSection spacing="compact">
          <Container>
            <RevealSection>
              <Stack className="max-w-3xl" gap="md">
                <h1 className="text-h2">Page not found</h1>
                <p className="text-body-lg text-muted-foreground">
                  The requested staging route does not exist.
                </p>
                <TextLink href="/">Return to the homepage</TextLink>
              </Stack>
            </RevealSection>
          </Container>
        </PageSection>
      </PageEntry>
    </RouteExperienceFrame>
  );
}
