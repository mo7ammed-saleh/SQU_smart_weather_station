# DT80W Integration & Data Source Guide

## Data Source — CSV Files (Source of Truth)

This application **does not generate any data**. All readings, charts, tables, and exports come
exclusively from the CSV files placed in the server's data folder.

### CSV File Location
```
artifacts/api-server/data/csv/
├── AQT560_DATA.CSV   ← Replace with your real CSV from Python converter
├── WS500_DATA.CSV    ← Replace with your real CSV from Python converter
├── SMP10_DATA.CSV    ← Replace with your real CSV from Python converter
└── DR30_DATA.CSV     ← Replace with your real CSV from Python converter
```

### How to Update with Real Data

1. Run your Python FTP + `dump_dbd.exe` workflow to convert DBD → CSV files.
2. Copy the resulting CSV files into the folder above, using the **exact same filenames**.
3. **Do not rename the files** — the app looks for the exact filenames listed above.
4. **Do not change the column headers** — the app reads them dynamically from the CSV.
5. Restart the API Server workflow to load the new data.

### What Changes Automatically
- Home page sensor card **Records** count = exact number of rows in your CSV
- Home page sensor card **Last Record** timestamp = last row timestamp in the CSV
- Sensor page table shows **every row** from the CSV (paginated 20/page)
- Sensor page chart samples from the real rows (up to 500 points for display performance)
- Excel export downloads **exactly the filtered CSV rows** — no synthetic data

### Required CSV Format
- Timestamps must appear under a column named exactly: `Timestamp`
- Timestamp format: `"DD/MM/YYYY, HH:MM"` (quoted string, comma-space separator)
- Example: `"28/04/2026, 15:55"`
- All other columns are read dynamically — names and units are preserved as-is

---

## Python Data Workflow

The intended production workflow:

1. **DataTaker DT80W** logs sensor data → produces DBD files (DATA_A.DBD through DATA_D.DBD)
2. **Python FTP script** connects to logger IP → downloads the latest DBD files
3. **`dump_dbd.exe`** converts DBD → CSV files (with the exact column headers expected)
4. Converted CSV files are placed in `artifacts/api-server/data/csv/`
5. Dashboard automatically reflects the new data on next page load

**Future enhancement:** The backend can call the Python script on a schedule (Node.js `setInterval`
or cron job) to auto-refresh CSVs without manual intervention.

---

## Sampling Interval — Current Behavior

The interval selector on the Home page saves the selected interval to:
```
artifacts/api-server/data/logger-settings.json
```

**This is currently a local setting only.** No command is sent to the physical DT80W logger yet.

### Available Intervals
| Label | Code |
|-------|------|
| Every 15 minutes | 15M |
| Every 30 minutes | 30M |
| Every 45 minutes | 45M |
| Every 1 hour | 1H |
| Every 2 hours | 2H |
| Every 3 hours | 3H |
| Every 4 hours | 4H |
| Every 1 day | 1D |

---

## Future: Sending Commands to DT80W

To connect the interval selector to the real logger, implement one of:

### Option 1 — FTP Command Upload
```javascript
const ftp = new FTPClient();
await ftp.connect({ host: process.env.DT80W_IP, user: 'user', password: process.env.DT80W_PASSWORD });
await ftp.uploadFile(generateScheduleProgram(intervalCode), '/schedule.dba');
```

### Option 2 — TCP/DeTransfer Socket Command
```javascript
const socket = net.createConnection(Number(process.env.DT80W_PORT), process.env.DT80W_IP);
socket.write(`BEGIN SCHED "MAIN" ${intervalCode} ...\r\n`);
```

### Option 3 — HTTP API (if DT80W web interface is accessible)
```javascript
await fetch(`http://${process.env.DT80W_IP}/api/schedule`, {
  method: 'POST',
  body: JSON.stringify({ interval: intervalCode })
});
```

---

## Environment Variables Needed (Future)

```env
DT80W_IP=192.168.1.xxx
DT80W_PORT=7700
DT80W_USERNAME=admin
DT80W_PASSWORD=xxxxx
```

---

## Logo Placeholders

```
artifacts/weather-dashboard/public/squ-logo.svg      ← Replace with real SQU logo (PNG or SVG)
artifacts/weather-dashboard/public/company-logo.svg  ← Replace with real iLab Marine logo
```

To use PNG files, add them to the public folder and update `<img src="...">` in:
- `src/pages/Login.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/Sidebar.tsx`

---

## Summary

| Feature | Current State |
|---------|--------------|
| Data source | Local CSV files — replace to update data |
| Data generation | None — app never creates or modifies CSV files |
| Record count | Always matches exact CSV row count |
| Logger interval | Saved locally (JSON) — no hardware command yet |
| DT80W command | Not yet connected |
| Auto data refresh | Not yet — manual CSV replacement for now |
