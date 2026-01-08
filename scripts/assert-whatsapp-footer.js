// FILE: scripts/assert-whatsapp-footer.js
/**
 * UI Spec Grader — WhatsApp Sticky Icon + Footer Mobile Number
 *
 * Enforces proof markers + cross-page propagation so Codex cannot claim completion
 * without implementing the exact requested behavior.
 */

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..");

const DISPLAY_NUMBER = "+447418329232";
const CHAT_NUMBER_DIGITS = "447418329232";

const MARKERS = {
  css: "SPEC: WHATSAPP_STICKY_BUTTON_FIXED_BOTTOM_RIGHT_2026_01_08",
  js: "SPEC: WHATSAPP_STICKY_BUTTON_INJECT_ALL_PAGES_2026_01_08",
  footer: "SPEC: FOOTER_CONTACT_MOBILE_NUMBER_2026_01_08",
};

function fail(msg) {
  throw new Error(`WHATSAPP/FOOTER SPEC FAILED: ${msg}`);
}

function assert(cond, msg) {
  if (!cond) fail(msg);
}

function readFile(relPath) {
  const fullPath = path.join(REPO_ROOT, relPath);
  assert(fs.existsSync(fullPath), `Missing required file: ${relPath}`);
  return fs.readFileSync(fullPath, "utf8");
}

function getAllHtmlFiles() {
  const results = [];
  const roots = ["."];
  const skipDirs = new Set(["node_modules", ".git", ".codex", ".npm-cache", "pricing-widget"]);

  function walk(dirRel) {
    const dirAbs = path.join(REPO_ROOT, dirRel);
    const entries = fs.readdirSync(dirAbs, { withFileTypes: true });
    for (const ent of entries) {
      if (ent.isDirectory()) {
        if (skipDirs.has(ent.name)) continue;
        walk(path.join(dirRel, ent.name));
      } else if (ent.isFile() && ent.name.toLowerCase().endsWith(".html")) {
        results.push(path.join(dirRel, ent.name));
      }
    }
  }

  for (const r of roots) walk(r);

  // Normalize to repo-relative without leading "./"
  return results
    .map((p) => p.replace(/^[.][\\/]/, ""))
    .filter((p) => p !== "")
    .sort();
}

function getContext(haystack, needle, radius = 900) {
  const idx = haystack.indexOf(needle);
  if (idx === -1) return "";
  const start = Math.max(0, idx - radius);
  const end = Math.min(haystack.length, idx + needle.length + radius);
  return haystack.slice(start, end);
}

function run() {
  const builtCss = readFile("assets/css/styles.css");
  const builtJs = readFile("assets/js/app.js");

  // ===== Proof markers in bundles =====
  assert(builtCss.includes(MARKERS.css), `Missing CSS proof marker in assets/css/styles.css: ${MARKERS.css}`);
  assert(builtJs.includes(MARKERS.js), `Missing JS proof marker in assets/js/app.js: ${MARKERS.js}`);

  // ===== CSS sanity around marker (fixed bottom-right expected) =====
  const cssCtx = getContext(builtCss, MARKERS.css, 1400);
  assert(cssCtx, `Could not extract context for CSS marker: ${MARKERS.css}`);
  assert(/position\s*:\s*fixed/i.test(cssCtx), `CSS near marker must include position: fixed`);
  assert(/bottom\s*:/i.test(cssCtx), `CSS near marker must define a bottom offset`);
  assert(/right\s*:/i.test(cssCtx), `CSS near marker must define a right offset`);

  // ===== JS sanity: must reference chat number + wa host (without relying on exact literal URL) =====
  const jsCtx = getContext(builtJs, MARKERS.js, 2200);
  assert(jsCtx, `Could not extract context for JS marker: ${MARKERS.js}`);
  assert(jsCtx.includes(CHAT_NUMBER_DIGITS), `JS must reference digits-only chat number: ${CHAT_NUMBER_DIGITS}`);
  assert(jsCtx.toLowerCase().includes("wa.me"), `JS must reference the wa.me host (WhatsApp click-to-chat)`);
  assert(/aria-label/i.test(jsCtx), `JS should set an aria-label on the sticky WhatsApp entry point`);

  // ===== Cross-page HTML checks =====
  const htmlFiles = getAllHtmlFiles();

  // Expected inventory (hard guard against missing pages)
  const expected = new Set([
    "about.html",
    "book.html",
    "contact.html",
    "index.html",
    "privacy-policy.html",
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
  ]);

  const actual = new Set(htmlFiles);
  const missing = [...expected].filter((p) => !actual.has(p));
  const extra = [...actual].filter((p) => !expected.has(p));

  assert(missing.length === 0, `HTML inventory mismatch. Missing expected pages: ${missing.join(", ")}`);
  // Extra HTML pages are allowed, but they must still pass the propagation rules.
  // We'll validate all HTML pages found.

  for (const rel of htmlFiles) {
    const html = readFile(rel);

    // Must load the JS bundle (so sticky icon can exist on every page)
    assert(
      /assets\/js\/app\.js/i.test(html),
      `${rel} must load the shared JS bundle (assets/js/app.js)`
    );

    // Footer phone marker + number must exist
    assert(
      html.includes(MARKERS.footer),
      `${rel} missing footer proof marker: ${MARKERS.footer}`
    );
    assert(
      html.includes(DISPLAY_NUMBER),
      `${rel} footer must include display number: ${DISPLAY_NUMBER}`
    );

    // Marker must be inside/near footer-contact block for reliability
    const footerCtx = getContext(html, MARKERS.footer, 1400);
    assert(footerCtx, `${rel} could not extract context for footer marker`);
    assert(
      /footer-contact/i.test(footerCtx),
      `${rel} footer marker must be placed within/near the footer-contact section`
    );
  }

  console.log("WHATSAPP/FOOTER SPEC PASSED");
}

run();
