import type { ReactNode } from "react";

import { Container } from "~/components/layout/container";
import { PageSection } from "~/components/layout/page-section";
import { cn } from "~/lib/utils";

import { Reveal } from "./reveal";

type SectionShellProps = {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  lead?: ReactNode;
  children: ReactNode;
  /** Centre the heading block (used by full-width feature sections). */
  align?: "start" | "center";
  /**
   * Heading measure. `wide` (default) lets display titles span a generous
   * multi-column measure while the lead stays readable; `full` removes the
   * title clamp entirely for hero-scale section openers.
   */
  headingWidth?: "wide" | "full";
  containerSize?: "compact" | "content" | "wide" | "max";
  className?: string;
  headingClassName?: string;
};

/**
 * Standard V2 section scaffold: a revealed heading block (eyebrow + display
 * title + lead) over a content slot. The reveal uses the shared
 * IntersectionObserver hook, so it settles on scroll and resolves immediately
 * under reduced motion.
 */
export function SectionShell({
  id,
  eyebrow,
  title,
  lead,
  children,
  align = "start",
  headingWidth = "wide",
  containerSize = "content",
  className,
  headingClassName,
}: SectionShellProps) {
  const hasHeading = Boolean(eyebrow ?? title ?? lead);

  return (
    <PageSection id={id} className={cn("relative", className)}>
      <Container size={containerSize}>
        {hasHeading ? (
          <Reveal
            className={cn(
              "ss-hv2-section-head flex flex-col gap-4",
              align === "center" && "items-center text-center",
              headingClassName,
            )}
            dataAlign={align}
            dataWidth={headingWidth}
            kind="section"
          >
            <div>
              {eyebrow ? (
                <span className="ss-eyebrow ss-hv2-kicker font-mono">
                  <span className="ss-hv2-kicker__dot" aria-hidden="true" />
                  {eyebrow}
                </span>
              ) : null}
              {title ? (
                <h2 className="ss-hv2-display ss-hv2-section-head__title mt-4 text-4xl sm:text-5xl">
                  {title}
                </h2>
              ) : null}
              {lead ? (
                <p className="ss-lead ss-hv2-section-head__lead mt-4 text-[color:var(--ss-v2-titanium)]">
                  {lead}
                </p>
              ) : null}
            </div>
          </Reveal>
        ) : null}
        {children}
      </Container>
    </PageSection>
  );
}
