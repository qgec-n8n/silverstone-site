/**
 * Simple build script to centralise CSS breakpoints.
 *
 * This script scans all CSS files in the `assets/css` directory and
 * replaces hard‑coded breakpoint values with those defined below.
 * Running this script allows maintainers to update the mobile and
 * desktop breakpoints in one place.  It does not minify or otherwise
 * transform the CSS; it performs plain string replacements.
 *
 * Usage:
 *   node build-css.js
 *
 * The script reads and writes files in place.  Ensure you have a backup
 * or version control before running.
 */
const fs = require('fs');
const path = require('path');

// Central breakpoint definitions
const MOBILE_BREAKPOINT = 768;
const DESKTOP_BREAKPOINT = 769;

// Directory containing the CSS files to process
const cssDir = path.join(__dirname, 'assets', 'css');

/**
 * Replace media query breakpoints within a CSS string.
 *
 * @param {string} css The original CSS content
 * @returns {string} The updated CSS content
 */
function replaceBreakpoints(css) {
  // Replace max-width queries (e.g., (max-width: 768px))
  css = css.replace(/\(max-width:\s*\d+px\)/g, `(max-width: ${MOBILE_BREAKPOINT}px)`);
  // Replace min-width queries (e.g., (min-width: 769px))
  css = css.replace(/\(min-width:\s*\d+px\)/g, `(min-width: ${DESKTOP_BREAKPOINT}px)`);
  // Replace combined prefers-reduced-motion and min-width queries
  css = css.replace(/\(prefers-reduced-motion:\s*no-preference\)\s*and\s*\(min-width:\s*\d+px\)/g, `(prefers-reduced-motion: no-preference) and (min-width: ${DESKTOP_BREAKPOINT}px)`);
  return css;
}

function processFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const updated = replaceBreakpoints(original);
  fs.writeFileSync(filePath, updated, 'utf8');
}

fs.readdirSync(cssDir).forEach((file) => {
  if (file.endsWith('.css')) {
    const fullPath = path.join(cssDir, file);
    processFile(fullPath);
  }
});

console.log(`Breakpoints updated to mobile <= ${MOBILE_BREAKPOINT}px and desktop >= ${DESKTOP_BREAKPOINT}px in CSS files.`);