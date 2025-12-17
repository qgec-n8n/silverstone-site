import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const source = path.resolve(__dirname, "../src/pricing-widget.css");
const dest = path.resolve(__dirname, "../../assets/css/pricing-widget.css");

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.copyFileSync(source, dest);
