#!/bin/zsh
set -euo pipefail

if [[ -z "${API_KEY_21ST:-}" ]]; then
  echo "API_KEY_21ST is not set. Add your 21st.dev Magic API key to the Codex app environment before starting this MCP server." >&2
  exit 1
fi

export API_KEY="${API_KEY_21ST}"
exec npx -y @21st-dev/magic@0.1.0
