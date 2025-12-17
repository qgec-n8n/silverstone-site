// FILE: scripts/validate-pricing-copy-map.js

/**
 * Validate PRICING_COPY_MAP.md is complete + machine-parseable.
 *
 * This script is intentionally dependency-free (no markdown parsers) so it can run in any
 * environment where Node runs.
 *
 * Usage:
 *   node scripts/validate-pricing-copy-map.js
 *   node scripts/validate-pricing-copy-map.js --print-json
 *   node scripts/validate-pricing-copy-map.js --json-out path/to/file.json
 */

const fs = require('fs');
const path = require('path');

const { TARGET_PAGES } = require('./pricing.constants');

const REPO_ROOT = path.join(__dirname, '..');
const COPY_MAP_PATH = path.join(REPO_ROOT, 'PRICING_COPY_MAP.md');

function parseArgs(argv) {
  const args = {
    printJson: false,
    jsonOut: null,
  };

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--print-json') args.printJson = true;
    else if (a === '--json-out') {
      const next = argv[i + 1];
      if (!next) throw new Error('Missing value for --json-out');
      args.jsonOut = next;
      i++;
    } else {
      throw new Error(`Unknown arg: ${a}`);
    }
  }
  return args;
}

function fail(message, context = {}) {
  const ctxParts = [];
  if (typeof context.line === 'number') ctxParts.push(`line ${context.line + 1}`);
  if (context.page) ctxParts.push(`page=${context.page}`);
  if (context.section) ctxParts.push(`section=${context.section}`);
  if (context.card) ctxParts.push(`card=${context.card}`);
  const ctx = ctxParts.length ? ` (${ctxParts.join(', ')})` : '';
  throw new Error(`${message}${ctx}`);
}

function stripWrappingEmphasis(s) {
  // Removes a single layer of wrapping emphasis markers like **...**, _..._, *...*
  let out = s.trim();

  if (out.startsWith('**') && out.endsWith('**') && out.length >= 4) out = out.slice(2, -2).trim();
  if (out.startsWith('_') && out.endsWith('_') && out.length >= 2) out = out.slice(1, -1).trim();
  if (out.startsWith('*') && out.endsWith('*') && out.length >= 2) out = out.slice(1, -1).trim();

  return out.trim();
}

function parseCurrencyToInt(value, ctx) {
  // Accept formats like "£1299", "£1,299", "1299", "1,299"
  const digits = value.replace(/[^\d]/g, '');
  if (!digits) fail(`Expected currency/number value, got: ${JSON.stringify(value)}`, ctx);
  return Number.parseInt(digits, 10);
}

function isHeading(line, level) {
  const prefix = '#'.repeat(level) + ' ';
  return line.startsWith(prefix);
}

function nextNonEmpty(lines, startIdx) {
  for (let i = startIdx; i < lines.length; i++) {
    if (lines[i].trim() !== '') return { idx: i, line: lines[i] };
  }
  return null;
}

function parseTitleSubtitle(lines, startIdx, ctx) {
  const titleLine = nextNonEmpty(lines, startIdx);
  if (!titleLine) fail('Missing title line', ctx);
  const titleMatch = titleLine.line.trim().match(/^\*\*(.+?)\*\*\s*$/);
  if (!titleMatch) fail('Expected bold title line like **Title**', { ...ctx, line: titleLine.idx });

  const subtitleLine = nextNonEmpty(lines, titleLine.idx + 1);
  if (!subtitleLine) fail('Missing subtitle line', ctx);
  // Format is `_Subtitle: ..._` (or `*Subtitle: ...*`)
  const subtitleMatch = subtitleLine.line.trim().match(/^[_*]Subtitle:\s*(.+?)[_*]\s*$/);
  if (!subtitleMatch) fail('Expected italic subtitle line like _Subtitle: ..._', { ...ctx, line: subtitleLine.idx });

  return {
    title: titleMatch[1].trim(),
    subtitle: subtitleMatch[1].trim(),
    nextIdx: subtitleLine.idx + 1,
  };
}

function normalizeLabelKey(lineTrimmed) {
  return lineTrimmed.replace(/\s+/g, ' ').trim().toLowerCase();
}

function parseSection1Plans(lines, startIdx, stopLinePredicate, pageKey) {
  const plans = [];
  let currentPlan = null;
  let inIncludes = false;

  function finalizePlan(finalLineIdx) {
    if (!currentPlan) return;
    const ctx = { page: pageKey, section: '1' };

    if (!currentPlan.name) fail('Section 1: missing plan name', ctx);
    if (typeof currentPlan.setupFee !== 'number') fail('Section 1: missing setup fee', { ...ctx, card: currentPlan.name });
    if (typeof currentPlan.monthlyRetainer !== 'number') fail('Section 1: missing monthly retainer', { ...ctx, card: currentPlan.name });
    if (!currentPlan.bestFor) fail('Section 1: missing best for', { ...ctx, card: currentPlan.name });
    if (!Array.isArray(currentPlan.includes) || currentPlan.includes.length < 1) {
      fail('Section 1: missing includes list', { ...ctx, card: currentPlan.name, line: finalLineIdx });
    }

    plans.push(currentPlan);
    currentPlan = null;
    inIncludes = false;
  }

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i];
    if (stopLinePredicate(line)) {
      finalizePlan(i);
      return { plans, nextIdx: i };
    }

    const trimmed = line.trim();
    if (!trimmed) {
      // Blank line ends includes block.
      inIncludes = false;
      continue;
    }

    const planStart = trimmed.match(/^\*\s+\*\*Plan name:\*\*\s*(.+?)\s*$/i);
    if (planStart) {
      finalizePlan(i);
      currentPlan = {
        name: planStart[1].trim(),
        setupFee: null,
        monthlyRetainer: null,
        bestFor: '',
        includes: [],
        badge: null,
      };
      continue;
    }

    if (!currentPlan) continue; // ignore lines until first plan start

    const setupMatch = trimmed.match(/^\*\*Setup fee:\*\*\s*(.+?)\s*$/i);
    if (setupMatch) {
      currentPlan.setupFee = parseCurrencyToInt(setupMatch[1], { page: pageKey, section: '1', card: currentPlan.name, line: i });
      continue;
    }

    const monthlyMatch = trimmed.match(/^\*\*Monthly retainer:\*\*\s*(.+?)\s*$/i);
    if (monthlyMatch) {
      currentPlan.monthlyRetainer = parseCurrencyToInt(monthlyMatch[1], { page: pageKey, section: '1', card: currentPlan.name, line: i });
      continue;
    }

    const bestForMatch = trimmed.match(/^\*\*Best for:\*\*\s*(.+?)\s*$/i);
    if (bestForMatch) {
      currentPlan.bestFor = bestForMatch[1].trim();
      continue;
    }

    const includesHeader = normalizeLabelKey(trimmed).match(/^\*\*what[’']s included:\*\*$/i);
    if (includesHeader) {
      inIncludes = true;
      continue;
    }

    const badgeMatch = trimmed.match(/^\*\*Badge:\*\*\s*(.+?)\s*$/i);
    if (badgeMatch) {
      currentPlan.badge = badgeMatch[1].trim();
      continue;
    }

    if (inIncludes) {
      // bullets are `- item`
      const bullet = trimmed.match(/^-+\s+(.+?)\s*$/);
      if (bullet) {
        currentPlan.includes.push(stripWrappingEmphasis(bullet[1]));
      } else {
        // If we’re in includes and see a non-bullet line, stop includes mode (but don't fail).
        inIncludes = false;
      }
    }
  }

  finalizePlan(lines.length - 1);
  return { plans, nextIdx: lines.length };
}

function parseSection2Groups(lines, startIdx, stopLinePredicate, pageKey) {
  const groups = [];
  let currentGroup = null;
  let inPlans = false;

  function finalizeGroup(finalLineIdx) {
    if (!currentGroup) return;
    const ctx = { page: pageKey, section: '2' };

    if (!currentGroup.groupLabel) fail('Section 2: missing group label', ctx);
    if (!currentGroup.oneLiner) fail('Section 2: missing one-liner', { ...ctx, card: currentGroup.groupLabel });
    if (!Array.isArray(currentGroup.plans) || currentGroup.plans.length < 1) {
      fail('Section 2: missing plans list', { ...ctx, card: currentGroup.groupLabel, line: finalLineIdx });
    }

    groups.push(currentGroup);
    currentGroup = null;
    inPlans = false;
  }

  function pushPlanLine(text) {
    const t = text.trim();
    if (!t) return;

    // Category + inline item: **Dentists:** Plan name...
    const catInline = t.match(/^\*\*(.+?):\*\*\s*(.+?)\s*$/);
    if (catInline) {
      currentGroup.plans.push({ kind: 'category', text: catInline[1].trim() });
      currentGroup.plans.push({ kind: 'item', text: catInline[2].trim() });
      return;
    }

    // Category only: **Real Estate:**
    const catOnly = t.match(/^\*\*(.+?):\*\*\s*$/);
    if (catOnly) {
      currentGroup.plans.push({ kind: 'category', text: catOnly[1].trim() });
      return;
    }

    currentGroup.plans.push({ kind: 'item', text: stripWrappingEmphasis(t) });
  }

  function parseInlinePlansList(text) {
    // Inline list is comma-separated.
    // Preserve exact wording per segment; we only trim outer whitespace.
    const parts = text
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);
    for (const p of parts) pushPlanLine(p);
  }

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i];
    if (stopLinePredicate(line)) {
      finalizeGroup(i);
      return { groups, nextIdx: i };
    }

    const trimmed = line.trim();
    if (!trimmed) {
      // Blank line ends plan capture.
      inPlans = false;
      continue;
    }

    const groupStart = trimmed.match(/^\*\s+\*\*Plan group label:\*\*\s*(.+?)\s*$/i);
    if (groupStart) {
      finalizeGroup(i);
      currentGroup = {
        groupLabel: groupStart[1].trim(),
        oneLiner: '',
        plans: [],
      };
      continue;
    }

    if (!currentGroup) continue;

    const oneLinerMatch = trimmed.match(/^\*\*One-liner:\*\*\s*(.+?)\s*$/i);
    if (oneLinerMatch) {
      currentGroup.oneLiner = oneLinerMatch[1].trim();
      continue;
    }

    const plansMatch = trimmed.match(/^(?:\*\*)?Plans:(?:\*\*)?\s*(.*)$/i);
    if (plansMatch && trimmed.toLowerCase().includes('plans:')) {
      // Handles both `**Plans:**` and `Plans:` styles.
      const after = plansMatch[1] ? plansMatch[1].trim() : '';
      inPlans = true;
      if (after) parseInlinePlansList(after);
      continue;
    }

    if (inPlans) {
      // Support markdown bullets with any indentation
      // Examples:
      //   - **Real Estate:**
      //   - Plan line
      // We remove a single leading '-' if present, then parse.
      const bulletMatch = trimmed.match(/^-+\s+(.+?)\s*$/);
      if (bulletMatch) pushPlanLine(bulletMatch[1]);
      else pushPlanLine(trimmed);
    }
  }

  finalizeGroup(lines.length - 1);
  return { groups, nextIdx: lines.length };
}

function parsePricingCopyMap(markdown) {
  const lines = markdown.split(/\r?\n/);

  /** @type {Record<string, any>} */
  const pages = {};

  let currentPageKey = null;

  for (let i = 0; i < lines.length; ) {
    const line = lines[i];

    // Page block headings: `## services.html` or `## niches/xyz.html`
    if (isHeading(line, 2)) {
      const heading = line.replace(/^##\s+/, '').trim();
      if (heading.toLowerCase().startsWith('global declaration')) {
        currentPageKey = null;
        i++;
        continue;
      }

      // Only treat headings that look like real HTML file paths as page blocks.
      // This intentionally ignores other `##` sections like "Cross-page rules".
      const looksLikePagePath = heading.endsWith('.html');
      if (!looksLikePagePath) {
        currentPageKey = null;
        i++;
        continue;
      }

      currentPageKey = heading;
      if (!pages[currentPageKey]) {
        pages[currentPageKey] = {
          section1: { title: '', subtitle: '', plans: [] },
          section2: { title: '', subtitle: '', groups: [] },
        };
      }
      i++;
      continue;
    }

    if (!currentPageKey) {
      i++;
      continue;
    }

    // Section headings inside the page block
    if (line.trim() === '### Pricing Section 1 title') {
      const parsed = parseTitleSubtitle(lines, i + 1, { page: currentPageKey, section: '1', line: i });
      pages[currentPageKey].section1.title = parsed.title;
      pages[currentPageKey].section1.subtitle = parsed.subtitle;
      i = parsed.nextIdx;
      continue;
    }

    if (line.trim() === '### Pricing Section 1 (highlighted)') {
      const parsed = parseSection1Plans(
        lines,
        i + 1,
        (l) => l.trim() === '### Pricing Section 2 title' || isHeading(l, 2),
        currentPageKey
      );
      pages[currentPageKey].section1.plans = parsed.plans;
      i = parsed.nextIdx;
      continue;
    }

    if (line.trim() === '### Pricing Section 2 title') {
      const parsed = parseTitleSubtitle(lines, i + 1, { page: currentPageKey, section: '2', line: i });
      pages[currentPageKey].section2.title = parsed.title;
      pages[currentPageKey].section2.subtitle = parsed.subtitle;
      i = parsed.nextIdx;
      continue;
    }

    if (line.trim() === '### Pricing Section 2 (other options summaries)') {
      const parsed = parseSection2Groups(
        lines,
        i + 1,
        (l) => isHeading(l, 2),
        currentPageKey
      );
      pages[currentPageKey].section2.groups = parsed.groups;
      i = parsed.nextIdx;
      continue;
    }

    i++;
  }

  return pages;
}

function validateParsed(pages) {
  // Ensure required pages exist.
  for (const page of TARGET_PAGES) {
    if (!pages[page]) fail(`Missing page block in PRICING_COPY_MAP.md: ${page}`);
  }

  // Validate each required page.
  for (const page of TARGET_PAGES) {
    const p = pages[page];
    if (!p) continue;

    if (!p.section1.title) fail('Section 1 title missing', { page, section: '1' });
    if (!p.section1.subtitle) fail('Section 1 subtitle missing', { page, section: '1' });
    if (!Array.isArray(p.section1.plans) || p.section1.plans.length !== 3) {
      fail(`Section 1 must have exactly 3 plans; found ${p.section1.plans ? p.section1.plans.length : 0}`, { page, section: '1' });
    }

    if (!p.section2.title) fail('Section 2 title missing', { page, section: '2' });
    if (!p.section2.subtitle) fail('Section 2 subtitle missing', { page, section: '2' });
    if (!Array.isArray(p.section2.groups) || p.section2.groups.length !== 3) {
      fail(`Section 2 must have exactly 3 groups; found ${p.section2.groups ? p.section2.groups.length : 0}`, { page, section: '2' });
    }
  }

  // If there are extra pages in the map, warn but do not fail.
  const extraPageKeys = Object.keys(pages).filter((k) => !TARGET_PAGES.includes(k));
  if (extraPageKeys.length) {
    console.warn(`WARN: PRICING_COPY_MAP.md contains extra page blocks not in TARGET_PAGES: ${extraPageKeys.join(', ')}`);
  }
}

function writeJsonOut(outPath, jsonObj) {
  const abs = path.isAbsolute(outPath) ? outPath : path.join(REPO_ROOT, outPath);
  const dir = path.dirname(abs);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(abs, JSON.stringify(jsonObj, null, 2) + '\n', 'utf8');
}

function main() {
  const args = parseArgs(process.argv);

  if (!fs.existsSync(COPY_MAP_PATH)) {
    console.error('❌ Missing PRICING_COPY_MAP.md at repo root.');
    process.exit(1);
  }

  const md = fs.readFileSync(COPY_MAP_PATH, 'utf8');
  try {
    const pages = parsePricingCopyMap(md);
    validateParsed(pages);

    if (args.printJson) {
      process.stdout.write(JSON.stringify(pages, null, 2) + '\n');
    }

    if (args.jsonOut) {
      writeJsonOut(args.jsonOut, pages);
      console.log(`✅ Wrote parsed pricing copy map JSON to: ${args.jsonOut}`);
    }

    console.log('✅ PRICING_COPY_MAP.md validated: structure + counts are correct.');
  } catch (err) {
    console.error(`❌ PRICING_COPY_MAP.md validation failed: ${err.message}`);
    process.exitCode = 1;
    return;
  }
}

main();
