# FILE: scripts/codex.audit.console-404s.sh
#!/usr/bin/env bash
set -euo pipefail

LOG_PATH="${1:-}"

if [[ -z "${LOG_PATH}" ]]; then
  echo "Usage: bash scripts/codex.audit.console-404s.sh <path-to-chrome-console-log>"
  echo "Example: bash scripts/codex.audit.console-404s.sh artifacts/input/desktop-console.log"
  exit 2
fi

if [[ ! -f "${LOG_PATH}" ]]; then
  echo "ERROR: log file not found: ${LOG_PATH}"
  exit 2
fi

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${REPO_ROOT}"

echo "== Console log: ${LOG_PATH} =="
echo

echo "== Raw lines containing 404 =="
grep -nE "404" "${LOG_PATH}" || true
echo

echo "== Extracted resource tokens (unique, from the log) =="
# Extract common static resource tokens mentioned in console logs, e.g. custom.css:1, /assets/css/foo.css, etc.
TOKENS="$(
  grep -oE "[A-Za-z0-9._/-]+\\.(css|js|png|jpe?g|webp|svg|ico|map|json|woff2?|ttf)" "${LOG_PATH}" \
  | sed 's/:$//' \
  | sort -u
)"

if [[ -z "${TOKENS}" ]]; then
  echo "(none found)"
else
  echo "${TOKENS}"
fi
echo

echo "== Repo references for extracted tokens (excluding node_modules) =="
if command -v rg >/dev/null 2>&1; then
  while IFS= read -r token; do
    [[ -z "${token}" ]] && continue
    echo
    echo "-- References for: ${token} --"
    rg -n --hidden --no-follow -S "${token}" . \
      --glob '!.git/**' \
      --glob '!node_modules/**' \
      --glob '!artifacts/**' \
      || true
  done <<< "${TOKENS}"
else
  echo "NOTE: ripgrep (rg) not found; falling back to grep -R (slower, noisier)."
  while IFS= read -r token; do
    [[ -z "${token}" ]] && continue
    echo
    echo "-- References for: ${token} --"
    grep -RIn "${token}" . \
      --exclude-dir node_modules \
      --exclude-dir .git \
      --exclude-dir artifacts \
      || true
  done <<< "${TOKENS}"
fi
echo

echo "== Quick check: JS-injected stylesheet candidates =="
# This is tailored to the common pattern in this repo: ensureStylesheet('...').
if command -v rg >/dev/null 2>&1; then
  rg -n --hidden --no-follow -S "ensureStylesheet\\(" src/js/app.js assets/js/app.js \
    --glob '!.git/**' \
    --glob '!node_modules/**' \
    || true
else
  grep -n "ensureStylesheet(" src/js/app.js assets/js/app.js || true
fi
echo

echo "== Next steps (manual) =="
echo "1) Map each 404 token to its initiator (DevTools Network 'Initiator' + stack)."
echo "2) Confirm whether the missing request happens on:"
echo "   - root pages only, or"
echo "   - subdirectory pages (e.g., niches/*) due to relative-path resolution."
echo "3) Choose the smallest fix that removes the request (or makes it 200) without changing visuals."
