# FILE: scripts/codex.requested-edits.sh
#!/usr/bin/env bash
set -euo pipefail

echo "==> Building CSS (src -> assets/css/styles.css)"
npm run build:css

echo "==> Building JS (src -> assets/js/app.js)"
npm run build:js

echo "==> Building pricing widget (pricing-widget/src -> assets)"
pushd pricing-widget >/dev/null
npm run build
popd >/dev/null

echo "==> Running validators"
node scripts/validate-pricing-copy-map.js --strict
node scripts/validate-pricing-mounts.js --strict
node scripts/validate-pricing-ui-tuning.js

node scripts/validate-homepage-index-sections.js --strict
node scripts/validate-services-page.js --strict
node scripts/validate-niche-pages.js --strict
node scripts/validate-core-pages.js --strict

node scripts/validate-requested-edits.js --strict
node scripts/assert-ui-spec.js --strict

echo "✅ All requested-edits validations passed."
