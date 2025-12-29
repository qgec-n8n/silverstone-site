# FILE: scripts/codex.requested-edits.sh
#!/usr/bin/env bash
set -euo pipefail

echo "[codex.requested-edits] Building CSS..."
npm run build:css

echo "[codex.requested-edits] Building JS..."
npm run build:js

echo "[codex.requested-edits] Checking required SPEC markers (proof-of-change anchors)..."
node scripts/assert-ui-spec.js

echo "[codex.requested-edits] Validating core + niche page shader variants..."
node scripts/validate-core-pages.js

echo "[codex.requested-edits] Validating Requested Edits 1–6..."
node scripts/validate-requested-edits.js --strict

echo "[codex.requested-edits] ✅ All checks passed."
