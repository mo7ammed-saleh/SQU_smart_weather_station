import { Router, Request, Response } from "express";
import { SENSORS } from "../config/sensors.js";
import { generateExcel } from "../services/excelService.js";

const router = Router();

// GET /api/export/excel
router.get("/excel", async (req: Request, res: Response) => {
  const { sensor, from, to } = req.query as Record<string, string>;

  let sensorIds: string[];
  if (!sensor || sensor === "all") {
    sensorIds = SENSORS.map((s) => s.id);
  } else {
    const found = SENSORS.find((s) => s.id === sensor);
    if (!found) {
      res.status(404).json({ error: `Sensor '${sensor}' not found` });
      return;
    }
    sensorIds = [sensor];
  }

  try {
    const buffer = await generateExcel(sensorIds, from, to);
    const filename =
      sensorIds.length === 1
        ? `${sensorIds[0].toUpperCase()}_DATA.xlsx`
        : `SQU_WeatherStation_ALL.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

export default router;
