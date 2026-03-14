#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const https = require("https");

function findIndexNowKeyFile(repoRoot) {
  const entries = fs.readdirSync(repoRoot, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".txt")) continue;
    const fullPath = path.join(repoRoot, entry.name);
    const contents = fs.readFileSync(fullPath, "utf8").trim();
    const expectedKey = entry.name.replace(/\.txt$/, "");
    if (contents === expectedKey) {
      return fullPath;
    }
  }
  return "";
}

function readSitemapUrls(repoRoot) {
  const sitemap = fs.readFileSync(path.join(repoRoot, "sitemap.xml"), "utf8");
  return Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)).map((match) =>
    match[1].trim()
  );
}

function postJson(hostname, pathname, payload) {
  const body = JSON.stringify(payload);
  return new Promise((resolve, reject) => {
    const request = https.request(
      {
        hostname,
        path: pathname,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (response) => {
        let data = "";
        response.on("data", (chunk) => {
          data += chunk;
        });
        response.on("end", () => {
          if (response.statusCode === 200 || response.statusCode === 202) {
            resolve({ statusCode: response.statusCode, body: data });
            return;
          }
          reject(
            new Error(
              `IndexNow request failed (${response.statusCode || "unknown"}): ${data}`
            )
          );
        });
      }
    );

    request.on("error", reject);
    request.write(body);
    request.end();
  });
}

async function submitIndexNow(options = {}) {
  const repoRoot = options.repoRoot || path.resolve(__dirname, "..");
  const logger = options.logger || console;

  const keyFilePath = findIndexNowKeyFile(repoRoot);
  if (!keyFilePath) {
    throw new Error("Unable to find a root IndexNow key file");
  }

  const urls = readSitemapUrls(repoRoot);
  if (!urls.length) {
    throw new Error("Sitemap is empty; nothing to submit to IndexNow");
  }

  const host = new URL(urls[0]).host;
  const keyFileName = path.basename(keyFilePath);
  const key = keyFileName.replace(/\.txt$/, "");
  const payload = {
    host,
    key,
    keyLocation: `https://${host}/${keyFileName}`,
    urlList: urls,
  };

  const result = await postJson("api.indexnow.org", "/indexnow", payload);
  logger.log(
    `IndexNow submitted ${urls.length} canonical URLs using ${keyFileName} (${result.statusCode})`
  );
  logger.log(
    "IndexNow only helps participating search engines; Google indexing still depends on canonical signals, crawlability, and page quality."
  );

  return {
    ...result,
    count: urls.length,
    keyFileName,
    host,
  };
}

if (require.main === module) {
  const warnOnly = process.argv.includes("--warn-only");
  submitIndexNow()
    .catch((error) => {
      const message = `IndexNow submission failed: ${error.message}`;
      if (warnOnly) {
        console.warn(message);
        process.exit(0);
      }
      console.error(message);
      process.exit(1);
    });
}

module.exports = {
  findIndexNowKeyFile,
  submitIndexNow,
};
