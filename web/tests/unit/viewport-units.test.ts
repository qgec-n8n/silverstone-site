import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * The booking console (/book) and the enquiry console (/contact) are the only
 * two surfaces on the site whose entire vertical rhythm — shell height,
 * paddings, gaps, control heights, the textarea — is a function of the
 * viewport. That makes them uniquely sensitive to which viewport-percentage
 * unit they use.
 *
 * `dvh` tracks the viewport live as mobile browser chrome expands and
 * retracts, so on iOS Safari every one of those quanta recomputed on each
 * frame of the URL-bar animation: the console resized under the reader's
 * finger mid-scroll and its own height change moved the document beneath the
 * scroll, which read as the panel shuddering. `svh` resolves against the small
 * viewport and is stable for the life of the layout.
 *
 * The consoles must therefore never reintroduce `dvh`. This is a source-level
 * contract because no headless browser can reproduce it: Chromium and WebKit
 * both resolve vh/svh/lvh/dvh to the same length when there is no retractable
 * browser chrome, so a rendered assertion would pass either way.
 */
const CSS_PATH = resolve(process.cwd(), "src/styles/core-pages/core-pages.css");

const CONSOLE_SELECTOR = /\.ss-enq|\.ss-booking-|\.ss-core-booking/;

/** Every `dvh` in the file, paired with the selector whose block it sits in. */
function dynamicViewportDeclarations(css: string) {
  const lines = css.split("\n");
  const found: { line: number; selector: string; text: string }[] = [];
  let selector = "(none)";
  let inComment = false;

  for (const [index, line] of lines.entries()) {
    // Selectors and declarations only — a `dvh` inside a comment is prose.
    let code = line;
    if (inComment) {
      const close = code.indexOf("*/");
      if (close === -1) continue;
      code = code.slice(close + 2);
      inComment = false;
    }
    code = code.replace(/\/\*.*?\*\//g, "");
    const open = code.indexOf("/*");
    if (open !== -1) {
      code = code.slice(0, open);
      inComment = true;
    }

    if (code.trimEnd().endsWith("{") && !code.trimStart().startsWith("@")) {
      selector = code.replace("{", "").trim() || selector;
    }
    if (code.includes("dvh")) {
      found.push({ line: index + 1, selector, text: code.trim() });
    }
  }

  return found;
}

describe("core-page console viewport units", () => {
  const css = readFileSync(CSS_PATH, "utf8");

  it("sizes the booking and enquiry consoles with svh, never dvh", () => {
    const offenders = dynamicViewportDeclarations(css).filter((entry) =>
      CONSOLE_SELECTOR.test(entry.selector),
    );

    expect(
      offenders.map(
        (entry) =>
          `${CSS_PATH}:${String(entry.line)} ${entry.selector} — ${entry.text}`,
      ),
    ).toEqual([]);
  });

  it("still sizes them from the viewport, so the one-screen fit contract holds", () => {
    // Guards the other direction: a blanket find-and-replace to fixed rem
    // values would also pass the test above while quietly dropping the
    // compression that keeps each console inside a short phone screen.
    expect(css).toMatch(/\.ss-core-booking\s*\{[\s\S]*?100svh/);
    expect((css.match(/svh/g) ?? []).length).toBeGreaterThan(50);
  });
});
