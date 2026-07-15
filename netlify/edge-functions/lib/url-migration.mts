/**
 * Legacy URL migration map — the single source of truth for permanent
 * redirects and removed (410) paths.
 *
 * Consumed by:
 *  - netlify/edge-functions/reject-noncanonical-paths.ts (noncanonical
 *    variants of these sources 301/410 in one hop);
 *  - web/scripts/generate-seo-artifacts.mjs (emits the deployed _redirects
 *    file from this map);
 *  - web/tests/unit/url-migration.test.ts (asserts one-hop termination on
 *    canonical routes, no loops, no canonical shadowing, and full coverage
 *    of the pre-migration production URL surface).
 *
 * Every entry requires repository or live-production evidence. Sources:
 *  - `git show 318527e2^:netlify.toml` — production redirect set until
 *    2026-07-14 (.html cores, /niches/*, /services/<industry> aliases).
 *  - Live production sitemap (last successful deploy, captured 2026-07-15) —
 *    21 pre-rename blog slugs, all 301-mapped below.
 *  - `git show 10dcca0a -- web/src/data/blog-posts.ts` — the 21 old→new blog
 *    slug rename pairs (19 unquoted + 2 automation-written quoted entries).
 *  - `git show 9fcfb1fe^:sitemap.xml` — legacy static site surface at the
 *    2026-07-07 cutover (33 deleted blog articles, /services/<niche> pages).
 *  - netlify.toml history (e9e1f4a9, 24028605, 15f08f65) — long-form blog
 *    aliases and the /niches → /services era.
 *  - `git show 318527e2 -- web/src/data/home-v2/system.ts` — internal links
 *    used /industries/<slug> for the industry pages until 2026-07-14 while
 *    the SPA fallback returned 200 for them, so those URLs were crawlable;
 *    each maps 1:1 to /industry/<slug>.
 */

/**
 * Permanent one-hop redirects: normalized legacy path → current canonical
 * path. Destinations must be current canonical routes (test-enforced).
 */
export const LEGACY_REDIRECTS: Readonly<Record<string, string>> = {
  // The legacy static site served /index.html; its clean-path normalization.
  "/index": "/",

  // Legacy hub alias: /industries was a prerendered 200 from 2026-07-07 to
  // 2026-07-14 (routes.ts "industries-hub-alias", removed in 318527e2).
  "/industries": "/industry",

  // /industries/<slug> was never a registered route, but sitewide internal
  // links pointed at these URLs until 318527e2 while the SPA fallback served
  // them as 200 shells — a bounded, evidence-backed 9-slug allowlist.
  "/industries/dentists": "/industry/dentists",
  "/industries/ecommerce": "/industry/ecommerce",
  "/industries/estate-agents": "/industry/estate-agents",
  "/industries/fitness-coaches": "/industry/fitness-coaches",
  "/industries/gyms-fitness-studios": "/industry/gyms-fitness-studios",
  "/industries/hospitality": "/industry/hospitality",
  "/industries/physios-chiropractors": "/industry/physios-chiropractors",
  "/industries/salons-barbers": "/industry/salons-barbers",
  "/industries/trades": "/industry/trades",

  // Legacy-site niche pages (/niches/<slug>[.html]) formerly 301d to
  // /services/<slug>; those destinations moved to /industry/<slug>, so the
  // sources now go straight to the final page in one hop.
  "/niches/dentists": "/industry/dentists",
  "/niches/ecommerce": "/industry/ecommerce",
  "/niches/estate-agents": "/industry/estate-agents",
  "/niches/fitness-coaches": "/industry/fitness-coaches",
  "/niches/gyms-fitness-studios": "/industry/gyms-fitness-studios",
  "/niches/hospitality": "/industry/hospitality",
  "/niches/physios-chiropractors": "/industry/physios-chiropractors",
  "/niches/salons-barbers": "/industry/salons-barbers",
  "/niches/trades-virtual-office": "/industry/trades",

  // Former /services/<industry> pages (legacy-site canonicals, still 301
  // targets in production today) → /industry/<slug>.
  "/services/dentists": "/industry/dentists",
  "/services/ecommerce": "/industry/ecommerce",
  "/services/estate-agents": "/industry/estate-agents",
  "/services/fitness-coaches": "/industry/fitness-coaches",
  "/services/gyms-fitness-studios": "/industry/gyms-fitness-studios",
  "/services/hospitality": "/industry/hospitality",
  "/services/physios-chiropractors": "/industry/physios-chiropractors",
  "/services/salons-barbers": "/industry/salons-barbers",
  "/services/trades": "/industry/trades",
  "/services/trades-virtual-office": "/industry/trades",

  // Service-offer aliases: prerendered indexable 200s from 2026-07-07 to
  // 2026-07-14 (approvedPrerenderPaths at 0ef496c0/fd7555f3, removed in
  // 318527e2), each the same offering as its canonical page.
  "/services/website-design-development": "/services/web-design-development",
  "/services/ai-agents-automation": "/services/ai-automation",

  // Blog slug renames (10dcca0a, 2026-07-14): the same 21 articles live on
  // under shorter canonical slugs. These are the URLs in the live sitemap
  // and Google's index today.
  "/blog/how-to-plan-a-conversion-focused-website-build-for-a-uk-small-business":
    "/blog/conversion-focused-website-planning",
  "/blog/bespoke-app-development-for-uk-small-businesses-what-to-build-first":
    "/blog/bespoke-app-development-guide",
  "/blog/ai-voice-agent-development-for-uk-businesses-calls-controls-and-handoffs-expla":
    "/blog/ai-voice-agent-development",
  "/blog/ai-receptionist-uk-what-small-businesses-should-set-up-before-they-buy":
    "/blog/ai-receptionist-setup-guide",
  "/blog/how-to-choose-the-first-workflow-to-automate-in-a-uk-small-business":
    "/blog/workflow-automation-selection-guide",
  "/blog/ai-and-automation-consulting-for-uk-small-businesses-what-to-fix-first":
    "/blog/ai-automation-consulting-guide",
  "/blog/a-practical-content-creation-framework-for-uk-small-businesses":
    "/blog/content-creation-framework",
  "/blog/estate-agent-automation-in-the-uk-what-to-build-first-and-what-to-leave-human":
    "/blog/estate-agent-automation-guide",
  "/blog/hospitality-automation-for-uk-small-businesses-where-ai-actually-helps":
    "/blog/hospitality-automation-guide",
  "/blog/how-uk-salons-and-barbers-can-use-ai-without-losing-the-human-touch":
    "/blog/salon-barber-ai-guide",
  "/blog/websites-ai-receptionists-and-automation-for-uk-trades-businesses":
    "/blog/trades-websites-ai-automation",
  "/blog/ai-systems-for-ecommerce-brands-what-uk-small-businesses-should-build-first":
    "/blog/ecommerce-ai-systems-guide",
  "/blog/how-uk-physio-and-chiropractic-practices-can-use-ai-without-losing-the-human-t":
    "/blog/physio-chiropractic-ai-guide",
  "/blog/dental-practice-automation-in-the-uk-a-practical-systems-guide":
    "/blog/dental-practice-automation-guide",
  "/blog/gym-automation-for-small-uk-fitness-businesses-a-practical-operating-model":
    "/blog/gym-automation-operating-model",
  "/blog/how-uk-fitness-coaches-can-turn-enquiries-into-booked-consultations":
    "/blog/fitness-coach-enquiry-automation",
  "/blog/web-design-and-development-for-uk-small-businesses-build-a-site-that-operates":
    "/blog/small-business-web-development",
  "/blog/app-development-for-uk-small-businesses-what-to-build-first":
    "/blog/small-business-app-development",
  "/blog/ai-voice-agents-in-the-uk-a-practical-buyer-s-guide-for-small-businesses":
    "/blog/ai-voice-agent-buyers-guide",
  "/blog/ai-receptionist-uk-a-practical-guide-for-small-business-owners":
    "/blog/ai-receptionist-small-business-guide",
  "/blog/ai-automation-for-uk-small-businesses-what-to-fix-first":
    "/blog/small-business-ai-automation",
};

/**
 * Intentionally removed pages with no sufficiently equivalent replacement.
 * These return HTTP 410 (Gone) and stay out of sitemaps, feeds and links.
 *
 * The 33 short slugs are the legacy static site's blog articles (canonical
 * extensionless form in `9fcfb1fe^:sitemap.xml`), deleted at the 2026-07-07
 * cutover; the current 21-post blog contains no equivalent content. The 12
 * long slugs are earlier aliases of those same deleted articles (redirect
 * sources in the March 2026 netlify.toml generations) and terminate as Gone
 * rather than chaining into a 410.
 */
export const GONE_PATHS: readonly string[] = [
  "/blog/ai-appointment-reminders-uk-2026",
  "/blog/ai-automation-failures-uk-smes-2026",
  "/blog/ai-automation-uk-gdpr-2026-sme-guide",
  "/blog/ai-automations-physio-chiro-clinics-uk",
  "/blog/ai-booking-automation-uk-hospitality-2026",
  "/blog/ai-call-answering-trades-uk",
  "/blog/ai-document-automation-uk-smes-2026",
  "/blog/ai-etas-smart-scheduling-uk-trades-2026",
  "/blog/ai-guest-concierge-hotels-bbs-uk",
  "/blog/ai-lead-capture-trades-uk-2026",
  "/blog/ai-lead-capture-uk-trades-2026",
  "/blog/ai-lead-qualification-estate-agents-2026",
  "/blog/ai-lead-scoring-fitness-coaches-uk",
  "/blog/ai-missed-call-recovery-dentists-uk",
  "/blog/ai-no-show-reduction-uk-salons-barbers",
  "/blog/ai-quote-follow-up-trades",
  "/blog/ai-rebooking-journeys-salons-uk",
  "/blog/ai-receptionist-small-business-2026",
  "/blog/ai-receptionist-uk-costs-roi-2026",
  "/blog/ai-returns-triage-ecommerce-uk",
  "/blog/ai-viewing-feedback-estate-agents-uk",
  "/blog/ai-voice-agents-uk-smes-2026",
  "/blog/ai-website-tools-uk-small-businesses-2026",
  "/blog/ai-win-back-journeys-gyms-uk",
  "/blog/clinic-rebooking-physio-chiro-uk",
  "/blog/dental-intake-e-consent-automation-uk",
  "/blog/dental-recall-automation-uk-2026",
  "/blog/dm-to-client-automation-uk-fitness-coaches-2026",
  "/blog/estate-agent-viewing-confirmations-uk",
  "/blog/gym-booking-automation-uk-gyms-studios-2026",
  "/blog/post-purchase-automation-uk-ecommerce-repeat-customers",
  "/blog/quote-chase-automation-uk-trades-accepted-jobs-2026",
  "/blog/quote-follow-up-automation-uk-trades-2026",
  "/blog/how-small-physio-and-chiro-clinics-can-cut-missed-sessions-and-improve-treatment-completion-with-simple-ai-automations",
  "/blog/how-small-uk-estate-agents-can-use-automated-viewing-confirmations-to-cut-no-shows-and-win-instructions",
  "/blog/how-uk-dental-practices-can-automate-patient-intake-and-e-consent-to-cut-admin-speed-treatment-starts-and",
  "/blog/how-uk-dental-practices-can-use-ai-missed-call-recovery-to-fill-more-high-value-appointments",
  "/blog/how-uk-ecommerce-brands-can-use-ai-returns-triage-to-cut-support-load-and-keep-customers-happy",
  "/blog/how-uk-estate-agents-can-use-ai-viewing-feedback-follow-up-to-win-more-instructions",
  "/blog/how-uk-fitness-coaches-can-use-ai-lead-scoring-to-spend-less-time-in-dms-and-more-time-closing-the-right",
  "/blog/how-uk-gyms-and-fitness-studios-can-use-ai-win-back-journeys-to-reactivate-inactive-members",
  "/blog/how-uk-hotels-and-b-and-bs-can-install-a-24-7-ai-guest-concierge-a-90-day-checklist-costs-and-data-risk",
  "/blog/how-uk-physio-and-chiropractic-clinics-can-automate-rebooking-to-keep-patients-on-plan",
  "/blog/how-uk-salons-and-barbers-can-use-ai-rebooking-journeys-to-fill-gaps-between-appointments",
  "/blog/how-uk-trades-businesses-can-use-ai-call-answering-to-stop-after-hours-emergency-jobs-going-to-competitors",
];
