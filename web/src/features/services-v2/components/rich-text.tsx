/**
 * `RichText`: the small inline markdown subset the approved copy is authored
 * in, shared by services, industries, core pages and articles.
 *
 * Split out of `./primitives` for the same reason as `./reveal` — rendering a
 * line of copy should not pull that module’s Motion dependency tail into the
 * importing chunk. `./primitives` re-exports it, so existing imports are
 * unchanged.
 */
import type { ReactNode } from "react";

import {
  CheckCircle2Icon,
  Sparkles,
  TriangleAlertIcon,
  Zap,
} from "~/components/icons/lucide";
import { MoneyPair } from "~/components/ui/money";

/**
 * Render approved inline copy with the small markdown subset used in the source
 * (`**bold**`, `*italic*`, `` `code` ``, `==mark==`,
 * `{{underline:text}}`, `{{accent:text}}`, and `{{chip:kind|label}}`). No
 * block-level markdown, nesting or raw HTML.
 * `[[£3,000|$3,900]]` is a currency pair (see ~/data/currency); the reader
 * sees the side matching their display currency, crawlers see both.
 *
 * `*italic*` doubles as the site's established gradient-emphasis marker: CSS
 * scoped to hero titles, section headings and CTA titles (see
 * `.ss-srv2-hero__title em` and siblings) renders it as a color sweep, while
 * the same token in body prose renders as a plain accent tint — one markdown
 * token, context-appropriate color, no separate syntax to remember.
 */
export function RichText({ text }: { text: string }): ReactNode {
  const nodes: ReactNode[] = [];
  const pattern =
    /(\[\[[^[\]|]+\|[^[\]|]+\]\]|\*\*[^*]+\*\*|(?<!\*)\*[^*]+\*(?!\*)|`[^`]+`|(?<!=)==[^=]+==(?![=])|\{\{(?:underline|accent):[^{}]+\}\}|\{\{chip:(?:action|idea|proof|warning)\|[^{}|]+\}\})/g;
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("[[")) {
      // `[[£3,000|$3,900]]` — a currency pair from ~/data/currency, shown one
      // side at a time by the display-currency rules; see MoneyPair.
      const [gbp = "", usd = ""] = token.slice(2, -2).split("|", 2);
      nodes.push(<MoneyPair gbp={gbp} key={key++} usd={usd} />);
    } else if (token.startsWith("**")) {
      nodes.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("`")) {
      nodes.push(<code key={key++}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith("==")) {
      nodes.push(
        <mark className="ss-rich-text__mark" key={key++}>
          {token.slice(2, -2)}
        </mark>,
      );
    } else if (token.startsWith("{{underline:")) {
      nodes.push(
        <u className="ss-rich-text__underline" key={key++}>
          {token.slice(12, -2)}
        </u>,
      );
    } else if (token.startsWith("{{accent:")) {
      nodes.push(
        <span className="ss-rich-text__accent" key={key++}>
          {token.slice(9, -2)}
        </span>,
      );
    } else if (token.startsWith("{{chip:")) {
      const [kind = "idea", label = ""] = token.slice(7, -2).split("|", 2);
      const ChipIcon =
        kind === "proof"
          ? CheckCircle2Icon
          : kind === "action"
            ? Zap
            : kind === "warning"
              ? TriangleAlertIcon
              : Sparkles;
      nodes.push(
        <span className="ss-rich-text__chip" data-kind={kind} key={key++}>
          <ChipIcon aria-hidden="true" />
          {label}
        </span>,
      );
    } else {
      nodes.push(<em key={key++}>{token.slice(1, -1)}</em>);
    }
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}
