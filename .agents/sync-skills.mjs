#!/usr/bin/env node
// Workspace skill-profile + MCP sync.
//
// Sources of truth:
//   - Skills:   .agents/skills/<name>/SKILL.md
//   - Profiles: .agents/skill-profiles.json
//   - MCP:      .mcp.json
//
// Usage:
//   node .agents/sync-skills.mjs
//   node .agents/sync-skills.mjs --profile core
//   CLAUDE_SKILL_PROFILE=frontend node .agents/sync-skills.mjs
//   node .agents/sync-skills.mjs --check

import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const SKILLS_DIR = join(repoRoot, ".agents", "skills");
const PROFILES_JSON = join(repoRoot, ".agents", "skill-profiles.json");
const CLAUDE_SKILLS_DIR = join(repoRoot, ".claude", "skills");
const MCP_JSON = join(repoRoot, ".mcp.json");
const CODEX_CONFIG = join(repoRoot, ".codex", "config.toml");
const MCP_MARKER = "# --- MCP servers";

const args = process.argv.slice(2);
const CHECK = args.includes("--check");
const profileArg = readFlag("--profile");
let drift = false;

function readFlag(name) {
  const inline = args.find((arg) => arg.startsWith(`${name}=`));
  if (inline) return inline.slice(name.length + 1);
  const idx = args.indexOf(name);
  if (idx >= 0) return args[idx + 1];
  return undefined;
}

function log(...parts) {
  console.log(...parts);
}

function note(message) {
  drift = true;
  log(message);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function readFrontmatter(skillMd) {
  const text = readFileSync(skillMd, "utf8");
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const frontmatter = {};
  const lines = match[1].split("\n");
  for (let i = 0; i < lines.length; i++) {
    const kv = lines[i].match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;

    const key = kv[1];
    let value = kv[2].trim();
    if (value === "" || value === "|" || value === ">") {
      const continuation = [];
      while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1])) {
        continuation.push(lines[++i].trim());
      }
      value = continuation.join(" ").trim();
    }
    frontmatter[key] = value.replace(/^["']|["']$/g, "");
  }
  return frontmatter;
}

function inventorySkills() {
  const skills = [];
  for (const dirName of readdirSync(SKILLS_DIR).sort()) {
    const dir = join(SKILLS_DIR, dirName);
    if (!lstatSync(dir).isDirectory()) continue;

    const skillMd = join(dir, "SKILL.md");
    if (!existsSync(skillMd)) {
      note(`  ! ${dirName}: missing SKILL.md`);
      continue;
    }

    const frontmatter = readFrontmatter(skillMd);
    if (!frontmatter?.name || !frontmatter?.description) {
      note(`  ! ${dirName}: invalid frontmatter (needs name + description)`);
    }

    skills.push({
      dirName,
      name: frontmatter?.name || dirName,
      description: frontmatter?.description || "",
      sourcePath: `.agents/skills/${dirName}`,
    });
  }
  return skills;
}

function loadProfile(skills) {
  if (!existsSync(PROFILES_JSON)) fail("Missing .agents/skill-profiles.json");
  const profileConfig = JSON.parse(readFileSync(PROFILES_JSON, "utf8"));
  const defaultProfile = profileConfig.defaultProfile || "core";
  const selectedName = profileArg || process.env.CLAUDE_SKILL_PROFILE || defaultProfile;
  const profile = profileConfig.profiles?.[selectedName];
  if (!profile) {
    fail(
      `Unknown skill profile "${selectedName}". Available profiles: ${Object.keys(
        profileConfig.profiles || {},
      ).join(", ")}`,
    );
  }

  const available = new Set(skills.map((skill) => skill.dirName));
  const selected =
    profile.includes("*") ? skills.map((skill) => skill.dirName) : [...new Set(profile)].sort();

  for (const name of selected) {
    if (!available.has(name)) note(`  ! profile "${selectedName}" references missing skill: ${name}`);
  }

  return {
    selectedName,
    allProfileNames: Object.keys(profileConfig.profiles || {}).sort(),
    selected: selected.filter((name) => available.has(name)),
  };
}

function desiredTarget(skillName) {
  return join("..", "..", ".agents", "skills", skillName);
}

function linkStatus(linkPath, skillName) {
  const stat = lstatSync(linkPath, { throwIfNoEntry: false });
  if (!stat) return { ok: false, exists: false };
  if (!stat.isSymbolicLink()) return { ok: false, exists: true, reason: "not a symlink" };
  const target = readlinkSync(linkPath);
  if (target !== desiredTarget(skillName)) return { ok: false, exists: true, reason: "wrong target" };
  return { ok: true, exists: true };
}

function syncClaudeSkillLinks(activeSkillNames, availableSkillNames) {
  const desired = new Set(activeSkillNames);
  let created = 0;
  let pruned = 0;

  if (!existsSync(CLAUDE_SKILLS_DIR)) {
    if (CHECK) note("  + would create .claude/skills/");
    else mkdirSync(CLAUDE_SKILLS_DIR, { recursive: true });
  }

  if (existsSync(CLAUDE_SKILLS_DIR)) {
    for (const entry of readdirSync(CLAUDE_SKILLS_DIR)) {
      const linkPath = join(CLAUDE_SKILLS_DIR, entry);
      const stat = lstatSync(linkPath, { throwIfNoEntry: false });
      const isLink = stat?.isSymbolicLink();
      const stale = !desired.has(entry);
      const known = availableSkillNames.has(entry);
      const broken = isLink && !existsSync(linkPath);
      const wrongTarget = isLink && readlinkSync(linkPath) !== desiredTarget(entry);
      const shouldPrune = stale || broken || wrongTarget || !known || !isLink;
      if (!shouldPrune) continue;

      const reason = broken
        ? "broken"
        : !known
          ? "unknown"
          : stale
            ? "not in active profile"
            : wrongTarget
              ? "wrong target"
              : "not a symlink";
      if (CHECK) note(`  - would prune .claude/skills/${entry} (${reason})`);
      else {
        rmSync(linkPath, { recursive: true, force: true });
        pruned++;
      }
    }
  }

  for (const skillName of activeSkillNames) {
    const linkPath = join(CLAUDE_SKILLS_DIR, skillName);
    const status = linkStatus(linkPath, skillName);
    if (status.ok) continue;

    if (CHECK) note(`  + would link .claude/skills/${skillName}`);
    else {
      if (status.exists) rmSync(linkPath, { recursive: true, force: true });
      symlinkSync(desiredTarget(skillName), linkPath);
      created++;
    }
  }

  if (!CHECK) log(`.claude/skills: ${created} linked, ${pruned} pruned`);
}

function tomlEscape(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function renderArray(values) {
  return `[${values.map((value) => `"${tomlEscape(value)}"`).join(", ")}]`;
}

function renderScalar(key, value) {
  if (Array.isArray(value)) return `${key} = ${renderArray(value)}\n`;
  if (typeof value === "boolean" || typeof value === "number") return `${key} = ${value}\n`;
  return `${key} = "${tomlEscape(value)}"\n`;
}

function syncCodexMcpConfig() {
  if (!existsSync(MCP_JSON)) return;

  const mcp = JSON.parse(readFileSync(MCP_JSON, "utf8")).mcpServers || {};
  const names = Object.keys(mcp).sort();
  const enabledCount = names.filter((name) => mcp[name].enabled === true).length;

  let block = `${MCP_MARKER} -- generated from .mcp.json by .agents/sync-skills.mjs ---\n`;
  block += "# Edit .mcp.json, then run `node .agents/sync-skills.mjs`.\n";
  for (const name of names) {
    const server = mcp[name];
    block += `\n[mcp_servers.${name}]\n`;
    if (server.url) block += renderScalar("url", server.url);
    else if (server.command) block += renderScalar("command", server.command);
    for (const key of [
      "args",
      "cwd",
      "env_vars",
      "enabled",
      "startup_timeout_sec",
      "tool_timeout_sec",
      "default_tools_approval_mode",
    ]) {
      if (server[key] !== undefined) block += renderScalar(key, server[key]);
    }
  }

  const current = existsSync(CODEX_CONFIG) ? readFileSync(CODEX_CONFIG, "utf8") : "";
  const markerIdx = current.indexOf(MCP_MARKER);
  const head = (markerIdx >= 0 ? current.slice(0, markerIdx) : current).replace(/\s*$/, "");
  const next = `${head ? `${head}\n\n` : ""}${block}`;

  if (next !== current) {
    if (CHECK) note("  ~ .codex/config.toml MCP section out of sync with .mcp.json");
    else {
      mkdirSync(dirname(CODEX_CONFIG), { recursive: true });
      writeFileSync(CODEX_CONFIG, next);
      log(`.codex/config.toml: MCP section regenerated (${enabledCount}/${names.length} enabled)`);
    }
  } else {
    log(`.codex/config.toml: MCP section in sync (${enabledCount}/${names.length} enabled)`);
  }
}

const skills = inventorySkills();
const availableNames = new Set(skills.map((skill) => skill.dirName));
const profile = loadProfile(skills);

log(`Inventoried ${skills.length} canonical skill(s).`);
log(
  `Active skill profile: ${profile.selectedName} (${profile.selected.length} active, ${
    skills.length - profile.selected.length
  } available inactive).`,
);
log(`Available profiles: ${profile.allProfileNames.join(", ")}`);

syncClaudeSkillLinks(profile.selected, availableNames);
syncCodexMcpConfig();

if (CHECK && drift) {
  log("\nDrift detected. Run: node .agents/sync-skills.mjs");
  process.exit(1);
}

log(CHECK ? "\nCheck passed: workspace skill/MCP wiring is in sync." : "\nSync complete.");
