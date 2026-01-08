// FILE: scripts/assert-whatsapp-spec.js
/**
 * UI Spec Grader — WhatsApp Floating Button + Footer Phone
 *
 * This script enforces a strict cross-page contract so Codex cannot claim
 * completion without implementing the requested changes on every page.
 */

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..");

const WHATSAPP_NUMBER = "447418329232";
const TEL_HREF = "tel:+447418329232";
const DISPLAY_TEXT = "+44 7418 329232";

// Avoid hard-coding external URLs in this repo; build domains from parts.
const WA_DOMAIN = ["wa", "me"].join(".");
const WA_ALT_DOMAIN = ["api", "whatsapp", "com"].join(".");

const MARKER_BUTTON_HTML = "SPEC: WHATSAPP_FLOAT_BUTTON_MARKUP_2026_01_08";
const MARKER_FOOTER_PHONE_HTML = "SPEC: FOOTER_CONTACT_PHONE_ADDED_2026_01_08";

const MARKER_BUTTON_CSS = "SPEC: WHATSAPP_FLOAT_BUTTON_STYLES_2026_01_08";
const MARKER_ICON_PHONE = "SPEC: ICON_PHONE_GLYPH_2026_01_08";
const MARKER_ICON_WHATSAPP = "SPEC: ICON_WHATSAPP_GLYPH_2026_01_08";

function fail(msg) {
  throw new Error(`WHATSAPP SPEC FAILED: ${msg}`);
}

function assert(cond, msg) {
  if (!cond) fail(msg);
}

function readFile(relPath) {
  const fullPath = path.join(REPO_ROOT, relPath);
  assert(fs.existsSync(fullPath), `Missing required file: ${relPath}`);
  return fs.readFileSync(fullPath, "utf8");
}

function getContext(haystack, needle, radius = 1200) {
  const idx = haystack.indexOf(needle);
  if (idx === -1) return "";
  const start = Math.max(0, idx - radius);
  const end = Math.min(haystack.length, idx + needle.length + radius);
  return haystack.slice(start, end);
}

function listHtmlPages() {
  const root = fs
    .readdirSync(REPO_ROOT)
    .filter((f) => f.endsWith(".html"))
    .sort();

  const nichesDir = path.join(REPO_ROOT, "niches");
  assert(fs.existsSync(nichesDir), "Missing niches/ directory (expected for page inventory)");

  const niches = fs
    .readdirSync(nichesDir)
    .filter((f) => f.endsWith(".html"))
    .map((f) => path.join("niches", f))
    .sort();

  return [...root, ...niches];
}

function assertWhatsAppButtonInHtml(html, relPath) {
  // Exactly one element with id="whatsapp-float".
  const idRe = /\bid\s*=\s*["']whatsapp-float["']/gi;
  const idMatches = html.match(idRe) || [];
  assert(
    idMatches.length === 1,
    `${relPath} must contain exactly one WhatsApp button with id="whatsapp-float" (found ${idMatches.length})`
  );

  // Extract the opening tag for additional assertions.
  const openTagRe = /<a\b[^>]*\bid\s*=\s*["']whatsapp-float["'][^>]*>/i;
  const openTagMatch = html.match(openTagRe);
  assert(openTagMatch, `${relPath} is missing the WhatsApp button <a ... id="whatsapp-float" ...>`);
  const openTag = openTagMatch[0];

  assert(/\bclass\s*=\s*["'][^"']*\bwa-float\b/i.test(openTag), `${relPath} WhatsApp button must include class "wa-float"`);
  assert(/\btarget\s*=\s*["']_blank["']/i.test(openTag), `${relPath} WhatsApp button must set target="_blank"`);
  assert(/\brel\s*=\s*["'][^"']*\bnoopener\b/i.test(openTag), `${relPath} WhatsApp button rel must include "noopener"`);
  assert(/\baria-label\s*=\s*["']Chat on WhatsApp["']/i.test(openTag), `${relPath} WhatsApp button must set aria-label="Chat on WhatsApp"`);

  // Link must reference the digits-only number. Also sanity-check that the href looks like a WhatsApp click-to-chat.
  const hrefMatch = openTag.match(/\bhref\s*=\s*["']([^"']+)["']/i);
  assert(hrefMatch, `${relPath} WhatsApp button is missing href`);
  const href = hrefMatch[1];

  assert(href.includes(WHATSAPP_NUMBER), `${relPath} WhatsApp href must include the number ${WHATSAPP_NUMBER}`);
  assert(
    href.includes(WA_DOMAIN) || href.includes(WA_ALT_DOMAIN),
    `${relPath} WhatsApp href must point to a WhatsApp click-to-chat endpoint (expected domain ${WA_DOMAIN} or ${WA_ALT_DOMAIN})`
  );

  assert(html.includes(MARKER_BUTTON_HTML), `${relPath} must include proof marker "${MARKER_BUTTON_HTML}"`);
}

function extractFooterContactSlice(html, relPath) {
  const start = html.indexOf('<div class="footer-contact">');
  assert(start !== -1, `${relPath} missing <div class="footer-contact">`);

  // Slice until the next footer section to avoid fragile HTML parsing.
  const end = html.indexOf('<div class="footer-social">', start);
  assert(end !== -1, `${relPath} could not locate end of footer-contact section (expected footer-social)`);

  return html.slice(start, end);
}

function assertFooterPhoneInHtml(html, relPath) {
  const slice = extractFooterContactSlice(html, relPath);

  const telCount = (slice.match(new RegExp(TEL_HREF.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
  assert(telCount === 1, `${relPath} footer-contact must contain exactly one ${TEL_HREF} link (found ${telCount})`);

  assert(slice.includes(DISPLAY_TEXT), `${relPath} footer phone display text must be exactly: ${DISPLAY_TEXT}`);
  assert(
    /<i\b[^>]*\bfa-solid\b[^>]*\bfa-phone\b[^>]*>\s*<\/i>/i.test(slice),
    `${relPath} footer phone row must include <i class="fa-solid fa-phone"></i>`
  );

  assert(slice.includes(MARKER_FOOTER_PHONE_HTML), `${relPath} must include proof marker "${MARKER_FOOTER_PHONE_HTML}"`);
}

function assertBuiltCssContracts(css) {
  assert(css.includes(MARKER_BUTTON_CSS), `assets/css/styles.css missing proof marker "${MARKER_BUTTON_CSS}"`);
  assert(css.includes(MARKER_ICON_PHONE), `assets/css/styles.css missing proof marker "${MARKER_ICON_PHONE}"`);
  assert(css.includes(MARKER_ICON_WHATSAPP), `assets/css/styles.css missing proof marker "${MARKER_ICON_WHATSAPP}"`);

  // Verify the icon mappings exist (allow flexible whitespace).
  assert(
    /\.fa-solid\.fa-phone::before\s*\{\s*content:\s*"\\f095";\s*\}/i.test(css),
    `assets/css/styles.css missing expected glyph mapping for .fa-solid.fa-phone::before (\\f095)`
  );

  assert(
    /\.fa-brands\.fa-whatsapp::before\s*\{\s*content:\s*"\\f232";\s*\}/i.test(css),
    `assets/css/styles.css missing expected glyph mapping for .fa-brands.fa-whatsapp::before (\\f232)`
  );

  // Basic `.wa-float` sanity: fixed positioning and z-index above cookie banner.
  assert(/\.wa-float\s*\{[\s\S]*?position\s*:\s*fixed\s*;/i.test(css), `assets/css/styles.css missing .wa-float { position: fixed; ... }`);

  const ctx = getContext(css, ".wa-float", 2000);
  const zMatch = ctx.match(/z-index\s*:\s*(\d+)/i);
  assert(zMatch, `assets/css/styles.css missing z-index for .wa-float`);
  const z = Number(zMatch[1]);
  assert(Number.isFinite(z) && z > 1000, `assets/css/styles.css .wa-float z-index must be > 1000 (found ${z})`);
}

function run() {
  const pages = listHtmlPages();

  // Sanity: this repo currently expects 15 pages (6 root + 9 niches).
  // If this changes in the future, update the spec page list and this assertion together.
  assert(pages.length === 15, `Expected 15 HTML pages in scope; found ${pages.length}. Update the spec and grader together.`);

  const builtCss = readFile(path.join("assets", "css", "styles.css"));
  assertBuiltCssContracts(builtCss);

  for (const relPath of pages) {
    const html = readFile(relPath);
    assertWhatsAppButtonInHtml(html, relPath);
    assertFooterPhoneInHtml(html, relPath);
  }

  console.log("[assert-whatsapp-spec] PASS");
}

run();
