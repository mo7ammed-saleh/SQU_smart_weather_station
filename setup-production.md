# Production Deployment Guide

Deploy the Smart Weather Station Dashboard for global or internal access.

## Option 1: Replit Deployments (Recommended)

1. Open the project in Replit
2. Click the **Deploy** button (top right)
3. Choose **Autoscale** or **Reserved VM**
4. Your app is live at `https://your-app.replit.app`

## Option 2: VPS / Linux Server

### Build the Frontend

```bash
pnpm --filter @workspace/weather-dashboard run build
```

Output: `artifacts/weather-dashboard/dist/`

### Start the Backend

```bash
export PORT=8080
export NODE_ENV=production
pnpm --filter @workspace/api-server run start
```

### Serve with Nginx

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    location /api/ {
        proxy_pass http://127.0.0.1:8080;
    }

    location / {
        root /srv/weather-dashboard/artifacts/weather-dashboard/dist;
        try_files $uri /index.html;
    }
}
```

## Option 3: Windows PC on Local Network

1. Follow local setup steps from `setup-local.md`
2. Find IP: open cmd → `ipconfig` → note IPv4 address (e.g., `192.168.1.50`)
3. Others on the same network access: `http://192.168.1.50:20300`
4. Use Windows Task Scheduler to run both servers on startup

## Environment Variables

Copy `.env.example` to `.env`:

```
PORT=8080
NODE_ENV=production
```

## Persistent Data (Must Survive Restarts)

These files must be kept persistent:

```
artifacts/api-server/data/csv/         ← sensor data
artifacts/api-server/data/users.json   ← login credentials
artifacts/api-server/data/logger-settings.json
```

Back these up regularly.

## Security Checklist

- [ ] Change default password immediately (`admin123` → something strong)
- [ ] Use HTTPS (SSL certificate via Let's Encrypt or Cloudflare)
- [ ] Do NOT serve the `data/` folder publicly
- [ ] Set `NODE_ENV=production`
- [ ] Consider adding rate limiting on `/api/auth/login`
- [ ] Plan database + hashed passwords migration (see `docs/12_DATABASE_PLAN.md`)
