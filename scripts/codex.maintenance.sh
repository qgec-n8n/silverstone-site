# FILE: scripts/codex.maintenance.sh
#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "[codex.maintenance] Running repo maintenance for active ExecPlan"
echo "[codex.maintenance] Active ExecPlan: codex/execplans/2026-01-19_restore-wheel-scroll.md"
echo

if command -v npm >/dev/null 2>&1; then
  echo "[codex.maintenance] Rebuilding bundles (safe, deterministic concat)..."
  npm run build:css
  npm run build:js
else
  echo "[codex.maintenance] npm not found; skipping rebuild"
fi

echo
echo "[codex.maintenance] Running scroll-lock audit (non-fatal)..."
bash scripts/codex.audit.scroll-lock.sh || true

echo
echo "[codex.maintenance] Done."
