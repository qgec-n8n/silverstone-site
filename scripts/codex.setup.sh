# FILE: scripts/codex.setup.sh
#!/usr/bin/env bash
#
# Codex Cloud / CLI setup script for the Silverstone repo.
#
# This script is intended to run when a new Codex Cloud container is created
# for this environment. It may also be run manually by humans.
#
# Responsibilities:
# - Ensure Node.js dependencies are installed.
# - Prime any build artifacts that are useful to cache.
# - Run only work that benefits from container caching (potentially heavier).
#
# The script should be safe to run multiple times.

set -euo pipefail

echo "[codex.setup] Starting setup for Silverstone repo."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${REPO_ROOT}"

echo "[codex.setup] Repo root: ${REPO_ROOT}"

# 1. Basic environment inspection
echo "[codex.setup] Checking Node and npm availability..."
if ! command -v node >/dev/null 2>&1; then
  echo "[codex.setup] WARNING: 'node' is not available on PATH. Node-based tooling may fail."
else
  node --version || true
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "[codex.setup] WARNING: 'npm' is not available on PATH. Dependency installation will be skipped."
fi

# 2. Install Node dependencies (if package.json exists)
if [[ -f "package.json" ]] && command -v npm >/dev/null 2>&1; then
  echo "[codex.setup] Found package.json – installing dependencies."

  # Prefer npm ci when a lockfile is present.
  if [[ -f "package-lock.json" ]]; then
    echo "[codex.setup] Using 'npm ci' with existing package-lock.json."
    npm ci --no-fund --no-audit
  else
    echo "[codex.setup] Using 'npm install' (no lockfile present)."
    npm install --no-fund --no-audit
  fi
else
  echo "[codex.setup] No package.json found or npm unavailable – skipping Node dependency installation."
fi

# 3. Optional: prime existing build artifacts
if command -v npm >/dev/null 2>&1 && [[ -f "package.json" ]]; then
  # Run build scripts only if defined; this leverages container caching.
  echo "[codex.setup] Checking for existing build scripts to prime cache..."

  # 'npm run <script> --if-present' will no-op if the script does not exist.
  npm run build --if-present || echo "[codex.setup] 'npm run build' failed or is not defined; continuing."
  npm run build:css --if-present || echo "[codex.setup] 'npm run build:css' failed or is not defined; continuing."
else
  echo "[codex.setup] Skipping build priming – npm or package.json missing."
fi

echo "[codex.setup] Setup complete."
