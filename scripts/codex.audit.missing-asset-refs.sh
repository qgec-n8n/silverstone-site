# FILE: scripts/codex.audit.missing-asset-refs.sh
#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${REPO_ROOT}"

if ! command -v rg >/dev/null 2>&1; then
  echo "ERROR: This script requires ripgrep (rg)."
  exit 2
fi

echo "== Scanning for referenced asset paths and verifying they exist =="
echo

scan_and_check() {
  local label="$1"
  local pattern="$2"

  echo "-- ${label} --"
  local refs
  refs="$(rg -o --no-filename -S "${pattern}" . \
    --glob '!.git/**' \
    --glob '!node_modules/**' \
    --glob '!artifacts/**' \
    | sort -u || true
  )"

  if [[ -z "${refs}" ]]; then
    echo "(no matches)"
    echo
    return 0
  fi

  local missing=0
  while IFS= read -r ref; do
    [[ -z "${ref}" ]] && continue
    # Strip trailing punctuation commonly found in HTML/JS/CSS contexts.
    local path="${ref%\"}"
    path="${path%\'}"
    path="${path%)}"
    path="${path%,}"

    # Only check repo-relative paths that start with assets/
    if [[ "${path}" == assets/* ]]; then
      if [[ ! -f "${path}" ]]; then
        echo "MISSING: ${path}"
        missing=1
      fi
    fi
  done <<< "${refs}"

  if [[ "${missing}" -eq 0 ]]; then
    echo "OK: no missing ${label} assets found (for paths starting with assets/)."
  fi
  echo
}

# Common asset reference patterns we care about for console/network 404s.
scan_and_check "CSS references" "assets/css/[A-Za-z0-9._/-]+\\.css"
scan_and_check "JS references"  "assets/js/[A-Za-z0-9._/-]+\\.js"
scan_and_check "Image references" "assets/images/[A-Za-z0-9._/-]+\\.(png|jpe?g|webp|svg|ico)"

echo "NOTE:"
echo "- This is a heuristic check. Runtime-generated URLs (JS-created) may not be fully covered."
echo "- Use DevTools Network + the ExecPlan to confirm runtime 404s are eliminated."
