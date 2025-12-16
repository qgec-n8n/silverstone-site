/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { stdio: "inherit", shell: false, ...opts });
  if (res.status !== 0) {
    throw new Error(`Command failed: ${cmd} ${args.join(" ")}`);
  }
}

function main() {
  const repoRoot = path.resolve(__dirname, "..");
  const widgetRoot = path.join(repoRoot, "src", "widgets", "pricing");
  const entryTsx = path.join(widgetRoot, "embed.tsx");
  const cssIn = path.join(widgetRoot, "index.css");
  const genDir = path.join(widgetRoot, "generated");
  const cssOut = path.join(genDir, "pricing.tailwind.css");
  const bundleOut = path.join(repoRoot, "assets", "js", "ss-pricing-widget.iife.js");

  if (!fs.existsSync(widgetRoot)) {
    console.log("[pricing-build] Widget folder missing; skipping.");
    console.log("[pricing-build] Expected:", path.relative(repoRoot, widgetRoot));
    return;
  }
  if (!fs.existsSync(entryTsx)) {
    console.log("[pricing-build] Widget entry missing; skipping.");
    console.log("[pricing-build] Expected:", path.relative(repoRoot, entryTsx));
    return;
  }
  if (!fs.existsSync(cssIn)) {
    console.log("[pricing-build] Widget CSS input missing; skipping.");
    console.log("[pricing-build] Expected:", path.relative(repoRoot, cssIn));
    return;
  }

  fs.mkdirSync(genDir, { recursive: true });
  fs.mkdirSync(path.dirname(bundleOut), { recursive: true });

  console.log("[pricing-build] Generating pricing data from CSV...");
  run("node", [path.join(repoRoot, "scripts", "generate-pricing-data.js")]);

  console.log("[pricing-build] Building Tailwind CSS for widget...");
  run("npx", [
    "tailwindcss",
    "-c", path.join(repoRoot, "scripts", "tailwind.pricing.config.cjs"),
    "-i", cssIn,
    "-o", cssOut,
    "--minify",
  ], { cwd: repoRoot });

  let esbuild;
  try {
    esbuild = require("esbuild");
  } catch (_e) {
    throw new Error("Missing dev dependency: esbuild");
  }

  console.log("[pricing-build] Bundling widget to assets/js/ss-pricing-widget.iife.js ...");

  esbuild.buildSync({
    entryPoints: [entryTsx],
    outfile: bundleOut,
    bundle: true,
    minify: true,
    sourcemap: false,
    format: "iife",
    target: ["es2018"],
    define: {
      "process.env.NODE_ENV": JSON.stringify("production"),
    },
    loader: {
      ".css": "text",
    },
  });

  console.log("[pricing-build] Built:", path.relative(repoRoot, bundleOut));
}

if (require.main === module) {
  try {
    main();
  } catch (err) {
    console.error("[pricing-build] ERROR:", err.message);
    process.exit(1);
  }
}
