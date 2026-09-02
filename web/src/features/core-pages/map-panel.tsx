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
 * Postcode note (checked 2026-09-02). The share URL below carries
 * `SE17 1GD` while every address string the site asserts — here, the schema
 * `postalCode`, and the privacy policy — says `SE17 1GE`. Both are live Royal
 * Mail postcodes sharing one ONS grid reference: 4 Deacon Street is a
 * multi-postcode block, and Companies House shows registrations there under
 * SE17 1GB, 1GD, 1GE and 1GF alike. So `SE17 1GE` is not wrong, and it stays.
 *
 * The `!2s…` segment is a display hint only: Google resolves the pin from the
 * place id (`!1s0x4876049f14d0c721:0x1a60c8a8a0a8ba73`, a `gcid:subpremise`
 * record) and returns "4 Deacon St, London SE17 1GD" whichever label is
 * passed — rewriting it to 1GE changes the source and nothing else, so don't.
 * Asking the geocoder for "…SE17 1GE" directly resolves to the same 1GD
 * subpremise, so no embed URL can make the map render 1GE.
 *
 * The consequence is a visible NAP mismatch on /contact: the card says 1GE,
 * the map inside it says 1GD. Fixing it needs a share URL generated from the
 * studio's own Google Business Profile — an owner action, not a code change.
 */
const MAP_QUERY = "4 Deacon Street, London SE17 1GE, United Kingdom";
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
      <BorderBeam />
    </div>
  );
}
