# FILE: scripts/codex.maintenance.sh
#!/usr/bin/env bash
set -euo pipefail

echo "[codex.maintenance] Rebuilding build outputs..."
node build-css.js
node scripts/build-js.js

echo "[codex.maintenance] Validating marquee image list (must match assets/images/socialmedia)..."
node scripts/generate-marquee-images.js --check

echo "[codex.maintenance] Validating hero shader variants on core + niche pages..."
node scripts/validate-core-pages.js

echo "[codex.maintenance] Validating services page requirements..."
node scripts/validate-services-page.js

echo "[codex.maintenance] Validating niche pages requirements..."
node scripts/validate-niche-pages.js

echo "[codex.maintenance] Validating general UI invariants..."
node scripts/assert-ui-spec.js

echo "[codex.maintenance] ✅ All checks passed."
