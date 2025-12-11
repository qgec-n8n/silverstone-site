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
# - Prepare the environment for refactors and bugfixes without doing heavy work.

set -uo pipefail

echo "[codex.maintenance] Starting maintenance for Silverstone repo."

# 1. Sanity check the working tree
if command -v git >/dev/null 2>&1; then
  # Avoid failing the task if git is not available (e.g., in some environments).
  if ! git diff --quiet --ignore-submodules HEAD -- 2>/dev/null; then
    echo "[codex.maintenance] Warning: there are uncommitted changes in the working tree."
    echo "[codex.maintenance] Codex should describe what it changed before exiting."
  else
    echo "[codex.maintenance] Working tree is clean."
  fi
else
  echo "[codex.maintenance] git not found; skipping working tree checks."
fi

# 2. Lightweight Node-based checks
if [[ -f "package.json" ]] && command -v npm >/dev/null 2>&1; then
  echo "[codex.maintenance] Verifying key npm scripts (non-fatal)."

  # Use --if-present so missing scripts don't cause errors.
  # For maintenance, prefer incremental CSS/JS builds over the heavy 'build' script.
  npm run build:css --if-present || echo "[codex.maintenance] 'npm run build:css' failed; Codex should investigate if this is unexpected."
  npm run build:js --if-present || echo "[codex.maintenance] 'npm run build:js' failed; Codex should investigate if this is unexpected."
  npm run lint --if-present || echo "[codex.maintenance] 'npm run lint' failed or is not defined."
  npm test --if-present || echo "[codex.maintenance] 'npm test' failed or is not defined (expected for this repo)."
else
  echo "[codex.maintenance] No package.json or npm unavailable – skipping npm-based checks."
fi

echo "[codex.maintenance] Maintenance complete."
exit 0
