/**
 * Resolve noncanonical URL variants ahead of static serving.
 *
 * Edge Functions run before redirect rules and static files, so this guard
 * owns every trailing-slash, repeated-slash and `.html` request:
 *  - variants of a current canonical route 301 to the canonical slashless
 *    path in one hop (query string preserved);
 *  - variants of a recognised legacy URL 301 straight to the current
 *    replacement in one hop (clean legacy paths are matched by the
 *    `[[redirects]]` rules in netlify.toml instead — they never reach this
 *    function because they don't match its pattern);
 *  - variants of an intentionally removed page return 410;
 *  - everything else returns a genuine 404, never a rewritten shell.
 *
 * Canonical requests and normal static assets do not match this function's
 * narrow pattern and continue through Netlify's static request chain.
 */
import { CANONICAL_PATHS } from "./generated/canonical-paths.ts";
import { GONE_PATHS, LEGACY_REDIRECTS } from "./lib/url-migration.mts";

const canonicalPaths = new Set(CANONICAL_PATHS);
const gonePaths = new Set(GONE_PATHS);

/**
 * Collapse a noncanonical variant onto the clean path it stands for:
 * repeated slashes fold, one `.html` suffix drops, `index` documents fold
 * onto their directory, and trailing slashes drop (the root stays `/`).
 * Case is intentionally preserved — case variants were never served, so
 * they stay 404s instead of becoming an unbounded alias surface.
 */
export function normalizePathVariant(pathname: string): string {
  let path = pathname.replace(/\/{2,}/g, "/");
  path = path.replace(/\.html$/, "");
  path = path.replace(/\/index$/, "/");
  while (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  return path === "" ? "/" : path;
}

function redirectTo(target: string, url: URL): Response {
  const location = new URL(target, url.origin);
  location.search = url.search;
  return new Response(null, {
    status: 301,
    headers: { location: location.toString() },
  });
}

export default function rejectNoncanonicalPath(
  request: Request,
): Response | undefined {
  const url = new URL(request.url);

  // The www hostname is collapsed to the apex by the forced netlify.toml
  // redirect, which Netlify applies ahead of this function, so www requests
  // never reach the logic below. A www request that also carries a
  // noncanonical variant therefore resolves in two 301 hops (www -> apex,
  // then apex-side normalization here) — accepted, since production URLs use
  // the apex host and a single www redirect cannot also rewrite the path.
  if (url.hostname === "www.silverstone-ai.com") {
    return undefined;
  }

  const { pathname } = url;
  const isNoncanonical =
    (pathname !== "/" && pathname.endsWith("/")) ||
    pathname.includes("//") ||
    pathname.endsWith(".html");

  if (!isNoncanonical) {
    return undefined;
  }

  const normalized = normalizePathVariant(pathname);
  const target = canonicalPaths.has(normalized)
    ? normalized
    : LEGACY_REDIRECTS[normalized];

  if (target) {
    return redirectTo(target, url);
  }

  if (gonePaths.has(normalized)) {
    return new Response("Gone", {
      status: 410,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "x-robots-tag": "noindex, nofollow",
      },
    });
  }

  return new Response("Not Found", {
    status: 404,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}

export const config = {
  // Invoke only for non-root trailing slashes, repeated slashes, or .html
  // requests. Upper/mixed-case route variants miss the case-sensitive static
  // files naturally once Pretty URLs are disabled.
  pattern: "^(?:/.+/$|/.*\\.html$|.*//.*)$",
  // Netlify's Edge Function manifest only accepts GET, POST, PUT, PATCH,
  // DELETE and OPTIONS here; HEAD requests are served from the GET path at
  // the CDN, so listing it breaks manifest validation without adding cover.
  method: ["GET"],
};
