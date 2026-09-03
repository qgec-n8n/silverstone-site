/**
 * Studio-location panel for /contact, for Silverstone's registered address
 * (the same address already used in the site's schema.org Organization
 * markup). Embedded via the keyless Google Maps share embed (the exact
 * share-URL supplied by the owner from Google Maps' "Embed a map" dialog),
 * so no Maps Embed API key is required.
 *
 * The embed offers no style control, so the premium dark treatment is
 * done outside the iframe: a CSS filter re-grades Google's light cartography
 * into the site's void-blue palette, and a pointer-transparent HUD layer
 * (grid, corner brackets, vignette, coordinates chip) integrates the map
 * into the card. The map stays fully interactive underneath.
 */
import { useState } from "react";

import { ArrowUpRight, MapPin } from "~/components/icons/lucide";
import { OrbitalLoader } from "~/components/ui/orbital-loader";
import { BorderBeam, Reveal } from "~/features/services-v2/components/primitives";

/**
 * Postcode note (owner-confirmed 2026-09-03). 4 Deacon Street is a
 * multi-postcode block: SE17 1GB, 1GD, 1GE and 1GF are all live Royal Mail
 * postcodes sharing one ONS grid reference, and Companies House shows
 * registrations at this address under each of them. So the `SE17 1GE` the
 * site used to assert was a plausible label rather than an obvious error —
 * which is why an earlier pass concluded it should stay.
 *
 * The studio's postcode is SE17 1GD. That is also what Google's place record
 * returns, so the visible copy, the schema `postalCode` and the map pin now
 * agree — closing the NAP mismatch that pass had to leave open.
 *
 * The `!2s…` segment in the embed URL is a display hint only: Google resolves
 * the pin from the place id (`!1s0x4876049f14d0c721:0x1a60c8a8a0a8ba73`, a
 * `gcid:subpremise` record) and returns "4 Deacon St, London SE17 1GD"
 * whichever label is passed. Don't try to steer the pin by editing it.
 */
const MAP_QUERY = "4 Deacon Street, London SE17 1GD, United Kingdom";
const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2484.1238117846615!2d-0.09805029999999998!3d51.4925954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4876049f14d0c721%3A0x1a60c8a8a0a8ba73!2s4%20Deacon%20St%2C%20London%20SE17%201GD!5e0!3m2!1sen!2suk!4v1783362761114!5m2!1sen!2suk";
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
            <span>4 Deacon Street, SE17 1GD</span>
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
            title="Map showing Silverstone AI's studio at 4 Deacon Street, SE17 1GD, London, United Kingdom"
            src={MAP_EMBED_URL}
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
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
            SE17 1GD · London
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
      <BorderBeam />
    </div>
  );
}
