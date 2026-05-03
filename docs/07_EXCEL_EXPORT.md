# 07 — Excel Export

## Overview

The dashboard can export sensor data to `.xlsx` Excel files using ExcelJS on the backend.

## Single Sensor Export

1. User selects one sensor from the export panel on the Home page
2. (Optional) Sets a date/time range
3. Clicks "Export to Excel"
4. Browser downloads a `.xlsx` file named `{SENSOR_ID}_data.xlsx`
5. The file contains one sheet with all matching rows

## All Sensors Export

1. User selects "All Sensors" from the sensor dropdown
2. (Optional) Sets a date/time range
3. Clicks "Export to Excel"
4. Browser downloads `all_sensors_data.xlsx`
5. The file contains one sheet per sensor (4 sheets total)

## Date/Time Filtering

- If no dates are set: all rows from the CSV are exported
- If only `from` is set: exports rows from that date onward
- If only `to` is set: exports rows up to that date
- If both are set: exports only rows within the range

## Excel File Structure

Each sheet includes:
- Header row with column names from the CSV
- One data row per CSV row matching the filter
- Timestamp in the first column

## API Endpoint

```
GET /api/export?sensor=aqt560&from=2024-01-01T00:00&to=2024-12-31T23:59
GET /api/export?sensor=all
```

Response: Binary `.xlsx` file with `Content-Disposition: attachment` header.

## Important

- Exports only real CSV data — no fake rows are added
- Row count in the Excel file will always match the filtered CSV row count
