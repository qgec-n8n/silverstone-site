// FILE: scripts/_pricing-copy-map.js
/**
 * Deterministic parser for PRICING_COPY_MAP.md.
 *
 * This is intentionally strict: it enforces the structure described in
 * codex/PRICING_COPY_MAP_SPEC.md so the UI mapping cannot “guess”.
 *
 * Exported helpers are used by validation scripts (and can be reused by build generators).
 */

const fs = require("fs");
const path = require("path");

function readPricingCopyMap(repoRoot) {
  const filePath = path.join(repoRoot, "PRICING_COPY_MAP.md");
  return fs.readFileSync(filePath, "utf8");
}

function extractPageIds(markdown) {
  const pageIds = [];
  const re = /^##\s+(\S+\.html)\b/mg;
  let m;
  while ((m = re.exec(markdown)) !== null) {
    pageIds.push(m[1]);
  }
  return pageIds;
}

function parseGbpAmountToNumber(line) {
  // Accept "£995", "£1,995", "£450/mo"
  const m = line.match(/£\s*([\d,]+(?:\.\d+)?)/);
  if (!m) return null;
  const n = Number(String(m[1]).replace(/,/g, ""));
  if (!Number.isFinite(n)) return null;
  return n;
}

function isHeading(line) {
  return /^#{2,6}\s+/.test(line.trim());
}

function parsePricingCopyMap(markdown) {
  const lines = markdown.split(/\r?\n/);

  /** @type {Record<string, any>} */
  const pages = {};

  let pageId = null;
  let section = null; // "row1" | "row2" | null

  /** @type {null | {name: string, badge?: string, setupFee?: number, monthlyRetainer?: number, bestFor?: string, includes: string[]}} */
  let currentPlan = null;
  /** @type {null | {label: string, plansIncluded: string[], oneLiner?: string}} */
  let currentCard = null;

  let mode = null; // "row1Title" | "row2Title" | "planIncludes" | "cardPlans" | null

  function ensurePage() {
    if (!pageId) return null;
    if (!pages[pageId]) {
      pages[pageId] = {
        pageId,
        row1: { title: null, subtitle: null, plans: [] },
        row2: { title: null, subtitle: null, cards: [] },
      };
    }
    return pages[pageId];
  }

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();

    // New page block
    const pageMatch = line.match(/^##\s+(\S+\.html)\b/);
    if (pageMatch) {
      pageId = pageMatch[1];
      section = null;
      currentPlan = null;
      currentCard = null;
      mode = null;
      ensurePage();
      continue;
    }

    if (!pageId) continue; // ignore preamble

    // Section headers
    if (line === "### Row 1") {
      section = "row1";
      currentPlan = null;
      currentCard = null;
      mode = null;
      continue;
    }
    if (line === "### Row 2") {
      section = "row2";
      currentPlan = null;
      currentCard = null;
      mode = null;
      continue;
    }

    // Row titles
    if (line === "#### Row 1 Title") {
      mode = "row1Title";
      continue;
    }
    if (line === "#### Row 2 Title") {
      mode = "row2Title";
      continue;
    }

    // Plan heading
    const planMatch = line.match(/^####\s+Plan\s+\d+\s+—\s+(.+)$/);
    if (planMatch) {
      const p = { name: planMatch[1].trim(), includes: [] };
      ensurePage().row1.plans.push(p);
      currentPlan = p;
      currentCard = null;
      mode = null;
      continue;
    }

    // Card heading
    const cardMatch = line.match(/^####\s+Card\s+\d+\s+—\s+(.+)$/);
    if (cardMatch) {
      const c = { label: cardMatch[1].trim(), plansIncluded: [] };
      ensurePage().row2.cards.push(c);
      currentCard = c;
      currentPlan = null;
      mode = null;
      continue;
    }

    // If we hit a new heading, cancel list modes
    if (isHeading(line)) {
      if (mode === "planIncludes" || mode === "cardPlans") mode = null;
    }

    // Title parsing
    if (mode === "row1Title" || mode === "row2Title") {
      const titleMatch = line.match(/^-+\s+Title:\s+(.+)$/);
      const subMatch = line.match(/^-+\s+Subtitle:\s+(.+)$/);
      if (titleMatch) {
        if (mode === "row1Title") ensurePage().row1.title = titleMatch[1].trim();
        if (mode === "row2Title") ensurePage().row2.title = titleMatch[1].trim();
        continue;
      }
      if (subMatch) {
        if (mode === "row1Title") ensurePage().row1.subtitle = subMatch[1].trim();
        if (mode === "row2Title") ensurePage().row2.subtitle = subMatch[1].trim();
        continue;
      }
      // End of the title block if we hit blank line
      if (!line) {
        mode = null;
      }
      continue;
    }

    // Plan field parsing
    if (currentPlan) {
      if (/^Setup Fee\b/i.test(line)) {
        const n = parseGbpAmountToNumber(line);
        currentPlan.setupFee = n;
        continue;
      }
      if (/^Monthly Retainer\b/i.test(line)) {
        const n = parseGbpAmountToNumber(line);
        currentPlan.monthlyRetainer = n;
        continue;
      }
      if (/^Badge:\s*/i.test(line)) {
        currentPlan.badge = line.replace(/^Badge:\s*/i, "").trim();
        continue;
      }
      if (/^Best for:\s*/i.test(line)) {
        currentPlan.bestFor = line.replace(/^Best for:\s*/i, "").trim();
        continue;
      }
      if (/^What.?s included:\s*$/i.test(line)) {
        mode = "planIncludes";
        continue;
      }
      if (mode === "planIncludes") {
        if (!line) {
          mode = null;
          continue;
        }
        if (line.startsWith("- ")) {
          currentPlan.includes.push(line.replace(/^- /, "").trim());
          continue;
        }
        // Stop includes if any other content encountered
        if (!line.startsWith("- ")) mode = null;
      }
    }

    // Card field parsing
    if (currentCard) {
      if (/^Plans included:\s*$/i.test(line)) {
        mode = "cardPlans";
        continue;
      }
      if (/^One-liner:\s*/i.test(line)) {
        currentCard.oneLiner = line.replace(/^One-liner:\s*/i, "").trim();
        mode = null;
        continue;
      }
      if (mode === "cardPlans") {
        if (!line) {
          mode = null;
          continue;
        }
        if (line.startsWith("- ")) {
          currentCard.plansIncluded.push(line.replace(/^- /, "").trim());
          continue;
        }
        // Stop plans list if content changes
        if (!line.startsWith("- ")) mode = null;
      }
    }
  }

  return pages;
}

function validateParsedCopy(pages, expectedPageIds) {
  /** @type {string[]} */
  const errors = [];

  const pageIds = Object.keys(pages);

  for (const expected of expectedPageIds) {
    if (!pages[expected]) errors.push(`Missing page block for: ${expected}`);
  }

  for (const pid of pageIds) {
    const page = pages[pid];

    if (!page.row1?.title) errors.push(`[${pid}] Missing Row 1 title`);
    if (!page.row1?.subtitle) errors.push(`[${pid}] Missing Row 1 subtitle`);
    if (!page.row2?.title) errors.push(`[${pid}] Missing Row 2 title`);
    if (!page.row2?.subtitle) errors.push(`[${pid}] Missing Row 2 subtitle`);

    if (!Array.isArray(page.row1?.plans) || page.row1.plans.length !== 3) {
      errors.push(`[${pid}] Row 1 must have exactly 3 plans`);
    }
    if (!Array.isArray(page.row2?.cards) || page.row2.cards.length !== 3) {
      errors.push(`[${pid}] Row 2 must have exactly 3 cards`);
    }

    for (const [idx, plan] of (page.row1?.plans || []).entries()) {
      const label = `[${pid}] Row 1 plan ${idx + 1}`;
      if (!plan?.name) errors.push(`${label} missing name`);
      if (!Number.isFinite(plan?.setupFee)) errors.push(`${label} missing/invalid setupFee`);
      if (!Number.isFinite(plan?.monthlyRetainer)) errors.push(`${label} missing/invalid monthlyRetainer`);
      if (!plan?.bestFor) errors.push(`${label} missing bestFor`);
      if (!Array.isArray(plan?.includes) || plan.includes.length < 1) errors.push(`${label} missing includes list`);
    }

    for (const [idx, card] of (page.row2?.cards || []).entries()) {
      const label = `[${pid}] Row 2 card ${idx + 1}`;
      if (!card?.label) errors.push(`${label} missing label`);
      if (!Array.isArray(card?.plansIncluded) || card.plansIncluded.length < 1) errors.push(`${label} missing plansIncluded list`);
      if (!card?.oneLiner) errors.push(`${label} missing oneLiner`);
    }
  }

  return errors;
}

module.exports = {
  readPricingCopyMap,
  extractPageIds,
  parsePricingCopyMap,
  validateParsedCopy,
};
