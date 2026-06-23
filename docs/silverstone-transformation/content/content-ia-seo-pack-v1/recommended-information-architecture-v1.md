# Recommended Information Architecture v1

**Status:** Recommendation  
**Version date:** 2026-06-23  
**Repository destination:** `/docs/silverstone-transformation/content/content-ia-seo-pack-v1/`  
**Publication gate:** Human approval required.

> This pack accompanies the migrated source content. It does not replace the G-02 provenance, claims, duplicate-review or migration-exception records. Reconcile every route and claim against those records before publication.

## Decision summary

**Sourced fact:** A-01 inventories 50 indexable routes: eight core/legal routes, nine industry routes currently nested under `/services/`, and 33 articles. The audit found unique page titles, descriptions and canonicals, but also substantial template similarity, weak proof coverage and unresolved intent overlap in several trades articles.

**Recommendation:** Separate **what Silverstone builds** from **who Silverstone serves**.

- Services answer: “What can you build for us?”
- Industries answer: “How could this work in a business like ours?”
- Insights answer: “What should we understand before deciding?”
- The booking path answers: “Are we a sensible fit, and what happens next?”

**Proposed marketing language:** “Practical digital systems for small teams: clearer websites, focused apps, useful AI and connected workflows.”

**Proof required:** Approved portfolio items, client evidence, measurable outcomes, team credentials, physical-location evidence and any regulated-sector assurance.

## Recommended route model

### Primary navigation

| Navigation item | Destination | Purpose |
|---|---|---|
| Services | `/services` | Six capability-led offers |
| Industries | `/industries` | Nine business-context pages |
| How we work | `/how-we-work` | Process, qualification and safeguards |
| Insights | `/blog` | Educational topic clusters |
| About | `/about` | Accountability, approach and approved evidence |
| Book a discovery call | `/book` | Primary conversion |

Use **Book a discovery call** as the persistent header CTA. Keep **Contact** in the utility/footer navigation.

### Service architecture

| Route | Public name | Buyer question |
|---|---|---|
| `/services/web-design-development` | Web Design & Development | Conversion-led websites that explain the offer clearly, work across devices and create a practical path from visit to enquiry. |
| `/services/app-development` | Custom App Development | Focused web and mobile applications designed around a real operational or customer problem, not a feature wish list. |
| `/services/ai-voice-agents` | AI Voice Agents | Conversational phone agents that handle defined call flows, capture information and take approved actions with clear human escalation. |
| `/services/ai-receptionists` | AI Receptionists | A practical front-desk layer for common enquiries, message-taking, routing and booking, configured around your operating rules. |
| `/services/content-creation` | Content Creation & Repurposing | A governed content system that turns approved expertise into useful website, email and social material without inventing proof. |
| `/services/ai-automation` | AI Automation & Agent Workflows | Connected workflows and task-focused agents that move information, trigger actions and keep people in control of exceptions. |

### Industry architecture

Create `/industries` as the index. The preferred long-term industry routes are:

- `/industries/estate-agents` — Estate Agents
- `/industries/hospitality` — Hospitality
- `/industries/salons-barbers` — Salons & Barbers
- `/industries/trades` — Trades & Home Services
- `/industries/ecommerce` — eCommerce Brands
- `/industries/physios-chiropractors` — Physio & Chiropractic Clinics
- `/industries/dentists` — Dental Practices
- `/industries/gyms-fitness-studios` — Gyms & Fitness Studios
- `/industries/fitness-coaches` — Fitness Coaches

## URL migration sequence

**Recommendation:** Do not change the nine current industry canonicals during the same release that changes the framework, templates and copy.

1. **Phase A — structural separation without URL change**
   - Add an Industries hub.
   - Label the nine pages as industries in navigation, breadcrumbs and content models.
   - Keep current `/services/{industry}` canonicals.
   - Point all new internal links to the current canonicals.
2. **Phase B — controlled path migration**
   - Confirm Search Console, analytics, backlink and conversion baselines.
   - Map each current industry URL one-to-one to `/industries/{industry}`.
   - Update canonicals, sitemap, breadcrumbs and internal links in the same release.
   - Apply direct permanent redirects with no chains.
   - Monitor old and new URLs after launch.

**Sourced fact:** Google recommends preparing a URL map, testing the destination, redirecting old URLs and monitoring both sides of a URL-changing move. It also advises changing one major variable at a time where practical.  
Source: Google Search Central, *Site Moves and Migrations*, https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes

## Page hierarchy

### Home

1. Clear problem-and-outcome hero
2. Six service families
3. Nine industries
4. Three-step working process
5. Qualification and safeguards
6. Proof area populated only with approved evidence
7. Discovery-call CTA

### Service page

1. Outcome-led hero
2. Business problem
3. What the service includes
4. Example use cases
5. Process and boundaries
6. Fit / not-fit criteria
7. Evidence placeholder
8. Relevant industries and insights
9. CTA

### Industry page

1. Industry-specific operational problem
2. Distinct workflow pressures
3. Relevant services
4. One illustrative workflow
5. Human handoff and risk controls
6. Qualification
7. Industry evidence placeholder
8. Related articles
9. CTA

### Insight article

1. Direct answer or executive summary
2. Practical explanation
3. Implementation considerations
4. Risks and controls
5. Relevant service and industry links
6. Contextual CTA

## Conversion architecture

### Primary conversion

**Qualified discovery-call booking.**

### CTA hierarchy

- Primary: **Book a discovery call**
- Secondary: **See how it works**
- Contextual: **Discuss this workflow**
- Low-commitment: **Explore services**
- Contact fallback: **Send an enquiry**

### Qualification signals

A stronger-fit visitor:

- has a repeated enquiry, content, booking or operational bottleneck;
- can involve the process owner and decision-maker;
- has access to the relevant systems and policies;
- is willing to start with a defined problem;
- accepts human review for sensitive or unusual cases.

A weaker-fit visitor:

- expects guaranteed rankings, revenue or conversion;
- wants unrestricted automation without an accountable owner;
- cannot identify a source of truth for data or decisions;
- requires a regulated decision to be made automatically;
- wants a large build before agreeing the first useful outcome.

## Services versus industries

Do not duplicate the same generic service list on every industry page. Use this division:

- A **service page** owns capability, deliverables, process, technical boundaries and cross-industry examples.
- An **industry page** owns vocabulary, workflow context, typical exceptions, regulatory caution and relevant service combinations.
- An **article** owns one search question, problem or implementation topic.
- A **proof page or case study** owns evidence only after approval.

## London and UK strategy

**Recommendation:** Position Silverstone as a UK provider with London context, without mass-producing city pages.

- Use “UK” in service metadata where it accurately describes the market.
- Use “London” on the home, about, contact and one future London landing page only when business address/service-area evidence is approved.
- Do not create near-identical pages for boroughs or cities.
- Add a London page only when it contains genuine local value: service area, meeting options, local process, relevant examples and verified contact data.
- Keep industry and service pages nationally useful.

## Search architecture principles

**Sourced fact:** Google recommends logical organisation, descriptive URLs, unique useful content, descriptive internal-link anchors and clear, concise page titles.  
Source: Google Search Central, *SEO Starter Guide*, https://developers.google.com/search/docs/fundamentals/seo-starter-guide

**Recommendation:**

- One primary intent per page.
- One canonical route per content item.
- Visible breadcrumbs that match `BreadcrumbList`.
- Service and industry hubs linked from the main navigation.
- Each service links to three to five priority industries and two to four relevant articles.
- Each industry links to its priority services and its own article cluster.
- Each article links upward to one industry and one service.
- Essential copy and CTAs must be present in initial HTML.

## Structured data policy

Use only schema that matches visible, approved content.

| Page type | Recommended schema |
|---|---|
| Home | `Organization`, `WebSite`, `WebPage` |
| About | `AboutPage`, `Organization`, `BreadcrumbList` |
| Services hub | `CollectionPage`, `ItemList`, `BreadcrumbList` |
| Service page | `Service`, `WebPage`, `BreadcrumbList` |
| Industries hub | `CollectionPage`, `ItemList`, `BreadcrumbList` |
| Industry page | `WebPage`, `Service`, `BreadcrumbList` |
| Blog hub | `CollectionPage`, `ItemList`, `BreadcrumbList` |
| Article | `BlogPosting`, `BreadcrumbList` |
| Book | `WebPage`, `BreadcrumbList`; add action markup only when accurate |
| Contact | `ContactPage`, `Organization`, `BreadcrumbList` |
| Privacy | `WebPage` |

Do not publish `Review`, `AggregateRating`, `Offer`, `FAQPage`, `LocalBusiness`, client, award or outcome markup unless the visible content and evidence support it.

## Consolidation decisions

- **Preserve:** all 50 current canonicals until route-level evidence is reviewed.
- **Consolidation candidates:** two trades lead-capture articles and three quote-follow-up articles.
- **Rewrite:** home, services hub, industry pages and any article carrying unsupported figures or examples.
- **Quarantine:** client names, logos, testimonials, case studies, rankings, guarantees, numerical outcomes and unverified pricing.
- **Delete only after approval:** superseded duplicate copy, dead redirects and assets proven unused. “Unreferenced” is not deletion authority.
