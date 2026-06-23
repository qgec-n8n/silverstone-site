---
name: /tmp/logs snapshots are frozen, not live tails
description: Why grepping /tmp/logs/*.log in bash after an edit shows stale output, and how to actually verify dev-server behavior.
---

# Verifying dev-server log output on Replit

The `/tmp/logs/<workflow>_<ts>.log` and `browser_console_*.log` files are **point-in-time
snapshots written by the `refresh_all_logs` tool**, NOT a live tail of the running workflow.
`tail`/`grep` on them in bash returns whatever was captured at the last `refresh_all_logs`
call — it will NOT show lines emitted after that snapshot, even with `sleep`.

**Why:** cost two wasted test cycles assuming `ls -t .../*.log | head -1` + grep would show
fresh reload events; it kept showing the same stale file (`...213912...`) across restarts.

**How to apply:** to confirm something the dev server just did (e.g. an HMR/full-reload fired,
a request hit, an error printed): make the change, then call `refresh_all_logs` — it writes a
NEW snapshot and returns a fresh preview. Read that returned preview (or the newly-named file).
For a server-side action you control (like a custom Vite plugin), add an explicit
`server.config.logger.info(...)` line so the snapshot shows unambiguous proof it ran.
