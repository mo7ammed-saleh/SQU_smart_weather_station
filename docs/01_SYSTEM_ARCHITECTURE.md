# 01 — System Architecture

## Overview

```
Browser (React + Vite)
        │
        │  HTTP requests (JSON)
        ▼
Express API Server  ──►  CSV files (data source)
        │           ──►  users.json (auth)
        │           ──►  logger-settings.json (interval)
        ▼
    Excel Export (.xlsx)
```

## Frontend (React + Vite)

- Framework: React 18 with TypeScript
- Build tool: Vite
- Routing: Wouter
- State: Zustand (auth), TanStack Query (server data)
- UI: Tailwind CSS + shadcn/ui components
- Charts: Recharts
- Excel: ExcelJS (client-side export trigger)
- Location: `artifacts/weather-dashboard/`

## Backend (Express)

- Runtime: Node.js + TypeScript (compiled with esbuild)
- Framework: Express 5
- Logging: Pino
- Location: `artifacts/api-server/`

## Data Sources

| File | Purpose |
|------|---------|
| `data/csv/AQT560_DATA.CSV` | Air quality sensor readings |
| `data/csv/WS500_DATA.CSV` | Weather station readings |
| `data/csv/SMP10_DATA.CSV` | Pyranometer readings |
| `data/csv/DR30_DATA.CSV` | Pyrheliometer readings |
| `data/users.json` | User credentials |
| `data/logger-settings.json` | Logger interval setting |

## API Flow

1. Frontend sends GET/POST request to `/api/...`
2. Express route handler reads from CSV or JSON files
3. Data is returned as JSON
4. Frontend renders charts, tables, cards

## Export Flow

1. User selects sensor and optional date range
2. Frontend calls `GET /api/export?sensor=...&from=...&to=...`
3. Backend reads CSV, filters rows, builds Excel workbook with ExcelJS
4. Response is streamed as `.xlsx` download

## Monorepo Structure

This project uses a pnpm workspace monorepo. Both the frontend and backend are separate packages under `artifacts/`. Shared API types and generated client hooks live in `lib/`.
