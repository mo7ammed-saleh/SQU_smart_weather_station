# 10 — Production Deployment Guide

Deploy the SQU Smart Weather Station Dashboard for internal or online access.

## GitHub Pages Note

GitHub is for source-code storage. GitHub Pages is not suitable for this project because the dashboard requires an Express backend for login, CSV reading, Excel export, settings, and DT80W logger control.

Use one of these options instead:

- Replit Deployment
- Local PC or server inside the organization network
- VPS or cloud server

## Option A — Replit Deployment

1. Open the project in Replit.
2. Confirm the app works in Preview.
3. Confirm CSV files are in:

```text
DB/CSV_Files/
```

4. Configure environment variables using `.env.example`.
5. Keep safe logger defaults while the logger is not connected:

```env
DT80_ENABLED=false
DT80_MODE=dry-run
```

6. Deploy from Replit.

## Option B — Local Organization PC or Server

This is suitable for a lab or office network.

Recommended flow:

1. Install Node.js and pnpm.
2. Clone the project.
3. Place CSV files in `DB/CSV_Files/`.
4. Run backend and frontend.
5. Use a Python updater plus Windows Task Scheduler to replace CSV files automatically.
6. Users on the same network open the dashboard using the PC IP address.

Example:

```text
http://192.168.1.50:20300
```

Persistent folders/files:

```text
DB/CSV_Files/
artifacts/api-server/data/users.json
artifacts/api-server/data/logger-settings.json
```

## Option C — VPS or Cloud Server

Requirements:

- Node.js LTS
- pnpm
- Domain name, optional but recommended
- Reverse proxy such as Nginx or Caddy, optional
- HTTPS certificate for public access

Basic commands:

```bash
git clone https://github.com/mo7ammed-saleh/SQU_smart_weather_station.git
cd SQU_smart_weather_station
pnpm install
cp .env.example .env
pnpm --filter @workspace/weather-dashboard run build
pnpm --filter @workspace/api-server run start
```

Frontend build output:

```text
artifacts/weather-dashboard/dist/
```

Backend API port is controlled by `PORT`, normally `8080`.

## Environment Variables

Important values:

```env
CSV_DATA_DIR=DB/CSV_Files
USERS_FILE=artifacts/api-server/data/users.json
LOGGER_SETTINGS_FILE=artifacts/api-server/data/logger-settings.json
```

Logger safe default:

```env
DT80_ENABLED=false
DT80_MODE=dry-run
```

When the DT80W is connected and tested:

```env
DT80_ENABLED=true
DT80_MODE=tcp
DT80_IP=192.168.5.50
DT80_PORT=7700
```

## Python CSV Updater in Production

The dashboard reads CSV only. The Python updater should:

1. Connect to DT80W FTP.
2. Download DBD files.
3. Convert DBD to CSV using `dump_dbd.exe`.
4. Save or replace CSV files in `DB/CSV_Files/`.
5. Run automatically using Task Scheduler, cron, or a service.

## Security Checklist

- Change the default password immediately.
- Use HTTPS for public access.
- Never commit `.env`.
- Do not expose `DB/CSV_Files/` directly through the web server.
- Do not expose `users.json` or `logger-settings.json` publicly.
- Keep DT80W direct control disabled until the real logger is connected and tested.
- Do not delete logger jobs or data during interval changes.
- Plan a future database and password-hashing migration.
