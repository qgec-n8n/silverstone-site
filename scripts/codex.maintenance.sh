# FILE: scripts/codex.maintenance.sh
#!/usr/bin/env bash
set -euo pipefail

echo "[codex.maintenance] Rebuilding build outputs..."
npm run build:css
npm run build:js

echo "[codex.maintenance] Validating core + niche shader variants..."
node scripts/validate-core-pages.js

echo "[codex.maintenance] Validating Requested Edits 1–6..."
node scripts/validate-requested-edits.js --strict

echo "[codex.maintenance] Validating required SPEC proof markers..."
node scripts/assert-ui-spec.js

echo "[codex.maintenance] ✅ All checks passed."
