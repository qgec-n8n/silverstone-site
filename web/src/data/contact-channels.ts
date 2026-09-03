/**
 * The contact channels the site publishes, in one place.
 *
 * The footer renders these and `~/seo/schema` asserts them, so the visible
 * page and the Organization node can never drift apart — structured data must
 * not claim a channel the site does not show.
 *
 * `display` is the national form a reader in that market expects; `e164` is
 * the form `tel:` links and schema.org `telephone` require.
 */
export type ContactNumber = {
  market: "US" | "UK";
  /** schema.org `contactPoint.areaServed`. */
  areaServed: "US" | "GB";
  display: string;
  e164: string;
};

export const CONTACT_NUMBERS: ContactNumber[] = [
  { market: "US", areaServed: "US", display: "+1 213-493-8834", e164: "+12134938834" },
  { market: "UK", areaServed: "GB", display: "07438 524862", e164: "+447438524862" },
];

/**
 * The number the Organization node carries as its single `telephone`. The UK
 * line is the one the Google Business Profile publishes, so the entity's
 * primary number matches the listing search engines already hold.
 */
export const PRIMARY_TELEPHONE = "+447438524862";

export const CONTACT_EMAIL = "info@silverstone-ai.com";
