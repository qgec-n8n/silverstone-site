# FILE: scripts/codex.maintenance.sh
set -euo pipefail

npm run build:css
npm run build:js

# Site UI fixes (A–E)
node scripts/validate-site-ui-fixes.js

# Existing validation suite
node scripts/validate-services-page.js --strict
node scripts/validate-niche-pages.js --strict
node scripts/validate-pricing-copy-map.js
node scripts/validate-pricing-mounts.js
node scripts/validate-pricing-ui-tuning.js

echo "✅ All checks passed"
