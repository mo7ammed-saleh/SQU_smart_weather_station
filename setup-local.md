# Local Setup Guide — Windows

Run the SQU Smart Weather Station Dashboard locally on any Windows PC.

## Requirements

Install:

- Git
- Node.js LTS v20 or newer
- pnpm
- VS Code
- Chrome or Edge
- Python, only if you will run the DBD-to-CSV updater
- dump_dbd.exe, only if you will convert DT80W DBD files to CSV

Install pnpm:

```bash
npm install -g pnpm
```

## Clone the Project

```bash
git clone https://github.com/mo7ammed-saleh/SQU_smart_weather_station.git
cd SQU_smart_weather_station
```

Or download ZIP from GitHub using **Code > Download ZIP**.

## Install Dependencies

```bash
pnpm install
```

Optional check:

```bash
pnpm run typecheck
```

## Create the Environment File

```bash
copy .env.example .env
```

Keep the safe default while the physical logger is not connected:

```env
DT80_ENABLED=false
DT80_MODE=dry-run
```

## Place CSV Files

The final CSV folder is:

```text
DB/CSV_Files/
```

Required files:

```text
DB/CSV_Files/AQT560_DATA.CSV
DB/CSV_Files/WS500_DATA.CSV
DB/CSV_Files/SMP10_DATA.CSV
DB/CSV_Files/DR30_DATA.CSV
```

The dashboard reads only this folder. Do not use the old CSV folder under `artifacts/api-server/data/`.

## Start the Backend

Terminal 1:

```bash
pnpm --filter @workspace/api-server run dev
```

## Start the Frontend

Terminal 2:

```bash
cd SQU_smart_weather_station
pnpm --filter @workspace/weather-dashboard run dev
```

## Open the Dashboard

```text
http://localhost:20300
```

Default login:

```text
admin / admin123
```

Change the password from Settings after first login.

## Python Auto Update Workflow

The dashboard does not read DBD files directly. The recommended data pipeline is:

1. DT80W logs sensor readings as DBD files.
2. Python connects to the logger FTP service.
3. Python downloads DBD files.
4. Python uses `dump_dbd.exe` to convert DBD to CSV.
5. Python saves or replaces the four CSV files in `DB/CSV_Files/`.
6. A batch file runs the Python script.
7. Windows Task Scheduler runs the batch file automatically, for example every 30 minutes.
8. Refresh the dashboard to read the updated CSV files.

## Troubleshooting

| Problem | Fix |
|---|---|
| `pnpm not found` | Run `npm install -g pnpm` |
| Login shows connection error | Make sure the backend terminal is running |
| No data appears | Confirm CSV files are in `DB/CSV_Files/` with exact names |
| Wrong row count | Check the real CSV row count and refresh the dashboard |
| Logger connection disabled | Normal when `DT80_ENABLED=false` |
| Logger connection failed | Check the logger network settings and `.env` values |
| Port already in use | Stop the conflicting process or change the port |
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
