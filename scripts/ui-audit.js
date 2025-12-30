// FILE: scripts/ui-audit.js
'use strict';

const fs = require('fs');
const path = require('path');

function listHtmlPages() {
  const root = process.cwd();
  const rootPages = fs
    .readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith('.html'))
    .map((d) => d.name)
    .sort();

  const nichesDir = path.join(root, 'niches');
  const nichePages = fs.existsSync(nichesDir)
    ? fs
        .readdirSync(nichesDir, { withFileTypes: true })
        .filter((d) => d.isFile() && d.name.endsWith('.html'))
        .map((d) => path.join('niches', d.name))
        .sort()
    : [];

  return [...rootPages, ...nichePages];
}

function extractHeroCanvasVariant(html) {
  const matches = html.match(/<canvas\b[^>]*id=["']hero-shader-canvas["'][^>]*>/gi);
  if (!matches || matches.length === 0) return { count: 0, variant: null };
  const tag = matches[0];
  const v = tag.match(/data-variant=["']([^"']+)["']/i);
  return { count: matches.length, variant: v ? v[1] : null };
}

function countOccurrences(haystack, needleRegex) {
  const m = haystack.match(needleRegex);
  return m ? m.length : 0;
}

function main() {
  const pages = listHtmlPages();
  if (pages.length === 0) {
    console.log('[ui-audit] No HTML pages found.');
    return;
  }

  console.log(`[ui-audit] Pages found: ${pages.length}`);
  for (const p of pages) {
    const html = fs.readFileSync(path.join(process.cwd(), p), 'utf8');
    const hero = extractHeroCanvasVariant(html);
    const subtitleCount = countOccurrences(html, /\bclass=["'][^"']*\bsection-subtitle\b[^"']*["']/gi);
    const heroCtas = countOccurrences(html, /\bclass=["'][^"']*\bcta-buttons\b[^"']*["']/gi);

    console.log(
      [
        `- ${p}`,
        `heroCanvas=${hero.count > 0 ? 'yes' : 'no'}`,
        `variant=${hero.variant ?? '(none)'}`,
        `sectionSubtitles=${subtitleCount}`,
        `heroCTAs=${heroCtas > 0 ? 'yes' : 'no'}`
      ].join(' | ')
    );
  }
}

main();
