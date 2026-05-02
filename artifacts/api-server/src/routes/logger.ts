import { Router, Request, Response } from "express";
import { getLoggerSettings, saveLoggerSettings } from "../services/loggerSettingsService.js";
import { SetLoggerIntervalBody } from "@workspace/api-zod";

const router = Router();

// GET /api/logger/interval
router.get("/interval", (_req: Request, res: Response) => {
  const settings = getLoggerSettings();
  res.json(settings);
});

// POST /api/logger/interval
router.post("/interval", (req: Request, res: Response) => {
  const parsed = SetLoggerIntervalBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body", details: parsed.error.issues });
    return;
  }

  const saved = saveLoggerSettings({
    intervalLabel: parsed.data.intervalLabel,
    intervalCode: parsed.data.intervalCode,
  });

  res.json(saved);
});

export default router;
