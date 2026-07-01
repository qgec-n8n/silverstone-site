#!/bin/zsh
set -euo pipefail

# Secrets for this server are not injected by the host environment (unlike
# API_KEY_21ST), so this wrapper sources them from a local, gitignored file
# instead of requiring them to already be present in the process environment.
ENV_FILE="$(cd "$(dirname "$0")/../.." && pwd)/.env.gpt-image-2-mcp"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE. Create it with OPENAI_API_KEY=... before starting this MCP server." >&2
  exit 1
fi

set -a
source "$ENV_FILE"
set +a

if [[ -z "${OPENAI_API_KEY:-}" ]]; then
  echo "OPENAI_API_KEY is not set in $ENV_FILE." >&2
  exit 1
fi

exec node "/Users/quentingeczy/.claude-mcp-servers/gpt-image-2-mcp/build/index.js"
