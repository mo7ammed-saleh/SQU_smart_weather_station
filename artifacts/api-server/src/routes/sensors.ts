import { Router, Request, Response } from "express";
import { SENSORS, getSensorById } from "../config/sensors.js";
import { readCsv, filterByDateRange, rowsToJson, getCsvLastModified } from "../services/csvService.js";

const router = Router();

// GET /api/sensors
router.get("/", (_req: Request, res: Response) => {
  const list = SENSORS.map((s) => ({
    id: s.id,
    displayName: s.displayName,
    csvFile: s.csvFile,
    description: s.description,
    parameterCount: s.parameters.length,
    color: s.color,
  }));
  res.json(list);
});

// GET /api/sensors/summary
router.get("/summary", (_req: Request, res: Response) => {
  const summaries = SENSORS.map((sensor) => {
    let latestTimestamp = "N/A";
    let mainValue = "N/A";
    let rowCount = 0;

    try {
      const rows = readCsv(sensor.csvFile);
      rowCount = rows.length;
      if (rows.length > 0) {
        const latest = rows[rows.length - 1];
        latestTimestamp = latest.parsedDate.toISOString();
        const val = latest[sensor.mainParameter];
        mainValue = val !== undefined && val !== null ? String(val) : "N/A";
      }
    } catch {}

    return {
      id: sensor.id,
      displayName: sensor.displayName,
      description: sensor.description,
      color: sensor.color,
      latestTimestamp,
      parameterCount: sensor.parameters.length,
      mainParameter: sensor.mainParameter,
      mainValue,
      mainUnit: sensor.mainUnit,
      rowCount,
      lastCsvUpdate: getCsvLastModified(sensor.csvFile),
    };
  });

  res.json(summaries);
});

// GET /api/sensors/:sensorId/latest
router.get("/:sensorId/latest", (req: Request, res: Response) => {
  const sensor = getSensorById(req.params["sensorId"] as string);
  if (!sensor) {
    res.status(404).json({ error: `Sensor '${req.params.sensorId}' not found` });
    return;
  }

  try {
    const rows = readCsv(sensor.csvFile);
    if (rows.length === 0) {
      res.status(404).json({ error: "No data available" });
      return;
    }
    const latest = rows[rows.length - 1];
    const { parsedDate, timestamp, ...data } = latest;
    res.json({ timestamp: parsedDate.toISOString(), data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

// GET /api/sensors/:sensorId/data
router.get("/:sensorId/data", (req: Request, res: Response) => {
  const sensor = getSensorById(req.params["sensorId"] as string);
  if (!sensor) {
    res.status(404).json({ error: `Sensor '${req.params.sensorId}' not found` });
    return;
  }

  const { from, to, limit } = req.query as Record<string, string>;
  const maxRows = limit ? parseInt(limit, 10) : 0;

  try {
    const rows = readCsv(sensor.csvFile);
    let filtered = filterByDateRange(rows, from, to);

    if (!isNaN(maxRows) && maxRows > 0) {
      filtered = filtered.slice(-maxRows);
    }

    res.json({
      sensorId: sensor.id,
      total: filtered.length,
      rows: rowsToJson(filtered),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

// GET /api/sensors/:sensorId/parameters
router.get("/:sensorId/parameters", (req: Request, res: Response) => {
  const sensor = getSensorById(req.params["sensorId"] as string);
  if (!sensor) {
    res.status(404).json({ error: `Sensor '${req.params.sensorId}' not found` });
    return;
  }
  res.json(sensor.parameters);
});

export default router;
