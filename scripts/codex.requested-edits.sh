# FILE: scripts/codex.requested-edits.sh
set -euo pipefail

echo "Codex Requested Edits — build (css/js + pricing widget) + validate"
echo

# 1) Root deps (optional)
if [[ "${CODEX_SKIP_NPM:-0}" == "1" ]]; then
  echo "1) Skipping root npm install (CODEX_SKIP_NPM=1)"
else
  echo "1) Installing root dependencies (best-effort)"
  npm install --no-fund --no-audit || echo "WARN: root npm install failed (continuing)"
fi
echo

# 2) Build site bundles (CSS/JS only; avoid image optimization noise)
if [[ "${CODEX_SKIP_BUILD:-0}" == "1" ]]; then
  echo "2) Skipping site build (CODEX_SKIP_BUILD=1)"
else
  echo "2) Building site CSS/JS (no image optimization)"
  npm run build:css
  npm run build:js
fi
echo

# 3) Build pricing widget (produces assets/css/pricing-widget.css + assets/js/pricing-widget.js)
if [[ "${CODEX_SKIP_WIDGET_BUILD:-0}" == "1" ]]; then
  echo "3) Skipping pricing widget build (CODEX_SKIP_WIDGET_BUILD=1)"
else
  echo "3) Building pricing widget"
  pushd pricing-widget >/dev/null
    if [[ "${CODEX_SKIP_NPM:-0}" == "1" ]]; then
      echo "   - Skipping pricing-widget npm install (CODEX_SKIP_NPM=1)"
    else
      npm install --no-fund --no-audit || echo "WARN: pricing-widget npm install failed (continuing)"
    fi
    npm run build
  popd >/dev/null
fi
echo

# 4) Run validators (strict)
echo "4) Running validators"
node scripts/validate-core-pages.js --strict
node scripts/validate-services-page.js --strict
node scripts/validate-niche-pages.js --strict
node scripts/validate-pricing-copy-map.js --strict
node scripts/validate-pricing-mounts.js --strict
node scripts/validate-pricing-ui-tuning.js --strict
node scripts/validate-requested-edits.js --strict

echo
echo "✅ All requested-edits validators passed."
