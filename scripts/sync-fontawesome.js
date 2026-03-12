const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const fontAwesomeRoot = path.join(projectRoot, 'node_modules', '@fortawesome', 'fontawesome-free');
const sourceCssFile = path.join(fontAwesomeRoot, 'css', 'all.css');
const targetCssDir = path.join(projectRoot, 'src', 'css', 'vendor');
const targetCssFile = path.join(targetCssDir, 'fontawesome.css');
const sourceWebfontsDir = path.join(fontAwesomeRoot, 'webfonts');
const targetWebfontsDir = path.join(projectRoot, 'assets', 'webfonts');
const webfontFiles = [
  'fa-brands-400.woff2',
  'fa-regular-400.woff2',
  'fa-solid-900.woff2',
  'fa-v4compatibility.woff2'
];

function assertExists(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing Font Awesome asset: ${filePath}`);
  }
}

function copyFile(sourceFile, targetFile) {
  fs.mkdirSync(path.dirname(targetFile), { recursive: true });
  fs.copyFileSync(sourceFile, targetFile);
}

assertExists(sourceCssFile);
copyFile(sourceCssFile, targetCssFile);

fs.mkdirSync(targetWebfontsDir, { recursive: true });
for (const fileName of webfontFiles) {
  const sourceFile = path.join(sourceWebfontsDir, fileName);
  const targetFile = path.join(targetWebfontsDir, fileName);
  assertExists(sourceFile);
  copyFile(sourceFile, targetFile);
}

console.log(`Synced Font Awesome CSS to ${targetCssFile}.`);
console.log(`Synced ${webfontFiles.length} Font Awesome webfonts to ${targetWebfontsDir}.`);
