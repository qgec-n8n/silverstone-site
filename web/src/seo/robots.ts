export const stagingRobotsDirective = "noindex,nofollow,noarchive" as const;

type RobotsEnvironment = "production" | "staging";

export function buildRobotsTxt({
  environment = "staging",
}: {
  environment?: RobotsEnvironment;
} = {}): string {
  if (environment === "staging") {
    return "User-agent: *\nDisallow: /\n";
  }

  return [
    "User-agent: *",
    "Allow: /",
    "Sitemap: https://silverstone-ai.com/sitemap.xml",
    "",
  ].join("\n");
}
