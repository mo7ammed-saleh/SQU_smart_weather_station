import fs from "fs";
import path from "path";
import Papa from "papaparse";

const PROJECT_ROOT = path.resolve(process.cwd(), "../..");
const CSV_DIR = process.env.CSV_DATA_DIR
  ? path.resolve(PROJECT_ROOT, process.env.CSV_DATA_DIR)
  : path.resolve(PROJECT_ROOT, "DB/CSV_Files");

export interface CsvRow {
  timestamp: string;
  parsedDate: Date;
  [key: string]: unknown;
}

function parseTimestamp(raw: string): Date {
  const cleaned = raw.trim().replace(/^"|"$/g, "");
  // Format: "28/04/2026, 15:55" or "28/04/2026, 15:55:00"
  const match = cleaned.match(/^(\d{2})\/(\d{2})\/(\d{4}),\s*(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (match) {
    const [, day, month, year, hour, min, sec = "00"] = match;
    return new Date(`${year}-${month}-${day}T${hour}:${min}:${sec}Z`);
  }
  return new Date(cleaned);
}

export function getCsvLastModified(csvFile: string): string | null {
  try {
    const filePath = path.join(CSV_DIR, csvFile);
    const stat = fs.statSync(filePath);
    return stat.mtime.toISOString();
  } catch {
    return null;
  }
}

export function readCsv(csvFile: string): CsvRow[] {
  const filePath = path.join(CSV_DIR, csvFile);
  if (!fs.existsSync(filePath)) {
    throw new Error(`CSV file not found: ${csvFile}`);
  }

  const content = fs.readFileSync(filePath, "utf-8");

  const result = Papa.parse<Record<string, string>>(content, {
    header: true,
    skipEmptyLines: true,
  }) as { data: Record<string, string>[] };

  const rows: CsvRow[] = [];

  for (const raw of result.data) {
    const timestampKey = Object.keys(raw).find((k) =>
      k.trim().toLowerCase() === "timestamp"
    );
    if (!timestampKey) continue;
    const rawTs = raw[timestampKey];
    if (!rawTs) continue;
    const parsedDate = parseTimestamp(rawTs);
    if (isNaN(parsedDate.getTime())) continue;

    const row: CsvRow = { timestamp: rawTs.trim(), parsedDate };
    for (const [k, v] of Object.entries(raw)) {
      if (k.trim().toLowerCase() === "timestamp") continue;
      const numVal = parseFloat(String(v).trim());
      row[k] = isNaN(numVal) ? String(v).trim() : numVal;
    }
    rows.push(row);
  }

  rows.sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());
  return rows;
}

export function filterByDateRange(
  rows: CsvRow[],
  from?: string,
  to?: string
): CsvRow[] {
  let filtered = rows;

  if (from) {
    const fromDate = new Date(from);
    if (!isNaN(fromDate.getTime())) {
      filtered = filtered.filter((r) => r.parsedDate >= fromDate);
    }
  }

  if (to) {
    const toDate = new Date(to);
    if (!isNaN(toDate.getTime())) {
      filtered = filtered.filter((r) => r.parsedDate <= toDate);
    }
  }

  return filtered;
}

export function rowsToJson(rows: CsvRow[]): Record<string, unknown>[] {
  return rows.map((r) => {
    const { parsedDate, ...rest } = r;
    // Format timestamp as ISO for frontend
    return {
      ...rest,
      timestamp: parsedDate.toISOString(),
    };
  });
}
