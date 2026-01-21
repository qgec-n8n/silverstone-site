# FILE: scripts/codex.diff.summary.sh
#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${REPO_ROOT}"

if ! command -v git >/dev/null 2>&1; then
  echo "ERROR: git is required."
  exit 2
fi

echo "== git status (porcelain) =="
git status --porcelain=v1 || true
echo

echo "== git diff --stat =="
git diff --stat || true
echo

echo "== git diff --name-only =="
git diff --name-only || true
echo

echo "== Reminder =="
echo "- Diff should remain minimal and strictly related to the two targeted outcomes."
echo "- Avoid unrelated formatting or refactors."
