# FILE: scripts/codex.setup.sh
#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "[codex.setup] Repo root: $REPO_ROOT"

if ! command -v node >/dev/null 2>&1; then
  echo "[codex.setup] ERROR: node is not installed or not on PATH."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "[codex.setup] ERROR: npm is not installed or not on PATH."
  exit 1
fi

echo "[codex.setup] node: $(node --version)"
echo "[codex.setup] npm:  $(npm --version)"

echo "[codex.setup] Installing dependencies (npm ci)…"
npm ci

echo "[codex.setup] Building CSS/JS bundles once to confirm toolchain…"
npm run build:css
npm run build:js

echo "[codex.setup] Setup complete."
