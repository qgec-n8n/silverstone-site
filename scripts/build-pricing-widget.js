// FILE: scripts/build-pricing-widget.js
/**
 * Build the pricing widget JS bundle with esbuild.
 *
 * Output: assets/js/pricing-widget.js
 */

const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const REPO_ROOT = path.join(__dirname, "..");
const ENTRY_POINT = path.join(REPO_ROOT, "pricing-widget", "src", "index.tsx");
const OUT_FILE = path.join(REPO_ROOT, "assets", "js", "pricing-widget.js");
const SRC_ROOT = path.join(REPO_ROOT, "pricing-widget", "src");

async function build() {
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });

  await esbuild.build({
    entryPoints: [ENTRY_POINT],
    outfile: OUT_FILE,
    bundle: true,
    format: "iife",
    platform: "browser",
    target: ["es2019"],
    sourcemap: false,
    minify: true,
    jsx: "automatic",
    define: {
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "production",
      ),
    },
    alias: {
      "@": SRC_ROOT,
    },
  });

  console.log(`Built ${path.relative(REPO_ROOT, OUT_FILE)}`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
