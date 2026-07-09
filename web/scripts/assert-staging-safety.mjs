#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const REQUIRED_ENV = {
  VITE_STAGING_MODE: 'true',
  VITE_ANALYTICS_DISABLED: 'true',
  RESEND_MODE: 'mock',
  VITE_ROBOTS_META: 'noindex,nofollow,noarchive',
  VITE_X_ROBOTS_TAG: 'noindex,nofollow,noarchive',
};

const FORBIDDEN_ENV_KEYS = [
  'RESEND_API_KEY',
  'RESEND_FROM',
  'RESEND_TO',
  'CONTACT_EMAIL',
  'GA_MEASUREMENT_ID',
  'GTM_ID',
  'SENTRY_DSN',
  'POSTHOG_KEY',
  'PLAUSIBLE_DOMAIN',
  'MIXPANEL_TOKEN',
  'HOTJAR_ID',
  'CLARITY_ID',
];

const FORBIDDEN_PUBLIC_URL_PATTERNS = [
  /replit\.dev/i,
  /replit\.app/i,
  /repl\.co/i,
];

const FORBIDDEN_ANALYTICS_PATTERNS = [
  /googletagmanager\.com/i,
  /google-analytics\.com/i,
  /\bgtag\s*\(/i,
  /\bgtm-\w+/i,
  // GA4 measurement ids are uppercase G- followed by ~10 uppercase
  // alphanumerics. Match case-sensitively with a minimum length so hashed
  // asset filenames (e.g. "entry.client-g-Ey3QrH.js") cannot false-positive.
  /\bG-[A-Z0-9]{6,}\b/,
  /plausible\.io/i,
  /\bposthog\b/i,
  /\bmixpanel\b/i,
  /\bsentry\b/i,
  /segment\.com/i,
  /hotjar/i,
  /clarity\.ms/i,
  /fullstory/i,
];

const robotsTokens = ['noindex', 'nofollow', 'noarchive'];
const skipDirectoryNames = new Set(['node_modules', '.git', '.codex', '.cache', 'coverage', 'dist']);

function normalize(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function parseArgs(argv) {
  const roots = [];
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--root' || arg === '--scan') {
      const value = argv[index + 1];
      if (!value) {
        throw new Error(`${arg} requires a path`);
      }
      roots.push(value);
      index += 1;
      continue;
    }
    if (arg.startsWith('--root=')) {
      roots.push(arg.slice('--root='.length));
      continue;
    }
    if (arg.startsWith('--scan=')) {
      roots.push(arg.slice('--scan='.length));
    }
  }
  return { roots };
}

function addError(errors, message) {
  errors.push(message);
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function hasForbiddenPublicUrl(text) {
  return FORBIDDEN_PUBLIC_URL_PATTERNS.some((pattern) => pattern.test(text));
}

function hasForbiddenAnalytics(text) {
  return FORBIDDEN_ANALYTICS_PATTERNS.some((pattern) => pattern.test(text));
}

function robotsMetaContents(text) {
  const metaTags = [...text.matchAll(/<meta\b[^>]*>/gi)].map((match) => match[0]);
  return metaTags.flatMap((tag) => {
    const name = tag.match(/\bname=["']([^"']+)["']/i)?.[1];
    const content = tag.match(/\bcontent=["']([^"']+)["']/i)?.[1];
    return name?.toLowerCase() === 'robots' && content ? [content.toLowerCase()] : [];
  });
}

function isHtmlFile(filePath) {
  const lower = filePath.toLowerCase();
  return lower.endsWith('.html') || lower.endsWith('.htm') || lower.endsWith('.xhtml');
}

function isTextLikeFile(filePath) {
  const lower = filePath.toLowerCase();
  return (
    isHtmlFile(lower) ||
    lower.endsWith('.txt') ||
    lower.endsWith('.xml') ||
    lower.endsWith('.json') ||
    lower.endsWith('.mjs') ||
    lower.endsWith('.js') ||
    lower.endsWith('.ts') ||
    lower.endsWith('.tsx') ||
    lower.endsWith('.md')
  );
}

function validateRobotsTxt(text, filePath, errors) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.replace(/#.*/, '').trim())
    .filter(Boolean);

  const normalized = lines.map((line) => line.toLowerCase());

  if (!normalized.includes('user-agent: *')) {
    addError(errors, `${filePath}: missing "User-agent: *"`);
  }

  if (!normalized.includes('disallow: /')) {
    addError(errors, `${filePath}: missing "Disallow: /"`);
  }

  if (normalized.some((line) => line.startsWith('allow:'))) {
    addError(errors, `${filePath}: allow rules are not permitted in staging robots.txt`);
  }

  if (normalized.some((line) => line.startsWith('sitemap:'))) {
    addError(errors, `${filePath}: sitemap references are not permitted in staging robots.txt`);
  }

  if (normalized.some((line) => line.includes('disallow:') && !line.includes('/'))) {
    addError(errors, `${filePath}: Disallow must block all crawling`);
  }
}

function validateHtml(text, filePath, errors) {
  const metas = robotsMetaContents(text);
  const compliantMeta = metas.some((content) => robotsTokens.every((token) => content.includes(token)));
  if (!compliantMeta) {
    addError(errors, `${filePath}: missing robots meta with noindex,nofollow,noarchive`);
  }

  for (const content of metas) {
    const stripped = content
      .replace(/noindex/g, '')
      .replace(/nofollow/g, '')
      .replace(/noarchive/g, '')
      .replace(/[,\s]+/g, ' ')
      .trim();
    if (/\b(index|follow|all)\b/.test(stripped)) {
      addError(errors, `${filePath}: robots meta contains indexable directives`);
      break;
    }
  }

  if (hasForbiddenAnalytics(text)) {
    addError(errors, `${filePath}: contains analytics code or identifiers that are not allowed in staging`);
  }

  if (hasForbiddenPublicUrl(text)) {
    addError(errors, `${filePath}: contains a Replit preview/public URL that must not become indexable`);
  }

  if (/<link\b[^>]*rel=["']canonical["'][^>]*href=["'][^"']*(replit\.dev|replit\.app|repl\.co)[^"']*["']/i.test(text)) {
    addError(errors, `${filePath}: canonical URL points at a Replit preview host`);
  }
}

async function scanPath(targetPath, errors) {
  const stat = await fs.stat(targetPath);
  if (stat.isDirectory()) {
    const entries = await fs.readdir(targetPath, { withFileTypes: true });
    for (const entry of entries) {
      if (skipDirectoryNames.has(entry.name)) {
        continue;
      }
      await scanPath(path.join(targetPath, entry.name), errors);
    }
    return;
  }

  if (!isTextLikeFile(targetPath)) {
    return;
  }

  const text = await fs.readFile(targetPath, 'utf8');
  const lowerPath = targetPath.toLowerCase();

  if (lowerPath.endsWith('robots.txt')) {
    validateRobotsTxt(text, targetPath, errors);
    return;
  }

  if (isHtmlFile(targetPath)) {
    validateHtml(text, targetPath, errors);
    return;
  }

  if (lowerPath.endsWith('.xml') && hasForbiddenPublicUrl(text)) {
    addError(errors, `${targetPath}: XML output contains a Replit preview/public URL`);
  }
}

async function validateBuildOutput(root, errors) {
  const resolvedRoot = path.resolve(root);
  if (path.basename(resolvedRoot) !== 'client') {
    return;
  }

  const manifestPath = path.resolve('src/data/generated/future-route-manifest.json');
  if (!(await exists(manifestPath))) {
    addError(errors, `${manifestPath}: missing future route manifest`);
  } else {
    const routes = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
    for (const route of routes) {
      const routeHtmlPath =
        route.path === '/'
          ? path.join(resolvedRoot, 'index.html')
          : path.join(resolvedRoot, route.path.replace(/^\/+/, ''), 'index.html');
      if (!(await exists(routeHtmlPath))) {
        addError(errors, `${routeHtmlPath}: missing prerendered route HTML`);
        continue;
      }
      const routeHtml = await fs.readFile(routeHtmlPath, 'utf8');
      if (!routeHtml.includes(`data-content-id="${route.contentId}"`)) {
        addError(errors, `${routeHtmlPath}: missing meaningful route content`);
      }
    }
  }

  const componentLabPath = path.join(resolvedRoot, '__components');
  if (await exists(componentLabPath)) {
    addError(errors, `${componentLabPath}: development-only route leaked into production output`);
  }
}

function validateEnvironment(errors) {
  for (const [key, expected] of Object.entries(REQUIRED_ENV)) {
    const actual = normalize(process.env[key]);
    if (actual !== expected) {
      addError(errors, `env ${key} must be "${expected}" (got "${actual || '<empty>'}")`);
    }
  }

  for (const key of FORBIDDEN_ENV_KEYS) {
    const actual = normalize(process.env[key]);
    if (actual) {
      addError(errors, `env ${key} must be empty in staging baseline`);
    }
  }

  for (const key of ['VITE_SITE_URL', 'VITE_CANONICAL_ORIGIN', 'PUBLIC_URL', 'APP_URL']) {
    const actual = normalize(process.env[key]);
    if (actual && hasForbiddenPublicUrl(actual)) {
      addError(errors, `env ${key} must not point at a Replit preview/public host`);
    }
  }
}

async function main() {
  const errors = [];
  const { roots } = parseArgs(process.argv.slice(2));

  validateEnvironment(errors);

  for (const root of roots) {
    if (!(await exists(root))) {
      addError(errors, `scan root does not exist: ${root}`);
      continue;
    }
    await scanPath(root, errors);
    await validateBuildOutput(root, errors);
  }

  if (errors.length > 0) {
    console.error('Staging safety check failed:');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log('Staging safety check passed.');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exit(1);
});
