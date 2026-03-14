#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const https = require("https");
const { execFileSync } = require("child_process");
const {
  getCanonicalUrlMap,
  getCanonicalUrls,
  normalizeUrl,
} = require("./seo-inventory");

const EXPECTED_INDEXNOW_KEY = "be41def3cc62428d99800b885d2d7a0f";
const EXPECTED_INDEXNOW_KEY_FILE = `${EXPECTED_INDEXNOW_KEY}.txt`;
const SITEWIDE_TRIGGER_PATTERNS = [
  /^robots\.txt$/i,
  /^sitemap\.xml$/i,
  /^netlify\.toml$/i,
  /^site\.webmanifest$/i,
  /^favicon\.ico$/i,
  /^favicon-\d+x\d+\.png$/i,
  /^apple-touch-icon\.png$/i,
  /^scripts\/seo-inventory\.js$/i,
  /^scripts\/generate-sitemaps\.js$/i,
  new RegExp(`^${EXPECTED_INDEXNOW_KEY_FILE.replace(".", "\\.")}$`, "i"),
];

function normalizeFilePath(filePath) {
  return filePath.replace(/\\/g, "/").replace(/^\.?\//, "");
}

function findValidIndexNowKeyFiles(siteRoot) {
  const entries = fs.readdirSync(siteRoot, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".txt"))
    .map((entry) => entry.name)
    .filter((fileName) => {
      const fullPath = path.join(siteRoot, fileName);
      const contents = fs.readFileSync(fullPath, "utf8").trim();
      return contents === fileName.replace(/\.txt$/, "");
    })
    .sort();
}

function getIndexNowKeyFile(siteRoot) {
  const validKeyFiles = findValidIndexNowKeyFiles(siteRoot);

  if (validKeyFiles.length !== 1) {
    throw new Error(
      `Expected exactly one valid root IndexNow key file, found ${validKeyFiles.length}`
    );
  }

  if (validKeyFiles[0] !== EXPECTED_INDEXNOW_KEY_FILE) {
    throw new Error(
      `Expected IndexNow key file ${EXPECTED_INDEXNOW_KEY_FILE}, found ${validKeyFiles[0]}`
    );
  }

  return path.join(siteRoot, validKeyFiles[0]);
}

function readSitemapUrls(siteRoot) {
  return getCanonicalUrls(siteRoot);
}

function canonicalUrlForFilePath(filePath, siteRoot = path.resolve(__dirname, "..")) {
  const normalizedPath = normalizeFilePath(filePath);
  return getCanonicalUrlMap(siteRoot).get(normalizedPath) || "";
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

function ensureAbsoluteUrls(urls) {
  return Array.from(
    new Set(
      urls.map((url) => {
        const parsed = new URL(url);
        return normalizeUrl(parsed.toString());
      })
    )
  );
}

function buildIndexNowPayload(options = {}) {
  const siteRoot = options.siteRoot || path.resolve(__dirname, "..");
  const rawUrls = options.urls || [];

  if (!rawUrls.length) {
    throw new Error("IndexNow requires at least one URL");
  }

  const urls = ensureAbsoluteUrls(rawUrls);
  const hostSet = new Set(urls.map((url) => new URL(url).host));
  if (hostSet.size !== 1) {
    throw new Error(`IndexNow URLs must share one host, found ${hostSet.size}`);
  }

  const host = Array.from(hostSet)[0];
  if (host !== "silverstone-ai.com") {
    throw new Error(`IndexNow URLs must use silverstone-ai.com, found ${host}`);
  }

  const keyFilePath = getIndexNowKeyFile(siteRoot);
  const keyFileName = path.basename(keyFilePath);
  const key = keyFileName.replace(/\.txt$/, "");

  return {
    host,
    key,
    keyLocation: `https://${host}/${keyFileName}`,
    urlList: urls,
  };
}

function isSitewideTrigger(filePath) {
  const normalizedPath = normalizeFilePath(filePath);
  return SITEWIDE_TRIGGER_PATTERNS.some((pattern) => pattern.test(normalizedPath));
}

function selectIndexNowUrlsForPaths(options = {}) {
  const siteRoot = options.siteRoot || path.resolve(__dirname, "..");
  const changedPaths = (options.changedPaths || []).map(normalizeFilePath).filter(Boolean);
  const sitemapUrls = readSitemapUrls(siteRoot);

  if (!sitemapUrls.length) {
    throw new Error("Sitemap is empty; nothing to submit to IndexNow");
  }

  if (!changedPaths.length) {
    return {
      mode: "skip",
      reason: "No changed files were supplied",
      urls: [],
      changedPaths: [],
    };
  }

  const sitewideTriggers = changedPaths.filter(isSitewideTrigger);
  if (sitewideTriggers.length > 0) {
    return {
      mode: "sitewide",
      reason: `Sitewide SEO files changed: ${sitewideTriggers.join(", ")}`,
      urls: sitemapUrls,
      changedPaths,
    };
  }

  const targetedUrls = Array.from(
    new Set(
      changedPaths
        .map((filePath) => canonicalUrlForFilePath(filePath, siteRoot))
        .filter(Boolean)
        .map(normalizeUrl)
    )
  );

  if (targetedUrls.length > 0) {
    return {
      mode: "targeted",
      reason: `Indexable pages changed: ${targetedUrls.join(", ")}`,
      urls: targetedUrls,
      changedPaths,
    };
  }

  return {
    mode: "skip",
    reason: `No indexable or sitewide SEO changes detected in ${changedPaths.length} changed files`,
    urls: [],
    changedPaths,
  };
}

function refExists(repoRoot, ref) {
  if (!ref || /^0+$/.test(ref)) {
    return false;
  }

  try {
    execFileSync("git", ["rev-parse", "--verify", `${ref}^{commit}`], {
      cwd: repoRoot,
      stdio: "ignore",
    });
    return true;
  } catch {
    return false;
  }
}

function readChangedPathsFromGit(options = {}) {
  const repoRoot = options.repoRoot || path.resolve(__dirname, "..");
  const baseRef = options.baseRef;
  const headRef = options.headRef;
  const output = execFileSync(
    "git",
    [
      "diff",
      "--name-status",
      "--find-renames",
      "--find-copies",
      baseRef,
      headRef,
    ],
    {
      cwd: repoRoot,
      encoding: "utf8",
    }
  );

  return output
    .split(/\r?\n/)
    .filter(Boolean)
    .flatMap((line) => {
      const parts = line.split("\t");
      const status = parts[0] || "";
      if (status.startsWith("R") || status.startsWith("C")) {
        return parts.slice(1, 3);
      }
      return parts.slice(1, 2);
    })
    .map(normalizeFilePath)
    .filter(Boolean);
}

function collectChangedIndexNowUrls(options = {}) {
  const repoRoot = options.repoRoot || path.resolve(__dirname, "..");
  const siteRoot = options.siteRoot || repoRoot;
  const baseRef = options.baseRef || process.env.CACHED_COMMIT_REF;
  const headRef = options.headRef || process.env.COMMIT_REF || "HEAD";
  const sitemapUrls = readSitemapUrls(siteRoot);

  if (!sitemapUrls.length) {
    throw new Error("Sitemap is empty; nothing to submit to IndexNow");
  }

  if (!refExists(repoRoot, baseRef) || !refExists(repoRoot, headRef)) {
    return {
      mode: "sitewide",
      reason: "Netlify git refs were unavailable, so submitting all canonical sitemap URLs",
      urls: sitemapUrls,
      changedPaths: [],
    };
  }

  const changedPaths = readChangedPathsFromGit({ repoRoot, baseRef, headRef });
  return selectIndexNowUrlsForPaths({ siteRoot, changedPaths });
}

async function submitIndexNow(options = {}) {
  const logger = options.logger || console;
  const payload = buildIndexNowPayload(options);
  const result = await postJson("api.indexnow.org", "/indexnow", payload);

  logger.log(
    `IndexNow submitted ${payload.urlList.length} URLs to https://api.indexnow.org/indexnow (${result.statusCode})`
  );
  logger.log(`IndexNow key location: ${payload.keyLocation}`);
  logger.log(
    "IndexNow only helps participating search engines; Google indexing still depends on canonical signals, crawlability, and page quality."
  );

  return {
    ...result,
    count: payload.urlList.length,
    host: payload.host,
    keyLocation: payload.keyLocation,
    urls: payload.urlList,
  };
}

function parseCliArgs(argv) {
  const args = {
    all: false,
    urls: [],
    warnOnly: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--all") {
      args.all = true;
      continue;
    }

    if (arg === "--url") {
      const url = argv[index + 1];
      if (!url) {
        throw new Error("--url requires an absolute URL");
      }
      args.urls.push(url);
      index += 1;
      continue;
    }

    if (arg === "--warn-only") {
      args.warnOnly = true;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (args.all && args.urls.length > 0) {
    throw new Error("Use either --all or one or more --url arguments, not both");
  }

  if (!args.all && args.urls.length === 0) {
    throw new Error("Specify one or more --url arguments, or use --all for a rare full-site resubmission");
  }

  return args;
}

async function runCli() {
  const args = parseCliArgs(process.argv.slice(2));
  const siteRoot = path.resolve(__dirname, "..");
  const urls = args.all ? readSitemapUrls(siteRoot) : args.urls;

  if (args.all) {
    console.log(
      "--all should only be used when the whole site's search surface changed, such as a migration or broad SEO rollout."
    );
  }

  await submitIndexNow({ siteRoot, urls, logger: console });
}

if (require.main === module) {
  runCli().catch((error) => {
    const warnOnly = process.argv.includes("--warn-only");
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
  EXPECTED_INDEXNOW_KEY,
  EXPECTED_INDEXNOW_KEY_FILE,
  buildIndexNowPayload,
  canonicalUrlForFilePath,
  collectChangedIndexNowUrls,
  findValidIndexNowKeyFiles,
  readSitemapUrls,
  selectIndexNowUrlsForPaths,
  submitIndexNow,
};
