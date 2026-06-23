# Human Review Checklist v1

**Pack:** silverstone-content-ia-seo-pack-v1  
**Repository destination:** `/docs/silverstone-transformation/content/content-ia-seo-pack-v1/`  
**Consumer explicitly identified:** **H-04 — Assurance Implementation**  
**Publication status:** Not approved.

> This pack accompanies migrated source content and requires human approval before publication. It must be reconciled against G-02, not substituted for it.

## 1. Source and migration review

- [ ] Confirm A-01 and A-02 versions used are the intended authoritative versions.
- [ ] Open G-02 `content-provenance-v1.csv`, claims review, duplicate review and migration exceptions.
- [ ] Reconcile every reused sentence, image, claim and route against G-02.
- [ ] Resolve any contradiction between this pack and a recorded migration exception in favour of the approved exception.
- [ ] Confirm all 50 current canonicals against a fresh repository and live crawl.
- [ ] Confirm the gyms canonical is `/services/gyms-fitness-studios` before implementation.
- [ ] Confirm the lead-capture route no longer self-redirects.
- [ ] Record the final source commit and review date.

## 2. Service and IA approval

- [ ] Approve the six public service names.
- [ ] Confirm each service is actually deliverable.
- [ ] Approve `/services`, `/industries` and `/how-we-work` route roles.
- [ ] Confirm industries remain structurally separate from services.
- [ ] Approve Phase A preservation of current industry canonicals.
- [ ] Decide whether Phase B `/industries/*` migration will occur.
- [ ] Confirm primary navigation and mobile navigation labels.
- [ ] Confirm every page has one clear primary CTA.

## 3. Claims and proof

- [ ] Review every row in `proof-placeholder-register-v1.csv`.
- [ ] Remove all unapproved counters, percentages, savings, response times and conversion claims.
- [ ] Remove or quarantine all client names, logos, reviews, testimonials and case studies without permission.
- [ ] Remove comparative rankings and superlatives without independent evidence.
- [ ] Do not publish a result or ranking guarantee.
- [ ] H-04 has applied the approved assurance directive.
- [ ] Every demonstration is labelled as fictional or illustrative.
- [ ] Every approved case study includes scope, dates, source, limitations and permission.
- [ ] Any named integration is tested and does not imply partnership.
- [ ] Any price or promotion has H-03/owner approval and current terms.

## 4. Regulated and sensitive workflows

- [ ] Clinical pages have been reviewed by an appropriate professional and privacy owner.
- [ ] Dental and clinic flows remain administrative and non-clinical.
- [ ] Voice and receptionist flows disclose automation where required.
- [ ] Human escalation, retry, failure and shutdown paths are documented.
- [ ] Data controller, processor, retention, access and lawful-basis responsibilities are clear.
- [ ] No page claims blanket GDPR, security or regulatory compliance.
- [ ] Health, emergency, complaint, vulnerable-person and safeguarding scenarios bypass standard automation appropriately.

## 5. Copy and differentiation

- [ ] Home copy is substantially shorter than the source.
- [ ] Each service page has a distinct capability, scope and boundary.
- [ ] Each industry page contains sector-specific workflows and safeguards.
- [ ] Generic template wording has not replaced specific content.
- [ ] Copy is understandable to a non-technical decision-maker.
- [ ] Acronyms are explained or removed.
- [ ] The same paragraph is not reused across multiple indexable pages.
- [ ] “UK” and “London” references are accurate and not inserted mechanically.
- [ ] No city or borough doorway pages have been created.

## 6. Metadata, headings and schema

- [ ] Every indexable route has a unique, accurate title and H1.
- [ ] Every description is a useful page summary, not a ranking claim.
- [ ] Canonicals match the final route model.
- [ ] Visible breadcrumbs match `BreadcrumbList`.
- [ ] `Service` data describes visible services only.
- [ ] `Organization` fields are verified.
- [ ] `LocalBusiness`, `Review`, `AggregateRating`, `Offer` and action markup are omitted unless fully supported.
- [ ] Structured data passes the relevant validator.
- [ ] Sitemap contains only intended canonical, indexable routes.
- [ ] Staging remains non-indexable.

## 7. Internal links and topic clusters

- [ ] Every service links to relevant industries and insights.
- [ ] Every industry links to relevant services and its article cluster.
- [ ] Every article links to one service and one industry where applicable.
- [ ] Anchor text describes the destination.
- [ ] No internal link points through a redirect.
- [ ] The five overlapping trades articles have an approved preserve/differentiate/merge decision.
- [ ] Newly published pages receive contextual inlinks, not footer-only links.

## 8. Conversion and forms

- [ ] Header CTA says “Book a discovery call”.
- [ ] Booking duration and Calendly URL are verified.
- [ ] Contact fallback works.
- [ ] Form fields collect only necessary information.
- [ ] Success and failure states are clear.
- [ ] Production form tests use approved test data and do not expose secrets.
- [ ] Qualification language does not exclude protected groups or make sensitive inferences.
- [ ] Conversion tracking names and consent behaviour are approved.

## 9. Release and redirect QA

- [ ] Export the final old-to-new URL map.
- [ ] Use direct permanent redirects only for approved moves.
- [ ] Remove duplicate and self-referential redirect rules.
- [ ] Test old URLs, new URLs, canonicals, sitemap and breadcrumbs.
- [ ] Capture pre-release Search Console and analytics baselines.
- [ ] Monitor crawl errors, indexation, rankings and qualified bookings after release.
- [ ] Maintain rollback instructions and the prior route map.
- [ ] Do not delete source content or assets solely because they appear unreferenced.

## Approval record

| Role | Name | Decision | Date | Notes |
|---|---|---|---|---|
| Business owner |  |  |  |  |
| Content/brand |  |  |  |  |
| SEO/migration |  |  |  |  |
| Legal/privacy |  |  |  |  |
| Regulated-sector reviewer |  |  |  |  |
| H-04 assurance owner |  |  |  |  |
| Release owner |  |  |  |  |
