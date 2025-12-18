# FILE: scripts/codex.homepage-index-sections.sh
#!/usr/bin/env bash
set -euo pipefail

echo "Codex homepage index sections: pricing sync/build + validations"
echo ""

echo "1) Install root dependencies (optional)"
if [ "${CODEX_SKIP_NPM:-0}" = "1" ]; then
  echo "   Skipping npm install (CODEX_SKIP_NPM=1)"
else
  if [ -f "package.json" ]; then
    npm install --no-fund --no-audit || echo "WARN: npm install failed; continuing."
  else
    echo "   No package.json at repo root; skipping."
  fi
fi
echo ""

echo "2) Sync pricing copy map markdown -> widget JSON"
node scripts/validate-pricing-copy-map.js --json-out pricing-widget/src/pricing-copy-map.json
echo ""

echo "3) Build pricing widget outputs"
if [ "${CODEX_SKIP_WIDGET_BUILD:-0}" = "1" ]; then
  echo "   Skipping widget build (CODEX_SKIP_WIDGET_BUILD=1)"
else
  if [ -f "pricing-widget/package.json" ]; then
    (cd pricing-widget && npm install && npm run build)
  else
    echo "ERROR: pricing-widget/package.json not found."
    exit 1
  fi
fi
echo ""

echo "4) Validate pricing + homepage"
node scripts/validate-pricing-copy-map.js
node scripts/validate-pricing-mounts.js
node scripts/validate-homepage-index-sections.js
echo ""

echo "5) Recommended regression checks"
node scripts/validate-core-pages.js
node scripts/validate-services-page.js --strict
node scripts/validate-niche-pages.js --strict
echo ""

echo "✅ Homepage sections pipeline complete."
