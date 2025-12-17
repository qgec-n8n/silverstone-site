// FILE: scripts/pricing.constants.js

/**
 * Centralized constants for the pricing widget embed.
 *
 * Keep this file dependency-free and CommonJS so it can be used by simple Node scripts.
 */

/**
 * Canonical list of pages that must receive the pricing widget.
 *
 * IMPORTANT:
 * - Values must match BOTH:
 *   1) real repo paths, and...
 *   2) the page keys used in PRICING_COPY_MAP.md
 */
const TARGET_PAGES = [
  'services.html',
  'niches/dentists.html',
  'niches/estate-agents.html',
  'niches/healthcare.html',
  'niches/lawyers.html',
  'niches/marketing-agencies.html',
  'niches/hospitality.html',
  'niches/trades.html',
  'niches/estate-agents.html',
  'niches/local-services.html',
];

/**
 * Substring used by the current placeholder content in pricing sections.
 * After integration, this must be removed/replaced.
 */
const PRICING_PLACEHOLDER_SUBSTRING = 'Transparent pricing tables will appear here soon';

module.exports = {
  TARGET_PAGES,
  PRICING_PLACEHOLDER_SUBSTRING,
};
