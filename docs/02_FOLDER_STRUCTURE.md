# 02 — Folder Structure

```
workspace/
├── artifacts/
│   ├── api-server/                 # Express backend
│   │   ├── src/
│   │   │   ├── app.ts              # Express app setup
│   │   │   ├── index.ts            # Server entry point
│   │   │   ├── routes/
│   │   │   │   ├── index.ts        # Route registry
│   │   │   │   ├── auth.ts         # POST /api/auth/login
│   │   │   │   ├── sensors.ts      # GET /api/sensors/...
│   │   │   │   ├── export.ts       # GET /api/export
│   │   │   │   ├── logger.ts       # GET/POST /api/logger/interval
│   │   │   │   ├── settings.ts     # GET/PUT /api/settings/user
│   │   │   │   └── health.ts       # GET /api/healthz
│   │   │   ├── services/
│   │   │   │   ├── csvService.ts           # CSV reading & filtering
│   │   │   │   ├── excelService.ts         # Excel workbook builder
│   │   │   │   ├── loggerSettingsService.ts # Read/write logger-settings.json
│   │   │   │   └── userSettingsService.ts  # Read/write users.json
│   │   │   ├── config/
│   │   │   │   └── sensors.ts      # Sensor definitions (id, name, file, params)
│   │   │   └── lib/
│   │   │       └── logger.ts       # Pino logger singleton
│   │   └── data/
│   │       ├── users.json          # User credentials (JSON auth)
│   │       ├── logger-settings.json
│   │       └── csv/
│   │           ├── AQT560_DATA.CSV
│   │           ├── WS500_DATA.CSV
│   │           ├── SMP10_DATA.CSV
│   │           └── DR30_DATA.CSV
│   │
│   └── weather-dashboard/          # React + Vite frontend
│       ├── public/
│       │   ├── company-logo.png    # iLab Marine logo
│       │   └── squ-logo.png        # SQU crest logo
│       └── src/
│           ├── App.tsx             # Root router
│           ├── main.tsx            # React entry point
│           ├── index.css           # Global styles + animations
│           ├── lib/
│           │   └── auth.ts         # Zustand auth store
│           ├── pages/
│           │   ├── Login.tsx       # Login page (calls /api/auth/login)
│           │   ├── Home.tsx        # Dashboard home
│           │   ├── SensorPage.tsx  # Sensor detail + chart + table
│           │   ├── Settings.tsx    # User settings page
│           │   └── not-found.tsx   # 404 page
│           └── components/
│               ├── layout/
│               │   ├── AppLayout.tsx   # Main layout wrapper + footer
│               │   ├── Header.tsx      # Top header bar
│               │   └── Sidebar.tsx     # Left navigation sidebar
│               └── ui/                 # shadcn/ui components
│
├── lib/
│   ├── api-spec/               # OpenAPI spec + Orval codegen config
│   │   └── openapi.yaml        # Contract-first API definition
│   └── api-client-react/       # Generated TanStack Query hooks
│
├── docs/                       # Project documentation
├── setup-local.md              # How to run locally on Windows
├── setup-production.md         # How to deploy to production
├── .env.example                # Example environment variables
├── README.md                   # Project overview
└── pnpm-workspace.yaml         # pnpm monorepo config
```
