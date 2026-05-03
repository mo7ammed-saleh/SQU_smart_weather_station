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
```

When the logger is connected and tested:

```env
DT80_ENABLED=true
DT80_MODE=tcp
DT80_IP=192.168.5.50
DT80_PORT=7700
```

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

## 5. Run Backend

Terminal 1:

```bash
pnpm --filter @workspace/api-server run dev
```

Expected backend port: `8080`.

## 6. Run Frontend

Terminal 2:

```bash
cd SQU_smart_weather_station
pnpm --filter @workspace/weather-dashboard run dev
```

Expected frontend URL:

```text
http://localhost:20300
```

## 7. Login

Default login:

```text
admin / admin123
```

Change password from Settings after first login.

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
| Login connection error | Start the backend terminal first |
| No data appears | Confirm CSV files are in `DB/CSV_Files/` with exact filenames |
| Row count looks wrong | Check the CSV row count and refresh the dashboard |
| Logger connection disabled | Normal when `DT80_ENABLED=false` |
| Logger connection failed | Check logger IP, port, network, and `.env` |
| Excel export fails | Confirm backend is running and CSV files exist |

## Quick Commands

```bash
git clone https://github.com/mo7ammed-saleh/SQU_smart_weather_station.git
cd SQU_smart_weather_station
npm install -g pnpm
pnpm install
copy .env.example .env
pnpm --filter @workspace/api-server run dev
```

Second terminal:

```bash
cd SQU_smart_weather_station
pnpm --filter @workspace/weather-dashboard run dev
```
