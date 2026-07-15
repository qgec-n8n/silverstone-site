import { describe, expect, it } from "vitest";

import rejectNoncanonicalPath, {
  config as edgeConfig,
  normalizePathVariant,
} from "../../../netlify/edge-functions/reject-noncanonical-paths";
import {
  GONE_PATHS,
  LEGACY_REDIRECTS,
} from "../../../netlify/edge-functions/lib/url-migration.mts";
import { CANONICAL_PATHS } from "../../../netlify/edge-functions/generated/canonical-paths";
import { PUBLISHED_BLOG_POSTS } from "~/data/blog-posts";
import { futureRouteManifest } from "~/data/future-routes";

// Netlify's Edge Functions manifest validator rejects any method outside this
// enum (deploys fail at the bundling step), so the config must never widen.
// HEAD in particular broke production bundling on 2026-07-14.
const NETLIFY_EDGE_ALLOWED_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
] as const;

function invoke(url: string): Response | undefined {
  return rejectNoncanonicalPath(new Request(url));
}

function expectRedirect(url: string, location: string) {
  const response = invoke(url);
  expect(response?.status).toBe(301);
  expect(response?.headers.get("location")).toBe(location);
}

describe("reject-noncanonical-paths edge function", () => {
  it("declares only methods Netlify's edge manifest accepts", () => {
    const methods = Array.isArray(edgeConfig.method)
      ? edgeConfig.method
      : [edgeConfig.method];
    expect(methods.length).toBeGreaterThan(0);
    for (const method of methods) {
      expect(NETLIFY_EDGE_ALLOWED_METHODS).toContain(method);
    }
  });

  it("declares a pattern so canonical routes and assets are never invoked", () => {
    const pattern = new RegExp(edgeConfig.pattern);
    expect(pattern.test("/about/")).toBe(true);
    expect(pattern.test("/about.html")).toBe(true);
    expect(pattern.test("//about")).toBe(true);
    expect(pattern.test("/about")).toBe(false);
    expect(pattern.test("/")).toBe(false);
    expect(pattern.test("/sitemap.xml")).toBe(false);
    expect(pattern.test("/sitemap-pages.xml")).toBe(false);
    expect(pattern.test("/robots.txt")).toBe(false);
    expect(pattern.test("/assets/entry.client.js")).toBe(false);
  });

  it("defers every www request to the forced hostname redirect", () => {
    // Netlify applies the forced netlify.toml www->apex redirect before this
    // function runs, so the function must not act on www requests at all; the
    // apex-side hop then normalizes any variant.
    expect(invoke("https://www.silverstone-ai.com/about/")).toBeUndefined();
    expect(invoke("https://www.silverstone-ai.com/about.html?x=1")).toBeUndefined();
    expect(
      invoke("https://www.silverstone-ai.com/niches/dentists.html"),
    ).toBeUndefined();
    expect(invoke("https://www.silverstone-ai.com/not-a-page/")).toBeUndefined();
  });

  it("passes canonical requests through untouched", () => {
    expect(invoke("https://silverstone-ai.com/")).toBeUndefined();
    expect(invoke("https://silverstone-ai.com/about")).toBeUndefined();
    expect(invoke("https://silverstone-ai.com/industry/dentists")).toBeUndefined();
  });

  it("normalizes variants without inventing new alias surfaces", () => {
    expect(normalizePathVariant("/about/")).toBe("/about");
    expect(normalizePathVariant("/about.html")).toBe("/about");
    expect(normalizePathVariant("//about//")).toBe("/about");
    expect(normalizePathVariant("/about/index.html")).toBe("/about");
    expect(normalizePathVariant("/index.html")).toBe("/");
    expect(normalizePathVariant("//")).toBe("/");
    // Case is preserved: case variants were never served.
    expect(normalizePathVariant("/About/")).toBe("/About");
  });

  it("301s trailing-slash and .html variants of every canonical route in one hop", () => {
    for (const path of CANONICAL_PATHS) {
      if (path === "/") continue;
      expectRedirect(
        `https://silverstone-ai.com${path}/`,
        `https://silverstone-ai.com${path}`,
      );
    }
    expectRedirect(
      "https://silverstone-ai.com/pricing/?utm_source=x",
      "https://silverstone-ai.com/pricing?utm_source=x",
    );
    expectRedirect(
      "https://silverstone-ai.com/index.html",
      "https://silverstone-ai.com/",
    );
    expectRedirect(
      "https://silverstone-ai.com/about.html",
      "https://silverstone-ai.com/about",
    );
  });

  it("301s variants of recognised legacy URLs straight to their replacement", () => {
    expectRedirect(
      "https://silverstone-ai.com/niches/dentists.html",
      "https://silverstone-ai.com/industry/dentists",
    );
    expectRedirect(
      "https://silverstone-ai.com/niches/trades-virtual-office/",
      "https://silverstone-ai.com/industry/trades",
    );
    expectRedirect(
      "https://silverstone-ai.com/industries/hospitality/",
      "https://silverstone-ai.com/industry/hospitality",
    );
    expectRedirect(
      "https://silverstone-ai.com/services/salons-barbers/",
      "https://silverstone-ai.com/industry/salons-barbers",
    );
  });

  it("keeps genuine 404s for unknown variants and 410s for removed pages", () => {
    const notFound = invoke("https://silverstone-ai.com/not-a-page/");
    expect(notFound?.status).toBe(404);
    expect(notFound?.headers.get("x-robots-tag")).toContain("noindex");
    expect(invoke("https://silverstone-ai.com/ABOUT/")?.status).toBe(404);
    expect(invoke("https://silverstone-ai.com/blog/unknown-post/")?.status).toBe(404);
    for (const path of GONE_PATHS) {
      expect(invoke(`https://silverstone-ai.com${path}/`)?.status).toBe(410);
    }
  });
});

describe("url migration map integrity", () => {
  const canonicalSet = new Set(CANONICAL_PATHS);

  it("generated canonical paths match the authoritative route + blog sources", () => {
    const expected = new Set([
      ...futureRouteManifest.map((route) => route.path),
      "/",
      ...PUBLISHED_BLOG_POSTS.map((post) => `/blog/${post.slug}`),
    ]);
    // futureRouteManifest includes "/" already; the union above just makes
    // the root explicit for readability.
    expect(new Set(CANONICAL_PATHS)).toEqual(expected);
  });

  it("every redirect terminates on a canonical route in one hop", () => {
    for (const [source, target] of Object.entries(LEGACY_REDIRECTS)) {
      expect(target === "/" || canonicalSet.has(target)).toBe(true);
      expect(LEGACY_REDIRECTS[target]).toBeUndefined();
      expect(canonicalSet.has(source)).toBe(false);
      expect(source).not.toBe(target);
    }
  });

  it("gone paths never shadow canonical routes or redirect sources", () => {
    for (const path of GONE_PATHS) {
      expect(canonicalSet.has(path)).toBe(false);
      expect(LEGACY_REDIRECTS[path]).toBeUndefined();
    }
    expect(new Set(GONE_PATHS).size).toBe(GONE_PATHS.length);
  });
});
