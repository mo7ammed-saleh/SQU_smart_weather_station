# 02 — Folder Structure

Final project structure:

```text
SQU_smart_weather_station/
├── README.md
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── .env.example
├── .gitignore
├── .replit
├── setup-local.md
├── setup-production.md
├── DB/
│   └── CSV_Files/
│       ├── AQT560_DATA.CSV
│       ├── WS500_DATA.CSV
│       ├── SMP10_DATA.CSV
│       └── DR30_DATA.CSV
├── artifacts/
│   ├── api-server/
│   │   ├── src/
│   │   │   ├── app.ts
│   │   │   ├── index.ts
│   │   │   ├── routes/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── sensors.ts
│   │   │   │   ├── export.ts
│   │   │   │   ├── logger.ts
│   │   │   │   ├── settings.ts
│   │   │   │   └── health.ts
│   │   │   ├── services/
│   │   │   │   ├── csvService.ts
│   │   │   │   ├── excelService.ts
│   │   │   │   ├── dt80LoggerService.ts
│   │   │   │   ├── loggerSettingsService.ts
│   │   │   │   └── userSettingsService.ts
│   │   │   ├── config/
│   │   │   │   └── sensors.ts
│   │   │   └── lib/
│   │   │       └── logger.ts
│   │   ├── dt80/
│   │   │   └── job-template.dxc
│   │   ├── data/
│   │   │   ├── users.json
│   │   │   └── logger-settings.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── weather-dashboard/
│       ├── public/
│       │   ├── company-logo.png
│       │   └── squ-logo.png
│       ├── src/
│       ├── package.json
│       └── vite.config.ts
├── lib/
│   ├── api-spec/
│   └── api-client-react/
├── docs/
└── scripts/
```

## Key Rules

- Final CSV source: `DB/CSV_Files/`.
- User credentials: `artifacts/api-server/data/users.json`.
- Logger settings: `artifacts/api-server/data/logger-settings.json`.
- Do not store sensor CSV files under `artifacts/api-server/data/`.
- Do not generate fake CSV rows.
- Keep frontend and backend as separate pnpm workspace packages.
