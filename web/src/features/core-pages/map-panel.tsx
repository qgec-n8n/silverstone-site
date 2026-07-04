/**
 * Studio-location panel for /contact, for Silverstone's registered address
 * (the same address already used in the site's schema.org Organization
 * markup). Embedded via the Google Maps Embed API "place" mode
 * (https://developers.google.com/maps/documentation/embed/embedding-map),
 * authenticated with a Maps Embed API key restricted by HTTP referrer in
 * Google Cloud Console — this key is designed to be visible client-side
 * (it appears directly in the iframe URL by design, same as any Maps Embed
 * integration on the web), so it is read from VITE_GOOGLE_MAPS_EMBED_KEY
 * rather than treated as a server secret.
 *
 * The Embed API offers no style control, so the premium dark treatment is
 * done outside the iframe: a CSS filter re-grades Google's light cartography
 * into the site's void-blue palette, and a pointer-transparent HUD layer
 * (grid, corner brackets, vignette, coordinates chip) integrates the map
 * into the card. The map stays fully interactive underneath.
 */
import { useState } from "react";

import { ArrowUpRight, MapPin } from "~/components/icons/lucide";
import { OrbitalLoader } from "~/components/ui/orbital-loader";
import { Reveal } from "~/features/services-v2/components/primitives";

const MAP_QUERY = "4 Deacon Street, London SE17 1GE, United Kingdom";
const MAP_EMBED_URL = `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(import.meta.env.VITE_GOOGLE_MAPS_EMBED_KEY)}&q=${encodeURIComponent(MAP_QUERY)}&zoom=16`;
const MAP_DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`;

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
          <h3 className="ss-core-map__address">
            <span>4 Deacon Street, SE17 1GE</span>
            <span>London, United Kingdom</span>
          </h3>
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
            title="Map showing Silverstone AI's studio at 4 Deacon Street, SE17 1GE, London, United Kingdom"
            src={MAP_EMBED_URL}
            loading="eager"
            onLoad={() => setLoaded(true)}
          />
          <div className="ss-core-map__hud" aria-hidden="true">
            <span className="ss-core-map__hud-grid" />
            <span className="ss-core-map__hud-vignette" />
            <span className="ss-core-map__hud-corner" data-corner="tl" />
            <span className="ss-core-map__hud-corner" data-corner="tr" />
            <span className="ss-core-map__hud-corner" data-corner="bl" />
            <span className="ss-core-map__hud-corner" data-corner="br" />
          </div>
          <div className="ss-core-map__chip" aria-hidden="true">
            <span className="ss-core-map__chip-dot" />
            SE17 1GE · London
          </div>
          <a
            className="ss-core-map__directions"
            href={MAP_DIRECTIONS_URL}
            target="_blank"
            rel="noreferrer"
          >
            Open in Google Maps
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </Reveal>
    </div>
  );
}
