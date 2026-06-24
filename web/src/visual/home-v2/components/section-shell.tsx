import type { ReactNode } from "react";

import { Container } from "~/components/layout/container";
import { PageSection } from "~/components/layout/page-section";
import { cn } from "~/lib/utils";
import { useSectionReveal } from "~/visual/hooks/use-section-reveal";

type SectionShellProps = {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  lead?: ReactNode;
  children: ReactNode;
  /** Centre the heading block (used by full-width feature sections). */
  align?: "start" | "center";
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
  containerSize = "content",
  className,
  headingClassName,
}: SectionShellProps) {
  const { ref, revealed } = useSectionReveal();
  const hasHeading = Boolean(eyebrow ?? title ?? lead);

  return (
    <PageSection id={id} className={cn("relative", className)}>
      <Container size={containerSize}>
        {hasHeading ? (
          <div
            ref={ref}
            data-revealed={revealed}
            className={cn(
              "ss-hv2-reveal flex max-w-(--ss-type-measure-heading) flex-col gap-4",
              align === "center" && "mx-auto items-center text-center",
              headingClassName,
            )}
          >
            {eyebrow ? (
              <span className="ss-eyebrow ss-hv2-kicker font-mono">
                <span className="ss-hv2-kicker__dot" aria-hidden="true" />
                {eyebrow}
              </span>
            ) : null}
            {title ? (
              <h2 className="ss-hv2-display text-4xl sm:text-5xl">{title}</h2>
            ) : null}
            {lead ? (
              <p className="ss-lead text-[color:var(--ss-v2-titanium)]">{lead}</p>
            ) : null}
          </div>
        ) : null}
        {children}
      </Container>
    </PageSection>
  );
}
