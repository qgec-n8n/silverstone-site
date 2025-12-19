# FILE: scripts/codex.requested-edits.sh
#!/usr/bin/env bash
set -euo pipefail

echo "=== Codex requested edits: setup ==="
bash scripts/codex.setup.sh

echo "=== Build main CSS ==="
node build-css.js

echo "=== Build main JS ==="
node scripts/build-js.js

echo "=== Build pricing widget ==="
pushd pricing-widget >/dev/null
npm install
npm run build
popd >/dev/null

echo "=== Validate core pages ==="
node scripts/validate-core-pages.js --strict

echo "=== Validate pricing mounts ==="
node scripts/validate-pricing-mounts.js --strict

echo "=== Validate requested edits (1–8) ==="
node scripts/validate-requested-edits.js --strict

echo "=== Validate services page ==="
node scripts/validate-services-page.js --strict

echo "=== Validate niche pages ==="
node scripts/validate-niche-pages.js --strict

echo "=== Validate pricing UI tuning ==="
node scripts/validate-pricing-ui-tuning.js --strict

echo "✅ All requested edits validations passed."
