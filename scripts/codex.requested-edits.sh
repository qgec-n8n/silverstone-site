# FILE: scripts/codex.requested-edits.sh
#!/usr/bin/env bash
set -euo pipefail

echo "=== Install + build (repo root) ==="
npm install
node scripts/build-css.js
node scripts/build-js.js

echo "=== Build pricing widget outputs ==="
pushd pricing-widget >/dev/null
npm install
npm run build
popd >/dev/null

echo "=== Validate core pages ==="
node scripts/validate-core-pages.js

echo "=== Validate services page ==="
node scripts/validate-services-page.js

echo "=== Validate niche pages ==="
node scripts/validate-niche-pages.js

echo "=== Validate pricing mounts ==="
node scripts/validate-pricing-mounts.js

echo "=== Validate pricing UI (Requested Edits 1–2) ==="
node scripts/validate-pricing-ui-tuning.js --strict

echo "=== Validate requested UI edits (1–5) ==="
node scripts/validate-requested-edits.js --strict

echo "=== All validations passed ==="
