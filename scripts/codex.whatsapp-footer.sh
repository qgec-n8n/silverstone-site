# FILE: scripts/codex.whatsapp-footer.sh
#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "[codex.whatsapp-footer] Rebuilding bundles…"
npm run build:css
npm run build:js

echo "[codex.whatsapp-footer] UI inventory (non-fatal)…"
node scripts/ui-audit.js || true

echo "[codex.whatsapp-footer] Running WhatsApp/Footer spec grader…"
node scripts/assert-whatsapp-footer.js

echo "[codex.whatsapp-footer] PASS"
