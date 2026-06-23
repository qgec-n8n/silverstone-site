# MANIFEST

**Package:** `silverstone-platform-capability-research-v1.zip`  
**Generated:** 2026-06-22  
**Intended repository upload path:** `/docs/silverstone-transformation/research/platforms/`  
**Repository modification status:** None. The package was created outside the repository and has not been uploaded or committed.  
**Consumers:** `C-01`, `D-01` (consumer identifiers supplied by the user; no additional scope inferred).

## Purpose

This package provides a current, official-source-led platform and model routing report for the Silverstone website transformation. It allocates research, engineering, visual development, testing, staging, and QA work across ChatGPT, Codex macOS, and Replit Core without implementing repository changes.

## Contents

| File | Purpose | Bytes | SHA-256 |
|---|---|---:|---|
| `official-platform-findings-v1.md` | Verified platform/model findings, availability, disclosure status, and source registry. | 17616 | `c8475051cf35d308c94af4cce20799803a3e3552cf3b730eca2ef3731da8fdb4` |
| `model-effort-routing-v1.md` | Decision rules for ChatGPT settings, Codex models/efforts, and Replit modes/tools. | 13441 | `027db67f6efa001e649805a0c4bbea5a8c9dfc36beaf230a32167f54085c05ce` |
| `workstream-allocation-v1.csv` | Machine-readable allocation for all fourteen required workstreams. | 8455 | `d8ce1bdffe4ecc20797b98ae2a1a1e3de6a72fa0fa3f1834b15677a2cee22513` |
| `usage-efficiency-guidance-v1.md` | Usage-control guidance and responsible uncertainty boundaries. | 9067 | `c4c06feea7fdf8b77577b4f266d57a2aa458fbd8a9333d72f9131e9ce2215480` |
| `capability-limitations-v1.md` | Known limitations, unknowns, and transformation guardrails. | 8924 | `312547cd9b90c7c7fe443e326af99531112e773c5cf8fa5f219ebf3ad25866c2` |

## Research boundaries

- OpenAI claims use only official OpenAI documentation.
- Replit claims use only official Replit documentation.
- The user-provided environment list is treated as authoritative availability information.
- No token, credit, task-duration, or subscription-consumption figures were invented.
- Replit task-level usage is treated as non-deterministic before execution.
- ChatGPT user-facing effort labels are not asserted to map one-to-one to API reasoning effort.
- The package stops at routing research and does not authorise or perform implementation.

## Validation checklist

- [x] All six required files are present.
- [x] All fourteen required workstreams are represented in the CSV.
- [x] Model names include GPT-5.5, GPT-5.4, and GPT-5.4 mini / GPT-5.4-mini user label.
- [x] Codex effort names include Low, Medium, High, and Extra High (`xhigh`).
- [x] ChatGPT settings include Instant, Medium, and High as user-provided availability.
- [x] Replit Core availability and Turbo exclusion are disclosed.
- [x] Replit exact-model disclosure is separated into verified and unknown portions.
- [x] Precise task-level subscription and credit usage is not estimated.
- [x] Claim taxonomy includes Verified capability, User-provided availability, Recommendation, Inference, and Unknown.
- [x] C-01 and D-01 are identified as consumers.
- [x] Official source URLs are included and restricted to the required vendor domains.
- [x] Repository was not modified.

## Upload instruction

Upload the ZIP unchanged to: `/docs/silverstone-transformation/research/platforms/`

After upload, verify the ZIP checksum shown below and preserve this manifest with the package.

