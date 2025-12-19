// FILE: scripts/validate-requested-edits.js
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

function readText(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing file: ${filePath}`);
  }
  return fs.readFileSync(filePath, "utf8");
}

function fail(messages) {
  console.error("\n❌ validate-requested-edits failed:\n");
  for (const m of messages) console.error(`- ${m}`);
  console.error("");
  process.exit(1);
}

function assertContains(haystack, needle, label, errors) {
  if (!haystack.includes(needle)) {
    errors.push(`${label}: expected to find "${needle}"`);
  }
}

function assertRegex(haystack, regex, label, errors) {
  if (!regex.test(haystack)) {
    errors.push(`${label}: pattern not found (${regex})`);
  }
}

function main() {
  const errors = [];

  // --- Guardrail: ensure the services headings in scope were not altered (copy must remain unchanged).
  const servicesHtmlPath = path.join(ROOT, "services.html");
  try {
    const servicesHtml = readText(servicesHtmlPath);
    const requiredHeadings = [
      "Where revenue (and time) quietly leaks away.",
      "Start small. Ship fast. Expand when it is working.",
      "General Service Lines:",
      "What changes once the basics are automated",
    ];
    for (const h of requiredHeadings) {
      assertContains(servicesHtml, h, "services.html copy guardrail", errors);
    }
  } catch (e) {
    errors.push(`services.html unreadable: ${e.message}`);
  }

  // --- Requested Edit 3: services.html mobile image container padding (CSS)
  const servicesCssPath = path.join(ROOT, "src", "css", "pages", "services.css");
  const builtStylesPath = path.join(ROOT, "assets", "css", "styles.css");

  const servicesMarker =
    "SS_SERVICES_SPEC: MOBILE_IMAGE_CONTAINER_TIGHT_WRAP_2025_12";

  try {
    const servicesCss = readText(servicesCssPath);
    assertContains(servicesCss, servicesMarker, "services.css marker", errors);

    // Require that the mobile override exists (inside max-width: 768px) and includes
    // tight-wrap properties for container + img. We check the presence of key properties
    // rather than a fragile exact formatting match.
    assertRegex(
      servicesCss,
      /@media\s*\(max-width:\s*768px\)[\s\S]*?SS_SERVICES_SPEC: MOBILE_IMAGE_CONTAINER_TIGHT_WRAP_2025_12[\s\S]*?\.page-services\s*\.service-row\s*\.service-image[\s\S]*?\{[\s\S]*?height\s*:\s*auto[\s\S]*?display\s*:\s*block/m,
      "services.css mobile .service-image tight-wrap rule",
      errors
    );

    // Image must be width:100% and height:auto on mobile (order-independent).
    assertRegex(
      servicesCss,
      /@media\s*\(max-width:\s*768px\)[\s\S]*?SS_SERVICES_SPEC: MOBILE_IMAGE_CONTAINER_TIGHT_WRAP_2025_12[\s\S]*?\.page-services\s*\.service-row\s*\.service-image\s*(img|\.service-img)[\s\S]*?\{[\s\S]*?width\s*:\s*100%/m,
      "services.css mobile img width:100% rule",
      errors
    );
    assertRegex(
      servicesCss,
      /@media\s*\(max-width:\s*768px\)[\s\S]*?SS_SERVICES_SPEC: MOBILE_IMAGE_CONTAINER_TIGHT_WRAP_2025_12[\s\S]*?\.page-services\s*\.service-row\s*\.service-image\s*(img|\.service-img)[\s\S]*?\{[\s\S]*?height\s*:\s*auto/m,
      "services.css mobile img height:auto rule",
      errors
    );
  } catch (e) {
    errors.push(`services.css unreadable: ${e.message}`);
  }

  try {
    const builtStyles = readText(builtStylesPath);
    assertContains(
      builtStyles,
      servicesMarker,
      "assets/css/styles.css marker (services)",
      errors
    );
  } catch (e) {
    errors.push(`assets/css/styles.css unreadable: ${e.message}`);
  }

  // --- Requested Edit 4: index.html Our Services cards icon/title inline layout (CSS)
  const homeCssPath = path.join(ROOT, "src", "css", "pages", "home.css");
  const homeMarker = "SS_HOME_SPEC: SERVICE_ICON_TITLE_INLINE_2025_12";

  try {
    const homeCss = readText(homeCssPath);
    assertContains(homeCss, homeMarker, "home.css marker", errors);

    assertRegex(
      homeCss,
      /SS_HOME_SPEC: SERVICE_ICON_TITLE_INLINE_2025_12[\s\S]*?\.packages-grid\s+\.service-title[\s\S]*?\{[\s\S]*?display\s*:\s*flex[\s\S]*?\}/m,
      "home.css .service-title flex-row rule",
      errors
    );

    // Require that the icon no longer enforces a bottom margin that stacks it above the title.
    // Accept optional !important.
    assertRegex(
      homeCss,
      /\.packages-grid\s+\.service-icon-img[\s\S]*?\{[\s\S]*?margin-bottom\s*:\s*0(?:px|rem)?(?:\s*!important)?\s*;?/m,
      "home.css .service-icon-img margin-bottom reset",
      errors
    );
  } catch (e) {
    errors.push(`home.css unreadable: ${e.message}`);
  }

  try {
    const builtStyles = readText(builtStylesPath);
    assertContains(builtStyles, homeMarker, "assets/css/styles.css marker (home)", errors);
  } catch (e) {
    // already reported if unreadable; avoid duplicating
  }

  if (errors.length) fail(errors);

  console.log("✅ validate-requested-edits passed.");
}

main();
