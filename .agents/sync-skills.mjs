#!/usr/bin/env node
// Workspace skill + MCP sync.
//
// Single source of truth:
//   - Skills:  .agents/skills/<name>/SKILL.md   (canonical store)
//   - MCP:     .mcp.json                         (canonical MCP server list)
//
// What it does (repeatable / idempotent):
//   1. (Re)generates .claude/skills/<name> symlinks for every skill in the
//      canonical store, and prunes stale / broken symlinks.
//   2. Validates each SKILL.md has YAML frontmatter with `name` + `description`.
//   3. Regenerates the [mcp_servers.*] section of .codex/config.toml from
//      .mcp.json so Codex and Claude expose the same MCP servers.
//
// Usage:
//   node .agents/sync-skills.mjs           # apply changes
//   node .agents/sync-skills.mjs --check   # verify only, exit 1 on drift

import {
  readdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
  lstatSync,
  rmSync,
  mkdirSync,
  symlinkSync,
  readlinkSync,
} from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const CHECK = process.argv.includes("--check");

const SKILLS_DIR = join(repoRoot, ".agents", "skills");
const CLAUDE_SKILLS_DIR = join(repoRoot, ".claude", "skills");
const MCP_JSON = join(repoRoot, ".mcp.json");
const CODEX_CONFIG = join(repoRoot, ".codex", "config.toml");
const MCP_MARKER = "# --- MCP servers";

let drift = false;
const log = (...a) => console.log(...a);
const note = (msg) => {
  drift = true;
  log(msg);
};

// ---------------------------------------------------------------------------
// 1. Inventory canonical skills + validate frontmatter
// ---------------------------------------------------------------------------
function readFrontmatter(skillMd) {
  const text = readFileSync(skillMd, "utf8");
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const fm = {};
  const lines = m[1].split("\n");
  for (let i = 0; i < lines.length; i++) {
    const kv = lines[i].match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    let val = kv[2].trim();
    // Folded/block scalar: value continues on following indented lines.
    if (val === "" || val === "|" || val === ">") {
      const cont = [];
      while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1])) {
        cont.push(lines[++i].trim());
      }
      val = cont.join(" ").trim();
    }
    fm[key] = val;
  }
  return fm;
}

const skills = [];
for (const name of readdirSync(SKILLS_DIR).sort()) {
  const dir = join(SKILLS_DIR, name);
  if (!lstatSync(dir).isDirectory()) continue;
  const skillMd = join(dir, "SKILL.md");
  if (!existsSync(skillMd)) {
    note(`  ! ${name}: missing SKILL.md (skipped)`);
    continue;
  }
  const fm = readFrontmatter(skillMd);
  if (!fm || !fm.name || !fm.description) {
    note(`  ! ${name}: invalid frontmatter (needs name + description)`);
  }
  skills.push(name);
}
log(`Inventoried ${skills.length} skill(s) in .agents/skills/`);

// ---------------------------------------------------------------------------
// 2. Sync .claude/skills symlinks
// ---------------------------------------------------------------------------
const desired = new Set(skills);
const wantTarget = (name) => join("..", "..", ".agents", "skills", name);

let created = 0;
let pruned = 0;

// Ensure the target directory exists (supports fresh / from-scratch projects).
if (!existsSync(CLAUDE_SKILLS_DIR) && !CHECK) {
  mkdirSync(CLAUDE_SKILLS_DIR, { recursive: true });
} else if (!existsSync(CLAUDE_SKILLS_DIR)) {
  note(`  + would create .claude/skills/`);
}

// Prune stale / broken / wrong-target entries.
if (existsSync(CLAUDE_SKILLS_DIR)) {
  for (const entry of readdirSync(CLAUDE_SKILLS_DIR)) {
    const linkPath = join(CLAUDE_SKILLS_DIR, entry);
    const st = lstatSync(linkPath);
    const isLink = st.isSymbolicLink();
    const stale = !desired.has(entry);
    const broken = !existsSync(linkPath);
    const wrongTarget = isLink && readlinkSync(linkPath) !== wantTarget(entry);
    if (stale || broken || (isLink && wrongTarget)) {
      if (CHECK) {
        note(`  - would prune ${entry} (${broken ? "broken" : stale ? "stale" : "wrong target"})`);
      } else {
        rmSync(linkPath, { recursive: true, force: true });
        pruned++;
      }
    }
  }
}

// Create missing symlinks.
for (const name of skills) {
  const linkPath = join(CLAUDE_SKILLS_DIR, name);
  const ok =
    existsSync(linkPath) &&
    lstatSync(linkPath).isSymbolicLink() &&
    readlinkSync(linkPath) === wantTarget(name);
  if (ok) continue;
  if (CHECK) {
    note(`  + would link .claude/skills/${name}`);
  } else {
    if (existsSync(linkPath) || lstatSync(linkPath, { throwIfNoEntry: false }))
      rmSync(linkPath, { recursive: true, force: true });
    symlinkSync(wantTarget(name), linkPath);
    created++;
  }
}
if (!CHECK) log(`.claude/skills: ${created} linked, ${pruned} pruned`);

// ---------------------------------------------------------------------------
// 3. Sync MCP servers (.mcp.json -> .codex/config.toml)
// ---------------------------------------------------------------------------
function tomlEscape(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
function renderArgs(args) {
  return "[" + args.map((a) => `"${tomlEscape(a)}"`).join(", ") + "]";
}

if (existsSync(MCP_JSON)) {
  const mcp = JSON.parse(readFileSync(MCP_JSON, "utf8")).mcpServers || {};
  const names = Object.keys(mcp).sort();

  let block = `${MCP_MARKER} — kept in sync with .mcp.json by .agents/sync-skills.mjs ---\n`;
  block += `# Run \`node .agents/sync-skills.mjs\` after editing .mcp.json.\n`;
  for (const n of names) {
    const s = mcp[n];
    block += `\n[mcp_servers.${n}]\n`;
    block += `command = "${tomlEscape(s.command)}"\n`;
    if (s.args) block += `args = ${renderArgs(s.args)}\n`;
  }

  // Bootstrap: create .codex/config.toml from scratch if it does not exist.
  const current = existsSync(CODEX_CONFIG) ? readFileSync(CODEX_CONFIG, "utf8") : "";
  const markerIdx = current.indexOf(MCP_MARKER);
  const head = (markerIdx >= 0 ? current.slice(0, markerIdx) : current).replace(/\s*$/, "");
  const preamble = head ? head + "\n\n" : "";
  const next = preamble + block;

  if (next !== current) {
    if (CHECK) {
      note("  ~ .codex/config.toml MCP section out of sync with .mcp.json");
    } else {
      mkdirSync(dirname(CODEX_CONFIG), { recursive: true });
      writeFileSync(CODEX_CONFIG, next);
      log(`.codex/config.toml: MCP section regenerated (${names.length} server(s))`);
    }
  } else {
    log(`.codex/config.toml: MCP section already in sync (${names.length} server(s))`);
  }
}

// ---------------------------------------------------------------------------
if (CHECK && drift) {
  log("\nDrift detected. Run: node .agents/sync-skills.mjs");
  process.exit(1);
}
log(CHECK ? "\nCheck passed: workspace skill wiring is in sync." : "\nSync complete.");
