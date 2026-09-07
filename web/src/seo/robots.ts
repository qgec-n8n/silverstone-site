export const stagingRobotsDirective = "noindex,nofollow,noarchive" as const;

type RobotsEnvironment = "production" | "staging";

/**
 * AI crawlers and answer-engine fetchers that get their own named group in the
 * production robots.txt.
 *
 * `User-agent: *` already allows every one of these, so these stanzas are a
 * statement of intent rather than a functional change: the file says the same
 * thing to a crawler either way. They exist because an omitted named group is
 * sometimes read as ambiguity — as a site that has not decided whether AI
 * crawling is welcome — and we would rather be explicit than inferred. Removing
 * them would not block anything; adding them does not open anything.
 */
const aiCrawlerUserAgents = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "Google-Extended",
] as const;

export function buildRobotsTxt({
  environment = "staging",
}: {
  environment?: RobotsEnvironment;
} = {}): string {
  if (environment === "staging") {
    return "User-agent: *\nDisallow: /\n";
  }

  // One `User-agent:` line per group, each with its own `Allow:`, groups
  // separated by a blank line. Comma-separated agents are not valid syntax.
  const groups = [
    ["User-agent: *", "Allow: /"],
    ...aiCrawlerUserAgents.map((agent) => [`User-agent: ${agent}`, "Allow: /"]),
  ];

  return [
    groups.map((lines) => lines.join("\n")).join("\n\n"),
    "",
    // Sitemap is group-independent, so it trails every group.
    "Sitemap: https://silverstone-ai.com/sitemap.xml",
    "",
  ].join("\n");
}
