#!/usr/bin/env node
/**
 * normalize-blog-spelling.mjs — one-time British -> US spelling pass over the
 * machine-written article bodies in src/data/blog-posts.ts.
 *
 * WHY THIS EXISTS
 * ---------------
 * The site declares `og:locale en_US` and llms.txt says "US English", but the
 * 83 articles in blog-posts.ts were written British because both n8n publishing
 * workflows enforced UK English until 2026-09-04. The workflows have since been
 * switched to US English, so this is intended as a back-catalogue pass.
 *
 * WHY A SCRIPT AND NOT A FIND-AND-REPLACE
 * ---------------------------------------
 * A blind regex over this file would corrupt four classes of content that are
 * NOT Silverstone prose and must keep their original spelling:
 *
 *   1. researchSources[]  — verbatim scraped third-party page titles and
 *      excerpts. Americanising them falsifies quoted source material and
 *      misattributes wording to publishers who did not write it. This is the
 *      single largest protected surface (~195 British-term occurrences).
 *   2. imagePrompt        — gpt-image prompts tuned against already-generated
 *      approved assets ("centred on", "brushed aluminium", "no call-centre
 *      stock photography"). Rewriting causes asset drift on regeneration.
 *   3. slug / heroImage / url / href — live indexed routes and external links.
 *      A slug rename breaks the published URL, sitemap, Atom feed and any
 *      Google-held reference. This site already carries a 301/410 migration
 *      burden; it does not need another.
 *   4. primaryKeyword / secondaryKeywords — the UK search terms an article was
 *      built to rank for. UK volume sits on "enquiry", not "inquiry"; changing
 *      these is a keyword-research decision, not a spelling fix.
 *
 * Plus two structural exclusions:
 *   5. organisationName — a declared TypeScript field on SilverstoneBlogSource.
 *      Renaming the data key without the type breaks `tsc`; renaming both is a
 *      refactor, not a spelling normalisation.
 *   6. Everything outside the N8N_BLOG_POSTS_START / N8N_BLOG_POSTS_END markers
 *      — hand-written types, doc comments and derived exports. Not article copy.
 *
 * And a phrase-level exclusion: UK statutory bodies, instruments and terms of
 * art ("Information Commissioner's Office", "UK GDPR", "Ofcom", "HMRC", "data
 * minimisation") are masked before replacement and restored afterwards.
 *
 * SAFETY PROPERTIES
 * -----------------
 * - Dry run by default. `--apply` is required to write.
 * - Never re-wraps, re-indents, re-quotes or reformats. Only whole words inside
 *   a line change; line count and quote balance are asserted unchanged.
 * - src/data/blog-posts.ts is listed in web/.prettierignore, so `format:check`
 *   (step 1 of `npm run verify`) will NOT catch damage here. That is why this
 *   script asserts its own invariants and refuses to write when any fail.
 * - The N8N markers are asserted present before and after, because the two n8n
 *   workflows append new articles between them.
 *
 * USAGE
 *   node scripts/normalize-blog-spelling.mjs              # dry run + report
 *   node scripts/normalize-blog-spelling.mjs --diff       # dry run + full diff
 *   node scripts/normalize-blog-spelling.mjs --apply      # write in place
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const TARGET = path.join(HERE, "..", "src", "data", "blog-posts.ts");

const START_MARKER = "// N8N_BLOG_POSTS_START";
const END_MARKER = "// N8N_BLOG_POSTS_END";
const MASK_OPEN = "@@SSMASK";
const MASK_CLOSE = "@@";

/**
 * British -> US word pairs, matched whole-word and case-preserving.
 *
 * DELIBERATELY EXCLUDED, because the two spellings mean different things or the
 * US form is identical to the British one:
 *   - "practise" (verb): rules are whole-word, so a practise->practice rule could
 *     never corrupt the noun "practice"; it is omitted only because the corpus
 *     contains no instance of the verb form.
 *   - "analysis" / "analyst" / "analytics": identical in US English.
 *   - "specialist" / "specialty": identical in US English.
 *   - "programme" is included, but note it is the one term the newly
 *     US-switched workflow still emits, so this may need re-running.
 */
const PAIRS = [
  ["enquiry", "inquiry"], ["enquiries", "inquiries"],
  ["enquire", "inquire"], ["enquired", "inquired"], ["enquiring", "inquiring"], ["enquires", "inquires"],
  ["judgement", "judgment"], ["judgements", "judgments"],
  ["organisation", "organization"], ["organisations", "organizations"],
  ["organisational", "organizational"], ["organise", "organize"],
  ["organised", "organized"], ["organising", "organizing"], ["organises", "organizes"],
  ["programme", "program"], ["programmes", "programs"],
  ["behaviour", "behavior"], ["behaviours", "behaviors"], ["behavioural", "behavioral"],
  ["optimise", "optimize"], ["optimised", "optimized"], ["optimising", "optimizing"],
  ["optimises", "optimizes"], ["optimisation", "optimization"], ["optimisations", "optimizations"],
  ["colour", "color"], ["colours", "colors"], ["coloured", "colored"], ["colourful", "colorful"],
  ["centre", "center"], ["centres", "centers"], ["centred", "centered"], ["centring", "centering"],
  ["standardise", "standardize"], ["standardised", "standardized"],
  ["standardising", "standardizing"], ["standardisation", "standardization"],
  ["summarise", "summarize"], ["summarised", "summarized"],
  ["summarising", "summarizing"], ["summarises", "summarizes"], ["summarisation", "summarization"],
  ["prioritise", "prioritize"], ["prioritised", "prioritized"],
  ["prioritising", "prioritizing"], ["prioritises", "prioritizes"], ["prioritisation", "prioritization"],
  ["recognise", "recognize"], ["recognised", "recognized"],
  ["recognising", "recognizing"], ["recognises", "recognizes"], ["recognisable", "recognizable"],
  ["labour", "labor"], ["labours", "labors"],
  ["towards", "toward"],
  ["licence", "license"], ["licences", "licenses"],
  ["minimise", "minimize"], ["minimised", "minimized"],
  ["minimising", "minimizing"], ["minimises", "minimizes"], ["minimisation", "minimization"],
  ["utilise", "utilize"], ["utilised", "utilized"], ["utilising", "utilizing"], ["utilisation", "utilization"],
  ["personalise", "personalize"], ["personalised", "personalized"],
  ["personalising", "personalizing"], ["personalisation", "personalization"],
  ["favour", "favor"], ["favours", "favors"], ["favoured", "favored"], ["favourable", "favorable"],
  ["specialise", "specialize"], ["specialised", "specialized"],
  ["specialising", "specializing"], ["specialises", "specializes"], ["specialisation", "specialization"],
  ["realise", "realize"], ["realised", "realized"], ["realising", "realizing"], ["realisation", "realization"],
  ["categorise", "categorize"], ["categorised", "categorized"],
  ["categorising", "categorizing"], ["categorisation", "categorization"],
  ["catalogue", "catalog"], ["catalogues", "catalogs"],
  ["emphasise", "emphasize"], ["emphasised", "emphasized"],
  ["emphasising", "emphasizing"], ["emphasises", "emphasizes"],
  ["whilst", "while"],
  ["customise", "customize"], ["customised", "customized"],
  ["customising", "customizing"], ["customisation", "customization"], ["customisations", "customizations"],
  ["modelling", "modeling"], ["modelled", "modeled"],
  ["cancelled", "canceled"], ["cancelling", "canceling"],
  ["maximise", "maximize"], ["maximised", "maximized"],
  ["maximising", "maximizing"], ["maximises", "maximizes"], ["maximisation", "maximization"],
  ["analyse", "analyze"], ["analysed", "analyzed"], ["analysing", "analyzing"],
  ["apologise", "apologize"], ["apologised", "apologized"], ["apologising", "apologizing"],
  ["fulfilment", "fulfillment"],
  ["authorisation", "authorization"], ["authorisations", "authorizations"],
  ["authorise", "authorize"], ["authorised", "authorized"], ["authorising", "authorizing"],
  ["unauthorised", "unauthorized"],
  ["acknowledgement", "acknowledgment"], ["acknowledgements", "acknowledgments"],
  ["stabilise", "stabilize"], ["stabilised", "stabilized"], ["stabilising", "stabilizing"],
  ["labelled", "labeled"], ["labelling", "labeling"],
  ["artefact", "artifact"], ["artefacts", "artifacts"],
  ["synchronisation", "synchronization"], ["synchronise", "synchronize"], ["synchronised", "synchronized"],
  ["penalise", "penalize"], ["penalised", "penalized"], ["penalising", "penalizing"],
  ["defence", "defense"], ["defences", "defenses"],
  ["offence", "offense"], ["offences", "offenses"],
  ["learnt", "learned"],
  ["travelled", "traveled"], ["travelling", "traveling"],
  ["normalise", "normalize"], ["normalised", "normalized"], ["normalising", "normalizing"],
  ["centralise", "centralize"], ["centralised", "centralized"], ["centralising", "centralizing"],
  ["decentralise", "decentralize"], ["decentralised", "decentralized"],
  ["visualise", "visualize"], ["visualised", "visualized"], ["visualising", "visualizing"],
  ["capitalise", "capitalize"], ["capitalised", "capitalized"], ["capitalising", "capitalizing"],
  ["formalise", "formalize"], ["formalised", "formalized"], ["formalising", "formalizing"],
  ["digitise", "digitize"], ["digitised", "digitized"], ["digitising", "digitizing"],
  ["digitisation", "digitization"],
  ["monetise", "monetize"], ["monetised", "monetized"], ["monetising", "monetizing"],
  ["monetisation", "monetization"],
  // Added after an adversarial review found 47 British spellings surviving in
  // renderable body prose — including several in visible H2 headings and card
  // titles, which would have left US body copy under British headings.
  ["generalise", "generalize"], ["generalised", "generalized"],
  ["generalising", "generalizing"], ["generalises", "generalizes"],
  ["generalisation", "generalization"],
  ["theatre", "theater"], ["theatres", "theaters"],
  ["dialling", "dialing"], ["dialled", "dialed"],
  ["systemise", "systemize"], ["systemised", "systemized"],
  ["systemising", "systemizing"], ["systemises", "systemizes"],
  ["modernise", "modernize"], ["modernised", "modernized"], ["modernising", "modernizing"],
  ["cannibalise", "cannibalize"], ["cannibalised", "cannibalized"],
  ["cannibalisation", "cannibalization"],
  ["annualise", "annualize"], ["annualised", "annualized"], ["annualising", "annualizing"],
  ["anonymise", "anonymize"], ["anonymised", "anonymized"],
  ["anonymising", "anonymizing"], ["anonymisation", "anonymization"],
  ["industrialise", "industrialize"], ["industrialised", "industrialized"],
  ["criticise", "criticize"], ["criticised", "criticized"], ["criticising", "criticizing"],
  ["operationalise", "operationalize"], ["operationalised", "operationalized"],
  ["operationalising", "operationalizing"],
  ["deprioritise", "deprioritize"], ["deprioritised", "deprioritized"],
  ["deprioritising", "deprioritizing"],
  ["honour", "honor"], ["honours", "honors"],
  ["honoured", "honored"], ["honouring", "honoring"],
  ["grey", "gray"], ["greys", "grays"],
  // Missing inflections of families already covered above.
  ["stabilises", "stabilizes"], ["stabilisation", "stabilization"],
];

/**
 * Object keys whose VALUE must never be respelled. A line assigning one of
 * these is skipped entirely. See the header comment for the reasoning.
 */
const PROTECTED_KEYS = [
  "imagePrompt",
  "slug",
  "heroImage",
  "url",
  "href",
  "primaryKeyword",
  "secondaryKeywords",
  "organisationName",
  "canonicalUrl",
  "website",
];

/**
 * Keys that OPEN a protected multi-line region. Everything from the opening
 * line to the closing bracket AT THE SAME INDENT is skipped.
 *
 * Indent, not bracket depth: scraped `summary` strings inside researchSources
 * contain unbalanced `[` and `]` (markdown link syntax, `[1]` citation markers),
 * which desynchronises a depth counter — in this file it made 4 of the 83
 * blocks swallow everything to end-of-file, silently skipping half the corpus.
 * This region is machine-generated with consistent indentation, so matching the
 * closing bracket at the opener's indent is both exact and tamper-evident: if
 * any block fails to resolve, the script aborts rather than guessing.
 */
const PROTECTED_BLOCK_KEYS = ["researchSources", "secondaryKeywords"];

/**
 * Statutory bodies, instruments and terms of art. Masked before replacement and
 * restored afterwards so no rule can reach inside them.
 */
const PROTECTED_PHRASES = [
  "Information Commissioner's Office",
  "Information Commissioner",
  "UK GDPR",
  "EU GDPR",
  "Ofcom",
  "HMRC",
  "Companies House",
  "Financial Conduct Authority",
  "Advertising Standards Authority",
  "data minimisation",
  "Labour Market Outlook",
  "Labour Party",
  "Association of Independent Healthcare Organisations",
  "Organisation for Economic",
];

const argv = new Set(process.argv.slice(2));
const APPLY = argv.has("--apply");
const SHOW_DIFF = argv.has("--diff");

const original = readFileSync(TARGET, "utf8");
const lines = original.split("\n");

const startIdx = lines.findIndex((l) => l.includes(START_MARKER));
const endIdx = lines.findIndex((l) => l.includes(END_MARKER));
if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
  console.error(`FATAL: could not locate ${START_MARKER} / ${END_MARKER}. Refusing to run.`);
  process.exit(1);
}

// Longest-first so "enquiries" is tried before "enquire".
const RULES = [...PAIRS]
  .sort((a, b) => b[0].length - a[0].length)
  .map(([uk, us]) => ({ uk, us, re: new RegExp(`\\b${uk}\\b`, "gi") }));

/** Preserve the casing of the matched source word. */
function matchCase(source, replacement) {
  if (source === source.toUpperCase() && source.length > 1) return replacement.toUpperCase();
  if (source[0] === source[0].toUpperCase()) {
    return replacement[0].toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

function escapeRe(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const protectedKeyRe = new RegExp(`^\\s*(${PROTECTED_KEYS.join("|")})\\s*:`);
const protectedBlockRe = new RegExp(`^\\s*(${PROTECTED_BLOCK_KEYS.join("|")})\\s*:\\s*\\[`);
const anyBritishRe = new RegExp(`\\b(${PAIRS.map(([uk]) => uk).join("|")})\\b`, "i");

const stats = new Map();
const changedLines = [];
const skipped = { outsideRegion: 0, protectedKey: 0, protectedBlock: 0, protectedPhrase: 0, urlsMasked: 0 };
const unresolvedBlocks = [];

const indentOf = (line) => line.length - line.trimStart().length;

/**
 * Resolve every protected block up front by indent, so the main pass is a
 * simple membership test and an unresolvable block is a hard failure rather
 * than a silent over-skip.
 */
const protectedLineNumbers = new Set();
for (let i = startIdx + 1; i < endIdx; i += 1) {
  if (!protectedBlockRe.test(lines[i])) continue;
  const indent = indentOf(lines[i]);
  let close = -1;
  for (let j = i + 1; j < endIdx; j += 1) {
    const trimmed = lines[j].trim();
    if ((trimmed === "]," || trimmed === "]") && indentOf(lines[j]) === indent) {
      close = j;
      break;
    }
  }
  if (close === -1) {
    unresolvedBlocks.push(i + 1);
    continue;
  }
  for (let j = i; j <= close; j += 1) protectedLineNumbers.add(j);
}

/**
 * Protected keys whose VALUE sits on the following line.
 *
 * Prettier wraps a long assignment as `imagePrompt:\n  "…"`, so a guard that
 * only tests the key line protects the key and leaves the value exposed. In
 * this file 178 of the 1,091 protected-key lines are wrapped that way —
 * including all 83 imagePrompt values, the single largest protected surface
 * after researchSources. Continuation lines are absorbed until the line that
 * terminates the value.
 */
const MAX_WRAPPED_VALUE_LINES = 20;
const unterminatedValues = [];
let wrappedValueLines = 0;
for (let i = startIdx + 1; i < endIdx; i += 1) {
  if (protectedLineNumbers.has(i)) continue;
  const match = lines[i].match(protectedKeyRe);
  if (!match) continue;
  const afterColon = lines[i].slice(lines[i].indexOf(":") + 1).trim();
  if (afterColon !== "") continue;
  let absorbed = 0;
  let terminated = false;
  for (let j = i + 1; j < endIdx; j += 1) {
    protectedLineNumbers.add(j);
    wrappedValueLines += 1;
    absorbed += 1;
    const trimmed = lines[j].trim();
    if (trimmed.endsWith(",") || trimmed.endsWith(";")) {
      terminated = true;
      break;
    }
    // Fail loud rather than silently protecting the rest of the file.
    if (absorbed > MAX_WRAPPED_VALUE_LINES) break;
  }
  if (!terminated) unterminatedValues.push(i + 1);
}

if (unterminatedValues.length) {
  console.error(
    `FATAL: ${unterminatedValues.length} wrapped protected value(s) never terminated ` +
      `(lines ${unterminatedValues.join(", ")}). Refusing to run rather than over-protect.`,
  );
  process.exit(1);
}

if (unresolvedBlocks.length) {
  console.error(
    `FATAL: ${unresolvedBlocks.length} protected block(s) did not close at their own indent ` +
      `(lines ${unresolvedBlocks.join(", ")}). Refusing to run rather than guess their extent.`,
  );
  process.exit(1);
}

const out = lines.map((line, i) => {
  const lineNo = i + 1;

  // 6. Outside the machine-written region: hand-authored types and exports.
  if (i <= startIdx || i >= endIdx) {
    if (anyBritishRe.test(line)) skipped.outsideRegion++;
    return line;
  }

  // 1. researchSources[] / secondaryKeywords[] — resolved by indent above.
  if (protectedLineNumbers.has(i)) {
    skipped.protectedBlock++;
    return line;
  }

  // 2-5. Protected key assignments.
  if (protectedKeyRe.test(line)) {
    skipped.protectedKey++;
    return line;
  }

  const masks = [];
  let work = line;

  /*
   * Mask URLs FIRST — before proper nouns, before any rule.
   *
   * Protecting the `url:` / `href:` keys is not enough: articles embed links in
   * prose as markdown, e.g.
   *   [ICO guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance…)
   * and `\borganisations\b` matches inside that path because `-` and `/` are
   * non-word characters. Rewriting it to `for-organizations` 404s a live
   * citation. The same hazard applies to internal links whose slug contains a
   * British spelling (/blog/cross-location-workflows-standardise-first).
   */
  for (const urlRe of [/https?:\/\/[^\s)"'`]+/g, /\]\((\/[^\s)"'`]*)\)/g, /"\/[a-z0-9/_-]+"/g]) {
    work = work.replace(urlRe, (m) => {
      const token = `${MASK_OPEN}${masks.length}${MASK_CLOSE}`;
      masks.push(m);
      skipped.urlsMasked += 1;
      return token;
    });
  }

  // Mask statutory proper nouns before any rule runs.
  for (const phrase of PROTECTED_PHRASES) {
    work = work.replace(new RegExp(escapeRe(phrase), "gi"), (m) => {
      const token = `${MASK_OPEN}${masks.length}${MASK_CLOSE}`;
      masks.push(m);
      skipped.protectedPhrase++;
      return token;
    });
  }

  const beforeReplace = work;
  for (const rule of RULES) {
    rule.re.lastIndex = 0;
    work = work.replace(rule.re, (m) => {
      stats.set(rule.uk, (stats.get(rule.uk) ?? 0) + 1);
      return matchCase(m, rule.us);
    });
  }
  const didChange = work !== beforeReplace;

  // Restore masks.
  const unmask = (value) =>
    value.replace(new RegExp(`${escapeRe(MASK_OPEN)}(\\d+)${escapeRe(MASK_CLOSE)}`, "g"), (_, n) => masks[Number(n)]);
  work = unmask(work);

  if (didChange) changedLines.push({ lineNo, before: line, after: work });
  return work;
});

const result = out.join("\n");

// ---- invariants -----------------------------------------------------------
const problems = [];
if (out.length !== lines.length) problems.push("line count changed");
if (!result.includes(START_MARKER)) problems.push("START marker lost");
if (!result.includes(END_MARKER)) problems.push("END marker lost");
if (result.includes(MASK_OPEN)) problems.push("mask token leaked into output");
const countOf = (s, ch) => (s.match(new RegExp(escapeRe(ch), "g")) ?? []).length;
for (const ch of ['"', "`", "{", "}", "[", "]"]) {
  if (countOf(result, ch) !== countOf(original, ch)) {
    problems.push(`${ch} count changed ${countOf(original, ch)} -> ${countOf(result, ch)}`);
  }
}

// ---- report ---------------------------------------------------------------
const total = [...stats.values()].reduce((a, b) => a + b, 0);
console.log(`\nnormalize-blog-spelling — ${APPLY ? "APPLY" : "DRY RUN"}`);
console.log(`target        ${path.relative(process.cwd(), TARGET)}`);
console.log(`region        lines ${startIdx + 1}..${endIdx + 1} (between N8N markers)`);
console.log(`lines changed ${changedLines.length}`);
console.log(`replacements  ${total}\n`);
console.log("skipped:");
console.log(`  ${String(skipped.protectedBlock).padStart(6)} lines inside a protected block (researchSources / secondaryKeywords)`);
console.log(`  ${String(skipped.protectedKey).padStart(6)} lines assigning a protected key`);
console.log(`  ${String(wrappedValueLines).padStart(6)} wrapped continuation lines of a protected key value`);
console.log(`  ${String(skipped.urlsMasked).padStart(6)} URLs / link targets masked inside prose`);
console.log(`  ${String(skipped.protectedPhrase).padStart(6)} protected phrase occurrences masked`);
console.log(`  ${String(skipped.outsideRegion).padStart(6)} lines outside the N8N region carrying a British term\n`);
console.log("by term:");
for (const [uk, n] of [...stats.entries()].sort((a, b) => b[1] - a[1])) {
  const us = PAIRS.find(([b]) => b === uk)?.[1];
  console.log(`  ${String(n).padStart(5)}  ${uk} -> ${us}`);
}

if (SHOW_DIFF) {
  console.log("\n--- full diff ---");
  for (const c of changedLines) {
    console.log(`\nL${c.lineNo}`);
    console.log(`- ${c.before.trim()}`);
    console.log(`+ ${c.after.trim()}`);
  }
}

if (problems.length) {
  console.error("\nINVARIANT FAILURES — refusing to write:");
  for (const p of problems) console.error("  ! " + p);
  process.exit(1);
}
console.log("\ninvariants OK (line count, markers, quote/brace balance, no mask leak)");

if (APPLY) {
  writeFileSync(TARGET, result, "utf8");
  console.log("WROTE " + TARGET);
} else {
  console.log("dry run — pass --apply to write, --diff to print every changed line");
}
