// FILE: scripts/validate-services-page.js

/**
 * Validates services.html against the A–H requirements that touch this page:
 * - Hero shader is blue (A1)
 * - Core Bundle Bullets heading is two-line and correctly cased (C1)
 * - The four General_Services_* image/card pairs alternate left/right via DOM order (C2)
 * - compact-section count reflects spacing reductions (E)
 * - Unstable global nth-of-type reordering rule is removed (C2)
 *
 * Dependency-free (no DOM parser). Uses conservative string + tag-balance checks.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const SERVICES_HTML = path.join(ROOT, "services.html");
const CARDS_CSS = path.join(ROOT, "src", "css", "components", "cards.css");

function readText(absPath) {
  return fs.readFileSync(absPath, "utf8");
}

function fail(msg) {
  console.error(`❌ [validate-services-page] ${msg}`);
  process.exitCode = 1;
}

function ok(msg) {
  console.log(`✅ [validate-services-page] ${msg}`);
}

function extractHeroCanvasVariant(html) {
  const m = html.match(/<canvas\b[^>]*\bid=["']hero-shader-canvas["'][^>]*>/i);
  if (!m) return null;
  const tag = m[0];
  const v = tag.match(/\bdata-variant=["']([^"']+)["']/i);
  return v ? v[1] : null;
}

function countOccurrences(haystack, needle) {
  let count = 0;
  let idx = 0;
  while (true) {
    const next = haystack.indexOf(needle, idx);
    if (next === -1) break;
    count++;
    idx = next + needle.length;
  }
  return count;
}

function findMatchingDivEnd(html, startIndex) {
  const tokenRe = /<\/?div\b[^>]*>/gi;
  tokenRe.lastIndex = startIndex;

  let depth = 0;
  let m;

  while ((m = tokenRe.exec(html)) !== null) {
    const token = m[0].toLowerCase();
    const isClose = token.startsWith("</div");
    if (!isClose) depth++;
    else depth--;

    if (depth === 0) {
      // tokenRe.lastIndex is positioned after the current match.
      return tokenRe.lastIndex;
    }
  }

  return -1;
}

function extractServiceRowBlockForImage(html, imageNeedle) {
  const imgIndex = html.indexOf(imageNeedle);
  if (imgIndex === -1) return null;

  const rowStart = html.lastIndexOf('<div class="service-row', imgIndex);
  if (rowStart === -1) return null;

  const rowEnd = findMatchingDivEnd(html, rowStart);
  if (rowEnd === -1) return null;

  return html.slice(rowStart, rowEnd);
}

function extractTopLevelDivChildClasses(serviceRowBlock) {
  // After the opening tag of the service-row div, find top-level child <div> tags and record their class attribute.
  const openEnd = serviceRowBlock.indexOf(">");
  if (openEnd === -1) return [];

  const tokenRe = /<\/?div\b[^>]*>/gi;
  tokenRe.lastIndex = openEnd + 1;

  let depth = 0;
  const childClasses = [];
  let m;

  while ((m = tokenRe.exec(serviceRowBlock)) !== null) {
    const tok = m[0];
    const isClose = tok.startsWith("</");

    if (!isClose) {
      if (depth === 0) {
        const cm = tok.match(/\bclass\s*=\s*"([^"]*)"/i);
        childClasses.push(cm ? cm[1] : "");
      }
      depth++;
    } else {
      depth--;
      if (depth < 0) break;
    }
  }

  return childClasses;
}

function assertTopLevelImageCardOrder(rowBlock, expectedFirst, expectedSecond, label) {
  const children = extractTopLevelDivChildClasses(rowBlock);

  const first = children[0] || "";
  const second = children[1] || "";

  const hasFirst = first.includes(expectedFirst);
  const hasSecond = second.includes(expectedSecond);

  // Also ensure we actually have both as top-level children somewhere in the first two slots.
  const hasImage = children.some((c) => c.includes("service-image"));
  const hasContent = children.some((c) => c.includes("service-content"));

  if (!hasImage || !hasContent) {
    fail(`${label}: expected top-level sibling divs for .service-image and .service-content within the same .service-row`);
    return;
  }

  if (!hasFirst || !hasSecond) {
    fail(
      `${label}: expected top-level child order "${expectedFirst}" then "${expectedSecond}" on desktop. ` +
        `Found child[0]="${first}" child[1]="${second}".`
    );
  } else {
    ok(`${label}: top-level child order is ${expectedFirst} then ${expectedSecond}`);
  }
}

function main() {
  if (!fs.existsSync(SERVICES_HTML)) {
    console.error(`Missing file: services.html`);
    process.exit(1);
  }

  const html = readText(SERVICES_HTML);

  // Required body class.
  if (!/class\s*=\s*"[^"]*\bpage-services\b[^"]*"/i.test(html)) {
    fail(`Body is missing required class "page-services"`);
  } else {
    ok(`Body has class "page-services"`);
  }

  // A1: hero shader must be blue on services.
  const variant = extractHeroCanvasVariant(html);
  if (variant !== "blue") {
    fail(`services.html: expected #hero-shader-canvas data-variant="blue", got ${variant === null ? "no data-variant" : JSON.stringify(variant)}`);
  } else {
    ok(`services.html: hero shader variant is blue`);
  }

  // C1: Core Bundle Bullets heading must be two-line and correctly cased.
  if (html.includes("Core bundle bullets (applies across packs):")) {
    fail(`Found old heading text: "Core bundle bullets (applies across packs):" (must be replaced)`);
  } else {
    ok(`Old Core bundle bullets one-line heading is not present`);
  }

  if (!html.includes("Core Bundle Bullets:")) {
    fail(`Missing required heading line: "Core Bundle Bullets:"`);
  } else {
    ok(`Found heading line "Core Bundle Bullets:"`);
  }

  if (!html.includes("(applies across packs)")) {
    fail(`Missing required subheading line: "(applies across packs)"`);
  } else {
    ok(`Found subheading line "(applies across packs)"`);
  }

  // Encourage matching the existing "General Service Lines" markup technique by checking for spans.
  const coreBundleHeadingSpanCheck = /Core Bundle Bullets:\s*<\/span>\s*<span[^>]*>\s*\(applies across packs\)/i;
  if (!coreBundleHeadingSpanCheck.test(html)) {
    fail(
      `Core Bundle Bullets heading does not appear to use the same two-span line-break technique as "General Service Lines". ` +
        `Expected two consecutive <span> blocks with the required strings.`
    );
  } else {
    ok(`Core Bundle Bullets heading appears to use two-span line-break technique`);
  }

  // E: compact-section count should be 9 after adding to sections 2,3,5.
  const compactCount = countOccurrences(html, "compact-section");
  if (compactCount !== 9) {
    fail(`Expected services.html to contain 9 occurrences of "compact-section" after spacing changes; found ${compactCount}`);
  } else {
    ok(`services.html compact-section count is 9`);
  }

  // C2: Unstable nth-of-type ordering rule must be removed.
  if (fs.existsSync(CARDS_CSS)) {
    const css = readText(CARDS_CSS);
    if (/service-row\s*:\s*nth-of-type\s*\(/i.test(css) || /service-row:nth-of-type/i.test(css)) {
      fail(`src/css/components/cards.css still contains a service-row:nth-of-type(...) ordering rule; remove/neutralize it (it is unstable)`);
    } else {
      ok(`cards.css does not contain service-row:nth-of-type ordering rule`);
    }
  } else {
    fail(`Missing expected CSS file: src/css/components/cards.css`);
  }

  // C2 + G: Validate the four image/card rows DOM structure and order.
  const pairs = [
    { img: "General_Services_1.jpeg", expected: ["service-image", "service-content"] },
    { img: "General_Services_2A.jpeg", expected: ["service-content", "service-image"] },
    { img: "General_Services_2B.jpeg", expected: ["service-image", "service-content"] },
    { img: "General_Services_3.jpeg", expected: ["service-content", "service-image"] },
  ];

  for (const p of pairs) {
    const row = extractServiceRowBlockForImage(html, p.img);
    if (!row) {
      fail(`Could not locate a .service-row block containing image "${p.img}"`);
      continue;
    }
    assertTopLevelImageCardOrder(row, p.expected[0], p.expected[1], p.img);
  }

  if (process.exitCode) {
    console.error("\nservices.html validation FAILED.");
    process.exit(1);
  } else {
    console.log("\nservices.html validation PASSED.");
  }
}

main();
