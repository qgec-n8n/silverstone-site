/**
 * Studio-location panel for /contact, for Silverstone's registered address
 * (the same address already used in the site's schema.org Organization
 * markup). The in-page embed uses OpenStreetMap rather than a keyless Google
 * Maps iframe: Google now serves `x-frame-options: SAMEORIGIN` on the
 * no-API-key embed trick (verified directly — every request is refused, not
 * a preview-sandbox artefact), and provisioning a Maps Embed API key is out
 * of scope here. The "Open in Google Maps" link still goes to Google, so
 * the outbound destination visitors expect for directions is unaffected.
 */
import { useState } from "react";

import { ArrowUpRight, MapPin } from "~/components/icons/lucide";
import { OrbitalLoader } from "~/components/ui/orbital-loader";
import { Reveal } from "~/features/services-v2/components/primitives";

const MAP_ADDRESS = "4 Deacon Street, London SE17 1GE, United Kingdom";
const MAP_LAT = 51.4928009;
const MAP_LON = -0.0978528;
const MAP_EMBED_URL = `https://www.openstreetmap.org/export/embed.html?bbox=${String(MAP_LON - 0.004)}%2C${String(MAP_LAT - 0.002)}%2C${String(MAP_LON + 0.004)}%2C${String(MAP_LAT + 0.002)}&layer=mapnik&marker=${String(MAP_LAT)}%2C${String(MAP_LON)}`;
const MAP_LINK_URL =
  "https://www.google.com/maps/search/?api=1&query=4+Deacon+Street%2C+SE17+1GE%2C+London%2C+UK";

export function MapPanel() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="ss-core-map ss-srv2-beam-border" id="studio-map">
      <Reveal kind="section">
        <div className="ss-core-booking__body">
          <span className="ss-srv2-bench__tag">
            <MapPin aria-hidden="true" />
            Studio address
          </span>
          <h3>{MAP_ADDRESS}</h3>
        </div>
      </Reveal>
      <Reveal kind="section" delayMs={120}>
        <div className="ss-core-map__frame" data-loaded={loaded} aria-busy={!loaded}>
          {!loaded ? (
            <div className="ss-core-booking__loading" role="status">
              <OrbitalLoader message="Loading map…" className="h-8 w-8" />
            </div>
          ) : null}
          <iframe
            title={`Map showing Silverstone AI's office at ${MAP_ADDRESS}`}
            src={MAP_EMBED_URL}
            loading="lazy"
            onLoad={() => setLoaded(true)}
          />
        </div>
      </Reveal>
      <Reveal kind="section" delayMs={200}>
        <div className="ss-core-form__actions">
          <a
            className="ss-srv2-btn ss-srv2-btn--ghost"
            href={MAP_LINK_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in Google Maps <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </Reveal>
    </div>
  );
}
