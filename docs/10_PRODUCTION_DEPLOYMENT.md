# 10 — Production Deployment Guide

## Option A: Replit Deployments (Easiest)

1. Open the project in Replit
2. Click **Deploy** in the top-right corner
3. Select **Autoscale** or **Reserved VM**
4. The app is published at `https://your-project.replit.app`
5. Both the API server and frontend are served automatically

## Option B: VPS / Cloud Server (Linux)

### Requirements
- Node.js LTS + pnpm
- A domain name (optional but recommended)
- Nginx or Caddy as a reverse proxy

### Steps

```bash
# Clone or upload the project
git clone https://github.com/your-repo/weather-dashboard.git
cd weather-dashboard

# Install dependencies
pnpm install

# Build the frontend
pnpm --filter @workspace/weather-dashboard run build

# Set environment variables
export PORT=8080
export NODE_ENV=production

# Start the API server
pnpm --filter @workspace/api-server run start

# Serve the frontend build via Nginx or a static file server
```

### Nginx Config Example

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:8080;
    }

    location / {
        root /path/to/weather-dashboard/artifacts/weather-dashboard/dist;
        try_files $uri /index.html;
    }
}
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```
PORT=8080
NODE_ENV=production
```

## Persistent Data

The following files must be preserved across restarts and deployments:

- `artifacts/api-server/data/csv/*.CSV` — sensor data
- `artifacts/api-server/data/users.json` — user credentials
- `artifacts/api-server/data/logger-settings.json` — interval setting

If using Docker or a VPS, mount these as a volume or persist them outside the deployment directory.

## Security Checklist

- [ ] Change the default password (`admin123`) immediately after deployment
- [ ] Use HTTPS (configure SSL via Let's Encrypt / Caddy)
- [ ] Do not expose the `data/csv/` folder directly via the web server
- [ ] Set `NODE_ENV=production`
- [ ] Consider adding rate limiting to the login endpoint
- [ ] Plan migration to database + hashed passwords (see `12_DATABASE_PLAN.md`)

## Option C: Local PC Inside Organization Network

1. Install Node.js on a Windows PC
2. Run the backend and frontend as described in `09_LOCAL_SETUP.md`
3. Find the PC's local IP address (e.g., `192.168.1.50`)
4. Other devices on the same network can access: `http://192.168.1.50:20300`
5. Use Windows Task Scheduler to auto-start the servers on boot
