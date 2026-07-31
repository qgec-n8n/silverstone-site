/**
 * The approved route art ships as a JPEG/PNG original plus a WebP sibling at
 * the same path, both written by `scripts/optimize-images.mjs`. WebP carries
 * the same stills at a fraction of the weight (the set went from 375 MB to
 * 7.7 MB), so `<picture>` offers it first and falls back to the original
 * format for the small share of clients that cannot decode it.
 */
export function webpSource(src: string): string {
  return src.replace(/\.(png|jpe?g)$/i, ".webp");
}

/** True when a WebP sibling is expected on disk for this source. */
export function hasWebpSibling(src: string): boolean {
  return /\.(png|jpe?g)$/i.test(src);
}
