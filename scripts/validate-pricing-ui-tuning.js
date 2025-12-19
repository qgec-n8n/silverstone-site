// FILE: scripts/validate-pricing-ui-tuning.js
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
  console.error("\n❌ validate-pricing-ui-tuning failed:\n");
  for (const m of messages) console.error(`- ${m}`);
  console.error("");
  process.exit(1);
}

function assertContains(haystack, needle, label, errors) {
  if (!haystack.includes(needle)) {
    errors.push(`${label}: expected to find "${needle}"`);
  }
}

function assertRange(value, { min, max }, label, errors) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    errors.push(`${label}: expected a number, got "${value}"`);
    return;
  }
  if (value < min || value > max) {
    errors.push(`${label}: expected in [${min}, ${max}], got ${value}`);
  }
}

function extractAlphasFromLightModeBg(css) {
  // Match the light-mode background definition that includes:
  // - linear-gradient(135deg, rgba(255,255,255,a1) ..., rgba(236,245,255,a2) ..., rgba(214,232,255,a3) ...)
  // - radial-gradient(circle at 20% 18%, rgba(0,174,239,b1) 0%, rgba(0,174,239,b2) 45%, ...)
  // - radial-gradient(circle at 82% 12%, rgba(255,79,216,p1) 0%, rgba(255,79,216,p2) 45%, ...)
  const linearRe =
    /linear-gradient\(\s*135deg\s*,\s*rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*(0\.\d+)\s*\)\s*0%\s*,\s*rgba\(\s*236\s*,\s*245\s*,\s*255\s*,\s*(0\.\d+)\s*\)\s*42%\s*,\s*rgba\(\s*214\s*,\s*232\s*,\s*255\s*,\s*(0\.\d+)\s*\)\s*100%\s*\)/m;

  const blueRe =
    /radial-gradient\(\s*circle at\s*20%\s*18%\s*,[\s\S]*?rgba\(\s*0\s*,\s*174\s*,\s*239\s*,\s*(0\.\d+)\s*\)\s*0%\s*,\s*rgba\(\s*0\s*,\s*174\s*,\s*239\s*,\s*(0\.\d+)\s*\)\s*45%\s*,/m;

  const pinkRe =
    /radial-gradient\(\s*circle at\s*82%\s*12%\s*,[\s\S]*?rgba\(\s*255\s*,\s*79\s*,\s*216\s*,\s*(0\.\d+)\s*\)\s*0%\s*,\s*rgba\(\s*255\s*,\s*79\s*,\s*216\s*,\s*(0\.\d+)\s*\)\s*45%\s*,/m;

  const linearMatch = css.match(linearRe);
  const blueMatch = css.match(blueRe);
  const pinkMatch = css.match(pinkRe);

  return {
    linear: linearMatch
      ? {
          start: parseFloat(linearMatch[1]),
          mid: parseFloat(linearMatch[2]),
          end: parseFloat(linearMatch[3]),
        }
      : null,
    blue: blueMatch
      ? { a0: parseFloat(blueMatch[1]), a45: parseFloat(blueMatch[2]) }
      : null,
    pink: pinkMatch
      ? { a0: parseFloat(pinkMatch[1]), a45: parseFloat(pinkMatch[2]) }
      : null,
  };
}

function validateCssFile(label, cssText, errors) {
  // Required markers for this request.
  assertContains(
    cssText,
    "SS_PRICING_SPEC: LIGHT_MODE_WASHOUT_TUNING_2025_12",
    `${label} marker`,
    errors
  );
  assertContains(
    cssText,
    "SS_PRICING_SPEC: CTA_BUTTON_ROW_ALIGNMENT_2025_12",
    `${label} marker`,
    errors
  );

  // 1) Washout tuning: ensure the “light mode” gradient has boosted blue/pink and reduced whitewash.
  const alphas = extractAlphasFromLightModeBg(cssText);

  if (!alphas.linear) {
    errors.push(
      `${label}: could not parse light-mode linear-gradient alphas (expected 135deg rgba(255/236/214...) pattern)`
    );
  } else {
    assertRange(
      alphas.linear.start,
      { min: 0.88, max: 0.95 },
      `${label}: white linear-gradient start alpha`,
      errors
    );
    assertRange(
      alphas.linear.mid,
      { min: 0.84, max: 0.92 },
      `${label}: white linear-gradient mid alpha`,
      errors
    );
    assertRange(
      alphas.linear.end,
      { min: 0.8, max: 0.88 },
      `${label}: white linear-gradient end alpha`,
      errors
    );
  }

  if (!alphas.blue) {
    errors.push(
      `${label}: could not parse light-mode blue radial-gradient alphas (expected circle at 20% 18% rgba(0,174,239,...) pattern)`
    );
  } else {
    assertRange(
      alphas.blue.a0,
      { min: 0.34, max: 0.55 },
      `${label}: blue radial-gradient alpha at 0%`,
      errors
    );
    assertRange(
      alphas.blue.a45,
      { min: 0.2, max: 0.4 },
      `${label}: blue radial-gradient alpha at 45%`,
      errors
    );
  }

  if (!alphas.pink) {
    errors.push(
      `${label}: could not parse light-mode pink radial-gradient alphas (expected circle at 82% 12% rgba(255,79,216,...) pattern)`
    );
  } else {
    assertRange(
      alphas.pink.a0,
      { min: 0.3, max: 0.5 },
      `${label}: pink radial-gradient alpha at 0%`,
      errors
    );
    assertRange(
      alphas.pink.a45,
      { min: 0.18, max: 0.35 },
      `${label}: pink radial-gradient alpha at 45%`,
      errors
    );
  }

  // 2) CTA alignment: enforce deterministic anchoring in CSS.
  const ctaHasAutoMargin = /\.ss-pricing__cta\s*\{[\s\S]*?margin-top\s*:\s*auto\s*;[\s\S]*?\}/m.test(
    cssText
  );
  if (!ctaHasAutoMargin) {
    errors.push(
      `${label}: expected ".ss-pricing__cta" to include "margin-top: auto;" for row alignment`
    );
  }

  const includesBlock = cssText.match(/\.ss-pricing__includes\s*\{[\s\S]*?\}/m);
  if (!includesBlock) {
    errors.push(`${label}: could not find ".ss-pricing__includes { ... }" block`);
  } else if (/margin-top\s*:\s*auto\s*;/.test(includesBlock[0])) {
    errors.push(
      `${label}: ".ss-pricing__includes" must NOT use "margin-top: auto;" (it prevents CTA alignment)`
    );
  }
}

function main() {
  const errors = [];

  const srcCssPath = path.join(
    ROOT,
    "pricing-widget",
    "src",
    "pricing-widget.css"
  );
  const builtCssPath = path.join(ROOT, "assets", "css", "pricing-widget.css");

  let srcCss = "";
  let builtCss = "";

  try {
    srcCss = readText(srcCssPath);
  } catch (e) {
    errors.push(`Source pricing CSS missing/unreadable: ${e.message}`);
  }

  try {
    builtCss = readText(builtCssPath);
  } catch (e) {
    errors.push(`Built pricing CSS missing/unreadable: ${e.message}`);
  }

  if (srcCss) validateCssFile("pricing-widget/src/pricing-widget.css", srcCss, errors);
  if (builtCss) validateCssFile("assets/css/pricing-widget.css", builtCss, errors);

  if (errors.length) fail(errors);

  console.log("✅ validate-pricing-ui-tuning passed.");
}

main();
