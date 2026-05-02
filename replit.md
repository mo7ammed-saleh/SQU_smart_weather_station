# SQU Smart Weather Station Dashboard

## Overview

A professional weather station monitoring dashboard for Sultan Qaboos University — iLab Marine.
Reads data from 4 sensors connected to a DataTaker DT80W data logger via CSV files.
Displays charts (Recharts), paginated data tables, date range filtering, and Excel exports.

**The app never generates data. CSV files are the sole source of truth.**

## Login Credentials
- **Username**: `admin`
- **Password**: `admin123`

## Stack

- **Monorepo**: pnpm workspaces
- **Frontend**: React + Vite + Tailwind CSS + Recharts + Framer Motion + Wouter
- **Backend**: Express 5 (Node.js)
- **API codegen**: Orval (from OpenAPI spec in `lib/api-spec`)
- **CSV parsing**: PapaParse
- **Excel export**: ExcelJS
- **Auth**: Zustand (client-side, localStorage session)
- **Build**: esbuild

## Key Commands

- `pnpm run typecheck` — full typecheck
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks/schemas
- Workflows manage the running servers (do not run `pnpm dev` at root)

## App Routes

| Path | Description |
|------|-------------|
| `/login` | Login page |
| `/` | Home — sensor overview, interval control, Excel export |
| `/sensors/aqt560` | AQT560 Air Quality sensor page |
| `/sensors/ws500` | WS500 Smart Weather sensor page |
| `/sensors/smp10` | SMP10 Pyranometer sensor page |
| `/sensors/dr30` | DR30 Pyrheliometer sensor page |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/sensors` | List all sensors |
| GET | `/api/sensors/summary` | Home page overview (row counts from CSV) |
| GET | `/api/sensors/:id/latest` | Latest reading (last CSV row) |
| GET | `/api/sensors/:id/data` | All CSV rows, filterable by from/to |
| GET | `/api/sensors/:id/parameters` | Parameter metadata |
| GET | `/api/export/excel` | Download Excel (sensor + from + to) |
| GET | `/api/logger/interval` | Get saved interval |
| POST | `/api/logger/interval` | Save interval |

## CSV Files

```
artifacts/api-server/data/csv/
├── AQT560_DATA.CSV   ← Replace with real data from Python converter
├── WS500_DATA.CSV
├── SMP10_DATA.CSV
└── DR30_DATA.CSV
```

**Timestamp format required**: `"DD/MM/YYYY, HH:MM"` (quoted, comma-space separator)

## Logo Placeholders

```
artifacts/weather-dashboard/public/squ-logo.svg       ← SQU logo placeholder
artifacts/weather-dashboard/public/company-logo.svg   ← iLab Marine logo placeholder
```

Replace with real logos (PNG or SVG) and update img src paths in Login.tsx, Header.tsx, Sidebar.tsx.

## Sidebar Interval Options (No 5-minute option)
15M · 30M · 45M · 1H · 2H · 3H · 4H · 1D

## Future Integration

See `docs/FUTURE_DT80W_INTEGRATION.md` — covers auto-refresh via Python FTP script,
real logger command via FTP/TCP, and environment variable setup.
