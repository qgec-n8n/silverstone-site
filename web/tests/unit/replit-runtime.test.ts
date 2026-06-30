import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Replit runtime contract", () => {
  const repositoryRoot = resolve(process.cwd(), "..");

  it("launches the /web React app from the Replit Run button", () => {
    const replitConfig = readFileSync(resolve(repositoryRoot, ".replit"), "utf8");

    expect(replitConfig).toContain('run = ["bash", "-lc", "npm run replit:dev"]');
    expect(replitConfig).toContain('args = "npm run replit:dev"');
    expect(replitConfig).not.toContain("serve .");
  });

  it("delegates root runtime scripts to the /web package", () => {
    const packageJson = JSON.parse(
      readFileSync(resolve(repositoryRoot, "package.json"), "utf8"),
    ) as { scripts: Record<string, string> };

    expect(packageJson.scripts.start).toBe("npm run replit:dev");
    expect(packageJson.scripts["replit:dev"]).toContain("npm --prefix web run dev");
    expect(packageJson.scripts.build).toBe("npm --prefix web run build");
    expect(packageJson.scripts.preview).toContain("npm --prefix web run preview");
    expect(packageJson.scripts.start).not.toContain("serve .");
  });
});
