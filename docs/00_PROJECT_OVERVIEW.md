# 00 — Project Overview

## What is the Smart Weather Station Dashboard?

The Smart Weather Station Dashboard is a full-stack web application built for Sultan Qaboos University (SQU) by iLab Marine. It provides a real-time monitoring interface for environmental and air quality data collected from four sensors deployed at the Smart Weather Station.

## Purpose

- Display sensor readings from four connected weather and environmental sensors
- Allow users to browse historical records, filter by date and time, and view trends as charts
- Export sensor data to Excel files for offline analysis and reporting
- Control the logger sampling interval
- Provide a settings page for user account management

## Four Sensors

| Sensor ID | Display Name | Description |
|-----------|-------------|-------------|
| aqt560 | AQT560 Air Quality | Measures air quality parameters (PM, NOx, O3, etc.) |
| ws500 | WS500 Weather Station | Measures wind speed, wind direction, temperature, humidity |
| smp10 | SMP10 Pyranometer | Measures solar irradiance (global solar radiation) |
| dr30 | DR30 Pyrheliometer | Measures direct solar radiation |

## CSV-Based Data Flow

The dashboard reads data **only** from four CSV files stored in `artifacts/api-server/data/csv/`:
- `AQT560_DATA.CSV`
- `WS500_DATA.CSV`
- `SMP10_DATA.CSV`
- `DR30_DATA.CSV`

These files are the **single source of truth**. No data is generated or simulated. Every row in the dashboard corresponds to a real row in the CSV files.

## Excel Export

Users can export sensor data to `.xlsx` files. Exports can be filtered by date range. Each sensor's data appears in its own sheet when exporting all sensors together.

## Settings Page

Users can change their login username and password from the Settings page. Credentials are stored in `artifacts/api-server/data/users.json`.

## Future DT80W Integration

The DataTaker DT80W data logger stores readings as DBD files. A Python conversion script (to be integrated later) downloads these files via FTP and converts them to CSV. The dashboard is designed to work with these CSV files once they are placed in the data directory. See `08_DT80W_DATA_FLOW.md` for full details.
