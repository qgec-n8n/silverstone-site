# FILE: scripts/codex.setup.sh
#!/usr/bin/env bash
set -euo pipefail

echo "[codex.setup] Installing root dependencies..."
npm ci

echo "[codex.setup] Building CSS + JS outputs..."
npm run build:css
npm run build:js

echo "[codex.setup] ✅ Setup complete."
echo "[codex.setup] Next: bash scripts/codex.requested-edits.sh"
