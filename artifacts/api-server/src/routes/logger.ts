import { Router, Request, Response } from "express";
import { SetLoggerIntervalBody } from "@workspace/api-zod";
import {
  applyLoggerInterval,
  getLoggerStatus,
  LoggerApplyError,
  testLoggerConnection,
} from "../services/dt80LoggerService.js";
import { getLoggerSettings } from "../services/loggerSettingsService.js";

const router = Router();

// GET /api/logger/status
router.get("/status", (_req: Request, res: Response) => {
  res.json(getLoggerStatus());
});

// GET /api/logger/test-connection
router.get("/test-connection", async (_req: Request, res: Response) => {
  const result = await testLoggerConnection();
  res.json(result);
});

// GET /api/logger/interval
router.get("/interval", (_req: Request, res: Response) => {
  const settings = getLoggerSettings();
  res.json(settings);
});

// POST /api/logger/interval
router.post("/interval", async (req: Request, res: Response) => {
  const parsed = SetLoggerIntervalBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body", details: parsed.error.issues });
    return;
  }

  try {
    const saved = await applyLoggerInterval({
      intervalLabel: parsed.data.intervalLabel,
      intervalCode: parsed.data.intervalCode,
    });
    res.json(saved);
  } catch (err) {
    if (err instanceof LoggerApplyError) {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }
    res.status(500).json({ error: "Failed to apply logger interval" });
  }
});

export default router;
