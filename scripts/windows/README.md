# Windows Dashboard Scripts

These scripts run the SQU Smart Weather Station Dashboard locally on a Windows PC.

## Files

| File | Purpose |
|---|---|
| `start-dashboard.bat` | Starts the full app with `pnpm.cmd run dev` and writes logs to `logs/dashboard-run.log`. |
| `start-dashboard-hidden.vbs` | Starts `start-dashboard.bat` hidden, useful for Windows Task Scheduler. |
| `stop-dashboard.bat` | Stops Node.js dashboard processes for this project. |

## Start Manually

Double-click:

```text
scripts/windows/start-dashboard.bat
```

Then open:

```text
http://localhost:20300
```

## Start Hidden

Use this file from Windows Task Scheduler:

```text
scripts/windows/start-dashboard-hidden.vbs
```

The app keeps running in the background. Output is written to:

```text
logs/dashboard-run.log
```

## Stop

Run:

```text
scripts/windows/stop-dashboard.bat
```

Warning: this script stops local `node.exe` processes whose command line contains this project path. If needed, review running Node.js processes before using it.
