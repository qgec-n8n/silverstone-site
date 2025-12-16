# FILE: scripts/codex.reset-session.sh
#!/usr/bin/env bash
set -euo pipefail

# Reset local Codex session artifacts that can keep a broken encrypted thread "stuck".
# Safe-by-default: backs up session files instead of deleting.

CODEX_DIR="${HOME}/.codex"
SESS_DIR="${CODEX_DIR}/sessions"

ts() { date +"%Y%m%d-%H%M%S"; }

echo "[codex.reset-session] Home Codex dir: ${CODEX_DIR}"
if command -v codex >/dev/null 2>&1; then
  echo "[codex.reset-session] codex: $(codex --version || true)"
else
  echo "[codex.reset-session] NOTE: codex executable not found on PATH."
fi

if [ ! -d "${SESS_DIR}" ]; then
  echo "[codex.reset-session] No sessions dir found at ${SESS_DIR}. Nothing to do."
  echo "[codex.reset-session] If you're using the VS Code extension, fully restart VS Code and start a NEW thread."
  exit 0
fi

BACKUP="${SESS_DIR}.bak.$(ts)"
echo "[codex.reset-session] Backing up sessions -> ${BACKUP}"
mv "${SESS_DIR}" "${BACKUP}"
mkdir -p "${SESS_DIR}"

echo "[codex.reset-session] Done."
echo "[codex.reset-session] Next steps:"
echo "  1) Restart Codex / VS Code"
echo "  2) Start a NEW thread (do not resume old)"
echo "  3) If needed: codex --profile fallback_gpt41"
