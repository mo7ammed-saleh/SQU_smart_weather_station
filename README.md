# Smart Weather Station Dashboard

**Sultan Qaboos University — iLab Marine**

A full-stack environmental monitoring dashboard for the SQU Smart Weather Station. Built with React + Vite (frontend) and Express (backend), using real CSV sensor data as the single source of truth.

## Updating Dashboard Data

To replace the CSV data with new sensor readings:

1. Replace the CSV files inside `DB/CSV_Files/`
2. Keep the same file names: `AQT560_DATA.CSV`, `WS500_DATA.CSV`, `SMP10_DATA.CSV`, `DR30_DATA.CSV`
3. Restart the API Server workflow
4. Refresh the dashboard — all row counts, charts, and tables update automatically
5. No fake data is generated at any point

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

Place real sensor CSV files in `DB/CSV_Files/` (project root):

- `AQT560_DATA.CSV`
- `WS500_DATA.CSV`
- `SMP10_DATA.CSV`
- `DR30_DATA.CSV`

The backend reads from this folder on every request. Replacing files and refreshing the dashboard shows new data immediately. The folder path can be overridden with the `CSV_DATA_DIR` environment variable (resolved relative to the project root).

**Do not generate or simulate CSV rows. Use only real sensor data.**

---

## Publishing to GitHub

To push the dashboard code to GitHub:

1. Create a GitHub Personal Access Token:
   - Go to **https://github.com/settings/tokens**
   - Click **"Generate new token (classic)"**
   - Select the **`repo`** scope
   - Copy the token (starts with `ghp_`)
   - **For fine-grained tokens**: go to Settings → Tokens → edit the token → add the target repository under "Repository access" → set **Contents: Read and write**

2. Store the token as a Replit Secret named **`GITHUB_TOKEN`**

3. Run the publish script:
   ```bash
   bash scripts/publish-to-github.sh https://github.com/YOUR_USERNAME/YOUR_REPO.git
   ```

The `GITHUB_TOKEN` secret is never committed to the repository.

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
