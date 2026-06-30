import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { benchmarkMetrics } from "~/data/benchmark-metrics";

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index] ?? "";
    const next = text[index + 1] ?? "";

    if (quoted) {
      if (character === '"' && next === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (character !== "\r") {
      field += character;
    }
  }

  if (field || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((candidate) => candidate.some((value) => value.length > 0));
}

describe("benchmark metrics data layer", () => {
  it("preserves every approved CSV row and key claim field", () => {
    const csvPath = resolve(
      process.cwd(),
      "../attached_assets/silverstone_ai_agency_performance_metrics_23_6_2026_1782315909364.csv",
    );
    const parsed = parseCsv(readFileSync(csvPath, "utf8"));
    const header = parsed[0];
    const rows = parsed.slice(1);
    expect(header).toBeDefined();
    if (!header) {
      throw new Error("Benchmark CSV header row is missing.");
    }
    const indexes = Object.fromEntries(
      header.map((field, index) => [field, index] as const),
    );
    const column = (name: string) => {
      const index = indexes[name];
      if (index === undefined) {
        throw new Error(`Benchmark CSV column missing: ${name}`);
      }
      return index;
    };

    expect(benchmarkMetrics).toHaveLength(rows.length);

    for (const [index, row] of rows.entries()) {
      const metric = benchmarkMetrics[index];
      expect(metric).toBeDefined();
      if (!metric) {
        throw new Error(`Generated benchmark metric missing at row ${String(index)}`);
      }
      expect(metric.pageTitle).toBe(row[column("page_title")]);
      expect(metric.pageType).toBe(row[column("page_type")]);
      expect(metric.metricName).toBe(row[column("metric_name")]);
      expect(metric.metricValueRaw).toBe(row[column("metric_value_raw")]);
      expect(metric.unit).toBe(row[column("unit")]);
      expect(metric.timeBasis).toBe(row[column("time_basis")]);
      expect(metric.fullClaimText).toBe(row[column("full_claim_text")]);
      expect(metric.impactArea).toBe(row[column("impact_area")]);
    }
  });
});
