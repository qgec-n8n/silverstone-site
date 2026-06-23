import rawLegacyRouteManifest from "~/data/generated/legacy-route-manifest.json";
import { validateLegacyRouteManifest, type LegacyUrlRecord } from "~/data/route-schema";

const validationIssues = validateLegacyRouteManifest(rawLegacyRouteManifest);
if (validationIssues.length > 0) {
  throw new Error(`Invalid legacy URL manifest:\n${validationIssues.join("\n")}`);
}

export const legacyRouteManifest =
  rawLegacyRouteManifest as unknown as LegacyUrlRecord[];

export const activeRedirects = legacyRouteManifest.filter(
  (route) =>
    route.recordType === "redirect" &&
    route.active &&
    (route.disposition === "redirected" || route.disposition === "consolidated"),
);

export { validateLegacyRouteManifest };
export type { LegacyUrlRecord };
