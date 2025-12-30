# FILE: scripts/codex.requested-edits.sh
#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "[codex.requested-edits] Rebuilding bundles…"
npm run build:css
npm run build:js

echo "[codex.requested-edits] UI inventory (non-fatal)…"
node scripts/ui-audit.js || true

echo "[codex.requested-edits] Running UI spec grader…"
node scripts/assert-ui-spec.js

echo "[codex.requested-edits] PASS"
