/**
 * Generates the dotted landmass plates behind the industry pages' Atlantic
 * atlas (the London ⇆ US-metros map in `MarketLanes`).
 *
 *   node scripts/generate-atlas-dots.mjs
 *
 * Writes ten static SVGs to `public/maps/`: for each ocean plate (wide,
 * compact) a world layer, a US-only layer and a UK-only layer, and for each
 * of the phone atlas's two insets (phone-us, phone-uk) the world layer plus
 * its own country. The country layers share
 * the world layer's exact grid, so they sit dot-for-dot on top of it and the
 * stylesheet can brighten one landmass under the market switch by opacity
 * alone.
 *
 * The plates are equirectangular on an explicit region, so a city's position
 * is a straight line from its coordinates:
 *
 *   x = (lng - lng.min) / (lng.max - lng.min) * width
 *   y = (lat.max - lat) / (lat.max - lat.min) * height
 *
 * That formula — not `dotted-map`'s `addPin`, which snaps to the nearest grid
 * dot — is what `content/atlas.ts` uses to place the thirteen nodes, and the
 * PLATES table below is duplicated there; `tests/unit/atlas-geometry.test.ts`
 * reads the generated files' viewBox back and fails if the two drift apart.
 *
 * Output is a single `<path>` of zero-length subpaths with round caps rather
 * than thousands of `<circle>`s: ~12 bytes a dot, and the files are fetched
 * once by the inline `<image>` in the plate instead of being prerendered into
 * the HTML of ten routes.
 *
 * `dotted-map` is a devDependency only. Nothing under `src/` imports it.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import DottedMap from "dotted-map";

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(here, "../public/maps");

/**
 * Grid counts, not pixels. Each plate keeps width/height in the same ratio as
 * its region's longitude/latitude spans, so an equirectangular degree is the
 * same length on both axes and the landmasses are not stretched.
 *
 * Wide: 192° × 68° at 1.25 dots per degree — Alaska to the Caspian, the
 * Sahel to Svalbard. Compact: 148° × 56° at 0.75 dots per degree — the North
 * Atlantic alone, so a phone-width plate still resolves the US coastlines.
 */
const PLATES = {
  wide: {
    region: { lat: { min: 4, max: 72 }, lng: { min: -140, max: 52 } },
    width: 240,
    height: 85,
  },
  compact: {
    region: { lat: { min: 8, max: 64 }, lng: { min: -142, max: 6 } },
    width: 111,
    height: 42,
  },
  /**
   * The phone atlas is two insets on one plate rather than one ocean-wide
   * region: at ~270px across, a single North Atlantic plate resolved the US
   * at 130px and the UK as a dozen dots on the right edge. Each inset keeps
   * its own honest equirectangular scale — 1.667 dots per degree for the
   * continental US, 3 for the British Isles — and only ever draws the
   * world layer plus its own country. The plate is drawn at the page's full
   * width on a phone (outside the atlas frame), which is what pays for the
   * larger insets.
   */
  "phone-us": {
    region: { lat: { min: 21, max: 51 }, lng: { min: -126, max: -66 } },
    width: 100,
    height: 50,
    layers: ["world", "us"],
  },
  "phone-uk": {
    region: { lat: { min: 49.5, max: 59.5 }, lng: { min: -12, max: 2 } },
    width: 42,
    height: 30,
    layers: ["world", "uk"],
  },
};

/** `dotted-map` country codes are ISO 3166-1 alpha-3. */
const LAYERS = [
  { name: "world", countries: undefined, color: "#dbe4ef", opacity: 0.34, dot: 0.9 },
  { name: "us", countries: ["USA"], color: "#ffffff", opacity: 1, dot: 0.94 },
  { name: "uk", countries: ["GBR"], color: "#ffffff", opacity: 1, dot: 0.94 },
];

const fmt = (n) => String(Math.round(n * 100) / 100);

function plateSvg(plate, layer) {
  const map = new DottedMap({
    width: plate.width,
    height: plate.height,
    grid: "diagonal",
    region: plate.region,
    projection: { name: "equirectangular" },
    ...(layer.countries ? { countries: layer.countries } : {}),
  });
  const points = map.getPoints();
  const d = points.map((point) => `M${fmt(point.x)} ${fmt(point.y)}h0`).join("");
  return {
    count: points.length,
    svg:
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${String(plate.width)} ${String(plate.height)}">` +
      `<path fill="none" stroke="${layer.color}" stroke-opacity="${String(layer.opacity)}" ` +
      `stroke-width="${String(layer.dot)}" stroke-linecap="round" d="${d}"/></svg>\n`,
  };
}

await mkdir(outDir, { recursive: true });

for (const [plateName, plate] of Object.entries(PLATES)) {
  const layers = plate.layers
    ? LAYERS.filter((layer) => plate.layers.includes(layer.name))
    : LAYERS;
  for (const layer of layers) {
    const { count, svg } = plateSvg(plate, layer);
    const file = path.join(outDir, `atlas-${plateName}-${layer.name}.svg`);
    await writeFile(file, svg);
    console.log(
      `${path.relative(process.cwd(), file)}: ${String(count)} dots, ${String(Buffer.byteLength(svg))} bytes`,
    );
  }
}
