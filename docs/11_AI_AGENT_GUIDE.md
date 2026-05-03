# 11 — AI Agent Guide

This file is for AI coding tools (GitHub Copilot, Claude, GPT, Cursor, Replit Agent, etc.) that need to understand, maintain, or extend this project.

---

## Project Purpose

This is a **full-stack environmental monitoring dashboard** for Sultan Qaboos University (SQU), developed by iLab Marine.

- Frontend: React + Vite + TypeScript
- Backend: Express + Node.js + TypeScript
- Data: CSV files only (no database yet)
- Auth: JSON file (users.json)

---

## Critical Rules

### 1. Never generate fake CSV data
The CSV files contain real sensor measurements. Do not add, simulate, or generate any rows. Every row must come from the physical sensor.

### 2. Never overwrite real CSV files
The files in `artifacts/api-server/data/csv/` are the source of truth. If you need test data, use a copy. Never modify the originals.

### 3. CSV headers are dynamic
Column names are read directly from the CSV header row. Do not hardcode column names in the frontend or backend. The UI adapts automatically.

### 4. Keep the sidebar on the LEFT
The navigation sidebar is on the left side of the layout. Do not move it to the right or change it to a top navigation bar.

### 5. Keep Smart Weather Station branding
- Project title: **Smart Weather Station**
- Organization: Sultan Qaboos University
- Developer: iLab Marine
- Do not rename the project or change the branding.

### 6. Login uses the API
`POST /api/auth/login` validates against `data/users.json`. Do not revert to hardcoded credentials.

---

## Where to Add New Sensors

1. Add the CSV file to `artifacts/api-server/data/csv/`
2. Register the sensor in `artifacts/api-server/src/config/sensors.ts`
3. Add a route entry in `artifacts/weather-dashboard/src/components/layout/Sidebar.tsx`
4. Add an icon mapping in `artifacts/weather-dashboard/src/pages/Home.tsx`

## Where to Add Future DT80W Integration

- Backend trigger: add a route in `artifacts/api-server/src/routes/`
- Python script call: use `child_process.exec` from Node.js
- Interval command: extend `artifacts/api-server/src/routes/logger.ts`
- See `08_DT80W_DATA_FLOW.md` for full architecture

## Key File Locations

| What | Where |
|------|-------|
| Auth store (frontend) | `artifacts/weather-dashboard/src/lib/auth.ts` |
| Login page | `artifacts/weather-dashboard/src/pages/Login.tsx` |
| Settings page | `artifacts/weather-dashboard/src/pages/Settings.tsx` |
| Sidebar | `artifacts/weather-dashboard/src/components/layout/Sidebar.tsx` |
| Header | `artifacts/weather-dashboard/src/components/layout/Header.tsx` |
| Sensor config | `artifacts/api-server/src/config/sensors.ts` |
| CSV service | `artifacts/api-server/src/services/csvService.ts` |
| User service | `artifacts/api-server/src/services/userSettingsService.ts` |
| Users file | `artifacts/api-server/data/users.json` |
| CSV files | `artifacts/api-server/data/csv/` |
