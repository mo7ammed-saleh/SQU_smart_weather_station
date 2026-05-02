import ExcelJS from "exceljs";
import { CsvRow, readCsv, filterByDateRange } from "./csvService.js";
import { SENSORS } from "../config/sensors.js";

export async function generateExcel(
  sensorIds: string[],
  from?: string,
  to?: string
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "SQU Weather Station";
  workbook.created = new Date();

  for (const sensorId of sensorIds) {
    const sensor = SENSORS.find((s) => s.id === sensorId);
    if (!sensor) continue;

    let rows: CsvRow[];
    try {
      rows = readCsv(sensor.csvFile);
    } catch {
      rows = [];
    }

    const filtered = filterByDateRange(rows, from, to);

    const sheet = workbook.addWorksheet(sensor.displayName, {
      views: [{ showGridLines: true }],
    });

    if (filtered.length === 0) {
      sheet.addRow(["No data available for the selected date range."]);
      continue;
    }

    // Build headers from the first row (excluding parsedDate)
    const sample = filtered[0];
    const headers = ["Timestamp", ...Object.keys(sample).filter(
      (k) => k !== "parsedDate" && k !== "timestamp"
    )];

    // Header row styling
    sheet.addRow(headers);
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0EA5E9" },
    };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.height = 20;

    // Auto-fit columns
    headers.forEach((h, i) => {
      const col = sheet.getColumn(i + 1);
      col.width = Math.max(h.length + 4, 15);
    });

    // Data rows
    for (const row of filtered) {
      const values: unknown[] = [
        row.parsedDate instanceof Date
          ? row.parsedDate.toISOString().replace("T", " ").substring(0, 19)
          : row.timestamp,
      ];
      for (const key of headers.slice(1)) {
        values.push(row[key] ?? "");
      }
      const dataRow = sheet.addRow(values);
      dataRow.alignment = { vertical: "middle" };
    }

    // Freeze header row
    sheet.views = [{ state: "frozen", ySplit: 1 }];
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
