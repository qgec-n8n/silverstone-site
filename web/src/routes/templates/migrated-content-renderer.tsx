import { Fragment } from "react";

import { Stack } from "~/components/layout/stack";
import { TextLink } from "~/components/ui/text-link";
import type {
  InlineSegment,
  MigratedContentBlock,
  MigratedContentRecord,
} from "~/content/migrated/schema";

const headingElements = {
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
} as const;

function InlineSegments({ segments }: { segments: InlineSegment[] }) {
  return segments.map((segment, index) => {
    if (segment.type === "text" || !segment.valid) {
      return (
        <Fragment key={index}>
          {segment.type === "text" ? segment.value : segment.text}
        </Fragment>
      );
    }

    return (
      <TextLink
        href={segment.href}
        key={index}
        {...(segment.external ? { rel: "noopener noreferrer", target: "_blank" } : {})}
      >
        {segment.text}
      </TextLink>
    );
  });
}

function ContentBlock({
  block,
  content,
}: {
  block: MigratedContentBlock;
  content: MigratedContentRecord;
}) {
  if (block.type === "heading") {
    const Heading = headingElements[block.level];
    return (
      <Heading className={block.level === 2 ? "text-h3" : "text-h5"}>
        {block.text}
      </Heading>
    );
  }

  if (block.type === "paragraph") {
    return (
      <p className="text-body-lg text-muted-foreground">
        <InlineSegments segments={block.segments} />
      </p>
    );
  }

  if (block.type === "list") {
    const List = block.ordered ? "ol" : "ul";
    return (
      <List className="grid list-inside list-disc gap-2 text-body-lg text-muted-foreground">
        {block.items.map((item, index) => (
          <li key={index}>
            <InlineSegments segments={item.segments} />
          </li>
        ))}
      </List>
    );
  }

  if (block.type === "image") {
    const asset = content.assets.find((candidate) => candidate.id === block.assetId);
    if (!asset) {
      return null;
    }
    return (
      <figure>
        <img
          alt={asset.altCandidate}
          className="h-auto w-full rounded-[var(--ss-radius-lg)]"
          decoding="async"
          height={asset.height}
          loading="lazy"
          src={asset.publicPath}
          width={asset.width}
        />
      </figure>
    );
  }

  if (block.type === "quote") {
    return (
      <blockquote className="border-l-2 border-border pl-5 text-body-lg text-muted-foreground">
        <InlineSegments segments={block.segments} />
      </blockquote>
    );
  }

  if (block.type === "table") {
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-body-sm">
          {block.headers.length > 0 ? (
            <thead>
              <tr>
                {block.headers.map((header) => (
                  <th className="border-b border-border p-3" key={header}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
          ) : null}
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td className="border-b border-border p-3" key={cellIndex}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const interaction = content.interactions.find(
    (candidate) => candidate.id === block.interactionId,
  );
  if (!interaction || interaction.fields.length === 0) {
    return null;
  }
  return (
    <dl className="grid gap-3" data-interaction-active="false">
      {interaction.fields.map((field) => (
        <div key={`${interaction.id}-${field.name}`}>
          <dt className="font-medium text-foreground">{field.label || field.name}</dt>
          {field.placeholder ? (
            <dd className="text-body-sm text-muted-foreground">{field.placeholder}</dd>
          ) : null}
        </div>
      ))}
    </dl>
  );
}

export function MigratedContentRenderer({
  content,
}: {
  content: MigratedContentRecord;
}) {
  return (
    <Stack gap="xl">
      {content.sections.map((section) => (
        <section data-source-selector={section.sourceSelector} key={section.order}>
          <Stack gap="lg">
            {section.blocks.map((block) => (
              <ContentBlock block={block} content={content} key={block.order} />
            ))}
          </Stack>
        </section>
      ))}
    </Stack>
  );
}
