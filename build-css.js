/**
 * Build script to concatenate modular CSS under `src/css` into a single
 * `assets/css/styles.css` bundle while normalising breakpoints.
 */
const fs = require('fs');
const path = require('path');

const MOBILE_BREAKPOINT = 768;
const DESKTOP_BREAKPOINT = 769;

const projectRoot = __dirname;
const srcRoot = path.join(projectRoot, 'src', 'css');
const outDir = path.join(projectRoot, 'assets', 'css');
const outFile = path.join(outDir, 'styles.css');

const cssOrder = [
  // Base
  'base/variables.css',
  'base/typography.css',
  'base/layout.css',
  // Components
  'components/header.css',
  'components/footer.css',
  'components/hero.css',
  'components/cards.css',
  'components/buttons.css',
  'components/stats.css',
  'components/faq.css',
  'components/cookie-banner.css',
  // Features
  'features/parallax.css',
  'features/gallery.css',
  'features/marquee.css',
  'features/lightbox.css',
  // Pages
  'pages/home.css',
  'pages/services.css',
  'pages/about.css',
  'pages/book.css',
  'pages/contact.css',
  'pages/estate-agents.css'
];

function replaceBreakpoints(css) {
  return css
    .replace(/\(max-width:\s*\d+px\)/g, `(max-width: ${MOBILE_BREAKPOINT}px)`)
    .replace(/\(min-width:\s*\d+px\)/g, `(min-width: ${DESKTOP_BREAKPOINT}px)`)
    .replace(
      /\(prefers-reduced-motion:\s*no-preference\)\s*and\s*\(min-width:\s*\d+px\)/g,
      `(prefers-reduced-motion: no-preference) and (min-width: ${DESKTOP_BREAKPOINT}px)`
    );
}

function buildBundle() {
  const parts = cssOrder.map((relativePath) => {
    const fullPath = path.join(srcRoot, relativePath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`Missing CSS source: ${relativePath}`);
      return '';
    }
    return fs.readFileSync(fullPath, 'utf8');
  });

  const combined = replaceBreakpoints(parts.join('\n\n'));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, combined, 'utf8');
  console.log(`Built ${outFile} from ${cssOrder.length} source files.`);
}

buildBundle();