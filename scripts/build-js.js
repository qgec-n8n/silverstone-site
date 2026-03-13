const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const srcRoot = path.join(projectRoot, 'src', 'js');
const outDir = path.join(projectRoot, 'assets', 'js');
const outFile = path.join(outDir, 'app.js');

const jsOrder = [
  'header-nav.js',
  'scroll-reveal.js',
  'stats.js',
  'viewport-metrics.js',
  'parallax.js',
  'hero-shader.js',
  'magnetic-buttons.js',
  'marquee.js',
  'gallery.js',
  'cookie-consent.js',
  'contact-form.js',
  'app.js'
];

function buildBundle() {
  const parts = jsOrder.map((relativePath) => {
    const fullPath = path.join(srcRoot, relativePath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`Missing JS source: ${relativePath}`);
      return '';
    }
    return fs.readFileSync(fullPath, 'utf8');
  });

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, parts.join('\n\n'), 'utf8');
  console.log(`Built ${outFile} from ${jsOrder.length} source files.`);
}

buildBundle();
