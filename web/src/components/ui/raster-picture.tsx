import type { ComponentProps } from "react";

import { hasWebpSibling, webpSource } from "~/lib/image-sources";

/**
 * A plain `<img>` for the approved raster art, wrapped in a `<picture>` that
 * offers the WebP sibling first.
 *
 * `scripts/optimize-images.mjs` writes a `.webp` next to every JPEG/PNG under
 * `public/`, and those siblings are a fraction of the weight (375 MB → 7.7 MB
 * across the set). Routes that compose their art through `ServiceFigure` /
 * `IndustryFigure` already build their own `<picture>`; this covers the
 * standalone `<img>` sites, which would otherwise still ship the heavy
 * original. Every prop is forwarded to the `<img>`, so `alt`, sizing, loading
 * and class names behave exactly as before.
 */
export function RasterPicture({
  src,
  pictureClassName,
  ...props
}: ComponentProps<"img"> & { src: string; pictureClassName?: string }) {
  const optimizedSrc = hasWebpSibling(src) ? webpSource(src) : src;

  return (
    <picture className={pictureClassName}>
      {hasWebpSibling(src) ? (
        <>
          <source srcSet={optimizedSrc} type="image/webp" />
          <source srcSet={src} />
        </>
      ) : null}
      <img src={optimizedSrc} {...props} />
    </picture>
  );
}
