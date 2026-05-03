# 09 — Local Setup Guide (Windows)

## Requirements

- **Node.js LTS** (v20 or later) — https://nodejs.org
- **pnpm** — install after Node.js: `npm install -g pnpm`
- **VS Code** (recommended editor) — https://code.visualstudio.com
- A modern browser (Chrome, Edge, Firefox)

## Steps

### 1. Download the Project

Download the ZIP from Replit (Files panel → right-click root → Download as zip) or clone from GitHub.

Extract to a folder, e.g., `C:\Projects\weather-dashboard\`

### 2. Open in VS Code

```
code C:\Projects\weather-dashboard
```

Or open VS Code → File → Open Folder → select the project folder.

### 3. Install Dependencies

Open the terminal in VS Code (Ctrl+`) and run:

```bash
pnpm install
```

This installs all packages for both the frontend and backend.

### 4. Place CSV Files

Copy your real sensor CSV files into:

```
artifacts/api-server/data/csv/
```

Files must be named exactly:
- `AQT560_DATA.CSV`
- `WS500_DATA.CSV`
- `SMP10_DATA.CSV`
- `DR30_DATA.CSV`

### 5. Run the Backend

In one terminal:

```bash
pnpm --filter @workspace/api-server run dev
```

The API server starts on port `8080` (or the PORT set in environment).

### 6. Run the Frontend

In a second terminal:

```bash
pnpm --filter @workspace/weather-dashboard run dev
```

The dashboard starts on port `20300` (or another available port).

### 7. Open in Browser

Navigate to: `http://localhost:20300`

### 8. Login

Default credentials:
- **Username:** `admin`
- **Password:** `admin123`

Change these from the Settings page after first login.

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `pnpm: command not found` | Run `npm install -g pnpm` first |
| Port already in use | Change PORT in `.env` or stop the conflicting process |
| CSV not showing | Check filenames match exactly (case-sensitive on Linux) |
| Login fails | Ensure API server is running on port 8080 |
| No data in charts | Verify CSV files have the correct timestamp format |
