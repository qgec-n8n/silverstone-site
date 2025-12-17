# FILE: scripts/codex.pricing-tuning.sh
set -euo pipefail

echo "Codex pricing UI tuning: widget build + validations"
echo ""

echo "1) Install dependencies"
if [ "${CODEX_SKIP_NPM:-0}" = "1" ]; then
  echo "   Skipping npm install (CODEX_SKIP_NPM=1)"
else
  npm install || echo "WARN: npm install failed. Continuing (validations may still run)."
fi
echo ""

echo "2) Build pricing widget"
if [ "${CODEX_SKIP_WIDGET_BUILD:-0}" = "1" ]; then
  echo "   Skipping widget build (CODEX_SKIP_WIDGET_BUILD=1)"
else
  if [ -f "pricing-widget/package.json" ]; then
    echo "   Detected pricing-widget/; installing deps + building widget"
    (cd pricing-widget && npm install && npm run build)
  else
    echo "   pricing-widget/ not present; cannot build widget"
    exit 1
  fi
fi
echo ""

echo "3) Validate (base + pricing + tuning)"
node scripts/validate-services-page.js --strict
node scripts/validate-niche-pages.js --strict
node scripts/validate-pricing-copy-map.js
node scripts/validate-pricing-mounts.js
node scripts/validate-pricing-ui-tuning.js --strict
echo ""

echo "Pricing UI tuning validations complete."
