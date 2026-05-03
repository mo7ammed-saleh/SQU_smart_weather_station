# 13 - Windows Auto-Run Guide

This guide explains how to run the SQU Smart Weather Station Dashboard automatically when Windows starts.

## Purpose

Use Windows Task Scheduler to start the dashboard in the background. After the PC starts, users can open a browser bookmark:

```text
http://localhost:20300
```

## Before Setup

First confirm the app works manually from the project root:

```bash
pnpm.cmd run dev
```

Open:

```text
http://localhost:20300
```

Confirm login works before creating the scheduled task.

## Task Scheduler Setup

1. Open Windows Task Scheduler.
2. Select **Create Task**.
3. On the **General** tab, give it a name such as `SQU Weather Dashboard`.
4. On the **Triggers** tab, add one trigger:
   - **At startup**, or
   - **At log on** if the dashboard should start only after a user signs in.
5. On the **Actions** tab, choose **Start a program**.
6. Set **Program/script** to:

```text
wscript.exe
```

7. Set **Add arguments** to:

```text
"FULL_PATH_TO_PROJECT\scripts\windows\start-dashboard-hidden.vbs"
```

Example:

```text
"C:\Users\mo7d_\Desktop\SQU_smart_weather_station\scripts\windows\start-dashboard-hidden.vbs"
```

8. Set **Start in** to:

```text
FULL_PATH_TO_PROJECT
```

Example:

```text
C:\Users\mo7d_\Desktop\SQU_smart_weather_station
```

9. Save the task.

## How to Test

1. Restart the PC.
2. Wait for Windows startup to finish.
3. Open Chrome or Edge.
4. Go to:

```text
http://localhost:20300
```

The backend API should also respond at:

```text
http://localhost:8080/api/healthz
```

## Troubleshooting

| Problem | Fix |
|---|---|
| Dashboard not opening | Check `logs/dashboard-run.log` in the project root. |
| Port already in use | Run `scripts/windows/stop-dashboard.bat`, then start again. |
| Backend not running | Check whether `http://localhost:8080/api/healthz` responds. |
| Frontend not running | Check whether `http://localhost:20300` opens. |
| `pnpm` not found | Install pnpm with `npm install -g pnpm`, then retry. |
| PowerShell blocks pnpm | Use `pnpm.cmd`; the Windows scripts already do this. |
| Logs are noisy | Normal API request logs are hidden by default. Set `HTTP_LOGS=true` in `.env` only while debugging. |

## Log File

The startup script writes output here:

```text
logs/dashboard-run.log
```

If startup fails, open this file and check the latest error near the bottom.

## Stop the Dashboard

Run:

```text
scripts/windows/stop-dashboard.bat
```

Warning: this script stops local `node.exe` processes whose command line contains this project path.
