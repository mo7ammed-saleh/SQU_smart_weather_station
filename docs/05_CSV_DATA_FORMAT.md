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
2. Replace the corresponding `.CSV` file in `artifacts/api-server/data/csv/` — keep the exact same filename
3. Restart the API server (`artifacts/api-server: API Server` workflow)
4. Refresh the dashboard — it reads the new rows automatically
5. No fake data is generated at any point

The dashboard row count, latest record, and Last CSV Update are all derived directly from the replaced file. There is no caching layer between the file and the UI.

## Last CSV Update Timestamp

The dashboard displays a **Last CSV Update** timestamp on each sensor card and sensor detail page. This value is the **file system last-modified time** (`mtime`) of the CSV file on disk — it reflects when the file was last written or replaced, not the timestamp of the most recent sensor reading inside the file.

For example, if the CSV was copied to the server at 23:40 on 02 May 2026, the Last CSV Update will show `02 May 2026, 23:40:00` even if the newest row in the file has a reading timestamp of 22:00 that same day.

This is intentional: it tells operators when the data file was last refreshed, which is useful for knowing whether the pipeline (DT80W → FTP → dump_dbd → CSV) has run recently.

If the CSV file is missing or unreadable, the display shows **Not available** and the dashboard does not crash.

## Expected Date Range

The current CSV files contain data from approximately October 2024. Any date filter outside this range will return zero rows — this is expected and not an error.
