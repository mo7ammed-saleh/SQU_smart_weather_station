# 08 — DT80W Data Flow

## Final Data Pipeline

```text
DT80W Data Logger
  ↓ records sensor readings as DBD files
Python FTP script
  ↓ downloads DBD files from the logger
Python plus dump_dbd.exe
  ↓ converts DBD files to CSV
DB/CSV_Files/
  ↓ Express API reads the CSV files
Smart Weather Station Dashboard
```

The dashboard does not read DBD files directly. Python is responsible for DBD download and CSV conversion. The dashboard reads only the final CSV files.

## DT80W Logging Program

The DT80W logger records four schedules:

```text
RA"AQT560_DATA"<INTERVAL>
RB"WS500_DATA"<INTERVAL>
RC"SMP10_DATA"<INTERVAL>
RD"DR30_DATA"<INTERVAL>
```

The interval can be 15M, 30M, 45M, 1H, 2H, 3H, 4H, or 1D.

## Python DBD-to-CSV Updater

The Python updater should:

1. Connect to the DT80W FTP server.
2. Download the DBD files.
3. Convert DBD files to CSV using `dump_dbd.exe`.
4. Save or replace the CSV files in `DB/CSV_Files/`.
5. A batch file can run the Python script.
6. Windows Task Scheduler can run the batch file automatically, for example every 30 minutes.
7. Refreshing the dashboard shows the latest CSV data.

Required output files:

```text
AQT560_DATA.CSV
WS500_DATA.CSV
SMP10_DATA.CSV
DR30_DATA.CSV
```

## Dashboard CSV Reading

The Express API reads CSV data from:

```text
DB/CSV_Files/
```

The dashboard uses CSV files for home sensor cards, latest readings, tables, charts, filters, Excel export, Last Record, and Last CSV Update.

CSV files are the source of truth. Do not generate fake rows.

## Last CSV Update vs Last Record

| Field | Meaning |
|---|---|
| Last CSV Update | File modified time. It shows when the CSV file was last written or replaced. |
| Last Record | Newest timestamp inside the CSV file. It shows the newest sensor measurement. |

Use Last CSV Update to confirm the Python pipeline has run. Use Last Record to confirm the sensor is logging new measurements.

## DT80W Direct Interval Control

The dashboard includes direct DT80W interval-control support.

Safe default:

```env
DT80_ENABLED=false
DT80_MODE=dry-run
```

When the logger is physically connected and the command interface is confirmed:

```env
DT80_ENABLED=true
DT80_MODE=tcp
DT80_IP=192.168.5.50
DT80_PORT=7700
```

Workflow:

1. User selects a logging interval.
2. User clicks Test DT80W Connection.
3. If the connection succeeds, user clicks Apply Interval to Logger.
4. Backend sends the interval update to the logger.
5. The selected interval is saved only after a successful apply.

Safety rules:

- Do not delete logger data.
- Do not delete logger jobs.
- Do not enable full job apply unless it is intentionally tested.

## Sensor Status

A future CSV status register can be added to each CSV file. If the CSV includes a status column such as `Sensor Status`, `Status Register`, `Device Status`, or `Status`, the dashboard can use it to show Active, Warning, Error, or Unknown.

If no status column exists, the dashboard can fall back to CSV freshness and data availability.

## Developer Notes

- Keep CSV path as `DB/CSV_Files/`.
- Keep CSV headers dynamic.
- Keep Python updater separate from the dashboard app.
- The dashboard should never create fake sensor rows.
- GitHub Pages is not suitable because Express backend is required.
