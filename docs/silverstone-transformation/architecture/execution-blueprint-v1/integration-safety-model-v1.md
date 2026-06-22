# Silverstone integration safety model v1

## 1. Non-negotiable production boundary

D-02 onward must not mutate production `main`, Netlify site configuration, DNS, production environment variables, Resend, analytics, Calendly or live monitoring. No production form submission, email send or booking is authorised.

## 2. Adapter contract

Each adapter exposes a typed interface and environment-specific implementation:

```ts
interface IntegrationAdapter<Request, Result> {
  execute(input: Request, context: ExecutionContext): Promise<Result>
  healthcheck?(): Promise<HealthStatus>
}
```

Adapters validate input and configuration at boundaries. Provider errors are mapped to safe domain errors; raw provider responses are not shown to users.

## 3. Environment variable policy

- `.env.example` contains names and safe descriptions only.
- Local secrets remain uncommitted.
- CI uses scoped test secrets or mocks.
- Staging secrets are distinct from production.
- Production variable names may be documented, but values are never copied.
- Startup/build checks fail closed when a required staging variable is missing.
- A production-looking recipient, API key, analytics ID or Calendly event identifier in staging is a release blocker unless explicitly authorised as read-only.

## 4. Contact/Resend

Staging options in preference order:

1. deterministic mock adapter;
2. email sink/test inbox with non-production Resend key and verified test domain;
3. disabled submission with explanatory test-mode response.

Production recipient addresses and live API keys are prohibited. Test messages must carry an unmistakable staging subject prefix and metadata. Server-side validation, length limits, honeypot/rate controls, origin policy, safe errors and accessible pending/success/failure states are mandatory.

## 5. Calendly

Use a static placeholder or authorised test event in staging. The production event URL may be rendered as plain reference text only when no booking can be initiated. Staging acceptance must prove fallback navigation, reserved layout space, keyboard path and failure handling without creating a live booking.

## 6. Analytics and consent

Analytics is disabled by default in local, CI and Replit. Integration staging may use a dedicated staging property only. Network tests must prove:

- no non-essential analytics before valid consent;
- approved scripts load after consent;
- withdrawal prevents subsequent loading where technically applicable;
- no duplicate committed and host-injected monitoring;
- staging events cannot contaminate production data.

## 7. Maps, IndexNow and monitoring

- Maps load lazily and include a direct location fallback.
- IndexNow is disabled outside an authorised production release.
- Monitoring uses a staging project/DSN or is disabled.
- No staging crawl or preview submits production URLs to external indexing services.

## 8. Integration test levels

| Level | Method | Side effects |
|---|---|---|
| unit | adapter mocks | none |
| contract | local/sandbox fixtures | non-production only |
| staging E2E | authorised staging services | controlled test records |
| production smoke | separate release approval | minimal authorised action |

## 9. Incident rule

Any evidence of production email, booking, analytics contamination, indexing or configuration mutation triggers: stop testing, preserve logs, revoke/rotate exposed staging credentials as needed, mark the candidate failed and return to the last approved checkpoint.

## Evidence authority

This blueprint is derived from the following repository authorities on branch `transformation/audit`:

- `../../audits/MANIFEST.md` (`A01-MANIFEST`)
- `../../audits/repository-live-audit-v1.md` (`A01-AUDIT`)
- `../../audits/route-inventory-v1.csv` (`A01-ROUTES`)
- `../../audits/asset-integration-inventory-v1.csv` (`A01-ASSETS`)
- `../../audits/repo-live-diff-v1.md` (`A01-DIFF`)
- `../../audits/seo-redirect-baseline-v1.csv` (`A01-SEO`)
- `../../audits/external-live-audit/` (`A02-*`)
- `../../research/platforms/` (`B01-*`)
- `../../research/benchmarks/` (`B02-*`)
- `../rebuild-decision-v1.md` (`C01-DECISION`)

Where evidence conflicts, the precedence order is: current owner-approved decision record; fresh implementation-baseline crawl; A-01 route/redirect inventories; A-02 advisory findings; platform and benchmark research. No conflict may be silently reconciled.

