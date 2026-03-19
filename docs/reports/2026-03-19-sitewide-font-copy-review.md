# Sitewide Font & Copy Review

Date: 2026-03-19

Purpose: record the final typography system after the subtitle/stat upgrade pass, explain where each font belongs, and capture the next copy/typography opportunities for a future run.

## Final Font System

| Surface | Font | Why This Is The Best Fit | Status |
| --- | --- | --- | --- |
| Hero titles | `Sora` | Distinctive display character, stronger brand presence, better high-impact title energy than the softer body/UI faces. | Implemented |
| Hero subtitles | `Manrope` | Best readability on longer hero support lines without making the hero feel generic. | Implemented |
| Section titles | `Poppins` | Cleaner at medium heading sizes than `Sora`, more structured and commercial than the long-form body font. | Implemented |
| Section subtitles outside cards | `Google Sans Flex` | Higher-end support text feel, stronger legibility at medium-small sizes, and better premium “interface copy” tone than plain grey body text. | Implemented |
| Card titles | `Poppins` | Keeps cards crisp and controlled at compact sizes while maintaining continuity with section titles. | Implemented |
| Card subtitles / taglines | `Manrope` | Better paragraph rhythm and less visual stiffness than a display or UI font inside cards. | Implemented where shared card subtitle styles exist |
| Card bullet points | `Manrope` | Most readable option for multi-line scannable lists. | Implemented by token inheritance |
| Stats numbers | `Sora` | Gives the numbers stronger pop and a clearer premium signature. | Implemented |
| Stats labels | `Google Sans Flex` | Reads like designed metric copy rather than faded utility text. | Implemented |
| CTA banner titles | `Sora` | Best fit for high-importance conversion moments and premium offer framing. | Implemented on shared CTA-card title surfaces touched in this pass |
| CTA banner subtitles | `Manrope` | Keeps conversion copy clear and persuasive without over-stylising it. | Implemented by token inheritance |
| CTA buttons | `Poppins` | Strong uppercase rhythm, clean compact shapes, and better control at button sizes than `Sora`. | Implemented |
| Navigation / chips / eyebrow labels | `Poppins` | Best compact UI font in the final system. | Implemented |
| Pricing feature titles | `Poppins` | Cleaner at card scale and more commercial than `Sora`. | Implemented |
| Pricing feature helper copy / subtitles | `Google Sans Flex` | Better for refined interface-adjacent support text. | Implemented where pricing subtitle/helper styles exist |
| Pricing feature body copy / lists | `Manrope` | Most readable for dense commercial detail and checklist content. | Implemented |
| Footer / contact supporting copy | `Manrope` | Keeps lower-priority informational text readable and balanced. | Implemented by token inheritance |

## Fonts Researched

| Font | Decision | Reason |
| --- | --- | --- |
| `Google Sans Flex` | Added locally | Strongest upgrade for subtitles and stat labels. Variable support and optical polish made it the clearest improvement. |
| `Sora` | Kept | Still the best display font in the current system. |
| `Manrope` | Kept | Still the best long-form and paragraph-support font in the current system. |
| `Poppins` | Restored selectively | Works better than `Sora` on compact UI headings, navigation, buttons, and medium-sized card headings. |
| `Montserrat` | Not restored broadly | It felt too familiar and generic in this brand after side-by-side review. |
| `Geist` | Researched, not added | Very clean, but too restrained for the premium/luxury edge the site needs. |
| `Space Grotesk` | Researched, not added | Good high-tech energy, but it pushed the site too far toward “experimental tech product” rather than polished premium service brand. |

## New Local Font Assets

| Asset | Path | Usage |
| --- | --- | --- |
| `Google Sans Flex Latin` | `/Users/quentingeczy/Desktop/silverstone-site/assets/fonts/google-sans-flex-latin.woff2` | Primary support-text coverage |
| `Google Sans Flex Latin Extended` | `/Users/quentingeczy/Desktop/silverstone-site/assets/fonts/google-sans-flex-latin-ext.woff2` | Extended Latin fallback coverage |

## Remaining Opportunities For A Future Run

| Page / Surface | Current Issue | Recommended Improvement | Reason / UX Impact | Priority |
| --- | --- | --- | --- | --- |
| Homepage hero support copy | Still slightly long for the strength of the updated title system. | Trim one more weak clause from the supporting paragraph. | Faster first-read comprehension above the fold. | High |
| Homepage “Main Silverstone AI Pages” descriptions | Link descriptions remain a little text-heavy. | Shorten each description by 10-15%. | Makes the navigation card feel more premium and less dense. | High |
| Homepage FAQ answers | Answer text is readable but still visually conservative. | Raise answer color slightly and trim the longest answer openings. | Better scanning without making the section louder. | Medium |
| About “Our Story” card | Now appropriately fuller, but still visually dense at desktop widths. | Split one sentence-length clause and add a slightly wider text measure. | More editorial premium reading feel. | Medium |
| Services resource lists | The card headers are improved, but list bodies are still dense. | Shorten a few link labels and tighten the longest supporting descriptors. | Keeps utility high while improving polish. | High |
| Services FAQ answers | Similar issue to homepage FAQs. | Trim the first sentence of the longest answers. | Better scanning and less visual drag. | Medium |
| Pricing recommender result copy | Functional, but could be tighter. | Shorten helper/result copy and increase contrast on result state text. | More decisive conversion moment. | High |
| Book fallback CTA card | The lower CTA card is still weaker than the audit card. | Tighten subtitle and give the card a stronger first sentence. | Better continuity across the page. | Medium |
| Contact form intro + labels | Functional but still slightly utilitarian. | Refine the intro copy and slightly strengthen label hierarchy. | Makes contact feel more premium and intentional. | Medium |
| Niche bottom CTA subtitles | A few remain explanatory rather than commercial. | Lead with the pain point first, then the pack/audit invitation. | Better end-of-page conversion push. | High |
| Blog index summaries | Stronger than before, but still a little dense. | Trim summary length and keep the stronger support-text hierarchy. | Faster scanning in the guide library. | Medium |
| Blog article template | Still on the older hierarchy logic. | Future typography pass for article H1/H2/H3, intro paragraphs, lists, and CTA blocks. | Biggest remaining typography opportunity after the core service pages. | High |

## Recommended Next Pass Order

1. Homepage copy tightening
2. Pricing recommender and FAQ copy tightening
3. Services resource-list copy density reduction
4. Niche bottom CTA copy tightening
5. Blog article typography pass
