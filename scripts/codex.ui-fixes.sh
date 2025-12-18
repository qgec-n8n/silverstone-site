# FILE: scripts/codex.ui-fixes.sh
set -euo pipefail

echo "== Build assets =="
npm run build:css
npm run build:js

echo "== Validate Site UI fixes (A–E) =="
node scripts/validate-site-ui-fixes.js

echo "== Regression suite (pricing + page structure) =="
node scripts/validate-services-page.js --strict
node scripts/validate-niche-pages.js --strict
node scripts/validate-pricing-mounts.js
node scripts/validate-pricing-copy-map.js
node scripts/validate-pricing-ui-tuning.js

echo "✅ codex.ui-fixes.sh completed successfully"
