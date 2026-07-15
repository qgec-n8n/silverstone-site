import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

/**
 * The edge-function unit tests import netlify/edge-functions/generated/
 * canonical-paths.ts, which is build output. Regenerate it before every test
 * run so tests always exercise the dataset the next deploy would ship.
 */
export default function globalSetup() {
  execFileSync(
    process.execPath,
    [
      fileURLToPath(
        new URL("../scripts/generate-edge-route-data.mjs", import.meta.url),
      ),
    ],
    { stdio: "inherit" },
  );
}
