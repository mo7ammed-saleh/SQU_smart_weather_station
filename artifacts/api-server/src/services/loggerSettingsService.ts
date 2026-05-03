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
  localOnly?: boolean;
  applyStatus?: string;
  lastConnectionTest?: LoggerOperationRecord | null;
  lastApply?: LoggerOperationRecord | null;
}

export interface LoggerOperationRecord {
  success: boolean;
  status: string;
  message: string;
  timestamp: string;
  mode: string;
  targetIp: string;
  targetPort: number;
  intervalCode?: string;
  intervalLabel?: string;
}

const DEFAULT_SETTINGS: LoggerSettings = {
  intervalLabel: "Every 5 minutes",
  intervalCode: "5M",
};

export function getLoggerSettings(): LoggerSettings {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const raw = fs.readFileSync(SETTINGS_FILE, "utf-8");
      return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as LoggerSettings) };
    }
  } catch {}
  return DEFAULT_SETTINGS;
}

function writeLoggerSettings(settings: LoggerSettings): LoggerSettings {
  const dir = path.dirname(SETTINGS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
  return settings;
}

export function saveLoggerSettings(
  settings: Pick<LoggerSettings, "intervalLabel" | "intervalCode">,
  metadata: Pick<LoggerSettings, "message" | "localOnly" | "applyStatus" | "lastApply">,
): LoggerSettings {
  const current = getLoggerSettings();
  const toSave: LoggerSettings = {
    ...current,
    intervalLabel: settings.intervalLabel,
    intervalCode: settings.intervalCode,
    updatedAt: new Date().toISOString(),
    message: metadata.message,
    localOnly: metadata.localOnly,
    applyStatus: metadata.applyStatus,
    lastApply: metadata.lastApply,
  };
  return writeLoggerSettings(toSave);
}

export function saveConnectionTest(record: LoggerOperationRecord): LoggerSettings {
  const current = getLoggerSettings();
  return writeLoggerSettings({
    ...current,
    lastConnectionTest: record,
  });
}
