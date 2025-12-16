#!/usr/bin/env node
"use strict";

/**
 * Deterministically parse PRICING_COPY_MAP.md and write:
 *   codex/_generated/pricing-copy.json
 *
 * No external dependencies.
 *
 * Usage:
 *   node scripts/pricing-copy-map-to-json.js
 *   node scripts/pricing-copy-map-to-json.js --out codex/_generated/pricing-copy.json
 */

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..");
const DEFAULT_IN = path.join(REPO_ROOT, "PRICING_COPY_MAP.md");
const DEFAULT_OUT = path.join(REPO_ROOT, "codex", "_generated", "pricing-copy.json");

function readText(p) {
  return fs.readFileSync(p, "utf8");
}

function writeText(p, text) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, text, "utf8");
}

function normalizeNewlines(s) {
  return s.replace(/\r\n/g, "\n");
}

function splitPages(md) {
  // Split on "## <pageKey>" headings, but keep the heading.
  const lines = md.split("\n");
  const pages = [];
  let current = null;

  for (const line of lines) {
    const m = line.match(/^##\s+(.+)\s*$/);
    if (m && m[1] !== "Global declaration (apply everywhere)" && m[1] !== "Cross-page rules" && m[1] !== "Assumptions / mismatches") {
      if (current) pages.push(current);
      current = { key: m[1].trim(), lines: [line] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) pages.push(current);
  return pages;
}

function extractTitleBlock(sectionLines, titleHeading) {
  // Find "### Row X title" then the next bold line and optional subtitle.
  const idx = sectionLines.findIndex((l) => l.trim() === titleHeading);
  if (idx === -1) return { title: "", subtitle: "" };

  let title = "";
  let subtitle = "";

  for (let i = idx + 1; i < sectionLines.length; i++) {
    const t = sectionLines[i].trim();
    if (!t) continue;
    if (t.startsWith("### ")) break;

    // Title: **...**
    const bold = t.match(/^\*\*(.+)\*\*$/);
    if (bold && !title) {
      title = bold[1].trim();
      continue;
    }

    // Subtitle: _Subtitle: ..._
    const sub = t.match(/^_Subtitle:\s*(.+)_$/);
    if (sub && !subtitle) {
      subtitle = sub[1].trim();
      continue;
    }

    // Some pages put the title on a bold line followed by two spaces etc; keep strict minimal.
    if (!title && t.startsWith("**") && t.endsWith("**")) {
      title = t.replace(/^\*\*/, "").replace(/\*\*$/, "").trim();
      continue;
    }
  }

  return { title, subtitle };
}

function extractRow1Plans(sectionLines) {
  const start = sectionLines.findIndex((l) => l.trim() === "### Row 1 (highlighted)");
  if (start === -1) return [];

  const plans = [];
  for (let i = start + 1; i < sectionLines.length; i++) {
    const line = sectionLines[i];

    if (line.trim().startsWith("### Row 2 title")) break;
    const m = line.match(/^\*\s+\*\*Plan name:\*\*\s+(.+)\s*$/);
    if (!m) continue;

    const plan = {
      name: m[1].trim(),
      setupFee: "",
      monthlyRetainer: "",
      bestFor: "",
      includes: [],
      badge: undefined,
    };

    // Scan forward until next plan or Row 2 title
    for (let j = i + 1; j < sectionLines.length; j++) {
      const l = sectionLines[j].trim();
      if (l.match(/^\*\s+\*\*Plan name:\*\*/)) {
        i = j - 1; // outer loop will i++ => next plan header
        break;
      }
      if (l.startsWith("### Row 2 title")) {
        i = j - 1;
        break;
      }

      const sf = l.match(/^\*\*Setup fee:\*\*\s+(.+)\s*$/);
      if (sf) plan.setupFee = sf[1].trim();

      const mr = l.match(/^\*\*Monthly retainer:\*\*\s+(.+)\s*$/);
      if (mr) plan.monthlyRetainer = mr[1].trim();

      const bf = l.match(/^\*\*Best for:\*\*\s+(.+)\s*$/);
      if (bf) plan.bestFor = bf[1].trim();

      const bd = l.match(/^\*\*Badge:\*\*\s+(.+)\s*$/);
      if (bd) plan.badge = bd[1].trim();

      // Includes list begins after "**What’s included:**"
      if (l.startsWith("**What")) {
        // capture subsequent "- " bullets
        for (let k = j + 1; k < sectionLines.length; k++) {
          const b = sectionLines[k].trim();
          if (b.startsWith("- ")) {
            plan.includes.push(b.slice(2).trim());
            continue;
          }
          if (!b) continue;
          // stop on next field or next plan
          if (b.startsWith("**") || b.startsWith("* **Plan name:**") || b.startsWith("### ")) break;
        }
      }
    }

    plans.push(plan);
  }

  return plans;
}

function extractRow2Groups(sectionLines) {
  const start = sectionLines.findIndex((l) => l.trim() === "### Row 2 (other options summaries)");
  if (start === -1) return [];

  const groups = [];
  for (let i = start + 1; i < sectionLines.length; i++) {
    const line = sectionLines[i];

    const m = line.match(/^\*\s+\*\*Plan group label:\*\*\s+(.+)\s*$/);
    if (!m) continue;

    const group = {
      label: m[1].trim(),
      plansIncludedRaw: "",
      oneLiner: "",
    };

    // Capture between "**Plans included:**" and "**One-liner:**"
    let inPlans = false;
    const plansBuf = [];

    for (let j = i + 1; j < sectionLines.length; j++) {
      const l = sectionLines[j].trim();

      if (l.match(/^\*\s+\*\*Plan group label:\*\*/)) {
        i = j - 1;
        break;
      }

      const pi = l.match(/^\*\*Plans included:\*\*\s*(.*)$/);
      if (pi) {
        inPlans = true;
        const inline = pi[1] ? pi[1].trim() : "";
        if (inline) plansBuf.push(inline);
        continue;
      }

      const ol = l.match(/^\*\*One-liner:\*\*\s+(.+)\s*$/);
      if (ol) {
        group.oneLiner = ol[1].trim();
        inPlans = false;
        continue;
      }

      if (inPlans) {
        // Keep raw but normalized; accept lines, bullets, category lines.
        if (l) plansBuf.push(l);
      }
    }

    group.plansIncludedRaw = plansBuf.join("\n").trim();
    groups.push(group);
  }

  return groups;
}

function parsePricingCopy(md) {
  const pagesArr = splitPages(md);
  const out = {};

  for (const p of pagesArr) {
    const lines = p.lines;

    const row1 = extractTitleBlock(lines, "### Row 1 title");
    const row2 = extractTitleBlock(lines, "### Row 2 title");

    const plans = extractRow1Plans(lines);
    const groups = extractRow2Groups(lines);

    out[p.key] = {
      row1: { title: row1.title, subtitle: row1.subtitle, plans },
      row2: { title: row2.title, subtitle: row2.subtitle, groups },
    };
  }

  return out;
}

function stableStringify(obj) {
  // Stable stringify: sort top-level page keys.
  const keys = Object.keys(obj).sort();
  const stable = {};
  for (const k of keys) stable[k] = obj[k];
  return JSON.stringify(stable, null, 2) + "\n";
}

function main() {
  const args = process.argv.slice(2);
  const outIdx = args.indexOf("--out");
  const outPath = outIdx !== -1 ? path.resolve(REPO_ROOT, args[outIdx + 1]) : DEFAULT_OUT;

  if (!fs.existsSync(DEFAULT_IN)) {
    console.error(`[pricing-copy-map-to-json] ERROR: Missing input file: ${path.relative(REPO_ROOT, DEFAULT_IN)}`);
    process.exit(1);
  }

  const md = normalizeNewlines(readText(DEFAULT_IN));
  const parsed = parsePricingCopy(md);

  writeText(outPath, stableStringify(parsed));
  console.log(`[pricing-copy-map-to-json] Wrote ${path.relative(REPO_ROOT, outPath)}`);
}

main();
