# 05 — CSV Data Format

## Golden Rule

**Do not generate fake CSV rows. Do not overwrite real CSV files.**

The CSV files are the single source of truth for all sensor data. Every row displayed in the dashboard must correspond to a real measurement from the physical sensor.

## CSV Files

| File | Sensor |
|------|--------|
| `AQT560_DATA.CSV` | AQT560 Air Quality |
| `WS500_DATA.CSV` | WS500 Weather Station |
| `SMP10_DATA.CSV` | SMP10 Pyranometer |
| `DR30_DATA.CSV` | DR30 Pyrheliometer |

Location: `artifacts/api-server/data/csv/`

## Timestamp Format

The first column of each CSV file is a timestamp in quoted format:

```
"DD/MM/YYYY, HH:MM"
```

Example:
```
"01/10/2024, 06:45",12.3,45.6,...
```

The backend parses this format when filtering by date range.

## Dynamic Headers

CSV column names are read dynamically from the first row of each file. This means:
- You do not need to hardcode column names in the frontend
- The chart and table automatically adapt to whatever columns exist in the CSV
- If a column is added or removed from the CSV, the UI updates automatically

## Row Count

The dashboard displays the exact number of rows present in the CSV file. There is no row cap for the API response (limit = 0 = no limit). The chart downsamples to 500 points client-side for performance, but the table shows all rows.

## Replacing CSV Files With Real Data

To update the dashboard with real data:
1. Export the new CSV from the DataTaker DT80W or the Python conversion script
2. Replace the corresponding `.CSV` file in `artifacts/api-server/data/csv/`
3. Restart the API server (`artifacts/api-server: API Server` workflow)
4. The dashboard will immediately reflect the new data

## Expected Date Range

The current CSV files contain data from approximately October 2024. Any date filter outside this range will return zero rows — this is expected and not an error.
