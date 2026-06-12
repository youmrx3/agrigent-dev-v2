# AGRIGENT — Deep Scan Report & Supabase Schema Design

**Date:** June 6, 2026 | **Stack:** Next.js 16.2.6 / React 19 / TypeScript / Tailwind v4 / Zustand v5 / Recharts
**Size:** 68 scanned files across app/, components/, stores/, services/, data/, lib/

---

## 1. EVERY DATA TYPE IN THE CODEBASE

Below is every TypeScript type/interface, structured into Supabase-ready tables with column names mapped 1:1.

### TABLE 1: `profiles` (stores/dashboard-store.ts:24-30 + data/dashboard-data.ts:62-77)
```typescript
CropProfile = {
  id: string;           // "P-001"
  cropType: string;     // "Wheat" | "Tomatoes"
  growthStage: string;  // "Flowering" | "Fruiting"
  climateZone: string;  // "Semi-arid" | "Mediterranean"
  createdAt: string;    // "2026-05-15"
}
```

### TABLE 2: `sensors` (stores/dashboard-store.ts:14-22 + data/dashboard-data.ts:22-50)
```typescript
Sensor = {
  id: string;          // "SN-A12"
  location: string;    // "North Field"
  moisture: string;    // "68%" (stored as text with %)
  npk: string;         // "45 mg/kg" (stored as text with unit)
  ph: string;          // "6.8"
  temperature: string; // "24°C" (stored as text with °C)
  status: string;      // "Active" | "Warning"
}
```

### TABLE 3: `reading_history` (stores/dashboard-store.ts:32-42 + data/dashboard-data.ts:79-124)
```typescript
ReadingRecord = {
  id: string;            // "R-001"
  timestamp: string;     // "2026-06-06 08:30"
  moisture: number;      // 72
  npk: number;           // 48
  ph: number;            // 6.8
  temperature: number;   // 24
  profileName: string;   // "Wheat - Flowering" (references CropProfile)
  recommendation: string;// "Optimal conditions — no action needed"
  outcome: string | null;// "Healthy growth" | null (farmer's action)
}
```

### TABLE 4: `recommendations` (stores/dashboard-store.ts:44-52 + data/dashboard-data.ts:126-154)
```typescript
RecommendationItem = {
  parameter: string;        // "Soil Moisture"
  value: number;            // 45
  optimalRange: string;     // "60% – 80%"
  unit: string;             // "%"
  status: "within" | "below" | "above";
  deviation: "mild" | "moderate" | "significant" | null;
  correctiveAction: string; // "Initiate irrigation..."
}
```

### TABLE 5: `stats` (stores/dashboard-store.ts:3-7 + data/dashboard-data.ts:1-20)
```typescript
Stat = {
  title: string;       // "Sensors Online"
  value: string;       // "3"
  valueColor?: string; // "text-green-400" (UI-only)
}
```

### TABLE 6: `ai_insights` (stores/dashboard-store.ts:54-58)
```typescript
AIInsight = {
  title: string;       // "Water Stress"
  confidence: string;  // "97%"
  status: string;      // "Critical" | "Stable" | "Positive"
}
```

### TABLE 7: `users` (from auth store) (stores/auth-store.ts:4-9)
```typescript
User = {
  id: string;              // crypto.randomUUID()
  email: string;           // "farmer@agrigent.ai"
  name: string;            // "Adam Farmer"
  role: "admin" | "farmer";
}
```

### TABLE 8: `notifications` (local state in app/dashboard/notifications/page.tsx:7-14)
```typescript
Notification = {
  id: number;
  title: string;       // "Irrigation Cycle Complete"
  message: string;
  time: string;         // "2 min ago"
  type: "success" | "warning" | "info";
  read: boolean;
}
```

---

## 2. ADDITIONAL DATA STRUCTURES (Embedded in Components)

These are *not* in the store/data layer but exist hardcoded in components and could become tables:

### `water_analytics` / `water_readings` (charts/dashboard)
- 7 data points (Mon-Sun) each with `{ day: string, value: number }`

### `crop_zones` / `field_health_scores` (in CropHealthScorePanel.tsx)
```typescript
CropZone = {
  id: string;           // "z1"
  name: string;         // "Field A3"
  crop: string;         // "Winter Wheat"
  area: string;         // "42 ha"
  overallScore: number; // 87
  trend: "up" | "down" | "stable";
  metrics: HealthMetric[];
}

HealthMetric = {
  id: string;           // "ndvi"
  label: string;        // "NDVI Index"
  score: number;        // 91
  delta: number;        // 3.2
  unit: string;         // "" | "%" | "MJ/m²"
  status: "optimal" | "warning" | "critical";
}
```

### `prediction_events` (in AIPredictionTimeline.tsx)
```typescript
PredictionEvent = {
  id: string;
  date: string;
  daysFromNow: number;
  title: string;
  description: string;
  confidence: "high" | "medium" | "low";
  type: "yield" | "pest" | "weather" | "disease" | "opportunity";
  impact: string;
  trend: "up" | "down" | "stable";
  actionRequired: boolean;
}
```

### `irrigation_zones` (in IrrigationEfficiencyMetrics.tsx)
```typescript
IrrigationZone = {
  id: string;
  name: string;
  crop: string;
  scheduledMm: number;
  actualMm: number;
  efficiencyPct: number;
  savingsLiters: number;
  status: "optimal" | "over" | "under";
}

DailyBar = {
  day: string;
  scheduled: number;
  actual: number;
}
```

### `activities` (in activity-feed.tsx)
```typescript
Activity = {
  id: number;
  message: string;
  time: string;
  status: "success" | "warning" | "critical";
}
```

### `settings` (local state in app/dashboard/settings/page.tsx)
```typescript
UserSetting = {
  id: string;
  label: string;
  description: string;
  type: "toggle" | "select";
  value: boolean | string;
  options?: string[];
}
```

### `contact_form` (in app/contact/page.tsx)
```
Fields: name, email, subject, message (no onSubmit — UI only)
```

---

## 3. PROPOSED SUPABASE TABLES (Migration-Ready)

### Core Tables (already in dashboard-report.md scope)

```sql
-- 1. PROFILES (was "crop_profiles")
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  crop_type TEXT NOT NULL,
  growth_stage TEXT NOT NULL,
  climate_zone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. SENSORS
CREATE TABLE sensors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  sensor_code TEXT NOT NULL,          -- "SN-A12"
  location TEXT NOT NULL,             -- "North Field"
  moisture NUMERIC,                   -- 68 (%)
  npk NUMERIC,                        -- 45 (mg/kg)
  ph NUMERIC,                         -- 6.8
  temperature NUMERIC,                -- 24 (°C)
  status TEXT DEFAULT 'Active',       -- "Active" | "Warning" | "Offline"
  last_reading_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. READING_HISTORY
CREATE TABLE reading_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  profile_id UUID REFERENCES profiles(id),
  sensor_id UUID REFERENCES sensors(id),
  moisture NUMERIC NOT NULL,
  npk NUMERIC NOT NULL,
  ph NUMERIC NOT NULL,
  temperature NUMERIC NOT NULL,
  recommendation TEXT,
  outcome TEXT,                        -- farmer action taken
  recorded_at TIMESTAMPTZ DEFAULT now()
);

-- 4. RECOMMENDATIONS
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reading_id UUID REFERENCES reading_history(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  parameter TEXT NOT NULL,             -- "Soil Moisture"
  value NUMERIC NOT NULL,
  optimal_range TEXT NOT NULL,         -- "60% – 80%"
  unit TEXT NOT NULL,                  -- "%"
  status TEXT NOT NULL CHECK (status IN ('within', 'below', 'above')),
  deviation TEXT CHECK (deviation IN ('mild', 'moderate', 'significant')),
  corrective_action TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Extended Tables (for AI module data)

```sql
-- 5. WATER_ANALYTICS (daily water readings)
CREATE TABLE water_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  sensor_id UUID REFERENCES sensors(id),
  day DATE NOT NULL,
  value NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. FIELD_ZONES / CROP_ZONES (for health scores)
CREATE TABLE field_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,                   -- "Field A3"
  crop_type TEXT NOT NULL,              -- "Winter Wheat"
  area_hectares NUMERIC,               -- 42
  overall_score INTEGER,               -- 87
  trend TEXT DEFAULT 'stable' CHECK (trend IN ('up', 'down', 'stable')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. HEALTH_METRICS (per zone metrics like NDVI, stress index)
CREATE TABLE health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id UUID REFERENCES field_zones(id) NOT NULL,
  metric_key TEXT NOT NULL,             -- "ndvi"
  label TEXT NOT NULL,                  -- "NDVI Index"
  score INTEGER NOT NULL,               -- 91
  delta NUMERIC,                        -- 3.2
  unit TEXT DEFAULT '',                 -- "%" | "MJ/m²"
  status TEXT NOT NULL CHECK (status IN ('optimal', 'warning', 'critical')),
  description TEXT,
  recorded_at TIMESTAMPTZ DEFAULT now()
);

-- 8. PREDICTION_EVENTS (AI predictions from timeline)
CREATE TABLE prediction_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  event_date DATE NOT NULL,
  days_from_now INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  confidence TEXT NOT NULL CHECK (confidence IN ('high', 'medium', 'low')),
  event_type TEXT NOT NULL CHECK (event_type IN ('yield', 'pest', 'weather', 'disease', 'opportunity')),
  impact TEXT,
  trend TEXT CHECK (trend IN ('up', 'down', 'stable')),
  action_required BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. IRRIGATION_ZONES (efficiency metrics)
CREATE TABLE irrigation_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  zone_code TEXT NOT NULL,              -- "A3"
  crop TEXT NOT NULL,
  efficiency_pct NUMERIC,
  savings_liters NUMERIC,
  status TEXT CHECK (status IN ('optimal', 'over', 'under')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. IRRIGATION_DAILY (scheduled vs actual per day)
CREATE TABLE irrigation_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id UUID REFERENCES irrigation_zones(id) NOT NULL,
  day DATE NOT NULL,
  scheduled_mm NUMERIC NOT NULL,
  actual_mm NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. NOTIFICATIONS
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('success', 'warning', 'info')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. ACTIVITY_LOG (live feed events)
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'warning', 'critical')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 13. USER_SETTINGS (preferences)
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  email_notifications BOOLEAN DEFAULT true,
  push_alerts BOOLEAN DEFAULT true,
  ai_recommendations BOOLEAN DEFAULT true,
  sensor_status_updates BOOLEAN DEFAULT false,
  compact_dashboard BOOLEAN DEFAULT false,
  time_format TEXT DEFAULT '24h' CHECK (time_format IN ('12h', '24h')),
  two_factor_auth BOOLEAN DEFAULT false,
  session_timeout TEXT DEFAULT '30 min',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 14. CONTACT_MESSAGES (contact form submissions)
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 4. DATA FLOW: CURRENT MOCK → SUPABASE REAL

### Current Flow (Mock):
```
Component (useEffect)
  → Service (dashboard-service.ts: setTimeout 500ms)
    → Data (dashboard-data.ts: hardcoded arrays)
      → Store (dashboard-store.ts: Zustand set())
        → Component (re-render)
```

### Target Flow (Supabase):
```
Component (useEffect or React Query)
  → Supabase Client (createClient from @supabase/supabase-js)
    → .from('table').select('*') queries
      → Store (dashboard-store.ts: Zustand set())
        → Component (re-render)
```

### Auth Flow:
```
Current: useAuthStore → creates mock user with crypto.randomUUID()
Target:  supabase.auth.signInWithPassword() → real session → user table row
```

---

## 5. DEPENDENCY MAP: Which Components Need Which Tables

| Page/Component | Tables Needed |
|---|---|
| `/dashboard` (overview) | `sensors`, `reading_history`, `recommendations`, `water_analytics`, `activity_log` |
| `/dashboard/sensors` | `sensors` |
| `/dashboard/profiles` | `profiles` |
| `/dashboard/readings` | `reading_history`, `profiles` |
| `/dashboard/recommendations` | `recommendations`, `reading_history` |
| `/dashboard/ai-insights` | `prediction_events`, `field_zones`, `health_metrics`, `irrigation_zones`, `irrigation_daily` |
| `/dashboard/notifications` | `notifications` |
| `/dashboard/settings` | `user_settings`, `auth.users` |
| `/login` / `/signup` | `auth.users` (Supabase Auth) |
| `/contact` | `contact_messages` |
| Sidebar status block | `sensors` (count active) |
| Activity feed | `activity_log` |

---

## 6. INDEXES TO CREATE

```sql
CREATE INDEX idx_reading_history_user ON reading_history(user_id, recorded_at DESC);
CREATE INDEX idx_reading_history_profile ON reading_history(profile_id);
CREATE INDEX idx_recommendations_reading ON recommendations(reading_id);
CREATE INDEX idx_recommendations_user ON recommendations(user_id, created_at DESC);
CREATE INDEX idx_sensors_user ON sensors(user_id);
CREATE INDEX idx_profiles_user ON profiles(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_activity_log_user ON activity_log(user_id, created_at DESC);
CREATE INDEX idx_water_analytics_user_day ON water_analytics(user_id, day DESC);
CREATE INDEX idx_health_metrics_zone ON health_metrics(zone_id);
CREATE INDEX idx_prediction_events_user ON prediction_events(user_id, event_date);
CREATE INDEX idx_irrigation_daily_zone ON irrigation_daily(zone_id, day DESC);
```

---

## 7. RLS POLICIES (Row-Level Security)

Every table with `user_id` needs:
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only see their own profiles"
  ON profiles FOR ALL
  USING (auth.uid() = user_id);

-- Repeat for: sensors, reading_history, recommendations,
-- water_analytics, field_zones, health_metrics, prediction_events,
-- irrigation_zones, irrigation_daily, notifications, activity_log,
-- user_settings
```

Tables without `user_id` (public):
- `contact_messages` — insert-only for public, select for admins

---

## 8. SUMMARY: All Data Shapes in the Project

| # | Shape Name | Location | Currently Mock? | Priority for Supabase |
|---|---|---|---|---|
| 1 | `Profile` / `CropProfile` | `dashboard-data.ts:62` + `dashboard-store.ts:24` | ✅ Mock | 🔴 HIGH |
| 2 | `Sensor` | `dashboard-data.ts:22` + `dashboard-store.ts:14` | ✅ Mock | 🔴 HIGH |
| 3 | `ReadingRecord` | `dashboard-data.ts:79` + `dashboard-store.ts:32` | ✅ Mock | 🔴 HIGH |
| 4 | `RecommendationItem` | `dashboard-data.ts:126` + `dashboard-store.ts:44` | ✅ Mock | 🔴 HIGH |
| 5 | `Stat` | `dashboard-data.ts:1` + `dashboard-store.ts:3` | ✅ Mock | 🟡 MED (computed) |
| 6 | `AIInsight` | `dashboard-store.ts:54` | ✅ Mock | 🟡 MED |
| 7 | `User` | `auth-store.ts:4` | ✅ Mock | 🔴 HIGH |
| 8 | `Notification` | `notifications/page.tsx:7` | ✅ Local state | 🟡 MED |
| 9 | `Activity` | `activity-feed.tsx:5` | ✅ Local state | 🟡 MED |
| 10 | `CropZone` / `HealthMetric` | `CropHealthScorePanel.tsx:15,26` | ✅ Hardcoded | 🟡 MED |
| 11 | `PredictionEvent` | `AIPredictionTimeline.tsx:20` | ✅ Hardcoded | 🟢 LOW (Phase 4) |
| 12 | `IrrigationZone` / `DailyBar` | `IrrigationEfficiencyMetrics.tsx:17,28` | ✅ Hardcoded | 🟢 LOW (Phase 4) |
| 13 | `UserSetting` | `settings/page.tsx:7` | ✅ Local state | 🟡 MED |
| 14 | Contact form fields | `contact/page.tsx` | ✅ No store | 🟡 MED |
