import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { ApprovedServiceContent } from "../../src/content/services/approved-services";

const approvedServices = JSON.parse(
  readFileSync(
    resolve(process.cwd(), "src/content/services/generated/approved-services.json"),
    "utf8",
  ),
) as Record<string, ApprovedServiceContent>;

const forbiddenPrototypePhrases = [
  "built around a clear business problem",
  "Service architecture",
  "Conversion path mapper",
  "First-release state map",
  "Exception-aware workflow run",
] as const;

const serviceRoutes = Object.values(approvedServices).map((service) => ({
  button: service.routeEntry.buttonLabel,
  h1: service.metadata.h1,
  path: service.route,
  phrase:
    service.acceptance.distinctivePhrases[1] ??
    service.acceptance.distinctivePhrases[0] ??
    service.metadata.h1,
}));

for (const route of serviceRoutes) {
  test(`approved service copy renders in HTML and hydrated DOM for ${route.path}`, async ({
    page,
    request,
  }) => {
    const response = await request.get(route.path);
    expect(response.ok()).toBe(true);
    const html = await response.text();

    expect(html).toContain(route.h1);
    expect(html).toContain(route.phrase);
    for (const phrase of forbiddenPrototypePhrases) {
      expect(html).not.toContain(phrase);
    }

    await page.goto(route.path);
    await expect(page.locator("html")).toHaveAttribute(
      "data-route-experience-state",
      "intro",
      { timeout: 12_000 },
    );

    await page.getByRole("button", { name: route.button }).click();
    await expect(page.locator("html")).toHaveAttribute(
      "data-route-experience-state",
      "body",
      { timeout: 8_000 },
    );
    await expect(page.getByRole("heading", { name: route.h1 })).toBeVisible();
    await expect(page.getByText(route.phrase, { exact: false }).first()).toBeVisible();

    const bodyText = await page.locator("body").innerText();
    for (const phrase of forbiddenPrototypePhrases) {
      expect(bodyText).not.toContain(phrase);
    }
  });
}
