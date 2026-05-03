# Smart Weather Station Dashboard

**Sultan Qaboos University — iLab Marine**

A full-stack environmental monitoring dashboard for the SQU Smart Weather Station. Built with React + Vite (frontend) and Express (backend), using real CSV sensor data as the single source of truth.

---

## Features

- **4 Live Sensor Pages** — AQT560 Air Quality, WS500 Weather, SMP10 Pyranometer, DR30 Pyrheliometer
- **Interactive Charts** — Recharts line charts with dynamic column selection
- **Date/Time Filtering** — Filter all data by date and time range
- **Excel Export** — Export one or all sensors to `.xlsx` with optional date filter
- **Logger Interval Control** — Set the sampling interval (15M to 1D)
- **Settings Page** — Change username and password
- **Blue/Cyan Glassmorphism UI** — Professional dashboard design
- **Protected Routes** — Login required for all pages

---

## Default Login

| Username | Password |
|----------|----------|
| admin | admin123 |

**Change your password from Settings after first login.**

---

## Quick Start (Replit)

Both workflows start automatically. Open the preview pane to see the dashboard.

---

## Run Locally (Windows)

See [`setup-local.md`](./setup-local.md) for full instructions.

```bash
pnpm install
pnpm --filter @workspace/api-server run dev    # Terminal 1
pnpm --filter @workspace/weather-dashboard run dev  # Terminal 2
```

Open: `http://localhost:20300`

---

## Folder Structure

```
artifacts/api-server/     → Express backend
artifacts/weather-dashboard/  → React frontend
docs/                     → Full documentation
setup-local.md            → Windows local setup
setup-production.md       → Production deployment
.env.example              → Environment variable template
```

---

## CSV Data

Place real sensor CSV files in `artifacts/api-server/data/csv/`:

- `AQT560_DATA.CSV`
- `WS500_DATA.CSV`
- `SMP10_DATA.CSV`
- `DR30_DATA.CSV`

**Do not generate or simulate CSV rows. Use only real sensor data.**

---

## Documentation

| File | Description |
|------|-------------|
| `docs/00_PROJECT_OVERVIEW.md` | What the system is and does |
| `docs/01_SYSTEM_ARCHITECTURE.md` | Frontend/backend/data architecture |
| `docs/02_FOLDER_STRUCTURE.md` | Every important folder and file |
| `docs/03_BACKEND_API.md` | All API endpoints with examples |
| `docs/04_FRONTEND_UI.md` | Pages and components guide |
| `docs/05_CSV_DATA_FORMAT.md` | CSV format rules and data flow |
| `docs/06_AUTH_AND_SETTINGS.md` | Login and settings system |
| `docs/07_EXCEL_EXPORT.md` | Export feature details |
| `docs/08_DT80W_DATA_FLOW.md` | DataTaker DT80W integration plan |
| `docs/09_LOCAL_SETUP.md` | Run locally on Windows |
| `docs/10_PRODUCTION_DEPLOYMENT.md` | Deploy to production |
| `docs/11_AI_AGENT_GUIDE.md` | Guide for AI coding tools |
| `docs/12_DATABASE_PLAN.md` | Future database migration plan |

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| Components | shadcn/ui, Recharts, Framer Motion |
| Backend | Express 5, Node.js, TypeScript |
| Data | CSV files (source of truth) |
| Auth | JSON file (users.json) |
| Export | ExcelJS |

---

## Future Roadmap

- [ ] Connect Python script for automatic DT80W → CSV conversion
- [ ] Send interval commands to DT80W via TCP
- [ ] Migrate from JSON auth to database with hashed passwords
- [ ] Add viewer role (read-only access)
- [ ] Add email alerts for sensor anomalies
