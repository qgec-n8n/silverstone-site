import type { MigratedContentRecord } from "~/content/migrated";
import type { FutureRouteRecord } from "~/data/route-schema";
import { RoutePageFrame } from "~/routes/templates/route-page-frame";
import { Stack } from "~/components/layout/stack";
import { TextLink } from "~/components/ui/text-link";

type ArticlePageProps = {
  content?: MigratedContentRecord | null;
  route: FutureRouteRecord;
};

export function ArticlePage({ content = null, route }: ArticlePageProps) {
  const articleUnderReview =
    route.template === "article" &&
    content &&
    !content.flags.claimsStatus.startsWith("safe-copy");

  const safeRoute = articleUnderReview
    ? {
        ...route,
        description:
          "This guide is being updated to align with current evidence, provenance and approval requirements.",
        h1: "Guide under editorial review",
      }
    : route;

  return (
    <RoutePageFrame content={articleUnderReview ? null : content} eyebrow="Guide" route={safeRoute}>
      {articleUnderReview ? (
        <Stack className="max-w-3xl" gap="md">
          <p className="text-body-lg text-muted-foreground">
            The original article content is temporarily withheld while claim evidence,
            source provenance or duplication decisions are being reviewed.
          </p>
          <p className="text-body-lg text-muted-foreground">
            Use the related service and industry pages below, or{" "}
            <TextLink href="/book">book a discovery call</TextLink> if you want to
            discuss the workflow in scope rather than wait for the article review.
          </p>
        </Stack>
      ) : null}
    </RoutePageFrame>
  );
}
