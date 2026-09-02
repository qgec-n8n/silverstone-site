/**
 * Typed parser for the approved service copy.
 *
 * The authoritative copy is preserved verbatim in
 * `~/content/services/generated/approved-services.json`. That JSON carries the
 * full public body as a single markdown string (`publicCopy`) plus already
 * structured microcopy (feature/outcome cards, process steps, benchmark).
 *
 * This module converts `publicCopy` into an explicit, typed view model so the
 * services-v2 UI can compose custom editorial layouts instead of dumping raw
 * markdown. It deliberately extracts ONLY public prose — no authoring labels,
 * SEO handoff notes, benchmark disclaimers-as-markdown, or configuration slots
 * ever flow through here.
 */
import type { ApprovedServiceContent } from "~/content/services/approved-services";

export type FaqItem = {
  /** Short accordion label from the approved source (falls back to the question). */
  label: string;
  question: string;
  answer: string[];
};

export type CopySubsection = {
  key: string;
  heading: string;
  paragraphs: string[];
};

export type CopySection = {
  key: string;
  heading: string;
  paragraphs: string[];
  subsections: CopySubsection[];
  /** Trailing single-line *italic* aphorism, if present. */
  pullQuote?: string;
};

export type ServiceViewModel = {
  h1: string;
  introParagraphs: string[];
  /** Text of the in-copy "Primary action" line (e.g. "Book a discovery call"). */
  primaryActionLabel?: string | undefined;
  /** All narrative H2 sections except the FAQ and the final CTA section. */
  sections: CopySection[];
  faq: { heading: string; items: FaqItem[] };
  finalCta: { heading: string; paragraphs: string[]; pullQuote?: string | undefined };
};

function slug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Parse the approved public markdown body into an explicit, typed structure. */
export function parseServiceCopy(publicCopy: string): {
  h1: string;
  introParagraphs: string[];
  primaryActionLabel?: string | undefined;
  sections: CopySection[];
} {
  const lines = publicCopy.replace(/\r\n/g, "\n").split("\n");

  let h1 = "";
  const introParagraphs: string[] = [];
  let primaryActionLabel: string | undefined;
  const sections: CopySection[] = [];
  let current: CopySection | null = null;
  let currentSub: CopySubsection | null = null;
  let buffer: string[] = [];

  const flush = (): void => {
    const text = buffer.join(" ").replace(/\s+/g, " ").trim();
    buffer = [];
    if (!text) {
      return;
    }

    const strongText = /^\*\*(.+?)\*\*$/.exec(text)?.[1];
    const italicText = /^\*(?!\*)(.+?)\*$/.exec(text)?.[1];

    if (!current) {
      if (strongText && /^primary action\s*:/i.test(strongText)) {
        primaryActionLabel = strongText.replace(/^primary action\s*:\s*/i, "").trim();
        return;
      }
      introParagraphs.push(text);
      return;
    }

    if (italicText && !currentSub) {
      current.pullQuote = italicText.trim();
      return;
    }

    const destination = currentSub ? currentSub.paragraphs : current.paragraphs;
    destination.push(text);
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.trim() === "") {
      flush();
      continue;
    }
    if (line.startsWith("# ")) {
      flush();
      h1 = line.slice(2).trim();
      continue;
    }
    if (line.startsWith("## ")) {
      flush();
      const heading = line.slice(3).trim();
      current = { key: slug(heading), heading, paragraphs: [], subsections: [] };
      currentSub = null;
      sections.push(current);
      continue;
    }
    if (line.startsWith("### ")) {
      flush();
      const heading = line.slice(4).trim();
      currentSub = { key: slug(heading), heading, paragraphs: [] };
      if (current) {
        current.subsections.push(currentSub);
      }
      continue;
    }
    if (line.startsWith(">")) {
      // Markdown blockquote in the body is always the benchmark disclaimer,
      // which we render from the canonical source — never as inline prose.
      flush();
      continue;
    }
    buffer.push(line.trim());
  }
  flush();

  return { h1, introParagraphs, primaryActionLabel, sections };
}

/** Build the full services-v2 view model from an approved service record. */
export function buildServiceViewModel(
  content: ApprovedServiceContent,
): ServiceViewModel {
  const parsed = parseServiceCopy(content.publicCopy);
  const faqLabels = content.componentMicrocopy.faqLabels;

  const faqIndex = parsed.sections.findIndex((section) =>
    /^questions\b/i.test(section.heading),
  );
  const ctaIndex = parsed.sections.length - 1;

  const faqSection = faqIndex >= 0 ? parsed.sections[faqIndex] : undefined;
  const faqItems: FaqItem[] = (faqSection?.subsections ?? []).map(
    (subsection, index) => ({
      label: faqLabels[index] ?? subsection.heading,
      question: subsection.heading,
      answer: subsection.paragraphs,
    }),
  );

  const ctaSection = parsed.sections[ctaIndex];

  const narrativeSections = parsed.sections.filter(
    (_, index) => index !== faqIndex && index !== ctaIndex,
  );

  return {
    h1: parsed.h1 || content.metadata.h1,
    introParagraphs: parsed.introParagraphs,
    primaryActionLabel:
      parsed.primaryActionLabel ?? content.componentMicrocopy.ctaButton,
    sections: narrativeSections,
    faq: {
      heading: faqSection?.heading ?? "Questions serious buyers ask",
      items: faqItems,
    },
    finalCta: {
      heading: ctaSection?.heading ?? "",
      paragraphs: ctaSection?.paragraphs ?? [],
      pullQuote: ctaSection?.pullQuote,
    },
  };
}

/** Pick a narrative section by matching a fragment of its heading (case-insensitive). */
export function findSection(
  sections: CopySection[],
  fragment: string,
): CopySection | undefined {
  const needle = fragment.toLowerCase();
  return sections.find((section) => section.heading.toLowerCase().includes(needle));
}
