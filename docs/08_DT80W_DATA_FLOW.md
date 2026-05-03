# 08 — DT80W Data Flow (Future Integration)

## Current Flow

```
CSV files → API Server → Dashboard
```

The dashboard currently reads pre-existing CSV files. These files were converted manually from the DataTaker DT80W logger.

## Full Intended Flow

```
DT80W Logger
    │  (logs sensor readings every N minutes as .DBD files)
    ▼
FTP Server on DT80W
    │  (Python script downloads .DBD file via FTP)
    ▼
dump_dbd Tool
    │  (converts .DBD binary format to .CSV)
    ▼
CSV files in data/csv/
    │  (API server reads these files)
    ▼
Dashboard
```

## Step-by-Step

1. **DT80W Logger** records environmental sensor readings at the configured interval (e.g., every 15 minutes). Readings are stored internally as `.DBD` (DataTaker Binary Data) files.

2. **Python FTP Script** connects to the DT80W's built-in FTP server and downloads the latest `.DBD` file. This script can be scheduled via Windows Task Scheduler or cron.

3. **dump_dbd Tool** is a command-line utility that converts `.DBD` files to `.CSV` format. It preserves all channel names and timestamps.

4. **CSV File Replacement** — The output CSV is placed in `artifacts/api-server/data/csv/`. The filename must match the expected name (e.g., `AQT560_DATA.CSV`).

5. **Dashboard Auto-refresh** — The API server reads CSV files fresh on each request. Once the CSV is updated, the dashboard reflects the new data on the next page load or data refresh.

## Logger Interval Control

The Settings → Logger Interval control on the Home page currently saves the interval to `data/logger-settings.json`. 

In the future, this can be connected to send a configuration command directly to the DT80W via its TCP command interface:
```
SCHEDULE 1B 1= EVERY 30M
```

## Notes for Developers

- Do not generate or simulate CSV rows
- The timestamp format expected is: `"DD/MM/YYYY, HH:MM"` (quoted)
- If a new sensor is added to the DT80W, a new CSV file and sensor config entry must be added
- See `config/sensors.ts` in the API server to register a new sensor
