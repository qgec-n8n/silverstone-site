import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const repoRoot = new URL("../../", import.meta.url).pathname;
const docsDir = join(repoRoot, "docs/approved-copy/services");
const outputDir = join(repoRoot, "web/src/content/services/generated");
const reportDir = join(repoRoot, "docs/approved-copy/services");

const routeFiles = [
  ["01_WEB_DESIGN_AND_DEVELOPMENT.md", "/services/web-design-development", "webDesignDevelopment"],
  ["02_APP_DEVELOPMENT.md", "/services/app-development", "appDevelopment"],
  ["03_AI_VOICE_AGENTS.md", "/services/ai-voice-agents", "aiVoiceAgents"],
  ["04_AI_RECEPTIONISTS.md", "/services/ai-receptionists", "aiReceptionists"],
  ["05_CONTENT_CREATION.md", "/services/content-creation", "contentCreation"],
  ["06_AI_AUTOMATION.md", "/services/ai-automation", "aiAutomation"],
  ["07_AI_AND_AUTOMATION_CONSULTING.md", "/services/ai-consulting", "aiConsulting"],
];

function hash(text) {
  return createHash("sha256").update(text).digest("hex");
}

function section(text, from, to) {
  const start = text.indexOf(from);
  if (start === -1) {
    throw new Error(`Missing section ${from}`);
  }
  const bodyStart = start + from.length;
  const end = to ? text.indexOf(to, bodyStart) : text.length;
  return text.slice(bodyStart, end === -1 ? text.length : end).trim();
}

function bulletValue(markdown, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`^- \\*\\*${escaped}:\\*\\*\\s*(.+)$`, "m");
  return markdown.match(pattern)?.[1]?.trim() ?? "";
}

function h2List(markdown) {
  return [...markdown.matchAll(/^##\s+(.+)$/gm)].map((match) => match[1].trim());
}

function h3List(markdown) {
  return [...markdown.matchAll(/^###\s+(.+)$/gm)].map((match) => match[1].trim());
}

function h1(markdown) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? "";
}

function markdownBullets(markdown, sectionHeading) {
  const block = section(markdown, `### ${sectionHeading}`, "\n### ");
  return [...block.matchAll(/^- \*\*(.+?):\*\*\s+(.+)$/gm)].map((match) => ({
    label: match[1].trim(),
    body: match[2].trim(),
  }));
}

function numberedItems(markdown, sectionHeading) {
  const block = section(markdown, `### ${sectionHeading}`, "\n### ");
  return [...block.matchAll(/^\d+\.\s+\*\*(.+?):?\*\*\s+—\s+(.+)$/gm)].map(
    (match) => ({
      label: match[1].trim(),
      body: match[2].trim(),
    }),
  );
}

function extractDemoSlots(markdown) {
  return [...markdown.matchAll(/- \*\*Configuration slot:\*\* `([^`]+)`/g)].map(
    (match) => match[1],
  );
}

function extractBenchmarks(markdown) {
  const metrics = [...markdown.matchAll(/- \*\*Metric \d+:\*\*\s+(.+)$/gm)].map(
    (match) => match[1].trim(),
  );
  const caption = bulletValue(markdown, "Caption");
  return { metrics, caption };
}

function parseRouteFile(filename, route, exportName) {
  const sourcePath = join(docsDir, filename);
  const raw = readFileSync(sourcePath, "utf8");
  const metadata = section(
    raw,
    "## 2. SEO metadata and search handoff",
    "## 3. CoreSpin Loader copy",
  );
  const loader = section(raw, "## 3. CoreSpin Loader copy", "## 4. Aether Flow route-entry hero")
    .replace(/^\*\*|\.\*\*$/g, "")
    .trim();
  const entry = section(raw, "## 4. Aether Flow route-entry hero", "## 5. Complete public page copy");
  const publicCopy = section(raw, "## 5. Complete public page copy", "## 6. Complete component microcopy");
  const microcopy = section(raw, "## 6. Complete component microcopy", "## 7. Required demo-placeholder copy");
  const demo = section(raw, "## 7. Required demo-placeholder copy", "## 8. Non-public implementation appendix");
  const benchmark = extractBenchmarks(microcopy);

  return {
    exportName,
    value: {
      route,
      sourceFilename: filename,
      sourcePath: `docs/approved-copy/services/${filename}`,
      sourceSha256: hash(raw),
      metadata: {
        title: bulletValue(metadata, "Preferred SEO title"),
        metaDescription: bulletValue(metadata, "Meta description"),
        openGraphTitle: bulletValue(metadata, "Open Graph title"),
        openGraphDescription: bulletValue(metadata, "Open Graph description"),
        canonicalRoute: bulletValue(metadata, "Canonical route"),
        h1: bulletValue(metadata, "H1"),
        h2: h2List(section(metadata, "### H2 structure", "### H3 structure")).filter(
          (item) => !item.startsWith("H2 structure"),
        ),
        h3: h3List(publicCopy),
        breadcrumbs: section(
          metadata,
          "### Breadcrumb labels",
          "### Internal-link targets and natural anchors",
        )
          .replace(/`/g, "")
          .trim(),
        schemaTypes: [...section(metadata, "### Recommended schema types", "### Image-alt guidance").matchAll(/`([^`]+)`/g)].map(
          (match) => match[1],
        ),
      },
      routeEntry: {
        loaderText: loader,
        pill: bulletValue(entry, "Pill"),
        title: bulletValue(entry, "Title"),
        subtitle: bulletValue(entry, "Subtitle"),
        buttonLabel: bulletValue(entry, "Route-entry button"),
      },
      publicCopy,
      publicHeadings: {
        h1: h1(publicCopy),
        h2: h2List(publicCopy),
        h3: h3List(publicCopy),
      },
      componentMicrocopy: {
        rawMarkdown: microcopy,
        featureCards: markdownBullets(microcopy, "Feature cards"),
        outcomeCards: markdownBullets(microcopy, "Outcome cards"),
        processSteps: numberedItems(microcopy, "Process steps"),
        benchmark,
        ctaButton: bulletValue(section(microcopy, "### CTA blocks", "### Labels and notes"), "Button"),
        finalReassurance: bulletValue(
          section(microcopy, "### CTA blocks", "### Labels and notes"),
          "Final reassurance",
        ),
        faqLabels: section(microcopy, "### FAQ accordion labels", "### CTA blocks")
          .split("\n")
          .map((line) => line.replace(/^- /, "").trim())
          .filter(Boolean),
      },
      demo: {
        rawMarkdown: demo,
        configSlots: extractDemoSlots(demo),
      },
      acceptance: {
        distinctivePhrases: [
          h1(publicCopy),
          h2List(publicCopy)[0],
          h3List(publicCopy)[0],
          benchmark.metrics[0],
          bulletValue(entry, "Title"),
        ].filter(Boolean),
        faqCount: h3List(publicCopy).filter((heading) => heading.endsWith("?")).length,
      },
    },
  };
}

mkdirSync(outputDir, { recursive: true });

const records = routeFiles.map(([filename, route, exportName]) =>
  parseRouteFile(filename, route, exportName),
);
const data = Object.fromEntries(records.map((record) => [record.value.route, record.value]));

writeFileSync(
  join(outputDir, "approved-services.json"),
  `${JSON.stringify(data, null, 2)}\n`,
);

const allMarkdown = readdirSync(docsDir)
  .filter((filename) => filename.endsWith(".md"))
  .sort()
  .map((filename) => {
    const filePath = join(docsDir, filename);
    return { filename, sha: hash(readFileSync(filePath, "utf8")) };
  });

writeFileSync(
  join(reportDir, "SOURCE_SHA256_MANIFEST.md"),
  [
    "# Approved Services Source SHA-256 Manifest",
    "",
    "| File | SHA-256 |",
    "|---|---|",
    ...allMarkdown.map((item) => `| \`${item.filename}\` | \`${item.sha}\` |`),
    "",
  ].join("\n"),
);

writeFileSync(
  join(reportDir, "COPY_FIDELITY_REPORT.md"),
  [
    "# Services Copy Fidelity Report",
    "",
    "| Route | Source | SHA-256 | Rendered H1 | CoreSpin line | Aether button | FAQ count | Benchmarks | Demo slots | Canonical |",
    "|---|---|---|---|---|---|---:|---|---|---|",
    ...Object.values(data).map((item) =>
      [
        item.route,
        `\`${basename(item.sourceFilename)}\``,
        `\`${item.sourceSha256}\``,
        item.metadata.h1,
        item.routeEntry.loaderText,
        item.routeEntry.buttonLabel,
        item.acceptance.faqCount,
        item.componentMicrocopy.benchmark.metrics.join("<br>"),
        item.demo.configSlots.map((slot) => `\`${slot}\``).join("<br>") || "deterministic module",
        item.metadata.canonicalRoute,
      ].join(" | "),
    ).map((row) => `| ${row} |`),
    "",
  ].join("\n"),
);

console.log(`Generated ${records.length} approved service records.`);
