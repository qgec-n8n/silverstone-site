import type { ReactNode } from "react";
import { Link } from "react-router";

import { ArrowUpRight } from "~/components/icons/lucide";
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
import type { MigratedContentRecord } from "~/content/migrated";
import { Reveal } from "~/features/services-v2/components/primitives";
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
   * custom body (e.g. services-v2) can own the single visible H1. Schema and
   * layout are preserved.
   */
  showHeader?: boolean;
  /**
   * When false, this frame's own breadcrumb bar is suppressed because the
   * custom body renders its own route-integrated breadcrumb trail (see
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
                          <BreadcrumbLink asChild>
                            <Link to={breadcrumb.path}>{breadcrumb.name}</Link>
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

            {/* Migrated blocks each carry their own scheduled reveal (see
                MigratedContentRenderer), so no outer RevealSection here —
                wrapping them again would hide the whole article until the
                wrapper fired and defeat the per-block cascade. */}
            {content ? <MigratedContentRenderer content={content} /> : null}

            {showRelated && relatedRoutes.length > 0 ? (
              <nav aria-label="Related pages" className="ss-hairline-t pt-8">
                <Stack gap="sm">
                  <Reveal kind="pill">
                    <span className="ss-eyebrow font-mono text-muted-foreground">
                      Continue reading
                    </span>
                  </Reveal>
                  <Reveal kind="section" delayMs={120}>
                    <h2 className="text-h5">Related pages</h2>
                  </Reveal>
                  <ul className="mt-2 grid gap-4 md:grid-cols-2">
                    {relatedRoutes.map((relatedRoute, index) => (
                      <li key={relatedRoute.id}>
                        <Reveal kind="card" delayMs={index * 110} className="h-full">
                          <Link
                            to={relatedRoute.path}
                            className="group flex h-full items-center justify-between gap-4 rounded-[var(--ss-radius-lg)] border border-border bg-card/40 px-5 py-4 no-underline transition-colors hover:border-[color:var(--ss-v2-signal-cyan)] hover:bg-card/70"
                          >
                            <span className="flex flex-col gap-1">
                              <span className="ss-eyebrow font-mono text-[10px] text-muted-foreground">
                                {relatedRoute.routeGroup.replace("-", " ")}
                              </span>
                              <span className="font-semibold text-foreground">
                                {relatedRoute.title}
                              </span>
                            </span>
                            <ArrowUpRight
                              aria-hidden="true"
                              className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[color:var(--ss-v2-signal-cyan)]"
                            />
                          </Link>
                        </Reveal>
                      </li>
                    ))}
                  </ul>
                </Stack>
              </nav>
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
