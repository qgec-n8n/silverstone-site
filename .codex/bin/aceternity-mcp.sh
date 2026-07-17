#!/bin/zsh
set -euo pipefail

if command -v aceternity-mcp-server >/dev/null 2>&1; then
  exec aceternity-mcp-server
fi

readonly aceternity_server_path="${HOME}/.local/bin/aceternity-mcp-server"
if [[ -x "${aceternity_server_path}" ]]; then
  exec "${aceternity_server_path}"
fi

echo "aceternity-mcp-server is not installed. Run: pipx install 'aceternity-mcp==2.1.0'" >&2
exit 1
