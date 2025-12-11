# FILE: scripts/codex.maintenance.sh
#!/usr/bin/env bash
#
# Codex Cloud / CLI maintenance script for the Silverstone repo.
#
# This script is intended to run on every task start when using cached
# containers. It should be fast, idempotent, and non-destructive.
#
# Responsibilities:
# - Sanity-check the working tree.
# - Run lightweight validation or build steps, if available.
# - Prepare the environment for the refactor without doing heavy work.

set -uo pipefail

echo "[codex.maintenance] Starting maintenance for Silverstone repo."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${REPO_ROOT}"

echo "[codex.maintenance] Repo root: ${REPO_ROOT}"

# 1. Optional: git cleanliness check (non-fatal)
if command -v git >/dev/null 2>&1; then
  if ! git status --porcelain >/dev/null 2>&1; then
    echo "[codex.maintenance] WARNING: Unable to read git status."
  else
    DIRTY_COUNT="$(git status --porcelain | wc -l | tr -d ' ')"
    if [[ "${DIRTY_COUNT}" -gt 0 ]]; then
      echo "[codex.maintenance] NOTE: Working tree has ${DIRTY_COUNT} uncommitted change(s). Codex should avoid touching unrelated files."
    else
      echo "[codex.maintenance] Working tree appears clean."
    fi
  fi
else
  echo "[codex.maintenance] git not available; skipping cleanliness check."
fi

# 2. Lightweight Node-based checks
if [[ -f "package.json" ]] && command -v npm >/dev/null 2>&1; then
  echo "[codex.maintenance] Verifying key npm scripts (non-fatal)."

  # Use --if-present so missing scripts don't cause errors.
  npm run build --if-present || echo "[codex.maintenance] 'npm run build' failed; Codex should investigate if this is unexpected."
  npm run build:css --if-present || echo "[codex.maintenance] 'npm run build:css' failed; Codex should investigate if this is unexpected."
  npm run lint --if-present || echo "[codex.maintenance] 'npm run lint' failed or is not defined."
  npm test --if-present || echo "[codex.maintenance] 'npm test' failed or is not defined."
else
  echo "[codex.maintenance] No package.json or npm unavailable – skipping npm-based checks."
fi

echo "[codex.maintenance] Maintenance complete."
exit 0
