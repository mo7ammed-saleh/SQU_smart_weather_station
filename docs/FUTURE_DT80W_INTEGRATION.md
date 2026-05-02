# Future DT80W Integration Notes

## Current Architecture

The dashboard currently reads **local CSV files** placed in `artifacts/api-server/data/csv/`.

### CSV File Location
```
artifacts/api-server/data/csv/
├── AQT560_DATA.CSV   ← Replace with real data
├── WS500_DATA.CSV    ← Replace with real data
├── SMP10_DATA.CSV    ← Replace with real data
└── DR30_DATA.CSV     ← Replace with real data
```

### How to Replace with Real Data

1. Place your CSV files (from the Python FTP + dump_dbd.exe workflow) into the above folder.
2. The files must use the **exact column headers** as shown in the sample files.
3. Timestamp format must be: `"DD/MM/YYYY, HH:MM"` (with surrounding quotes in the CSV).
4. Restart the API server workflow.

---

## Python Script Integration

The current workflow:
1. DataTaker DT80W logs data → DBD files (DATA_A.DBD through DATA_D.DBD)
2. Python script connects via FTP → downloads DBD files
3. `dump_dbd.exe` converts DBD → CSV files
4. CSVs placed in `artifacts/api-server/data/csv/`

**Future enhancement:** The backend can call the Python script on a schedule (e.g., cron job or setInterval in Node.js) to auto-refresh the CSV files without manual intervention.

---

## Logger Interval Integration

### Current Behavior
- Interval selection saved to `artifacts/api-server/data/logger-settings.json`
- No command is sent to the physical logger yet

### Future Implementation (`POST /api/logger/interval`)
To connect to the DT80W logger, the endpoint should:

**Option 1 — FTP command upload:**
```javascript
// Upload a new schedule program via FTP to DT80W
const ftp = new FTPClient();
await ftp.connect({ host: DT80W_IP, user: 'user', password: 'pass' });
await ftp.uploadFile(generateScheduleProgram(intervalCode), '/schedule.dba');
```

**Option 2 — TCP/DeTransfer command:**
```javascript
// Send command via TCP socket to DT80W
const socket = net.createConnection(DT80W_PORT, DT80W_IP);
socket.write(`BEGIN SCHED "MAIN" ${intervalCode} ...`);
```

**Option 3 — HTTP API (if DT80W web interface available):**
```javascript
await fetch(`http://${DT80W_IP}/api/schedule`, {
  method: 'POST',
  body: JSON.stringify({ interval: intervalCode })
});
```

---

## Environment Variables to Add (Future)

```env
DT80W_IP=192.168.1.xxx
DT80W_PORT=7700
DT80W_USERNAME=admin
DT80W_PASSWORD=xxxxx
FTP_SCHEDULE_PATH=/schedule.dba
```

---

## Summary

| Feature | Current | Future |
|---------|---------|--------|
| Data source | Local CSV files | Auto-fetched via Python/FTP |
| Logger interval | Saved locally | Sent to DT80W via FTP/TCP |
| Data refresh | Manual file replace | Scheduled auto-refresh |
