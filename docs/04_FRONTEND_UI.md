# 04 — Frontend UI Guide

## Pages

### Login (`/login`)
- White card on animated blue gradient background
- iLab Marine logo at top
- Calls `POST /api/auth/login` — credentials validated against `users.json`
- On success: stores session + userId + username in localStorage, redirects to `/`

### Home (`/`)
- Hero banner with system description and 3 pill badges (4 Active Sensors, Live CSV Data, Excel Export)
- Logger interval selector (15M, 30M, 45M, 1H, 2H, 3H, 4H, 1D)
- Excel export panel (sensor selector + date range + export button)
- Sensor status cards grid (Last Record, Parameters, Records count, Status, View Details button)

### Sensor Page (`/sensors/:id`)
- Loads all data from the sensor's CSV file
- Date/time filter inputs
- Interactive Recharts line chart (downsampled to 500 points for performance)
- Full data table (all rows, paginated or scrollable)
- Column selector for chart
- Export to Excel button

### Settings (`/settings`)
- Shows current username
- Change Username form
- Change Password form (current password required)
- Credentials stored in `data/users.json`

### Not Found
- 404 page for unknown routes

---

## Layout Components

### AppLayout
- Wraps all authenticated pages
- Renders Sidebar + Header + main content area + Footer
- Footer: fixed bottom bar with centered copyright text and "iLab Marine" on right

### Header
- Fixed top bar (blue gradient)
- Left: SQU logo
- Center: "Smart Weather Station" title, live clock, "System Online" indicator
- Right: iLab Marine logo, mobile menu button

### Sidebar
- Fixed left panel (256px wide)
- "Navigation" title header
- Links: Home Dashboard, AQT560, WS500, SMP10, DR30, Settings
- Active link highlighted in blue
- Logout button at the bottom

### Footer
- Fixed bottom bar
- Center: "SQU Smart Weather Station Monitoring System © 2026 | Developed for environmental data monitoring"
- Right: "iLab Marine"

---

## Key Libraries

| Library | Purpose |
|---------|---------|
| React + Vite | UI framework + dev server |
| Wouter | Client-side routing |
| TanStack Query | API data fetching + caching |
| Zustand | Auth state |
| Recharts | Data charts |
| shadcn/ui | UI component library |
| Tailwind CSS | Styling |
| Framer Motion | Page animations |
| date-fns | Date formatting |
| ExcelJS | Excel file generation |
