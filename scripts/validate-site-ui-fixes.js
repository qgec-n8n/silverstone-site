// FILE: scripts/validate-site-ui-fixes.js
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = process.cwd();

function readText(relPath) {
  const abs = path.join(REPO_ROOT, relPath);
  return fs.readFileSync(abs, 'utf8');
}

function listDir(relPath) {
  const abs = path.join(REPO_ROOT, relPath);
  return fs.readdirSync(abs);
}

function getAttr(tag, attrName) {
  const re = new RegExp(`\\b${attrName}=["']([^"']+)["']`, 'i');
  const m = tag.match(re);
  return m ? m[1] : '';
}

function extractHeroCanvasTag(html) {
  const m = html.match(/<canvas\b[^>]*\bid=["']hero-shader-canvas["'][^>]*>/i);
  return m ? m[0] : null;
}

function findHeroVariant(html) {
  const tag = extractHeroCanvasTag(html);
  if (!tag) return null; // not found
  return getAttr(tag, 'data-variant'); // may be empty if omitted
}

function extractMarqueeImagesFromJs(jsText) {
  const m = jsText.match(/const\s+MARQUEE_IMAGES\s*=\s*\[([\s\S]*?)\];/m);
  if (!m) return null;
  const body = m[1];
  const items = [];
  const re = /'([^']+)'/g;
  let mm;
  while ((mm = re.exec(body)) !== null) {
    items.push(mm[1]);
  }
  return items;
}

function collectExpectedMarqueeStems() {
  const dir = 'assets/images/socialmedia';
  const files = listDir(dir);

  const eligibleExt = new Set(['.jpg', '.jpeg', '.webp']);
  const prefixRe = /^(1-1|2-3|3-2)_/i;

  const stems = new Set();

  for (const f of files) {
    const ext = path.extname(f).toLowerCase();
    if (!eligibleExt.has(ext)) continue;
    if (!prefixRe.test(f)) continue;
    stems.add(path.parse(f).name);
  }

  return stems;
}

function maxRunLength(arr) {
  let max = 0;
  let run = 0;
  let prev = null;
  for (const v of arr) {
    if (v === prev) run += 1;
    else run = 1;
    prev = v;
    if (run > max) max = run;
  }
  return max;
}

function findAllImgTagsWithClass(html, classToken) {
  const re = new RegExp(`<img\\b[^>]*\\bclass=["'][^"']*\\b${classToken}\\b[^"']*["'][^>]*>`, 'gi');
  return Array.from(html.matchAll(re), (m) => m[0]);
}

function findLastMatchBefore(re, text) {
  let last = null;
  let m;
  while ((m = re.exec(text)) !== null) last = m[0];
  return last;
}

function sectionOpenTags(html) {
  return Array.from(html.matchAll(/<section\b[^>]*>/gi), (m) => m[0]);
}

function hasClassToken(tag, token) {
  const cls = getAttr(tag, 'class');
  if (!cls) return false;
  return cls.split(/\s+/).includes(token);
}

function main() {
  const errors = [];

  // A1) Hero shader variants
  const mainPages = [
    ['index.html', 'blue'],
    ['about.html', 'blue'],
    ['services.html', 'blue'],
    ['book.html', 'blue'],
    ['contact.html', 'blue'],
  ];

  for (const [file, expected] of mainPages) {
    const html = readText(file);
    const variant = findHeroVariant(html);
    if (variant === null) {
      errors.push(`[Hero shader] Missing hero shader canvas tag in ${file}`);
      continue;
    }
    if (variant !== expected) {
      errors.push(`[Hero shader] ${file} must set data-variant="${expected}" (found: ${variant})`);
    }
  }

  const nicheFiles = listDir('niches').filter((f) => f.endsWith('.html')).map((f) => `niches/${f}`);
  for (const file of nicheFiles) {
    const html = readText(file);
    const variant = findHeroVariant(html);
    if (variant === null) {
      errors.push(`[Hero shader] Missing hero shader canvas tag in ${file}`);
      continue;
    }
    if (variant && variant !== 'default') {
      errors.push(`[Hero shader] ${file} must be purple (data-variant omitted or "default"). Found: ${variant}`);
    }
  }

  // A2) Marquee images: all + shuffled
  const marqueeJs = readText('src/js/marquee.js');
  const marqueeImages = extractMarqueeImagesFromJs(marqueeJs);
  if (!marqueeImages || marqueeImages.length === 0) {
    errors.push('[Marquee] Could not extract MARQUEE_IMAGES from src/js/marquee.js');
  } else {
    const expectedStems = collectExpectedMarqueeStems();
    const actualStems = marqueeImages.map((p) => path.parse(p).name);

    // Dedup + exact coverage
    const actualStemSet = new Set(actualStems);
    if (actualStemSet.size !== actualStems.length) {
      errors.push('[Marquee] MARQUEE_IMAGES contains duplicate stems (choose one extension per image).');
    }

    for (const s of expectedStems) {
      if (!actualStemSet.has(s)) errors.push(`[Marquee] Missing marquee image stem: ${s}`);
    }
    for (const s of actualStemSet) {
      if (!expectedStems.has(s)) errors.push(`[Marquee] Unknown marquee image stem (not in assets/images/socialmedia prefix set): ${s}`);
    }

    // Shuffle/mix check: ensure not grouped by prefix
    const prefixes = actualStems.map((s) => (s.includes('_') ? s.split('_')[0] : s));
    const run = maxRunLength(prefixes);
    if (run > 6) {
      errors.push(`[Marquee] Images appear grouped by aspect ratio (max consecutive run=${run}, must be <=6).`);
    }
  }

  // A3) Niche service images must not be lazy
  for (const file of nicheFiles) {
    const html = readText(file);
    const imgTags = findAllImgTagsWithClass(html, 'service-img');
    if (imgTags.length === 0) {
      errors.push(`[Niche images] Could not find any .service-img <img> tags in ${file}`);
      continue;
    }
    for (const tag of imgTags) {
      if (/\bloading=["']lazy["']/.test(tag)) {
        errors.push(`[Niche images] service-img must not be loading="lazy" in ${file}`);
      }
    }
  }

  // A4) Overlay opacity reduced slightly
  const varsCss = readText('src/css/base/variables.css');
  const overlayMatch = varsCss.match(/--body-section-overlay-opacity:\s*([0-9.]+)\s*;/);
  if (!overlayMatch) {
    errors.push('[Overlay] Could not find --body-section-overlay-opacity in src/css/base/variables.css');
  } else {
    const val = Number.parseFloat(overlayMatch[1]);
    if (!(val < 0.24)) errors.push(`[Overlay] --body-section-overlay-opacity must be lower than 0.24 (found ${overlayMatch[1]})`);
    if (val < 0.18 || val > 0.22) errors.push(`[Overlay] --body-section-overlay-opacity must be a small change (expected 0.18–0.22, found ${overlayMatch[1]})`);
  }

  // B) Mobile niche background fix: remove book hero background, fix parallax BASE_IMAGE path
  const estateCss = readText('src/css/pages/estate-agents.css');
  if (estateCss.includes('book-hero-calendly-mobile-2025')) {
    errors.push('[Mobile niche background] estate-agents.css must not set book-hero-calendly-mobile-2025 as body.page-niche background on mobile.');
  }

  const parallaxJs = readText('src/js/parallax.js');
  const baseImageMatch = parallaxJs.match(/const\s+BASE_IMAGE\s*=\s*['"]([^'"]+)['"]\s*;/);
  if (!baseImageMatch) {
    errors.push('[Parallax] Could not find BASE_IMAGE constant in src/js/parallax.js');
  } else {
    const base = baseImageMatch[1];
    if (!base.startsWith('/assets/')) {
      errors.push(`[Parallax] BASE_IMAGE must start with "/assets/" so it works from /niches/*.html (found: ${base})`);
    }
  }

  // C1) services.html Core Bundle Bullets heading requirements
  const servicesHtml = readText('services.html');
  if (/Core bundle bullets\s*\(applies across packs\)\s*:/i.test(servicesHtml)) {
    errors.push('[Services C1] Old single-line "Core bundle bullets (applies across packs):" must be removed.');
  }

  const anchorRe = /start small\.\s*ship fast\.\s*expand when it is working\./i;
  const anchorMatch = servicesHtml.match(anchorRe);
  if (!anchorMatch) {
    errors.push('[Services C1] Could not find the target card headline ("start small. ship fast. expand when it is working.")');
  } else {
    const idx = servicesHtml.search(anchorRe);
    const slice = servicesHtml.slice(idx, idx + 6000);
    if (!slice.includes('Core Bundle Bullets:')) errors.push('[Services C1] Missing "Core Bundle Bullets:" near the target card.');
    if (!slice.includes('(applies across packs)')) errors.push('[Services C1] Missing "(applies across packs)" near the target card.');
    if (!slice.includes('var(--color-blue')) errors.push('[Services C1] "Core Bundle Bullets:" line must use existing blue token (var(--color-blue)).');
    if (!slice.includes('var(--color-white')) errors.push('[Services C1] Second line must use existing white token (var(--color-white)).');
    if (!slice.includes('display: block')) errors.push('[Services C1] Two-line heading must use the existing block-span line-break technique (display: block).');
  }

  // C2) services.html desktop alternation data attributes
  const expectedOrderByImage = {
    'General_Services_1.jpeg': 'img-left',
    'General_Services_2A.jpeg': 'img-right',
    'General_Services_2B.jpeg': 'img-left',
    'General_Services_3.jpeg': 'img-right',
  };

  for (const [img, expected] of Object.entries(expectedOrderByImage)) {
    const pos = servicesHtml.indexOf(img);
    if (pos === -1) {
      errors.push(`[Services C2] Could not find ${img} in services.html`);
      continue;
    }
    const before = servicesHtml.slice(0, pos);
    const openTag = findLastMatchBefore(/<div\b[^>]*\bclass=["'][^"']*service-row[^"']*["'][^>]*>/gi, before);
    if (!openTag) {
      errors.push(`[Services C2] Could not locate parent .service-row opening tag for ${img}`);
      continue;
    }
    const order = getAttr(openTag, 'data-desktop-order');
    if (!order) errors.push(`[Services C2] service-row for ${img} must declare data-desktop-order`);
    if (order !== expected) errors.push(`[Services C2] ${img} must have data-desktop-order="${expected}" (found "${order}")`);
  }

  // D2) Mobile nav: font-size parity + reveal delay base
  const headerCss = readText('src/css/components/header.css');
  if (!/\.mobile-nav-link\s*\{[\s\S]*?\bfont-size\s*:/.test(headerCss)) {
    errors.push('[Mobile nav] .mobile-nav-link must declare an explicit font-size so <button> and <a> match.');
  }
  if (!headerCss.includes('--mobile-nav-item-reveal-delay-base-ms')) {
    errors.push('[Mobile nav] header.css must use --mobile-nav-item-reveal-delay-base-ms to start item reveals at ~60% of panel slide.');
  }

  const headerNavJs = readText('src/js/header-nav.js');
  if (!headerNavJs.includes('--mobile-nav-item-reveal-delay-base-ms')) {
    errors.push('[Mobile nav] header-nav.js must set --mobile-nav-item-reveal-delay-base-ms (computed from panel slide).');
  }

  // D1) Desktop dropdown hover (static check)
  const hasHoverOpen =
    /servicesToggle\.addEventListener\(\s*['"](mouseenter|pointerenter)['"]/.test(headerNavJs) ||
    /addEventListener\(\s*['"](mouseenter|pointerenter)['"]\s*,\s*.*servicesToggle/.test(headerNavJs);
  const hasHoverDismiss =
    /servicesDropdown\.addEventListener\(\s*['"](mouseleave|pointerleave)['"]/.test(headerNavJs) ||
    /addEventListener\(\s*['"](mouseleave|pointerleave)['"]\s*,\s*.*servicesDropdown/.test(headerNavJs);

  if (!hasHoverOpen) errors.push('[Desktop dropdown] header-nav.js must open Services dropdown on hover (mouseenter/pointerenter on servicesToggle).');
  if (!hasHoverDismiss) errors.push('[Desktop dropdown] header-nav.js must manage dropdown dismissal on hover-out (pointerleave/mouseleave on servicesDropdown).');

  // E) Spacing: .section.tight-bottom utility + required section tagging
  const layoutCss = readText('src/css/base/layout.css');
  if (!layoutCss.includes('.section.tight-bottom')) {
    errors.push('[Spacing] src/css/base/layout.css must define .section.tight-bottom utility.');
  }

  // services.html: require tight-bottom on sections #2, #3, #4, #5, #8, #9 (1-based)
  const serviceSections = sectionOpenTags(servicesHtml);
  const mustTightServices = [2, 3, 4, 5, 8, 9];
  for (const oneBased of mustTightServices) {
    const idx0 = oneBased - 1;
    const tag = serviceSections[idx0];
    if (!tag) {
      errors.push(`[Spacing] services.html is missing section #${oneBased} (cannot validate tight-bottom placement)`);
      continue;
    }
    if (!hasClassToken(tag, 'tight-bottom')) {
      errors.push(`[Spacing] services.html section #${oneBased} must include class "tight-bottom"`);
    }
  }

  // niches: require tight-bottom on sections #2, #3, #4, #5, #8 (1-based)
  const mustTightNiche = [2, 3, 4, 5, 8];
  for (const file of nicheFiles) {
    const html = readText(file);
    const sections = sectionOpenTags(html);
    for (const oneBased of mustTightNiche) {
      const idx0 = oneBased - 1;
      const tag = sections[idx0];
      if (!tag) {
        errors.push(`[Spacing] ${file} is missing section #${oneBased} (cannot validate tight-bottom placement)`);
        continue;
      }
      if (!hasClassToken(tag, 'tight-bottom')) {
        errors.push(`[Spacing] ${file} section #${oneBased} must include class "tight-bottom"`);
      }
    }
  }

  if (errors.length) {
    console.error('\n❌ Site UI fixes validation FAILED. Issues found:\n');
    for (const e of errors) console.error(` - ${e}`);
    console.error(`\nTotal issues: ${errors.length}\n`);
    process.exit(1);
  }

  console.log('\n✅ Site UI fixes validation PASSED.\n');
}

main();
