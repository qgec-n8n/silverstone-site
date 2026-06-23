import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";

const repo = "/Users/quentingeczy/Desktop/silverstone-site";
const require = createRequire(import.meta.url);
const inventory = require(path.join(repo, "scripts/seo-inventory.js"));
const pages = inventory.getIndexedPages(repo);
const sha256 = (value) =>
  crypto.createHash("sha256").update(value).digest("hex");
const normalize = (value = "") =>
  value
    .replace(/\r\n/g, "\n")
    .replace(/>\s+</g, "><")
    .replace(/\s+/g, " ")
    .trim();
const removeNetlifyRum = (value = "") =>
  value.replace(
    /<script\b[^>]*id=["']netlify-rum-container["'][\s\S]*?<\/script>/gi,
    "",
  );
const strip = (value = "") =>
  value
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
const first = (html, regex) => {
  const match = html.match(regex);
  return match ? strip(match[1]) : "";
};
const routeForFile = (file) =>
  file === "index.html" ? "/" : `/${file.replace(/\.html$/i, "")}`;

const crawlOne = async (page) => {
  const url = page.canonical;
  const started = Date.now();
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": "Silverstone transformation audit/1.0" },
    });
    const body = await response.text();
    const local = fs.readFileSync(path.join(repo, page.file), "utf8");
    return {
      file: page.file,
      route: routeForFile(page.file),
      requestedUrl: url,
      finalUrl: response.url,
      status: response.status,
      ok: response.ok,
      elapsedMs: Date.now() - started,
      contentType: response.headers.get("content-type") || "",
      cacheControl: response.headers.get("cache-control") || "",
      server: response.headers.get("server") || "",
      netlifyId: response.headers.get("x-nf-request-id") || "",
      bodyBytes: Buffer.byteLength(body),
      liveSha256: sha256(body),
      repoSha256: sha256(local),
      normalizedEqual: normalize(body) === normalize(local),
      normalizedEqualWithoutNetlifyRum:
        normalize(removeNetlifyRum(body)) === normalize(local),
      title: first(body, /<title[^>]*>([\s\S]*?)<\/title>/i),
      canonical:
        body.match(
          /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i,
        )?.[1] || "",
      robots:
        body.match(
          /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["'][^>]*>/i,
        )?.[1] || "",
      h1: first(body, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i),
      schemaBlockCount: [
        ...body.matchAll(
          /<script[^>]+type=["']application\/ld\+json["'][^>]*>/gi,
        ),
      ].length,
      ga: /G-7GT6DQKTT5/.test(body),
      calendly: /calendly/i.test(body),
      contactForm: /id=["']contact-form["']/.test(body),
    };
  } catch (error) {
    return {
      file: page.file,
      route: routeForFile(page.file),
      requestedUrl: url,
      error: error.message,
      elapsedMs: Date.now() - started,
    };
  }
};

const limit = 6;
const canonicalRows = [];
let cursor = 0;
const workers = Array.from({ length: limit }, async () => {
  while (cursor < pages.length) {
    const index = cursor++;
    canonicalRows[index] = await crawlOne(pages[index]);
  }
});
await Promise.all(workers);

const netlify = fs.readFileSync(path.join(repo, "netlify.toml"), "utf8");
const definitions = [
  ...netlify.matchAll(
    /\[\[redirects\]\]([\s\S]*?)(?=\n\[\[redirects\]\]|\n\[|$)/g,
  ),
].map((match) => ({
  from: match[1].match(/from\s*=\s*"([^"]+)"/)?.[1] || "",
  to: match[1].match(/to\s*=\s*"([^"]+)"/)?.[1] || "",
  status: Number(match[1].match(/status\s*=\s*(\d+)/)?.[1] || 0),
  force: /force\s*=\s*true/.test(match[1]),
}));
const uniqueDefinitions = [
  ...new Map(definitions.map((item) => [item.from, item])).values(),
];

const redirectRows = [];
cursor = 0;
const redirectWorkers = Array.from({ length: limit }, async () => {
  while (cursor < uniqueDefinitions.length) {
    const index = cursor++;
    const item = uniqueDefinitions[index];
    const requestedUrl = `https://silverstone-ai.com${item.from}`;
    try {
      const response = await fetch(requestedUrl, {
        redirect: "manual",
        headers: { "user-agent": "Silverstone transformation audit/1.0" },
      });
      redirectRows[index] = {
        ...item,
        requestedUrl,
        liveStatus: response.status,
        liveLocation: response.headers.get("location") || "",
        matchesRepository:
          response.status === item.status &&
          (response.headers.get("location") || "") === item.to,
      };
    } catch (error) {
      redirectRows[index] = { ...item, requestedUrl, error: error.message };
    }
  }
});
await Promise.all(redirectWorkers);

for (const url of [
  "https://silverstone-ai.com/robots.txt",
  "https://silverstone-ai.com/sitemap.xml",
  "https://silverstone-ai.com/site.webmanifest",
  "https://silverstone-ai.com/.netlify/functions/send-email",
]) {
  try {
    const response = await fetch(url, { redirect: "manual" });
    const body = await response.text();
    canonicalRows.push({
      recordType: "supporting-resource",
      requestedUrl: url,
      finalUrl: response.url,
      status: response.status,
      contentType: response.headers.get("content-type") || "",
      xRobotsTag: response.headers.get("x-robots-tag") || "",
      bodyBytes: Buffer.byteLength(body),
      bodySha256: sha256(body),
      bodyPreview: body.slice(0, 300),
    });
  } catch (error) {
    canonicalRows.push({
      recordType: "supporting-resource",
      requestedUrl: url,
      error: error.message,
    });
  }
}

process.stdout.write(
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      canonicalRows,
      redirectRows,
    },
    null,
    2,
  ),
);
