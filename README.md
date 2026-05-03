# SQU Smart Weather Station Dashboard

**Sultan Qaboos University — iLab Marine- Developed by Mohammed Saleh- +96894776969**

A full-stack dashboard for monitoring the SQU Smart Weather Station. The system uses a React/Vite frontend and an Express/Node.js backend. The dashboard reads real sensor CSV files, displays latest readings, charts, data tables, date filters, and exports Excel reports.

---

## Final System Workflow

```text
DT80W Data Logger
  ↓ logs sensor data as DBD files
Python FTP Script
  ↓ downloads DBD files from the DT80W
Python + dump_dbd.exe
  ↓ converts DBD files to CSV
DB/CSV_Files/
  ↓ dashboard reads CSV files
Web Dashboard
```

The Python updater and Windows Task Scheduler are separate from the dashboard app. The dashboard reads the final CSV files only.

---

## Important Data Rule

CSV files are the **single source of truth** for dashboard readings.

- Do not generate fake CSV rows.
- Do not overwrite real CSV files unless replacing them with new DT80W-converted CSV files.
- The dashboard reads the current files from disk.
- When the Python script replaces CSV files, refresh the dashboard to see updated data.

Final CSV folder:

```text
DB/CSV_Files/
```

Required filenames:

```text
AQT560_DATA.CSV
WS500_DATA.CSV
SMP10_DATA.CSV
DR30_DATA.CSV
```

---

## Features

- Login-protected dashboard.
- Home dashboard with four sensor overview cards.
- Sensor pages for AQT560, WS500, SMP10, and DR30.
- Latest reading cards.
- Dynamic CSV headers.
- Date/range filtering, including Today and Latest Available Day.
- Chart parameter selection.
- Data table with pagination and rows-per-page control.
- Excel export:
  - Top sensor export downloads all data for that sensor.
  - Data Table export downloads only selected/filtered rows.
  - Home export can export one sensor or all sensors.
- Settings page for username/password changes.
- Data logger interval control.
- DT80W connection test.
- Direct DT80W interval apply when enabled and the logger is reachable.

---

## Default Login

Credentials are stored in:

```text
artifacts/api-server/data/users.json
```

Default credentials:

| Username | Password |
|---|---|
| admin | admin123 |

Change the password from **Settings** after first login.

---

## Folder Structure

```text
SQU_smart_weather_station/
├── README.md
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── .env.example
├── .gitignore
├── .replit
├── setup-local.md
├── setup-production.md
├── DB/
│   └── CSV_Files/
│       ├── AQT560_DATA.CSV
│       ├── WS500_DATA.CSV
│       ├── SMP10_DATA.CSV
│       └── DR30_DATA.CSV
├── artifacts/
│   ├── api-server/          # Express backend
│   └── weather-dashboard/   # React/Vite frontend
├── lib/                     # OpenAPI spec and generated client
├── docs/                    # Full project documentation
└── scripts/                 # Utility scripts
```

---

## Run Locally on Windows

See [`setup-local.md`](./setup-local.md) for full instructions.

Quick version:

```bash
git clone https://github.com/mo7ammed-saleh/SQU_smart_weather_station.git
cd SQU_smart_weather_station
npm install -g pnpm
pnpm install
copy .env.example .env
```

Put the four CSV files in:

```text
DB/CSV_Files/
```

Terminal 1:

```bash
pnpm --filter @workspace/api-server run dev
```

Terminal 2:

```bash
pnpm --filter @workspace/weather-dashboard run dev
```

Open:

```text
http://localhost:20300
```

---

## Python Auto Update Workflow

Your Python workflow should:

1. Connect to the DT80W FTP server.
2. Download the DBD files.
3. Convert DBD to CSV using `dump_dbd.exe`.
4. Save/replace these files inside `DB/CSV_Files/`:
   - `AQT560_DATA.CSV`
   - `WS500_DATA.CSV`
   - `SMP10_DATA.CSV`
   - `DR30_DATA.CSV`
5. Use a `.bat` file and Windows Task Scheduler to run the Python script automatically, for example every 30 minutes.
6. Refresh the dashboard to read the latest CSV files.

---

## DT80W Interval Control

The website includes DT80W direct interval control.

Safe default in `.env`:

```env
DT80_ENABLED=false
DT80_MODE=dry-run
```

When the DT80W is physically connected and the correct command interface/port is confirmed, configure:

```env
DT80_ENABLED=true
DT80_MODE=tcp
DT80_IP=192.168.5.50
DT80_PORT=7700
```

Workflow:

1. User selects a logging interval.
2. User clicks **Test DT80W Connection**.
3. If the connection succeeds, user clicks **Apply Interval to Logger**.
4. The backend sends the interval update to the DT80W.

Important safety rules:

- Do not use `DELALLJOBS` for interval changes.
- Do not delete logger data.
- Do not apply full job updates unless intentionally enabled and tested.

---

## Deployment Notes

GitHub is used for source-code storage. GitHub Pages is **not suitable** for this project because the dashboard needs an Express backend.

Use one of these options:

- Replit Deployment.
- Local PC/server inside the organization network.
- VPS/cloud server with Node.js and optional Nginx/Caddy.

See [`setup-production.md`](./setup-production.md).

---

## Documentation

| File | Description |
|---|---|
| `docs/00_PROJECT_OVERVIEW.md` | Project purpose and workflow |
| `docs/01_SYSTEM_ARCHITECTURE.md` | Frontend/backend/data architecture |
| `docs/02_FOLDER_STRUCTURE.md` | Folder structure |
| `docs/03_BACKEND_API.md` | API endpoints |
| `docs/04_FRONTEND_UI.md` | UI/pages guide |
| `docs/05_CSV_DATA_FORMAT.md` | CSV rules and format |
| `docs/06_AUTH_AND_SETTINGS.md` | Login/settings |
| `docs/07_EXCEL_EXPORT.md` | Excel export behavior |
| `docs/08_DT80W_DATA_FLOW.md` | DT80W → Python → CSV → Dashboard flow |
| `docs/09_LOCAL_SETUP.md` | Local Windows setup |
| `docs/10_PRODUCTION_DEPLOYMENT.md` | Production deployment |
| `docs/11_AI_AGENT_GUIDE.md` | Rules for future AI/developers |
| `docs/12_DATABASE_PLAN.md` | Future database plan |

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, TypeScript, Tailwind CSS |
| UI | shadcn/ui, Recharts, Framer Motion |
| Backend | Express, Node.js, TypeScript |
| Data | CSV files in `DB/CSV_Files/` |
| Auth | JSON file (`users.json`) |
| Export | ExcelJS |
