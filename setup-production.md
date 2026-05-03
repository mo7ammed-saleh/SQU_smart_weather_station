# Production Deployment Guide

Deploy the SQU Smart Weather Station Dashboard for internal or online access.

## Important Note About GitHub Pages

GitHub is for source-code storage. GitHub Pages is not suitable for this full dashboard because the project requires an Express backend API for login, CSV reading, Excel export, settings, and DT80W logger control.

Use one of these deployment options instead:

- Replit Deployment
- Local PC/server inside the organization network
- VPS/cloud server

---

## Option A — Replit Deployment

This is the easiest option for the current project.

1. Open the project in Replit.
2. Confirm the project runs correctly in Preview.
3. Confirm CSV files are in:

```text
DB/CSV_Files/
```

4. Click **Deploy**.
5. Choose the deployment type required by the project.
6. Configure environment variables using the same keys from `.env.example`.

Recommended safe logger defaults when the DT80W is not connected:

```env
DT80_ENABLED=false
DT80_MODE=dry-run
```

---

## Option B — Local PC or Local Server

This is recommended for an internal lab or organization network.

Typical use:

- A Windows PC runs the dashboard backend and frontend.
- The Python updater runs by Windows Task Scheduler.
- The Python updater replaces CSV files in `DB/CSV_Files/` every configured interval.
- Users on the same network open the dashboard from the PC IP address.

Example:

```text
http://192.168.1.50:20300
```

Keep these folders/files persistent:

```text
DB/CSV_Files/
artifacts/api-server/data/users.json
artifacts/api-server/data/logger-settings.json
```

---

## Option C — VPS or Cloud Server

Use this option for a more formal production deployment.

### Requirements

- Node.js LTS
- pnpm
- Linux server or Windows server
- Optional Nginx or Caddy reverse proxy
- HTTPS certificate

### Basic Linux/VPS Flow

```bash
git clone https://github.com/mo7ammed-saleh/SQU_smart_weather_station.git
cd SQU_smart_weather_station
pnpm install
cp .env.example .env
pnpm --filter @workspace/weather-dashboard run build
pnpm --filter @workspace/api-server run start
```

The frontend build output is under:

```text
artifacts/weather-dashboard/dist/
```

The backend API runs on the configured `PORT`, usually `8080`.

### Example Reverse Proxy Concept

Proxy API requests to the backend:

```text
/api/*  ->  http://127.0.0.1:8080
```

Serve the frontend from:

```text
artifacts/weather-dashboard/dist/
```

---

## Environment Variables

Copy `.env.example` to `.env` and edit as needed.

Important values:

```env
CSV_DATA_DIR=DB/CSV_Files
USERS_FILE=artifacts/api-server/data/users.json
LOGGER_SETTINGS_FILE=artifacts/api-server/data/logger-settings.json
```

For DT80W direct control, keep safe defaults until the logger is connected and tested:

```env
DT80_ENABLED=false
DT80_MODE=dry-run
```

When ready to control the logger directly:

```env
DT80_ENABLED=true
DT80_MODE=tcp
DT80_IP=192.168.5.50
DT80_PORT=7700
```

---

## Persistent Data

These must survive restarts, redeployments, and updates:

```text
DB/CSV_Files/                         sensor CSV data
artifacts/api-server/data/users.json  login credentials
artifacts/api-server/data/logger-settings.json logger interval/status settings
```

Back them up regularly.

---

## Python CSV Updater in Production

The dashboard does not read DBD files directly.

The Python updater should:

1. Connect to the DT80W FTP server.
2. Download DBD files.
3. Convert DBD to CSV using `dump_dbd.exe`.
4. Save or replace the four CSV files in `DB/CSV_Files/`.
5. Run automatically using Task Scheduler, cron, or a service.
6. The dashboard reads the updated CSV files after refresh.

---

## Security Checklist

- Change the default password immediately.
- Use HTTPS for external access.
- Do not expose JSON data files or CSV folders directly through the web server.
- Set `NODE_ENV=production`.
- Keep `.env` private and never commit it.
- Keep DT80W direct control disabled until the logger network and port are confirmed.
- Do not use `DELALLJOBS` for interval changes.
- Plan a future migration from JSON passwords to database + hashed passwords.
