# DT80W Integration & Data Source Guide

## Data Source - CSV Files

The dashboard does not generate sensor data. Readings, charts, tables, and exports come from CSV files written by the DT80W/Python conversion workflow.

Final CSV folder:

```text
DB/CSV_Files/
```

Required files:

```text
AQT560_DATA.CSV
WS500_DATA.CSV
SMP10_DATA.CSV
DR30_DATA.CSV
```

## Python Data Workflow

1. DT80W logs sensor data as DBD files.
2. Python connects to the DT80W by FTP.
3. Python downloads the latest DBD files.
4. `dump_dbd.exe` converts DBD files to CSV.
5. Converted CSV files replace the files in `DB/CSV_Files/`.
6. The dashboard reflects the new data after refresh.

## Sampling Interval and DT80W Control

The Home page Data Logger Sampling Interval panel shows:

- DT80W connection status
- Mode
- Target IP and port
- Last connection test
- Last apply
- Current interval
- New interval selector
- Test DT80W Connection button
- Apply Interval to Logger button

The backend supports:

```text
GET /api/logger/status
GET /api/logger/test-connection
POST /api/logger/interval
```

With the safe default `DT80_ENABLED=false`, interval changes are saved locally only and no hardware command is sent. With `DT80_MODE=dry-run`, interval changes are also local-only.

When `DT80_ENABLED=true`, `DT80_MODE=tcp`, and the configured target has passed a connection test, the backend sends a safe interval update to the DT80W.

## Environment Variables

```env
DT80_ENABLED=false
DT80_MODE=dry-run
DT80_IP=192.168.5.50
DT80_PORT=7700
DT80_TIMEOUT_MS=10000
DT80_JOB_NAME=S_W_STAT
DT80_APPLY_FULL_JOB=false
```

## Safety Rules

- Do not generate fake sensor rows.
- Do not delete logger data.
- Do not delete logger jobs.
- Do not send `DELALLJOBS`, format, clear, or delete commands for interval changes.
- Keep `DT80_APPLY_FULL_JOB=false` unless a full job update has been intentionally tested.

## Summary

| Feature | Current State |
|---|---|
| Data source | CSV files in `DB/CSV_Files/` |
| Data generation | None |
| Record count | Matches CSV rows |
| Logger interval | Saves locally by default; sends TCP interval command only when enabled and tested |
| DT80W command | Supported through safe TCP interval update |
