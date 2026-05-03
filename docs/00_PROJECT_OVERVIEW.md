# 00 — Project Overview

## What is the SQU Smart Weather Station Dashboard?

The SQU Smart Weather Station Dashboard is a full-stack web application for monitoring environmental and air-quality data from the Smart Weather Station at Sultan Qaboos University, developed by iLab Marine.

The dashboard provides:

- A login-protected monitoring interface.
- Four sensor overview cards.
- Detailed pages for every sensor.
- Latest readings, charts, filters, and data tables.
- Excel export for full or filtered data.
- User settings for username/password changes.
- Data logger interval control with DT80W connection testing.

---

## Final Data Workflow

```text
DT80W Data Logger
  ↓ logs sensor data as DBD files
Python FTP Script
  ↓ downloads DBD files
Python + dump_dbd.exe
  ↓ converts DBD to CSV
DB/CSV_Files/
  ↓ dashboard reads real CSV files
Web Dashboard
```

The dashboard does **not** read DBD files directly. The Python updater is responsible for pulling and converting data. The dashboard only reads the final CSV files.

---

## Four Sensors

| Sensor ID | Display Name | Purpose |
|---|---|---|
| `aqt560` | AQT560 Air Quality | Air quality, gases, particulate values, temperature, humidity, pressure |
| `ws500` | WS500 Weather | Weather station values such as wind, rain, pressure, humidity, temperature |
| `smp10` | SMP10 Pyranometer | Solar/global irradiance and body temperature |
| `dr30` | DR30 Pyrheliometer | Direct solar irradiance and body temperature |

---

## CSV Files as Source of Truth

The dashboard reads data only from:

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

Every dashboard row must correspond to a real row in those CSV files.

Rules:

- Do not generate fake rows.
- Do not simulate sensor values.
- Do not overwrite real CSV files except when replacing them with new DT80W-converted CSV output.
- Keep the same filenames.

---

## Python Auto Update

The recommended automatic update method is:

1. Python connects to the DT80W FTP server.
2. Python downloads the DBD files.
3. Python uses `dump_dbd.exe` to convert DBD to CSV.
4. Python writes the four CSV files into `DB/CSV_Files/`.
5. A batch file runs the Python script.
6. Windows Task Scheduler runs the batch file at the required interval.
7. The dashboard reads the updated CSV files after refresh.

---

## DT80W Interval Control

The dashboard includes DT80W direct logger-control support.

Safe default:

```env
DT80_ENABLED=false
DT80_MODE=dry-run
```

When the logger is physically connected and the correct network/port are confirmed:

```env
DT80_ENABLED=true
DT80_MODE=tcp
DT80_IP=192.168.5.50
DT80_PORT=7700
```

Workflow:

1. User selects interval.
2. User tests DT80W connection.
3. If successful, user applies the interval.
4. Backend sends the interval update to the logger.

Never use `DELALLJOBS` for interval changes.

---

## Deployment Options

- Replit Deployment for easiest online hosting.
- Local PC/server for internal network operation.
- VPS/cloud server for production.

GitHub stores source code only. GitHub Pages is not suitable because this project requires an Express backend.
