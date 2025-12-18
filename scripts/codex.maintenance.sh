# FILE: scripts/codex.maintenance.sh
set -euo pipefail

echo "Codex maintenance: build + validations"
echo ""

echo "1) Install dependencies"
if [ "${CODEX_SKIP_NPM:-0}" = "1" ]; then
  echo "   Skipping npm install (CODEX_SKIP_NPM=1)"
else
  # In some sandboxed environments network access may be disabled.
  npm install || echo "WARN: npm install failed. Continuing (validations may still run)."
fi
echo ""

echo "2) Build pricing widget (only if implemented)"
WIDGET_ASSETS_PRESENT=0
if [ -f "assets/js/pricing-widget.js" ] && [ -f "assets/css/pricing-widget.css" ]; then
  WIDGET_ASSETS_PRESENT=1
fi

if [ "${CODEX_SKIP_WIDGET_BUILD:-0}" = "1" ]; then
  echo "   Skipping widget build (CODEX_SKIP_WIDGET_BUILD=1)"
elif [ "${CODEX_FORCE_WIDGET_BUILD:-0}" != "1" ] && [ "$WIDGET_ASSETS_PRESENT" = "1" ]; then
  echo "   Widget assets already present; skipping widget build (set CODEX_FORCE_WIDGET_BUILD=1 to rebuild)"
elif [ -f "pricing-widget/package.json" ]; then
  echo "   Detected pricing-widget/; installing deps + building widget"
  (cd pricing-widget && npm install && npm run build) || echo "WARN: widget build failed."
else
  echo "   pricing-widget/ not present; skipping widget build"
fi
echo ""

echo "3) Build site (best-effort; may require deps)"
if [ "${CODEX_SKIP_BUILD:-0}" = "1" ]; then
  echo "   Skipping npm run build (CODEX_SKIP_BUILD=1)"
else
  npm run build || echo "WARN: npm run build failed."
fi
echo ""

echo "4) Validate (base + pricing)"
node scripts/validate-services-page.js --strict
node scripts/validate-niche-pages.js --strict
node scripts/validate-pricing-copy-map.js
node scripts/validate-pricing-mounts.js

if [ "${CODEX_PRICING_UI_TUNING_STRICT:-0}" = "1" ]; then
  node scripts/validate-pricing-ui-tuning.js --strict
else
  node scripts/validate-pricing-ui-tuning.js || echo "WARN: pricing UI tuning validator failed (non-strict)."
fi
echo ""

echo "5) Validate (site UI fixes)"
if [ "${CODEX_SITE_UI_FIXES_STRICT:-0}" = "1" ]; then
  node scripts/validate-site-ui-fixes.js --strict
else
  node scripts/validate-site-ui-fixes.js || echo "WARN: site UI fixes validator failed (non-strict)."
fi
echo ""

echo "Maintenance complete."
