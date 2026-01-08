# FILE: scripts/codex.whatsapp.sh
#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "[codex.whatsapp] Rebuilding bundles…"
npm run build:css
npm run build:js

echo "[codex.whatsapp] UI inventory (non-fatal)…"
node scripts/ui-audit.js || true

echo "[codex.whatsapp] Running WhatsApp spec grader…"
node scripts/assert-whatsapp-spec.js

echo "[codex.whatsapp] PASS"
