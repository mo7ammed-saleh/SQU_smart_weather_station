# 03 — Backend API Reference

Base URL: `/api`

---

## Auth

### POST /api/auth/login

Validate username and password against `data/users.json`.

**Request:**
```json
{ "username": "admin", "password": "admin123" }
```

**Response (200):**
```json
{ "success": true, "user": { "id": 1, "username": "admin", "role": "admin", "updatedAt": "..." } }
```

**Response (401):**
```json
{ "error": "Invalid username or password" }
```

---

## Sensors

### GET /api/sensors

List all configured sensors.

**Response:**
```json
[
  { "id": "aqt560", "displayName": "AQT560 Air Quality", "csvFile": "...", "description": "...", "parameterCount": 12, "color": "..." }
]
```

### GET /api/sensors/summary

Returns summary for all sensors (last record, record count, status).

### GET /api/sensors/:id

Returns metadata for one sensor.

### GET /api/sensors/:id/parameters

Returns column/parameter definitions for a sensor.

### GET /api/sensors/:id/latest

Returns the most recent row of data for a sensor.

### GET /api/sensors/:id/data

Returns all data rows. Optional query params: `from` (ISO datetime), `to` (ISO datetime).

**Example:** `/api/sensors/aqt560/data?from=2024-01-01T00:00&to=2024-12-31T23:59`

---

## Export

### GET /api/export

Download an Excel file (.xlsx) with sensor data.

**Query params:**
- `sensor` — sensor ID or `all`
- `from` — start datetime (optional)
- `to` — end datetime (optional)

**Response:** Excel file download

---

## Logger Interval

### GET /api/logger/interval

Returns the current logger interval setting.

**Response:**
```json
{ "intervalLabel": "Every 30 minutes", "intervalCode": "30M", "updatedAt": "..." }
```

### POST /api/logger/interval

Update the logger interval.

**Request:**
```json
{ "intervalLabel": "Every 1 hour", "intervalCode": "1H" }
```

---

## Settings

### GET /api/settings/user?id=1

Returns public user info (no password).

**Response:**
```json
{ "id": 1, "username": "admin", "role": "admin", "updatedAt": "..." }
```

### PUT /api/settings/user

Update username or password.

**Request (change username):**
```json
{ "userId": 1, "username": "newname" }
```

**Request (change password):**
```json
{ "userId": 1, "currentPassword": "admin123", "newPassword": "newpass456" }
```

**Response (200):**
```json
{ "message": "Settings updated successfully", "user": { "id": 1, "username": "...", ... } }
```

**Response (400):**
```json
{ "error": "Current password is incorrect" }
```

---

## Health

### GET /api/healthz

Returns server health status.
