import { describe, expect, it } from "vitest";

import { buildRobotsTxt } from "~/seo/robots";

const STAGING_ROBOTS = "User-agent: *\nDisallow: /\n";
const SITEMAP_LINE = "Sitemap: https://silverstone-ai.com/sitemap.xml";

// Named AI crawlers that must carry their own allow stanza in production.
const AI_CRAWLER_USER_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "Google-Extended",
];

describe("robots.txt", () => {
  it("keeps staging blocked from every crawler", () => {
    expect(buildRobotsTxt({ environment: "staging" })).toBe(STAGING_ROBOTS);
    expect(buildRobotsTxt()).toBe(STAGING_ROBOTS);
  });

  it("gives each named AI crawler its own allow group in production", () => {
    const robots = buildRobotsTxt({ environment: "production" });

    for (const agent of AI_CRAWLER_USER_AGENTS) {
      expect(robots).toContain(`User-agent: ${agent}\nAllow: /`);
    }

    expect(robots).not.toContain("Disallow");
    // One agent per `User-agent:` line — never a comma-separated list.
    expect(robots).not.toContain(",");
  });

  it("keeps the wildcard group and the trailing sitemap directive", () => {
    const robots = buildRobotsTxt({ environment: "production" });
    const lines = robots.trimEnd().split("\n");

    expect(robots.startsWith("User-agent: *\nAllow: /")).toBe(true);
    expect(lines.filter((line) => line.startsWith("User-agent:"))).toHaveLength(
      AI_CRAWLER_USER_AGENTS.length + 1,
    );
    expect(lines.at(-1)).toBe(SITEMAP_LINE);
    expect(robots.endsWith("\n")).toBe(true);
  });
});
