# AGRIGENT — Smart Agriculture Platform

**Version:** 0.1.0 | **Stack:** Next.js 16.2.6 / React 19.2.4 / TypeScript / Tailwind CSS v4 / Supabase / Zustand v5

AI-powered agricultural monitoring and intelligent farming analytics platform for modern agriculture. Combines IoT sensors, machine learning, and data analytics to help farmers optimize irrigation, fertilization, and crop productivity.

---

## 1. PROJECT OVERVIEW

AGRIGENT is a full-stack smart agriculture platform headquartered in **Algiers, Algeria**. It provides:
- Real-time soil sensor monitoring via ESP32 devices
- AI-driven crop health analysis and predictive insights
- Rule-based decision recommendations for irrigation, fertilization, and pH correction
- Land management with interactive maps (Leaflet.js)
- User authentication via Supabase Auth
- Cloud-based dashboards with live data visualization (Recharts)

---

## 2. TECH STACK

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16.2.6 (App Router) |
| **UI Library** | React 19.2.4 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4, tw-animate-css |
| **Animations** | Framer Motion v12 |
| **State Management** | Zustand v5 (persist middleware) |
| **Charts** | Recharts v3 |
| **Maps** | Leaflet v1.9.4 (react-leaflet) |
| **Icons** | Lucide React v1.16 |
| **UI Components** | Radix UI, Shadcn, class-variance-authority, clsx, tailwind-merge |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (email/password) |
| **IoT Hardware** | ESP32 microcontroller, SerialPort (Node.js) |
| **Image Export** | html-to-image |
| **Linting** | ESLint v9, eslint-config-next |
| **Package Manager** | npm |

---

## 3. SITE MAP & ROUTES

### 3.1 Public Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | **Home** (`app/page.tsx`) | Landing page with Hero, Features, StatsStrip, TrustedBy, DashboardPreview, Footer |
| `/about` | **About** | AGRIGENT mission, technology, and team info |
| `/technology` | **Technology** | IoT Sensor Network, AI & ML, Real-Time Analytics, Satellite Integration |
| `/contact` | **Contact** | Contact form (name, email, subject, message) + company details |
| `/partnerships` | **Partnerships** | Partner types: Agricultural Orgs, Research, Technology, Distribution |
| `/privacy` | **Privacy Policy** | Data collection, usage, security, retention, contact |
| `/terms` | **Terms of Service** | Acceptance, service description, user responsibilities, liability |
| `/security` | **Security** | End-to-end encryption, access control, monitoring, infrastructure, SOC 2/GDPR/ISO 27001 |
| `/login` | **Login** | Email/password sign-in with "remember me" and "forgot password" |
| `/signup` | **Sign Up** | Registration with name, email, password + link to Terms/Privacy |

### 3.2 Authenticated Dashboard Routes

| Route | Page | Description |
|-------|------|-------------|
| `/dashboard` | **Farm Monitoring Center** | Live sensor data from ESP32 — 7 metrics (Moisture, Temp, EC, pH, N, P, K), live chart, reading history, bridge control |
| `/dashboard/ai-insights` | **AI & Insights** | Coming Soon — unified AI predictions, smart recommendations, intelligent alerts, predictive analytics |
| `/dashboard/decisions` | **Decisions & Analysis** | Rule-based crop analysis per monitoring session — evaluates parameters against thresholds, generates recommendations and corrective actions |
| `/dashboard/devices` | **Devices** | Coming Soon — multi-device sync, live tracking, centralized hub |
| `/dashboard/notifications` | **Notifications** | System alerts, AI recommendations, farm updates — mark read/dismiss |
| `/dashboard/profiles` | **Land Management** | CRUD for farm lands: name, surface area, crops, location (map picker), growth stage, climate zone, custom characteristics |
| `/dashboard/settings` | **Settings** | Profile, notifications, display, security preferences — toggles + selects |

### 3.3 API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/signup` | POST | Server-side signup using Supabase service_role key (bypasses rate limits) |
| `/api/sensor/live` | GET | Sensor bridge status + latest reading. Actions: `list` (ports), `detect` (auto-detect ESP32), `start`/`stop` (bridge), `connect`, `status` |
| `/api/decision-rules` | GET | Loads `config/decision-rules.json` — parameter thresholds and evaluation rules |

---

## 4. APPLICATION ARCHITECTURE

```
app/
├── api/
│   ├── signup/route.ts           # Server-side signup endpoint
│   ├── sensor/live/route.ts      # ESP32 serial bridge API
│   └── decision-rules/route.ts   # Decision rules config endpoint
├── dashboard/                    # Authenticated dashboard (7 sub-pages)
├── (public pages)                # about, contact, login, signup, etc.
├── layout.tsx                    # Root layout (Geist font, AuthInitializer)
├── globals.css                   # Tailwind + custom CSS variables
└── page.tsx                      # Landing page

components/
├── navbar.tsx, footer.tsx        # Public navigation
├── hero.tsx, features.tsx        # Landing page sections
├── dashboard-sidebar.tsx         # Dashboard navigation (7 links)
├── dashboard-topbar.tsx          # User info, search, logout
├── auth-guard.tsx                # Route protection
├── auth-initializer.tsx          # Session restoration
├── map-picker.tsx / map-preview.tsx  # Leaflet interactive map
├── live-chart.tsx                # Real-time moisture trend (Recharts)
├── land-selector.tsx             # Land selection dropdown
├── modules/ai/                   # AI module components (Phase 4)
│   ├── AIPredictionTimeline.tsx
│   ├── CropHealthScorePanel.tsx
│   └── IrrigationEfficiencyMetrics.tsx
└── (other UI components)         # container, page-header, stat-card, sensor-card, etc.

stores/                           # Zustand state management
├── auth-store.ts                 # Auth state + Supabase session
├── dashboard-store.ts            # Dashboard data + land management + monitoring sessions
└── theme-store.ts                # Dark/light theme

services/
├── dashboard-service.ts          # Supabase queries (stats, sensors, readings, recommendations, notifications, settings)
└── seed-service.ts               # Initial seed data for new users

hooks/
└── useLiveSensor.ts              # Live sensor polling hook

lib/
├── supabase.ts                   # Supabase client configuration
├── serial-reader.ts              # ESP32 serial bridge management (Node.js)
└── utils.ts                      # cn() helper (clsx + tailwind-merge)

scripts/
├── serial-bridge.js              # ESP32 serial bridge process (reads sensor frames, writes to data/latest-sensor.json)
└── list-ports.js                 # List available serial ports

config/
└── decision-rules.json           # Parameter thresholds: moisture, temp, pH, EC, N, P, K

data/
└── latest-sensor.json            # Latest sensor reading from bridge (file-based IPC)

migrations/
├── 001_initial_schema.sql        # Full Supabase schema (14 tables + RLS + indexes)
└── run.js                        # Migration runner script

PlatformIO/Projects/              # ESP32 firmware (PlatformIO project)
```

---

## 5. DATABASE (Supabase PostgreSQL)

**Instance:** `cerjbqhlfcjuivafflrc.supabase.co`

### 5.1 Tables (14 total)

**Core (4):**
- `profiles` — Crop profiles: type, growth stage, climate zone
- `sensors` — Physical sensor devices with latest readings
- `reading_history` — Historical sensor snapshots
- `recommendations` — Rule-based evaluation outputs per parameter

**Analytical (6):**
- `water_analytics` — Daily water consumption data
- `field_zones` — Named field areas with crop assignments
- `health_metrics` — Per-zone scores (NDVI, moisture, stress)
- `prediction_events` — AI forecast events
- `irrigation_zones` — Irrigation sector metadata
- `irrigation_daily` — Scheduled vs actual irrigation

**System (4):**
- `notifications` — System alerts
- `activity_log` — Live feed events
- `user_settings` — User preferences (toggles, time format)
- `contact_messages` — Public contact form submissions

### 5.2 Row-Level Security
All tables have RLS enabled with `auth.uid() = user_id` policies. `contact_messages` allows public INSERT but only authenticated SELECT.

### 5.3 Indexes
12 indexes on foreign keys and `user_id + timestamp DESC` patterns.

---

## 6. KEY FEATURES

### 6.1 IoT Sensor Integration
- ESP32 microcontroller reads: soil moisture, temperature, EC, pH, Nitrogen, Phosphorus, Potassium
- Serial bridge (`scripts/serial-bridge.js`) parses sensor frames at 115200 baud
- Auto-detection of ESP32 USB serial ports (CP210x, CH340, SiLabs)
- Live data polling via `/api/sensor/live` every 3 seconds

### 6.2 Dashboard Metrics (7 parameters)
| Parameter | Unit | Range | Display Color |
|-----------|------|-------|---------------|
| Moisture | % | 0-100 | Cyan |
| Temperature | °C | -10-100 | Orange |
| EC | µS/cm | 0-99999 | Yellow |
| pH | 0-14 | 0-14 | Purple |
| Nitrogen | mg/kg | 0-99999 | Green |
| Phosphorus | mg/kg | 0-99999 | Emerald |
| Potassium | mg/kg | 0-99999 | Lime |

### 6.3 Decision Rules Engine
Configurable JSON rules (`config/decision-rules.json`) evaluate each parameter against thresholds with 4 status levels:
- **good** — Optimal range
- **low** — Below optimal (mild deviation)
- **warning** — Concerning (moderate deviation)
- **critical** — Requires immediate action

Each level provides a specific corrective action recommendation. Overrides can be saved per session in localStorage.

### 6.4 Land Management
- CRUD operations for farm lands
- Interactive map picker (Leaflet) with polygon boundary drawing and map snapshots
- Fields: name, surface area (hectares/m²/acres), crops, address, GPS coordinates, growth stage, climate zone, custom characteristics
- Per-land monitoring session history with reading summaries

### 6.5 Authentication Flow
1. User signs up via `/signup` → `POST /api/signup` (bypasses rate limits using service_role key)
2. Admin creates user in Supabase Auth (auto-confirmed email)
3. Auto-login + `seedInitialData()` populates demo data (2 profiles, 3 sensors, readings, recommendations, notifications, settings)
4. Auth state persisted in localStorage via Zustand middleware

---

## 7. DATA FLOW

```
ESP32 Sensor → Serial Bridge (Node.js)
  → data/latest-sensor.json (file-based IPC)
    → GET /api/sensor/live (Next.js API route)
      → Dashboard page polls every 3 seconds
        → Zustand store updated
          → React re-renders live metrics

Decision Rules Evaluation:
  Monitoring Session (start/stop) → collects readings
    → Decision Rules Engine compares against config/decision-rules.json
      → Generates per-parameter status + corrective actions
        → Displays in Decisions & Analysis page

Supabase Persistence:
  Component → dashboard-service.ts → supabase.from('table').select()
    → Zustand store → Component re-render
```

---

## 8. SCRIPTS

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `next dev --webpack` | Start development server |
| `build` | `next build` | Production build |
| `start` | `next start` | Start production server |
| `lint` | `eslint` | Run ESLint |
| `bridge` | `node scripts/serial-bridge.js` | Start serial bridge (auto-detect port) |
| `bridge:dev` | `node scripts/serial-bridge.js COM5` | Start bridge with specific port |
| `dev:all` | `start cmd /c "npm run bridge:dev" && npm run dev` | Start bridge + dev server |

---

## 9. ENVIRONMENT VARIABLES

```env
NEXT_PUBLIC_SUPABASE_URL=https://cerjbqhlfcjuivafflrc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

---

## 10. CURRENT STATUS & ROADMAP

| Phase | Status | Description |
|-------|--------|-------------|
| **Phase 1** | ✅ Active | Sensor acquisition — ESP32 serial bridge, real-time monitoring, live dashboard |
| **Phase 2** | ✅ Active | Rule-based evaluation — decision rules engine, land management, session tracking |
| **Phase 3** | 🔄 In Progress | AI & Insights hub — unified predictions, health scores, irrigation metrics |
| **Phase 4** | 📅 Planned | AI model integration — Supabase Realtime, predictive analytics, multi-device sync |

**System:** Phase 1 Active — "Sensor acquisition and rule-based evaluation operational."

---

## 11. CONTACT

- **Email:** contact@agrigent.ai / agrigent.tech@gmail.com
- **Phone:** +213 696955909
- **Location:** Algiers, Algeria
- **Privacy:** privacy@agrigent.ai
- **Legal:** legal@agrigent.ai

---

## 12. LICENSE

Private — All rights reserved. © 2026 AGRIGENT.
