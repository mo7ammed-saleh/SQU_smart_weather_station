import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SETTINGS_FILE = path.resolve(__dirname, "../data/logger-settings.json");

export interface LoggerSettings {
  intervalLabel: string;
  intervalCode: string;
  updatedAt?: string;
  message?: string;
}

const DEFAULT_SETTINGS: LoggerSettings = {
  intervalLabel: "Every 5 minutes",
  intervalCode: "5M",
};

export function getLoggerSettings(): LoggerSettings {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const raw = fs.readFileSync(SETTINGS_FILE, "utf-8");
      return JSON.parse(raw) as LoggerSettings;
    }
  } catch {}
  return DEFAULT_SETTINGS;
}

export function saveLoggerSettings(settings: Omit<LoggerSettings, "updatedAt" | "message">): LoggerSettings {
  const dir = path.dirname(SETTINGS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const toSave: LoggerSettings = {
    ...settings,
    updatedAt: new Date().toISOString(),
    message: "Sampling interval updated successfully. Logger command integration can be added later.",
  };
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(toSave, null, 2), "utf-8");
  return toSave;
}
