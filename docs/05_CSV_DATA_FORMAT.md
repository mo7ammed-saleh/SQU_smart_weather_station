# 05 — CSV Data Format

## Golden Rule

CSV files are the single source of truth for all displayed sensor readings.

- Do not generate fake CSV rows.
- Do not simulate sensor values.
- Do not overwrite real CSV files except when replacing them with new DT80W-converted CSV output.
- Keep the same filenames.

## Final CSV Folder

The dashboard reads sensor CSV files only from:

```text
DB/CSV_Files/
```

Required files:

| File | Sensor |
|---|---|
| `AQT560_DATA.CSV` | AQT560 Air Quality |
| `WS500_DATA.CSV` | WS500 Weather Station |
| `SMP10_DATA.CSV` | SMP10 Pyranometer |
| `DR30_DATA.CSV` | DR30 Pyrheliometer |

The backend can also use the environment variable:

```env
CSV_DATA_DIR=DB/CSV_Files
```

Do not use the old CSV folder under `artifacts/api-server/data/`.

## Timestamp Column

Each CSV must contain a timestamp column. The parser detects the timestamp column dynamically where possible.

Supported examples include:

```text
28/04/2026, 15:55
28 Apr 2026, 20:15:00
2026-04-28 16:30:00
```

The timestamp is used for:

- Latest Record.
- Date/range filtering.
- Charts.
- Table sorting.
- Excel export filtering.

## Dynamic Headers

CSV column names are read from the CSV header. The dashboard should not require frontend hardcoding for table columns. If a parameter column is added or removed, the table and chart parameter list should adapt to the CSV headers.

Sensor display names, friendly labels, units, and icons can still be configured in the backend sensor configuration.

## Row Count

The dashboard row count must equal the number of valid data rows in the CSV file, excluding header/title/empty rows.

## Replacing CSV Files With Real Data

To update dashboard data:

1. Run the DT80W/Python conversion workflow.
2. Save or replace the four CSV files inside `DB/CSV_Files/`.
3. Keep exact filenames.
4. Refresh the dashboard.
5. The dashboard reads the new files from disk.

## Python Auto Update Workflow

The dashboard does not read DBD files directly.

Recommended workflow:

1. DT80W logs DBD files.
2. Python connects to DT80W FTP.
3. Python downloads DBD files.
4. Python uses `dump_dbd.exe` to convert DBD to CSV.
5. Python saves CSV files in `DB/CSV_Files/`.
6. Windows Task Scheduler runs the Python updater through a batch file.
7. Dashboard reads the latest CSV files after refresh.

## Last CSV Update Timestamp

Last CSV Update is the file system modified time of the CSV file. It means when the CSV file was last written or replaced, not necessarily the newest sensor timestamp inside the file.

## Last Record Timestamp

Last Record is taken from the final valid timestamp row inside the CSV file. It represents the newest measurement in that file.

## No Data Cases

If a selected date/range has no rows, the dashboard should show a clear message such as:

```text
No data available for the selected period.
```

If Today has no rows, show:

```text
No data available for today.
```
