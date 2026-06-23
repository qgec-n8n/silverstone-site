import type { FutureRouteRecord } from "~/data/route-schema";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function buildSitemapXml({
  environment,
  routes,
}: {
  environment: "production" | "staging";
  routes: readonly FutureRouteRecord[];
}): string {
  if (environment === "staging") {
    return "";
  }

  const entries = routes
    .filter((route) => route.productionIndexable && route.sitemap)
    .map((route) => `  <url><loc>${escapeXml(route.canonical)}</loc></url>`)
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries,
    "</urlset>",
    "",
  ].join("\n");
}
