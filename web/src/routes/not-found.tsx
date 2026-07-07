import { Link } from "react-router";

import { Container } from "~/components/layout/container";
import { PageSection } from "~/components/layout/page-section";
import { Stack } from "~/components/layout/stack";
import { Button } from "~/components/ui/button";
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
                <span className="ss-eyebrow font-mono text-muted-foreground">
                  404 · Signal not found
                </span>
                <h1 className="text-h2">Back to a live route.</h1>
                <p className="text-body-lg text-muted-foreground">
                  Nothing answers at this address, but every system below is live and
                  monitored — pick the route that matches what you came for.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Button asChild size="lg" variant="accent" className="ss-btn-signal">
                    <Link to="/">Return to the homepage</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link to="/services">Explore the services</Link>
                  </Button>
                  <Button asChild size="lg" variant="ghost">
                    <Link to="/book#booking-calendar">Book a discovery call</Link>
                  </Button>
                </div>
              </Stack>
            </RevealSection>
          </Container>
        </PageSection>
      </PageEntry>
    </RouteExperienceFrame>
  );
}
