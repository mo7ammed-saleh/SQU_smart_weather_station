# 11 — AI Agent Guide

This guide is for future AI coding tools and developers working on the SQU Smart Weather Station Dashboard.

## Project Purpose

Full-stack monitoring dashboard for Sultan Qaboos University Smart Weather Station, developed by iLab Marine.

- Frontend: React, Vite, TypeScript
- Backend: Express, Node.js, TypeScript
- Data: CSV files only
- Auth: JSON file authentication
- Export: Excel files
- Logger: DT80W interval control support

## Critical Rules

### CSV Data

- Never generate fake CSV data.
- Never simulate sensor rows.
- CSV source is always:

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

Do not use old CSV folders under `artifacts/api-server/data/`.

### Dynamic Headers

CSV headers are dynamic. The table and chart parameter list should adapt to CSV headers. Friendly labels, units, icons, and sensor names can be configured in backend sensor config.

### Python Updater

The dashboard does not read DBD files directly.

Final data pipeline:

1. DT80W logs DBD files.
2. Python downloads DBD files by FTP.
3. Python converts DBD to CSV with `dump_dbd.exe`.
4. Python saves CSV files into `DB/CSV_Files/`.
5. Dashboard reads CSV files from disk.

### DT80W Logger Control

Keep logger control safe.

Default:

```env
DT80_ENABLED=false
DT80_MODE=dry-run
DT80_IP=192.168.5.50
DT80_PORT=7700
DT80_TIMEOUT_MS=10000
DT80_JOB_NAME=S_W_STAT
DT80_APPLY_FULL_JOB=false
```

Only enable direct logger control after the real logger is connected and the connection test succeeds:

```env
DT80_ENABLED=true
DT80_MODE=tcp
```

Rules:

- User must test DT80W connection before applying interval.
- `POST /api/logger/interval` must not send hardware commands unless `DT80_ENABLED=true`, `DT80_MODE=tcp`, and the most recent connection test succeeded for the configured target.
- Disabled and dry-run modes may save interval selections as local-only, but must clearly report that no hardware command was sent.
- Never send `DELALLJOBS`, format, clear, or delete commands for interval changes.
- Full job apply should remain disabled unless specifically tested.

## Branding and UI Rules

- Project title: Smart Weather Station
- Organization: Sultan Qaboos University
- Developer: iLab Marine
- Sidebar stays on the left.
- Keep login, settings, export, charts, and sensor pages intact.

## Key File Locations

| What | Location |
|---|---|
| CSV files | `DB/CSV_Files/` |
| Backend | `artifacts/api-server/` |
| Frontend | `artifacts/weather-dashboard/` |
| Sensor config | `artifacts/api-server/src/config/sensors.ts` |
| CSV service | `artifacts/api-server/src/services/csvService.ts` |
| Excel service | `artifacts/api-server/src/services/excelService.ts` |
| Logger service | `artifacts/api-server/src/services/dt80LoggerService.ts` |
| Logger routes | `artifacts/api-server/src/routes/logger.ts` |
| Users file | `artifacts/api-server/data/users.json` |
| Logger settings | `artifacts/api-server/data/logger-settings.json` |
| DT80 template | `artifacts/api-server/dt80/job-template.dxc` |
| Login page | `artifacts/weather-dashboard/src/pages/Login.tsx` |
| Home page | `artifacts/weather-dashboard/src/pages/Home.tsx` |
| Sensor page | `artifacts/weather-dashboard/src/pages/SensorPage.tsx` |
| Settings page | `artifacts/weather-dashboard/src/pages/Settings.tsx` |

## Adding a New Sensor

1. Add the CSV file to `DB/CSV_Files/`.
2. Add sensor metadata in `artifacts/api-server/src/config/sensors.ts`.
3. Add sidebar/home UI mapping if required.
4. Keep CSV headers dynamic.
5. Update docs if it is a permanent sensor.

## Export Behavior

- Top export button on a sensor page exports all CSV rows for that sensor.
- Data Table export exports only selected or filtered rows.
- Home export supports one sensor or all sensors.

## Local Setup Reminder

Use `docs/09_LOCAL_SETUP.md` for Windows installation. Use `docs/13_WINDOWS_AUTO_RUN.md` for Task Scheduler startup.

Normal backend request logs are hidden by default with `HTTP_LOGS=false`. Keep this default for local use and set `HTTP_LOGS=true` only when debugging API request traffic. GitHub Pages is not suitable because this project requires an Express backend.
