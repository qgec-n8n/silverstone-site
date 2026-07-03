import type { ReactNode } from "react";

import { Container } from "~/components/layout/container";
import { PageSection } from "~/components/layout/page-section";
import { Stack } from "~/components/layout/stack";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { TextLink } from "~/components/ui/text-link";
import type { MigratedContentRecord } from "~/content/migrated";
import { futureRouteManifest } from "~/data/future-routes";
import type { FutureRouteRecord } from "~/data/route-schema";
import { getRouteExperienceByPath } from "~/data/route-experiences";
import { MigratedContentRenderer } from "~/routes/templates/migrated-content-renderer";
import { RouteExperienceFrame } from "~/routes/templates/route-experience-frame";
import { buildRouteSchemaGraph, serializeJsonLd } from "~/seo/schema";
import { PageEntry } from "~/visual/components/page-entry";
import { RevealSection } from "~/visual/components/reveal-section";

type RoutePageFrameProps = {
  children?: ReactNode;
  content: MigratedContentRecord | null;
  emitSchema?: boolean;
  eyebrow: string;
  entryExperience?: boolean;
  route: FutureRouteRecord;
  showRelated?: boolean;
  /**
   * When false, the default eyebrow + H1 + description header is suppressed so a
   * bespoke body (e.g. services-v2) can own the single visible H1. Schema and
   * layout are preserved.
   */
  showHeader?: boolean;
  /**
   * When false, this frame's own breadcrumb bar is suppressed because the
   * bespoke body renders its own route-integrated breadcrumb trail (see
   * `SecondaryHero`) styled to match its hero rhythm instead.
   */
  showBreadcrumbs?: boolean;
  /**
   * When true, skip the Aether intro / expandable-hero gate entirely and
   * render straight to the particle body — for gate-free routes (Book) that
   * must be immediately usable, including on a direct link from another page.
   */
  skipIntro?: boolean;
};

export function RoutePageFrame({
  children,
  content,
  emitSchema = true,
  eyebrow,
  entryExperience = true,
  route,
  showRelated = true,
  showHeader = true,
  showBreadcrumbs = true,
  skipIntro = false,
}: RoutePageFrameProps) {
  const routeById = new Map(
    futureRouteManifest.map((candidate) => [candidate.id, candidate]),
  );
  const relatedRoutes = route.relatedRouteIds.flatMap((routeId) => {
    const relatedRoute = routeById.get(routeId);
    return relatedRoute ? [relatedRoute] : [];
  });
  const schema = buildRouteSchemaGraph(route);
  const motionEnabled = route.path !== "/";

  const page = (
    <PageEntry enabled={motionEnabled}>
      <PageSection
        data-content-id={route.contentId}
        data-source-file={route.sourceFile}
      >
        <Container>
          <Stack gap="xl">
            {showBreadcrumbs ? (
              <Breadcrumb>
                <BreadcrumbList>
                  {route.breadcrumbs.flatMap((breadcrumb, index) => {
                    const current = index === route.breadcrumbs.length - 1;
                    return [
                      ...(index > 0
                        ? [<BreadcrumbSeparator key={`${breadcrumb.path}-separator`} />]
                        : []),
                      <BreadcrumbItem key={breadcrumb.path}>
                        {current ? (
                          <BreadcrumbPage>{breadcrumb.name}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={breadcrumb.path}>
                            {breadcrumb.name}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>,
                    ];
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            ) : null}

            {showHeader ? (
              <RevealSection enabled={motionEnabled}>
                <Stack className="max-w-4xl" gap="lg">
                  <span className="ss-eyebrow text-muted-foreground">{eyebrow}</span>
                  <h1 className="text-h1">{route.h1}</h1>
                  <p className="ss-lead text-muted-foreground">{route.description}</p>
                </Stack>
              </RevealSection>
            ) : null}

            {children ? (
              <RevealSection enabled={motionEnabled}>{children}</RevealSection>
            ) : null}

            {content ? (
              <RevealSection enabled={motionEnabled}>
                <MigratedContentRenderer content={content} />
              </RevealSection>
            ) : null}

            {showRelated && relatedRoutes.length > 0 ? (
              <RevealSection enabled={motionEnabled}>
                <nav aria-label="Related pages">
                  <Stack gap="sm">
                    <h2 className="text-h5">Related pages</h2>
                    <ul className="grid gap-3 md:grid-cols-2">
                      {relatedRoutes.map((relatedRoute) => (
                        <li key={relatedRoute.id}>
                          <TextLink href={relatedRoute.path}>
                            {relatedRoute.title}
                          </TextLink>
                        </li>
                      ))}
                    </ul>
                  </Stack>
                </nav>
              </RevealSection>
            ) : null}
          </Stack>
          {emitSchema ? (
            <script
              dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
              type="application/ld+json"
            />
          ) : null}
        </Container>
      </PageSection>
    </PageEntry>
  );

  return (
    <RouteExperienceFrame
      enabled={entryExperience && route.path !== "/"}
      experience={getRouteExperienceByPath(route.path)}
      skipIntro={skipIntro}
    >
      {page}
    </RouteExperienceFrame>
  );
}
