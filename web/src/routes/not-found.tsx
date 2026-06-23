import { Container } from "~/components/layout/container";
import { PageSection } from "~/components/layout/page-section";
import { Stack } from "~/components/layout/stack";
import { TextLink } from "~/components/ui/text-link";

export default function NotFoundRoute() {
  return (
    <PageSection spacing="compact">
      <Container>
        <Stack className="max-w-3xl" gap="md">
          <h1 className="text-h2">Page not found</h1>
          <p className="text-body-lg text-muted-foreground">
            The requested staging route does not exist.
          </p>
          <TextLink href="/">Return to the homepage</TextLink>
        </Stack>
      </Container>
    </PageSection>
  );
}
