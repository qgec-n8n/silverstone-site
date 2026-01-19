# FILE: scripts/codex.validate.scroll.sh
#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

STAMP="$(date +%Y%m%d_%H%M%S)"
OUT_DIR="artifacts/codex_scroll_validate/${STAMP}"
mkdir -p "$OUT_DIR"

REPORT="${OUT_DIR}/validate.txt"

# Guardrail helper for git-based repos.
in_git_repo() {
  git rev-parse --is-inside-work-tree >/dev/null 2>&1
}

changed_files() {
  # Files changed in working tree (staged or unstaged).
  git status --porcelain | awk '{print $2}' | sed 's/^"\\(.*\\)"$/\\1/' || true
}

fail_if_changed() {
  local pattern="$1"
  local label="$2"
  local allow_env="${3:-}"

  local matches=""
  matches="$(changed_files | grep -E "$pattern" || true)"

  if [[ -n "$matches" ]]; then
    echo
    echo "[guardrail] Unexpected changes detected (${label}):"
    echo "$matches" | sed 's/^/  - /'

    if [[ -n "$allow_env" && "${!allow_env:-}" == "1" ]]; then
      echo "[guardrail] Override acknowledged via ${allow_env}=1"
    else
      echo "[guardrail] FAIL: revert these changes or explicitly override (if truly required)."
      echo "[guardrail] (If override is needed, set ${allow_env}=1 for this run and justify in the ExecPlan.)"
      exit 2
    fi
  fi
}

{
  echo "[codex_scroll_validate] repo_root=${REPO_ROOT}"
  echo "[codex_scroll_validate] timestamp=${STAMP}"
  echo
  echo "This script runs build + static audits, and (if git is available) applies guardrails against unrelated changes."
  echo

  echo "========================================"
  echo "1) Build bundles (CSS/JS)"
  echo "========================================"
  if command -v npm >/dev/null 2>&1; then
    npm run build:css
    npm run build:js
  else
    echo "npm not found; skipping build step."
  fi

  echo
  echo "========================================"
  echo "2) Static scroll-lock audit"
  echo "========================================"
  bash scripts/codex.audit.scroll-lock.sh

  echo
  echo "========================================"
  echo "3) Page inventory"
  echo "========================================"
  bash scripts/codex.inventory.pages.sh

  echo
  echo "========================================"
  echo "4) Guardrails (git repos only)"
  echo "========================================"
  if in_git_repo; then
    echo "git repo detected."
    echo
    echo "Changed files:"
    git status --porcelain || true

    # Hard “no scope drift” guards (should never change for this bug).
    fail_if_changed '^assets/images/|^assets/img/|^assets/videos/|^assets/webfonts/|^assets/fonts/' "static assets (visual diffs)" "ALLOW_STATIC_ASSET_CHANGES"
    fail_if_changed '^node_modules/|^\\.npm-cache/' "dependency directories" "ALLOW_DEP_DIR_CHANGES"

    # Pricing widget is protected. Changes are allowed only with explicit justification + extra testing.
    fail_if_changed '^assets/js/pricing-widget\\.js$|^assets/css/pricing-widget\\.css$' "protected pricing widget files" "ALLOW_PRICING_WIDGET_CHANGES"

    # Dependency manifest changes are usually scope drift for a scroll bug.
    fail_if_changed '^package\\.json$|^package-lock\\.json$' "dependency manifests" "ALLOW_DEP_MANIFEST_CHANGES"

    echo
    echo "[guardrail] OK: no disallowed changes detected (or overrides provided)."
  else
    echo "git repo not detected; skipping diff-based guardrails."
    echo "Tip: If possible, run Codex in a git clone so diffs and rollbacks are safer."
  fi

  echo
  echo "========================================"
  echo "5) Manual validation checklist"
  echo "========================================"
  echo "Follow:"
  echo "  codex/checklists/scroll-wheel-validation.md"
  echo
  echo "Tip:"
  echo "  Use the devtools snippets in codex/snippets/wheel-debug-snippet.md to confirm wheel is not prevented."
  echo
} | tee "$REPORT"

echo
echo "[codex_scroll_validate] wrote ${REPORT}"
