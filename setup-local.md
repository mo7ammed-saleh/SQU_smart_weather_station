# Local Setup Guide — Windows

Run the Smart Weather Station Dashboard on any Windows PC.

## Requirements

| Tool | Version | Link |
|------|---------|------|
| Node.js | LTS (v20+) | https://nodejs.org |
| pnpm | Latest | `npm install -g pnpm` |
| VS Code | Any | https://code.visualstudio.com |
| Browser | Chrome / Edge | — |

## Steps

### 1. Download the Project

Download the ZIP from Replit or clone from GitHub:

```bash
git clone https://github.com/your-org/weather-dashboard.git
```

Extract the folder somewhere, e.g., `C:\Projects\weather-dashboard\`

### 2. Open Terminal in the Project Folder

```bash
cd C:\Projects\weather-dashboard
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Add CSV Files

Place your real sensor CSV files in:

```
artifacts/api-server/data/csv/
```

Expected filenames:
- `AQT560_DATA.CSV`
- `WS500_DATA.CSV`
- `SMP10_DATA.CSV`
- `DR30_DATA.CSV`

### 5. Start the Backend

Open a terminal and run:

```bash
pnpm --filter @workspace/api-server run dev
```

You should see: `Server listening on port 8080`

### 6. Start the Frontend

Open a second terminal and run:

```bash
pnpm --filter @workspace/weather-dashboard run dev
```

You should see: `VITE ready at http://localhost:20300`

### 7. Open the Dashboard

Open your browser and go to:

```
http://localhost:20300
```

### 8. Login

- **Username:** `admin`
- **Password:** `admin123`

Change your password from **Settings** after first login.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `pnpm not found` | Run `npm install -g pnpm` |
| Port already in use | Kill the process using that port |
| Login fails with "Connection Error" | Make sure the API server is running |
| No data shown | Check CSV files are in the correct folder with exact filenames |
