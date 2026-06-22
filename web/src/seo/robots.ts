export const stagingRobotsDirective = "noindex,nofollow,noarchive" as const;

export function buildRobotsTxt(): string {
  return "User-agent: *\nDisallow: /\n";
}
