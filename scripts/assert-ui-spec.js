// FILE: scripts/assert-ui-spec.js
'use strict';

const fs = require('fs');
const path = require('path');

const SPEC_MARKERS = {
  REQ1: 'SPEC: REQ1_HERO_SHADER_COLORS_PER_PAGE_2025_12_30',
  REQ2: 'SPEC: REQ2_HERO_GLASS_PANEL_REMOVED_2025_12_30',
  REQ3: 'SPEC: REQ3_HERO_COPY_CTA_POSITIONED_OFF_MIDLINE_2025_12_30',
  REQ4: 'SPEC: REQ4_INDEX_STREAMLINE_WORKFLOWS_ONE_LINE_2025_12_30',
  REQ5: 'SPEC: REQ5_SECTION_SUBTITLES_GREY_2025_12_30',
  REQ6: 'SPEC: REQ6_ABOUT_IMAGES_COVER_CENTER_2025_12_30',
  REQ7: 'SPEC: REQ7_SERVICES_IMAGES_COVER_CENTER_2025_12_30'
};

const EXPECTED_HERO_VARIANTS = {
  'about.html': 'neon-yellow',
  'services.html': 'green',
  'book.html': 'neon-pink',
  'contact.html': 'fire-orange'
};

const INDEX_NOWRAP_CLASS = 'btn-streamline-workflows';
const IMAGE_COVER_CLASS = 'img-cover-center';

const ASSETS_CSS = path.join('assets', 'css', 'styles.css');
const ASSETS_JS = path.join('assets', 'js', 'app.js');

function readFileOrThrow(relPath) {
  const abs = path.join(process.cwd(), relPath);
  if (!fs.existsSync(abs)) {
    throw new Error(`Missing required file: ${relPath}`);
  }
  return fs.readFileSync(abs, 'utf8');
}

function listHtmlPages() {
  const root = process.cwd();
  const rootPages = fs
    .readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith('.html'))
    .map((d) => d.name);

  const nichesDir = path.join(root, 'niches');
  const nichePages = fs.existsSync(nichesDir)
    ? fs
        .readdirSync(nichesDir, { withFileTypes: true })
        .filter((d) => d.isFile() && d.name.endsWith('.html'))
        .map((d) => path.join('niches', d.name))
    : [];

  return [...rootPages, ...nichePages].sort();
}

function extractHeroCanvasTag(html) {
  const matches = html.match(/<canvas\b[^>]*id=["']hero-shader-canvas["'][^>]*>/gi);
  if (!matches || matches.length === 0) return { count: 0, tag: null };
  return { count: matches.length, tag: matches[0] };
}

function extractDataVariantFromCanvasTag(tag) {
  if (!tag) return null;
  const m = tag.match(/data-variant=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

function findAnchorContainingText(html, needleText) {
  // Simple non-DOM approach: scan all <a> tags and compare stripped inner text.
  const anchors = html.match(/<a\b[\s\S]*?<\/a>/gi) || [];
  const normalizedNeedle = needleText.toLowerCase().replace(/\s+/g, ' ').trim();

  for (const a of anchors) {
    const inner = a
      .replace(/<a\b[^>]*>/i, '')
      .replace(/<\/a>/i, '')
      .replace(/<[^>]+>/g, ' ')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    if (inner.includes(normalizedNeedle)) {
      return a;
    }
  }
  return null;
}

function tagHasClass(tag, className) {
  const m = tag.match(/\bclass=["']([^"']+)["']/i);
  if (!m) return false;
  const classes = m[1].split(/\s+/g).filter(Boolean);
  return classes.includes(className);
}

function findImgTagBySrcIncludes(html, srcNeedle) {
  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  for (const img of imgs) {
    const m = img.match(/\bsrc=["']([^"']+)["']/i);
    if (m && m[1].includes(srcNeedle)) return img;
  }
  return null;
}

function extractCssRuleBlock(css, selector) {
  const idx = css.indexOf(selector);
  if (idx === -1) return null;

  const braceOpen = css.indexOf('{', idx);
  if (braceOpen === -1) return null;

  let depth = 0;
  for (let i = braceOpen; i < css.length; i++) {
    const ch = css[i];
    if (ch === '{') depth++;
    if (ch === '}') depth--;
    if (depth === 0) {
      return css.slice(braceOpen + 1, i);
    }
  }
  return null;
}

function blockIncludesNonCenteredJustify(block) {
  if (!block) return false;
  const m = block.match(/justify-content\s*:\s*([^;]+);/i);
  if (!m) return false;
  const v = m[1].trim().toLowerCase();
  return v !== 'center';
}

function assertContains(haystack, needle, errors, label) {
  if (!haystack.includes(needle)) {
    errors.push(`Missing ${label}: expected to find "${needle}".`);
  }
}

function main() {
  const errors = [];

  let css = '';
  let js = '';
  try {
    css = readFileOrThrow(ASSETS_CSS);
  } catch (e) {
    errors.push(String(e.message || e));
  }
  try {
    js = readFileOrThrow(ASSETS_JS);
  } catch (e) {
    errors.push(String(e.message || e));
  }

  // Marker checks (bundle-level contract)
  if (css) {
    assertContains(css, SPEC_MARKERS.REQ2, errors, 'REQ2 proof marker in CSS bundle');
    assertContains(css, SPEC_MARKERS.REQ3, errors, 'REQ3 proof marker in CSS bundle');
    assertContains(css, SPEC_MARKERS.REQ4, errors, 'REQ4 proof marker in CSS bundle');
    assertContains(css, SPEC_MARKERS.REQ5, errors, 'REQ5 proof marker in CSS bundle');
    assertContains(css, SPEC_MARKERS.REQ6, errors, 'REQ6 proof marker in CSS bundle');
    assertContains(css, SPEC_MARKERS.REQ7, errors, 'REQ7 proof marker in CSS bundle');
  }
  if (js) {
    assertContains(js, SPEC_MARKERS.REQ1, errors, 'REQ1 proof marker in JS bundle');
  }

  // Req1: per-page hero variant mapping + theme presence
  for (const [page, expectedVariant] of Object.entries(EXPECTED_HERO_VARIANTS)) {
    const abs = path.join(process.cwd(), page);
    if (!fs.existsSync(abs)) {
      errors.push(`REQ1: Missing expected page file: ${page}`);
      continue;
    }
    const html = fs.readFileSync(abs, 'utf8');
    const hero = extractHeroCanvasTag(html);
    if (hero.count !== 1) {
      errors.push(`REQ1: ${page}: expected exactly 1 hero canvas with id="hero-shader-canvas"; found ${hero.count}.`);
      continue;
    }
    const variant = extractDataVariantFromCanvasTag(hero.tag);
    if (variant !== expectedVariant) {
      errors.push(`REQ1: ${page}: expected data-variant="${expectedVariant}" but found "${variant ?? '(none)'}".`);
    }
  }

  if (js) {
    // Ensure required variants exist in JS bundle (string-level presence).
    const requiredVariants = new Set(Object.values(EXPECTED_HERO_VARIANTS));
    for (const v of requiredVariants) {
      if (!js.includes(v)) {
        errors.push(`REQ1: JS bundle missing expected variant key string: "${v}".`);
      }
    }
  }

  // Req2: hero glass panel removed (targeted check on hero content block)
  if (css) {
    const heroContentBlock = extractCssRuleBlock(css, '.hero.title-band .content');
    if (!heroContentBlock) {
      errors.push('REQ2: Could not find CSS rule block for ".hero.title-band .content" in built CSS.');
    } else {
      if (/backdrop-filter\s*:/i.test(heroContentBlock) || /-webkit-backdrop-filter\s*:/i.test(heroContentBlock)) {
        errors.push('REQ2: Hero content still contains backdrop-filter; glass/blur panel not removed.');
      }
      // Enforce “no visible panel background” by requiring explicit transparent/none background OR absence of background declaration.
      const bgDecl = heroContentBlock.match(/background\s*:\s*([^;]+);/i);
      if (bgDecl) {
        const bgVal = bgDecl[1].trim().toLowerCase();
        const ok = bgVal.includes('transparent') || bgVal.includes('none');
        if (!ok) {
          errors.push(`REQ2: Hero content background should be transparent/none; found "${bgDecl[1].trim()}".`);
        }
      }
    }
  }

  // Req3: hero content moved away from midline (non-centered justify-content required)
  if (css) {
    const heroBandBlock = extractCssRuleBlock(css, '.hero.title-band');
    if (!heroBandBlock) {
      errors.push('REQ3: Could not find CSS rule block for ".hero.title-band" in built CSS.');
    } else if (!blockIncludesNonCenteredJustify(heroBandBlock)) {
      errors.push('REQ3: ".hero.title-band" must set a non-centered justify-content (not "center") to avoid midline obstruction.');
    }
  }

  // Req4: index streamline workflows button class + nowrap CSS
  {
    const abs = path.join(process.cwd(), 'index.html');
    if (!fs.existsSync(abs)) {
      errors.push('REQ4: Missing index.html');
    } else {
      const html = fs.readFileSync(abs, 'utf8');
      const a = findAnchorContainingText(html, 'Streamline workflows');
      if (!a) {
        errors.push('REQ4: Could not find an <a> tag containing text "Streamline workflows" in index.html.');
      } else if (!tagHasClass(a, INDEX_NOWRAP_CLASS)) {
        errors.push(`REQ4: The "Streamline workflows" button must include class "${INDEX_NOWRAP_CLASS}".`);
      }
    }

    if (css) {
      if (!css.includes(`.${INDEX_NOWRAP_CLASS}`)) {
        errors.push(`REQ4: Built CSS missing selector ".${INDEX_NOWRAP_CLASS}".`);
      }
      if (!/white-space\s*:\s*nowrap\s*;/i.test(css)) {
        errors.push('REQ4: Built CSS appears to be missing "white-space: nowrap;" (required for the index nowrap button).');
      }
    }
  }

  // Req5: subtitle grey rule present (token-level hint)
  if (css) {
    if (!css.includes('--color-silver-original')) {
      errors.push('REQ5: Built CSS does not reference "--color-silver-original"; expected for stable grey subtitle color.');
    }
  }

  // Req6: about images have cover-fill class hooks
  {
    const abs = path.join(process.cwd(), 'about.html');
    if (!fs.existsSync(abs)) {
      errors.push('REQ6: Missing about.html');
    } else {
      const html = fs.readFileSync(abs, 'utf8');
      const img28 = findImgTagBySrcIncludes(html, 'Silverstone_28.jpg');
      const img22 = findImgTagBySrcIncludes(html, 'Silverstone_22.jpg');

      if (!img28) errors.push('REQ6: Could not find <img> with src containing "Silverstone_28.jpg" in about.html.');
      if (!img22) errors.push('REQ6: Could not find <img> with src containing "Silverstone_22.jpg" in about.html.');

      if (img28 && !tagHasClass(img28, IMAGE_COVER_CLASS)) {
        errors.push(`REQ6: Silverstone_28.jpg img must include class "${IMAGE_COVER_CLASS}".`);
      }
      if (img22 && !tagHasClass(img22, IMAGE_COVER_CLASS)) {
        errors.push(`REQ6: Silverstone_22.jpg img must include class "${IMAGE_COVER_CLASS}".`);
      }
    }

    if (css) {
      if (!css.includes(`.${IMAGE_COVER_CLASS}`)) {
        errors.push(`REQ6: Built CSS missing selector ".${IMAGE_COVER_CLASS}" (required for cover-fill images).`);
      }
      if (!/object-fit\s*:\s*cover\s*;/i.test(css)) {
        errors.push('REQ6: Built CSS appears to be missing "object-fit: cover;" (required for cover-fill images).');
      }
    }
  }

  // Req7: services images have cover-fill class hooks
  {
    const abs = path.join(process.cwd(), 'services.html');
    if (!fs.existsSync(abs)) {
      errors.push('REQ7: Missing services.html');
    } else {
      const html = fs.readFileSync(abs, 'utf8');
      const needles = [
        'General_Services_1.jpeg',
        'General_Services_2A.jpeg',
        'General_Services_2B.jpeg',
        'General_Services_3.jpeg'
      ];

      for (const n of needles) {
        const img = findImgTagBySrcIncludes(html, n);
        if (!img) {
          errors.push(`REQ7: Could not find <img> with src containing "${n}" in services.html.`);
          continue;
        }
        if (!tagHasClass(img, IMAGE_COVER_CLASS)) {
          errors.push(`REQ7: ${n} img must include class "${IMAGE_COVER_CLASS}".`);
        }
      }
    }
  }

  // Cross-page sanity: ensure we didn't accidentally remove hero canvas ids on any page
  {
    const pages = listHtmlPages();
    for (const p of pages) {
      const html = fs.readFileSync(path.join(process.cwd(), p), 'utf8');
      const hero = extractHeroCanvasTag(html);
      if (hero.count === 0) {
        errors.push(`SANITY: ${p}: missing hero canvas id="hero-shader-canvas".`);
      }
    }
  }

  if (errors.length > 0) {
    console.error('\n[assert-ui-spec] FAILED');
    for (const e of errors) console.error(`- ${e}`);
    console.error('\n[assert-ui-spec] Hint: read codex/REQUESTED_EDITS_SPEC.md and ensure proof markers + class hooks are applied, then rebuild bundles.');
    process.exit(1);
  }

  console.log('[assert-ui-spec] PASS');
}

main();
