# SQU Weather Station Dashboard

## Overview

A professional weather station monitoring dashboard for Sultan Qaboos University. Reads data from 4 sensors connected to a DataTaker DT80W data logger, displays readings via Recharts charts, supports date range filtering, and exports Excel reports.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS + Recharts + Framer Motion
- **Backend**: Express 5 (Node.js)
- **API codegen**: Orval (from OpenAPI spec)
- **CSV parsing**: PapaParse
- **Excel export**: ExcelJS
- **Build**: esbuild (CJS bundle)

## Login Credentials

- **Username**: `admin`
- **Password**: `admin123`

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Artifact Structure

### Frontend: `artifacts/weather-dashboard/`
- `/login` — Login page
- `/` — Home overview (sensor summary cards, logger interval, Excel export)
- `/sensors/aqt560` — AQT560 Air Quality sensor page
- `/sensors/ws500` — WS500 Smart Weather sensor page
- `/sensors/smp10` — SMP10 Pyranometer sensor page
- `/sensors/dr30` — DR30 Pyrheliometer sensor page

### Backend: `artifacts/api-server/`
- `GET /api/sensors` — list all sensors
- `GET /api/sensors/summary` — sensor summary for home page
- `GET /api/sensors/:id/latest` — latest reading
- `GET /api/sensors/:id/data` — filtered CSV data (supports from/to/limit)
- `GET /api/sensors/:id/parameters` — parameter metadata (labels + units)
- `GET /api/export/excel` — download Excel report (sensor + from + to)
- `GET /api/logger/interval` — get current interval
- `POST /api/logger/interval` — set interval

## CSV Files

Place real CSV files (from Python FTP script) in:
```
artifacts/api-server/data/csv/
├── AQT560_DATA.CSV
├── WS500_DATA.CSV
├── SMP10_DATA.CSV
└── DR30_DATA.CSV
```

**Required timestamp format**: `"DD/MM/YYYY, HH:MM"` (quoted, comma-space separator)

## Logger Settings

Saved at: `artifacts/api-server/data/logger-settings.json`

## Future Integration

See `docs/FUTURE_DT80W_INTEGRATION.md` for instructions on connecting to the real DT80W logger via FTP/TCP.
