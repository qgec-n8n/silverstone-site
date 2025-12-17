import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(
  __dirname,
  "../node_modules/@jridgewell/sourcemap-codec/dist"
);
const targetFile = path.join(distDir, "sourcemap-codec.mjs");

if (!fs.existsSync(distDir)) {
  process.exit(0);
}

if (!fs.existsSync(targetFile)) {
  const content = `import codec from "./sourcemap-codec.umd.js";
export const decode = codec.decode;
export const decodeGeneratedRanges = codec.decodeGeneratedRanges;
export const decodeOriginalScopes = codec.decodeOriginalScopes;
export const encode = codec.encode;
export const encodeGeneratedRanges = codec.encodeGeneratedRanges;
export const encodeOriginalScopes = codec.encodeOriginalScopes;
export default codec;
`;

  fs.writeFileSync(targetFile, content, "utf8");
}
