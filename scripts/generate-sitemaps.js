#!/usr/bin/env node

const path = require("path");
const {
  SITEMAP_FILE_NAMES,
  writeSitemapArtifacts,
} = require("./seo-inventory");

const repoRoot = path.resolve(__dirname, "..");
const artifacts = writeSitemapArtifacts(repoRoot);

for (const fileName of Object.keys(SITEMAP_FILE_NAMES).map((key) => SITEMAP_FILE_NAMES[key])) {
  if (artifacts[fileName]) {
    console.log(`Generated ${fileName}`);
  }
}
