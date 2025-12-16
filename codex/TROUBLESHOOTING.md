<!-- FILE: codex/TROUBLESHOOTING.md -->

# Troubleshooting — Codex “invalid_encrypted_content”

## Symptom
Codex responds with:
- `invalid_request_error`
- `code: invalid_encrypted_content`
- message: “The encrypted content gAAA... could not be verified.”

## What it means
Codex is attempting to continue a session/thread that references encrypted tool or message artifacts.
The server can’t validate the encrypted blob for the current context/auth/provider, so the thread becomes “poisoned”.

## Most reliable recovery
1) Stop the current Codex thread (do not keep retrying in it).
2) Start a fresh thread in the repo.
3) If the same error happens again within a few turns:
   - run `bash scripts/codex.reset-session.sh`
   - then run with `codex --profile fallback_gpt41`

## Prevention rules for this repo
- Do not resume a thread after switching auth method (ChatGPT ↔ API key).
- Avoid pinning brittle model names as the default in project config.
- If you must change model/provider, start a new thread after the change.
