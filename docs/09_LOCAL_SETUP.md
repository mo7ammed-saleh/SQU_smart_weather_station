# 09 — Local Setup Guide (Windows)

This guide explains how to run the SQU Smart Weather Station Dashboard on any Windows PC.

## Requirements

- Git
- Node.js LTS v20 or newer
- pnpm
- VS Code
- Chrome or Edge
- Python, only if running the DBD-to-CSV updater
- dump_dbd.exe, only if converting DT80W DBD files to CSV

Install pnpm after Node.js:

```bash
npm install -g pnpm
```

## 1. Clone the Project

```bash
git clone https://github.com/mo7ammed-saleh/SQU_smart_weather_station.git
cd SQU_smart_weather_station
```

## 2. Install Dependencies

```bash
pnpm install
```

Optional check:

```bash
pnpm run typecheck
```

## 3. Create Environment File

```bash
copy .env.example .env
```

Safe default when the DT80W is not connected:

```env
DT80_ENABLED=false
DT80_MODE=dry-run
DT80_IP=192.168.5.50
DT80_PORT=7700
DT80_TIMEOUT_MS=10000
DT80_JOB_NAME=S_W_STAT
DT80_APPLY_FULL_JOB=false
```

When the logger is connected and tested:

```env
DT80_ENABLED=true
DT80_MODE=tcp
DT80_IP=192.168.5.50
DT80_PORT=7700
DT80_TIMEOUT_MS=10000
```

With the safe default, the Home dashboard shows DT80W direct control as disabled/local-only. Interval changes are saved locally and no hardware command is sent. Set `DT80_ENABLED=true` and `DT80_MODE=tcp` only after the logger is connected and ready for direct control.

## 4. Place CSV Files

Final CSV folder:

```text
DB/CSV_Files/
```

Required files:

```text
AQT560_DATA.CSV
WS500_DATA.CSV
SMP10_DATA.CSV
DR30_DATA.CSV
```

The dashboard reads only this folder. Do not use old CSV folders.

## 5. Run the Full App

```bash
pnpm.cmd run dev
```

Then open:

```text
http://localhost:20300
```

Local ports:

```text
Frontend dashboard: http://localhost:20300
Backend API: http://localhost:8080
```

During local development, the Vite dev server forwards frontend `/api` requests to the backend on `http://localhost:8080`.

Normal API request logs are hidden by default so the terminal stays quiet. Set this only while debugging request traffic:

```env
HTTP_LOGS=true
```

## 6. Login

Default login:

```text
admin / admin123
```

Change password from Settings after first login.

## 7. Alternative Troubleshooting Startup

Use this only if you need to isolate backend or frontend startup problems.

Backend terminal:

```bash
pnpm --filter @workspace/api-server run dev
```

Frontend terminal:

```bash
cd SQU_smart_weather_station
pnpm --filter @workspace/weather-dashboard run dev
```

Then open:

```text
http://localhost:20300
```

## 8. Python Auto Update Workflow

The dashboard does not read DBD files directly.

Recommended update process:

1. DT80W logs readings as DBD files.
2. Python connects to the DT80W FTP server.
3. Python downloads DBD files.
4. Python converts DBD files to CSV using `dump_dbd.exe`.
5. Python saves or replaces CSV files in `DB/CSV_Files/`.
6. A batch file runs the Python script.
7. Windows Task Scheduler runs the batch file automatically.
8. Refresh the dashboard to see the updated CSV data.

## 9. Troubleshooting

| Problem | Fix |
|---|---|
| pnpm not found | Run `npm install -g pnpm` |
| Login connection error | Confirm the backend process is running |
| No data appears | Confirm CSV files are in `DB/CSV_Files/` with exact filenames |
| Row count looks wrong | Check the CSV row count and refresh the dashboard |
| Logger connection disabled | Normal when `DT80_ENABLED=false` |
| Logger connection failed | Check logger IP, port, network, and `.env` |
| Apply Interval button disabled | Click **Test DT80W Connection** first, or keep local-only mode with `DT80_ENABLED=false` / `DT80_MODE=dry-run` |
| Excel export fails | Confirm backend is running and CSV files exist |
| Need API request logs | Set `HTTP_LOGS=true` in `.env`, restart the app, then set it back to `false` after debugging |

## Quick Commands

```bash
git clone https://github.com/mo7ammed-saleh/SQU_smart_weather_station.git
cd SQU_smart_weather_station
npm install -g pnpm
pnpm install
copy .env.example .env
pnpm.cmd run dev
```
