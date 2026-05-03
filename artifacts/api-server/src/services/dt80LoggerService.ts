import net from "net";
import {
  getLoggerSettings,
  saveConnectionTest,
  saveLoggerSettings,
  type LoggerOperationRecord,
  type LoggerSettings,
} from "./loggerSettingsService.js";

const VALID_INTERVALS = new Set(["15M", "30M", "45M", "1H", "2H", "3H", "4H", "1D"]);

export interface Dt80Config {
  enabled: boolean;
  mode: "dry-run" | "tcp";
  targetIp: string;
  targetPort: number;
  timeoutMs: number;
  jobName: string;
  applyFullJob: boolean;
}

export interface LoggerStatus {
  enabled: boolean;
  mode: string;
  targetIp: string;
  targetPort: number;
  timeoutMs: number;
  jobName: string;
  applyFullJob: boolean;
  connectionStatus: string;
  canApply: boolean;
  message: string;
  currentInterval: LoggerSettings;
  lastConnectionTest?: LoggerOperationRecord | null;
  lastApply?: LoggerOperationRecord | null;
}

export class LoggerApplyError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
  ) {
    super(message);
  }
}

export function getDt80Config(): Dt80Config {
  return {
    enabled: process.env.DT80_ENABLED === "true",
    mode: process.env.DT80_MODE === "tcp" ? "tcp" : "dry-run",
    targetIp: process.env.DT80_IP ?? "192.168.5.50",
    targetPort: Number(process.env.DT80_PORT ?? "7700"),
    timeoutMs: Number(process.env.DT80_TIMEOUT_MS ?? "10000"),
    jobName: process.env.DT80_JOB_NAME ?? "S_W_STAT",
    applyFullJob: process.env.DT80_APPLY_FULL_JOB === "true",
  };
}

function targetMatches(record: LoggerOperationRecord | null | undefined, config: Dt80Config): boolean {
  return Boolean(
    record?.success &&
      record.mode === config.mode &&
      record.targetIp === config.targetIp &&
      record.targetPort === config.targetPort,
  );
}

export function getLoggerStatus(): LoggerStatus {
  const config = getDt80Config();
  const settings = getLoggerSettings();
  const lastConnectionTest = settings.lastConnectionTest ?? null;
  const lastApply = settings.lastApply ?? null;

  if (!config.enabled) {
    return {
      ...config,
      mode: "disabled",
      connectionStatus: "disabled",
      canApply: true,
      message: "DT80W direct control is disabled. Interval changes are saved locally only.",
      currentInterval: settings,
      lastConnectionTest,
      lastApply,
    };
  }

  if (config.mode === "dry-run") {
    return {
      ...config,
      connectionStatus: "dry-run",
      canApply: true,
      message: "Dry-run mode is active. Interval changes are saved locally only; no DT80W command is sent.",
      currentInterval: settings,
      lastConnectionTest,
      lastApply,
    };
  }

  const hasSuccessfulTest = targetMatches(lastConnectionTest, config);

  return {
    ...config,
    connectionStatus: hasSuccessfulTest ? "connected" : "not-tested",
    canApply: hasSuccessfulTest,
    message: hasSuccessfulTest
      ? "DT80W connection was tested successfully. Interval apply is enabled."
      : "Run a successful DT80W connection test before applying an interval.",
    currentInterval: settings,
    lastConnectionTest,
    lastApply,
  };
}

function testTcpConnection(config: Dt80Config): Promise<void> {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({
      host: config.targetIp,
      port: config.targetPort,
      timeout: config.timeoutMs,
    });

    socket.once("connect", () => {
      socket.destroy();
      resolve();
    });
    socket.once("timeout", () => {
      socket.destroy();
      reject(new Error(`Connection timed out after ${config.timeoutMs} ms`));
    });
    socket.once("error", (err) => {
      socket.destroy();
      reject(err);
    });
  });
}

function makeRecord(
  config: Dt80Config,
  result: Pick<LoggerOperationRecord, "success" | "status" | "message" | "intervalCode" | "intervalLabel">,
): LoggerOperationRecord {
  return {
    ...result,
    timestamp: new Date().toISOString(),
    mode: config.enabled ? config.mode : "disabled",
    targetIp: config.targetIp,
    targetPort: config.targetPort,
  };
}

export async function testLoggerConnection(): Promise<LoggerOperationRecord> {
  const config = getDt80Config();

  if (!config.enabled) {
    const record = makeRecord(config, {
      success: false,
      status: "disabled",
      message: "DT80W direct control is disabled. Set DT80_ENABLED=true only after the logger is connected and tested.",
    });
    saveConnectionTest(record);
    return record;
  }

  if (config.mode === "dry-run") {
    const record = makeRecord(config, {
      success: true,
      status: "dry-run",
      message: "Dry-run mode is active. Hardware TCP connection was skipped; applies will be saved locally only.",
    });
    saveConnectionTest(record);
    return record;
  }

  try {
    await testTcpConnection(config);
    const record = makeRecord(config, {
      success: true,
      status: "connected",
      message: `Connected to DT80W at ${config.targetIp}:${config.targetPort}.`,
    });
    saveConnectionTest(record);
    return record;
  } catch (err) {
    const record = makeRecord(config, {
      success: false,
      status: "failed",
      message: err instanceof Error ? err.message : "DT80W connection test failed.",
    });
    saveConnectionTest(record);
    return record;
  }
}

function buildIntervalCommand(intervalCode: string): string {
  return [
    `RA"AQT560_DATA"${intervalCode}`,
    `RB"WS500_DATA"${intervalCode}`,
    `RC"SMP10_DATA"${intervalCode}`,
    `RD"DR30_DATA"${intervalCode}`,
  ].join("\r\n") + "\r\n";
}

function sendTcpCommand(config: Dt80Config, command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({
      host: config.targetIp,
      port: config.targetPort,
      timeout: config.timeoutMs,
    });
    let settled = false;

    function done(err?: Error) {
      if (settled) return;
      settled = true;
      socket.destroy();
      if (err) reject(err);
      else resolve();
    }

    socket.once("connect", () => {
      socket.write(command, (err) => {
        if (err) {
          done(err);
          return;
        }
        socket.end();
      });
    });
    socket.once("close", () => done());
    socket.once("timeout", () => done(new Error(`Command timed out after ${config.timeoutMs} ms`)));
    socket.once("error", (err) => done(err));
  });
}

export async function applyLoggerInterval(input: {
  intervalLabel: string;
  intervalCode: string;
}): Promise<LoggerSettings> {
  const intervalCode = input.intervalCode.trim().toUpperCase();
  const intervalLabel = input.intervalLabel.trim();

  if (!VALID_INTERVALS.has(intervalCode) || !intervalLabel) {
    throw new LoggerApplyError("Invalid logger interval.", 400);
  }

  const config = getDt80Config();

  if (!config.enabled || config.mode === "dry-run") {
    const record = makeRecord(config, {
      success: true,
      status: config.enabled ? "dry-run" : "local-only",
      message: config.enabled
        ? "Dry-run mode: interval saved locally only. No DT80W command was sent."
        : "DT80W disabled: interval saved locally only. No DT80W command was sent.",
      intervalCode,
      intervalLabel,
    });

    return saveLoggerSettings(
      { intervalCode, intervalLabel },
      {
        message: record.message,
        localOnly: true,
        applyStatus: record.status,
        lastApply: record,
      },
    );
  }

  const settings = getLoggerSettings();
  if (!targetMatches(settings.lastConnectionTest, config)) {
    throw new LoggerApplyError(
      "Run a successful DT80W connection test before applying an interval.",
      409,
    );
  }

  const command = buildIntervalCommand(intervalCode);
  if (/DELALLJOBS|FORMAT|CLEAR|DELETE/i.test(command)) {
    throw new LoggerApplyError("Refusing to send unsafe DT80W command.", 400);
  }

  try {
    await sendTcpCommand(config, command);
  } catch (err) {
    throw new LoggerApplyError(
      err instanceof Error ? err.message : "Failed to send DT80W interval command.",
      502,
    );
  }

  const record = makeRecord(config, {
    success: true,
    status: "applied",
    message: `Interval command sent to DT80W at ${config.targetIp}:${config.targetPort}.`,
    intervalCode,
    intervalLabel,
  });

  return saveLoggerSettings(
    { intervalCode, intervalLabel },
    {
      message: record.message,
      localOnly: false,
      applyStatus: "applied",
      lastApply: record,
    },
  );
}
