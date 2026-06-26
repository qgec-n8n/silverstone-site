import { useId, useMemo, useRef, useState } from "react";

import "~/styles/visual/visual.css";

import { useReducedMotion } from "~/components/accessibility/use-reduced-motion";

export type ToolEntry = {
  name: string;
  category: string;
  note: string;
};

export type ToolsCarouselProps = {
  label: string;
  tools: ToolEntry[];
};

const ALL = "All";

/**
 * The "Connector Constellation" tools rail. Native horizontal scroll (no
 * autoplay, no cloning, no nested scroll), category filters, prev/next group
 * scroll and a live status line. Categories are framed as compatibility
 * categories — never as confirmed live integrations.
 */
export function ToolsCarousel({ label, tools }: ToolsCarouselProps) {
  const { reducedMotion } = useReducedMotion();
  const railRef = useRef<HTMLUListElement | null>(null);
  const [active, setActive] = useState(ALL);
  const headingId = useId();

  const categories = useMemo(() => {
    const unique = new Set<string>();
    for (const tool of tools) {
      unique.add(tool.category);
    }
    return [ALL, ...unique];
  }, [tools]);

  const visible = useMemo(() => {
    if (active === ALL) {
      return tools;
    }
    return tools.filter((tool) => tool.category === active);
  }, [active, tools]);

  const scrollByGroup = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (rail === null) {
      return;
    }
    rail.scrollBy({
      left: direction * Math.round(rail.clientWidth * 0.8),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  const scope =
    active === ALL
      ? `all ${String(visible.length)}`
      : `${String(visible.length)} ${active}`;
  const status = `Showing ${scope} tools. Compatibility categories, not confirmed live integrations.`;

  return (
    <section className="ss-tools" data-tools="" aria-labelledby={headingId}>
      <div className="ss-tools__head">
        <h3 className="ss-tools__title" id={headingId}>
          {label}
        </h3>
        <div className="ss-tools__nav">
          <button
            type="button"
            className="ss-tools__arrow"
            data-tools-prev=""
            aria-label="Scroll tools backward"
            onClick={() => {
              scrollByGroup(-1);
            }}
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            type="button"
            className="ss-tools__arrow"
            data-tools-next=""
            aria-label="Scroll tools forward"
            onClick={() => {
              scrollByGroup(1);
            }}
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </div>

      <div
        className="ss-tools__filters"
        role="group"
        aria-label="Filter tools by category"
      >
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={
              category === active ? "ss-tools__filter is-active" : "ss-tools__filter"
            }
            data-tools-filter={category}
            aria-pressed={category === active}
            onClick={() => {
              setActive(category);
            }}
          >
            {category}
          </button>
        ))}
      </div>

      <ul
        className="ss-tools__rail"
        data-tools-rail=""
        ref={railRef}
        tabIndex={0}
        role="list"
        aria-label="Compatible tool categories"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            scrollByGroup(1);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            scrollByGroup(-1);
          }
        }}
      >
        {visible.map((tool) => (
          <li
            className="ss-tool-card"
            data-category={tool.category}
            key={`${tool.category}-${tool.name}`}
          >
            <span className="ss-tool-card__category">{tool.category}</span>
            <span className="ss-tool-card__name">{tool.name}</span>
            <span className="ss-tool-card__note">{tool.note}</span>
          </li>
        ))}
      </ul>

      <p
        className="ss-tools__status"
        data-tools-status=""
        role="status"
        aria-live="polite"
      >
        {status}
      </p>
    </section>
  );
}
