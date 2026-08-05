/**
 * QA screenshot sweep for the industries-v2 rebuild.
 * Usage: node scripts/qa-screenshots.mjs <baseUrl> <outDir>
 * Captures intro + full opened body for all 11 rebuilt routes at desktop,
 * tablet and mobile sizes, and reports console errors + horizontal overflow.
 */
/* global document, window */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const baseUrl = process.argv[2] ?? "http://localhost:61061";
const outDir = process.argv[3] ?? "qa-screens";
fs.mkdirSync(outDir, { recursive: true });

const routes = [
  "/services",
  "/industry",
  "/industry/estate-agents",
  "/industry/salons-barbers",
  "/industry/aesthetic-clinics",
  "/industry/ecommerce",
  "/industry/dentists",
  "/industry/fitness-coaches",
  "/industry/hospitality",
  "/industry/trades",
  "/industry/physios-chiropractors",
  "/industry/gyms-fitness-studios",
];

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
];

const browser = await chromium.launch();
const problems = [];

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
  });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => consoleErrors.push(String(error)));

  for (const route of routes) {
    const slug = route.replaceAll("/", "_").replace(/^_/, "") || "home";
    consoleErrors.length = 0;
    try {
      await page.goto(baseUrl + route, { waitUntil: "networkidle" });
      // Intro screenshot after loader clears.
      await page.waitForSelector(".ss-service-intro button", { timeout: 20_000 });
      await page.waitForTimeout(2200);
      await page.screenshot({
        path: path.join(outDir, `${slug}--${viewport.name}--intro.png`),
      });
      // Open body and capture the full page.
      await page.locator(".ss-service-intro button").first().click();
      await page.waitForSelector(
        '[data-service-body-visible="true"], [data-route-body-visible="true"]',
        {
          timeout: 20_000,
        },
      );
      await page.waitForTimeout(2600);
      // Broken images
      const brokenImages = await page.evaluate(() =>
        [...document.querySelectorAll("img")]
          .filter(
            (img) => img.complete && img.naturalWidth === 0 && img.loading !== "lazy",
          )
          .map((img) => img.src),
      );
      // Horizontal overflow check
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      // Scroll through so lazy images/reveals resolve, then full-page shot.
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.8;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 140));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(1200);
      await page.screenshot({
        path: path.join(outDir, `${slug}--${viewport.name}--body.png`),
        fullPage: true,
      });
      if (overflow > 1) {
        problems.push(`${route} [${viewport.name}]: horizontal overflow ${overflow}px`);
      }
      if (brokenImages.length > 0) {
        problems.push(
          `${route} [${viewport.name}]: broken images ${brokenImages.join(", ")}`,
        );
      }
      if (consoleErrors.length > 0) {
        problems.push(
          `${route} [${viewport.name}]: console errors ${consoleErrors.join(" | ")}`,
        );
      }
      console.log(`ok ${route} @ ${viewport.name}`);
    } catch (error) {
      problems.push(
        `${route} [${viewport.name}]: FAILED ${String(error).slice(0, 200)}`,
      );
      console.log(`FAIL ${route} @ ${viewport.name}`);
    }
  }
  await context.close();
}

await browser.close();
console.log("\n==== PROBLEMS ====");
console.log(problems.length ? problems.join("\n") : "none");
