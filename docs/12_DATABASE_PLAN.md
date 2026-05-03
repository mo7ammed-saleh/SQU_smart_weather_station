# 12 — Future Database Plan

## Current System

The dashboard currently uses:
- **CSV files** for sensor readings
- **users.json** for authentication
- **logger-settings.json** for interval settings

This is suitable for a single-user, low-traffic internal deployment. For multi-user access, data persistence, and security, a real database is recommended.

## Recommended Database

- **SQLite** — lightweight, file-based, no server required. Good for local/internal use.
- **PostgreSQL** — full relational database. Recommended for production/cloud deployments.

---

## Suggested Tables

### users
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | Primary key, auto-increment |
| username | VARCHAR(100) | Unique |
| password_hash | VARCHAR(255) | bcrypt hash |
| role | VARCHAR(50) | e.g., "admin", "viewer" |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### sensors
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | Primary key |
| sensor_key | VARCHAR(50) | e.g., "aqt560" |
| display_name | VARCHAR(100) | |
| csv_file | VARCHAR(255) | Current CSV filename |
| description | TEXT | |
| active | BOOLEAN | |

### sensor_readings
| Column | Type | Notes |
|--------|------|-------|
| id | BIGINT | Primary key |
| sensor_id | INTEGER | FK → sensors.id |
| timestamp | TIMESTAMP | Parsed from CSV |
| parameter_key | VARCHAR(100) | Column name from CSV |
| parameter_label | VARCHAR(100) | Display name |
| value | FLOAT | Numeric reading |
| unit | VARCHAR(50) | Optional |

### logger_settings
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | Primary key |
| interval_label | VARCHAR(100) | e.g., "Every 30 minutes" |
| interval_code | VARCHAR(20) | e.g., "30M" |
| updated_at | TIMESTAMP | |
| updated_by | INTEGER | FK → users.id |

### export_logs
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | Primary key |
| sensor_key | VARCHAR(50) | Which sensor was exported |
| from_datetime | TIMESTAMP | Filter start (nullable) |
| to_datetime | TIMESTAMP | Filter end (nullable) |
| file_name | VARCHAR(255) | Downloaded filename |
| created_at | TIMESTAMP | |

### system_settings
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER | Primary key |
| setting_key | VARCHAR(100) | Unique key |
| setting_value | TEXT | JSON or plain value |
| updated_at | TIMESTAMP | |

---

## Migration Steps (When Ready)

1. Choose database (SQLite for local, PostgreSQL for production)
2. Install Drizzle ORM or Prisma
3. Create schema from tables above
4. Write a migration script that reads existing CSV files and inserts all rows into `sensor_readings`
5. Replace `userSettingsService.ts` with database-backed auth
6. Replace `loggerSettingsService.ts` with database-backed settings
7. Add bcrypt password hashing to the auth flow
8. Update API endpoints to query the database instead of reading CSV files
