# ExecPlan: Premium Directory Cards and Mobile Marquee Reliability

## Observed baseline

- The homepage `primary-site-links` buttons used a premium surface, but the internal text stack was not explicitly aligned to the services Buyer Pathway treatment.
- The homepage and services-hub industry-directory cards reused the generic directory styling, so their headers and cards felt flatter than the Buyer Pathway container beside them.
- Only the services pages exposed hero breadcrumbs; the homepage, about, blog, pricing, book, and contact heroes did not.
- The non-services single marquee attempted to render two eager copies of all 78 `.webp` images, which meant 156 images and about 24MB of image payload on mobile.
- Marquee image failures were handled by hiding the image immediately, so intermittent mobile load failures could leave the row looking blank or broken.

## Root cause

- The requested UI mismatch came from reusing a general-purpose directory card component where the page needed a more premium pathway-style hierarchy.
- The mobile marquee reliability issue came from an oversized eager image workload plus brittle `onerror` handling that removed assets instead of retrying a fallback format.

## Changes made

- Added hero breadcrumbs to the six top-level pages using the existing `hero-breadcrumb` pattern.
- Restyled the homepage main-links buttons to use an explicit left-aligned pathway-style hierarchy.
- Scoped premium industry-directory styling only to `#industry-service-directory` and `#service-page-clusters`, leaving the blog directory unchanged.
- Kept current industry-card wording, but changed the presentation to icon, title, and subtitle on separate lines with smaller white icons and stronger title/copy hierarchy.
- Added a mobile-only marquee image subset and reduced the mobile eager/high-priority batch to four images.
- Added `.jpeg` fallback retry logic before hiding a marquee image.
- Generated the missing `blog_39` responsive derivatives so the blog index and the related estate-agents article stop requesting nonexistent preview assets.

## Verification

- `npm run build:css`
- `npm run build:js`
- Desktop Playwright checks passed for `/`, `/services`, `/about`, `/blog`, `/pricing`, `/book`, and `/contact`:
  - breadcrumbs render with the requested labels
  - homepage main-links are left-aligned
  - homepage and services-hub directory headers are centered
  - homepage and services-hub cards use left-aligned stacked icon/title/subtitle layout
  - blog directory header/icon styles remain on the original shared styling
- Mobile Playwright checks passed for `/`, `/services`, and `/about`:
  - breadcrumbs render correctly
  - no horizontal overflow was detected
  - `parallax-stage-active` still appears on homepage and services
  - the mobile single marquee mounts with 24 visible images, only 4 eager images, and a changing transform matrix proving continuous motion
- Response-level verification showed the only remaining preview 404 is the local Netlify `/.netlify/scripts/rum` request during `netlify dev`.
- `git diff --check` passed.
