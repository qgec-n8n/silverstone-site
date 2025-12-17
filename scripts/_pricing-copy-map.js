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

const REQUIRED_PAGE_IDS = [
  "services.html",
  "niches/dentists.html",
  "niches/ecommerce.html",
  "niches/estate-agents.html",
  "niches/fitness-coaches.html",
  "niches/gyms-fitness-studios.html",
  "niches/hospitality.html",
  "niches/physios-chiropractors.html",
  "niches/salons-barbers.html",
  "niches/trades-virtual-office.html",
];

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
  /** @type {"row1Title" | "row1Plans" | "row2Title" | "row2Cards" | null} */
  let section = null;
  /** @type {null | {name: string, badge?: string, setupFee?: number, monthlyRetainer?: number, bestFor?: string, includes: string[]}} */
  let currentPlan = null;
  /** @type {null | {label: string, plansIncluded: string[], oneLiner?: string}} */
  let currentCard = null;
  let planIncludesMode = false;
  let cardPlansMode = false;

  function ensurePage(pid) {
    if (!pages[pid]) {
      pages[pid] = {
        pageId: pid,
        row1: { title: null, subtitle: null, plans: [] },
        row2: { title: null, subtitle: null, cards: [] },
      };
    }
    return pages[pid];
  }

  function resetModes() {
    planIncludesMode = false;
    cardPlansMode = false;
  }

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();

    const pageMatch = trimmed.match(/^##\s+(\S+\.html)\b/);
    if (pageMatch) {
      pageId = pageMatch[1];
      section = null;
      currentPlan = null;
      currentCard = null;
      resetModes();
      ensurePage(pageId);
      continue;
    }

    if (!pageId) continue; // ignore preamble

    // Section headers
    if (/^###\s+Row\s+1\s+title/i.test(trimmed)) {
      section = "row1Title";
      currentPlan = null;
      currentCard = null;
      resetModes();
      continue;
    }
    if (/^###\s+Row\s+1\b/i.test(trimmed) && !/^###\s+Row\s+1\s+title/i.test(trimmed)) {
      section = "row1Plans";
      currentPlan = null;
      currentCard = null;
      resetModes();
      continue;
    }
    if (/^###\s+Row\s+2\s+title/i.test(trimmed)) {
      section = "row2Title";
      currentPlan = null;
      currentCard = null;
      resetModes();
      continue;
    }
    if (/^###\s+Row\s+2\b/i.test(trimmed) && !/^###\s+Row\s+2\s+title/i.test(trimmed)) {
      section = "row2Cards";
      currentPlan = null;
      currentCard = null;
      resetModes();
      continue;
    }

    if (!trimmed) {
      // blank lines terminate list modes
      resetModes();
      continue;
    }

    // Titles (Row 1 + Row 2)
    if (section === "row1Title" || section === "row2Title") {
      const titleMatch = trimmed.match(/^\*\*(.+)\*\*$/);
      const subtitleMatch = trimmed.match(/^_Subtitle:\s*(.+)_$/i);
      if (titleMatch) {
        const value = titleMatch[1].trim();
        if (section === "row1Title") ensurePage(pageId).row1.title = value;
        if (section === "row2Title") ensurePage(pageId).row2.title = value;
        continue;
      }
      if (subtitleMatch) {
        const value = subtitleMatch[1].trim();
        if (section === "row1Title") ensurePage(pageId).row1.subtitle = value;
        if (section === "row2Title") ensurePage(pageId).row2.subtitle = value;
        continue;
      }
      continue;
    }

    // Row 1 plans (highlighted)
    if (section === "row1Plans") {
      const planMatch = trimmed.match(/^\*\s*\*\*Plan name:\*\*\s*(.+)$/i);
      if (planMatch) {
        const p = { name: planMatch[1].trim(), includes: [] };
        ensurePage(pageId).row1.plans.push(p);
        currentPlan = p;
        resetModes();
        continue;
      }

      if (!currentPlan) continue;

      if (planIncludesMode && /^- /.test(trimmed)) {
        currentPlan.includes.push(trimmed.replace(/^- /, "").trim());
        continue;
      }

      const normalized = trimmed.replace(/^[*-]\s+/, "");

      const setupMatch = normalized.match(/^\*\*Setup fee:\*\*\s*(.+)$/i);
      if (setupMatch) {
        currentPlan.setupFee = parseGbpAmountToNumber(setupMatch[1]);
        continue;
      }

      const monthlyMatch = normalized.match(/^\*\*Monthly retainer:\*\*\s*(.+)$/i);
      if (monthlyMatch) {
        currentPlan.monthlyRetainer = parseGbpAmountToNumber(monthlyMatch[1]);
        continue;
      }

      const bestForMatch = normalized.match(/^\*\*Best for:\*\*\s*(.+)$/i);
      if (bestForMatch) {
        currentPlan.bestFor = bestForMatch[1].trim();
        continue;
      }

      const badgeMatch = normalized.match(/^\*\*Badge:\*\*\s*(.+)$/i);
      if (badgeMatch) {
        currentPlan.badge = badgeMatch[1].trim();
        continue;
      }

      if (/^\*\*What[’']s included:\*\*/i.test(normalized)) {
        planIncludesMode = true;
        continue;
      }
      continue;
    }

    // Row 2 cards (other options)
    if (section === "row2Cards") {
      const cardMatch = trimmed.match(/^\*\s*\*\*Plan group label:\*\*\s*(.+)$/i);
      if (cardMatch) {
        const c = { label: cardMatch[1].trim(), plansIncluded: [] };
        ensurePage(pageId).row2.cards.push(c);
        currentCard = c;
        resetModes();
        continue;
      }

      if (!currentCard) continue;

      if (cardPlansMode && /^- /.test(trimmed)) {
        currentCard.plansIncluded.push(trimmed.replace(/^- /, "").trim());
        continue;
      }

      const normalized = trimmed.replace(/^[*-]\s+/, "");

      if (/^\*\*Plans included:\*\*/i.test(normalized)) {
        const after = normalized.replace(/^\*\*Plans included:\*\*\s*/i, "");
        if (after) {
          currentCard.plansIncluded.push(after.trim());
        }
        cardPlansMode = true;
        continue;
      }

      const oneLinerMatch = normalized.match(/^\*\*One-liner:\*\*\s*(.+)$/i);
      if (oneLinerMatch) {
        currentCard.oneLiner = oneLinerMatch[1].trim();
        resetModes();
        continue;
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
  REQUIRED_PAGE_IDS,
};
