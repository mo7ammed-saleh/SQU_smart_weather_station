# 06 — Authentication and Settings

## Overview

The dashboard uses simple JSON file authentication. Credentials are stored in:

```
artifacts/api-server/data/users.json
```

**This is intentionally simple** — it is designed for a single-user local or internal deployment. A future version should use a real database with hashed passwords.

## users.json Structure

```json
{
  "users": [
    {
      "id": 1,
      "username": "admin",
      "password": "admin123",
      "role": "admin",
      "updatedAt": "2026-05-02T00:00:00.000Z"
    }
  ]
}
```

## Login Flow

1. User enters username and password on the Login page
2. Frontend sends `POST /api/auth/login`
3. Backend reads `users.json` and compares credentials
4. If valid: returns user info, frontend stores `session=true` + `userId` + `username` in localStorage
5. If invalid: returns 401 error

## Changing Username

1. User opens Settings page (`/settings`)
2. Enters new username and submits
3. Frontend sends `PUT /api/settings/user` with `{ userId, username }`
4. Backend validates (not empty, not taken) and updates `users.json`
5. Username in localStorage is updated immediately

## Changing Password

1. User opens Settings page
2. Enters current password + new password + confirmation
3. Frontend validates that new and confirm match
4. Frontend sends `PUT /api/settings/user` with `{ userId, currentPassword, newPassword }`
5. Backend validates current password is correct, then updates `users.json`

## After Changing Credentials

- The new username/password takes effect immediately
- On next logout + login, the new credentials must be used

## Future Improvement

This system should be replaced with:
- A real database (PostgreSQL or SQLite)
- Hashed passwords using bcrypt
- JWT or session tokens
- Role-based access control

See `12_DATABASE_PLAN.md` for the full database migration plan.
