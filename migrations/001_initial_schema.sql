-- ============================================================
-- AGRIGENT - Initial Schema Migration
-- Run this in Supabase SQL Editor
-- ============================================================

-- 0. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  crop_type TEXT NOT NULL,
  growth_stage TEXT NOT NULL,
  climate_zone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. SENSORS
CREATE TABLE IF NOT EXISTS sensors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  sensor_code TEXT NOT NULL,
  location TEXT NOT NULL,
  moisture NUMERIC,
  npk NUMERIC,
  ph NUMERIC,
  temperature NUMERIC,
  status TEXT DEFAULT 'Active',
  last_reading_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. READING_HISTORY
CREATE TABLE IF NOT EXISTS reading_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  profile_id UUID REFERENCES profiles(id),
  sensor_id UUID REFERENCES sensors(id),
  moisture NUMERIC NOT NULL,
  npk NUMERIC NOT NULL,
  ph NUMERIC NOT NULL,
  temperature NUMERIC NOT NULL,
  recommendation TEXT,
  outcome TEXT,
  recorded_at TIMESTAMPTZ DEFAULT now()
);

-- 4. RECOMMENDATIONS
CREATE TABLE IF NOT EXISTS recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reading_id UUID REFERENCES reading_history(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  parameter TEXT NOT NULL,
  value NUMERIC NOT NULL,
  optimal_range TEXT NOT NULL,
  unit TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('within', 'below', 'above')),
  deviation TEXT CHECK (deviation IN ('mild', 'moderate', 'significant')),
  corrective_action TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. WATER_ANALYTICS
CREATE TABLE IF NOT EXISTS water_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  sensor_id UUID REFERENCES sensors(id),
  day DATE NOT NULL,
  value NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. FIELD_ZONES
CREATE TABLE IF NOT EXISTS field_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  crop_type TEXT NOT NULL,
  area_hectares NUMERIC,
  overall_score INTEGER,
  trend TEXT DEFAULT 'stable' CHECK (trend IN ('up', 'down', 'stable')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. HEALTH_METRICS
CREATE TABLE IF NOT EXISTS health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id UUID REFERENCES field_zones(id) NOT NULL,
  metric_key TEXT NOT NULL,
  label TEXT NOT NULL,
  score INTEGER NOT NULL,
  delta NUMERIC,
  unit TEXT DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('optimal', 'warning', 'critical')),
  description TEXT,
  recorded_at TIMESTAMPTZ DEFAULT now()
);

-- 8. PREDICTION_EVENTS
CREATE TABLE IF NOT EXISTS prediction_events (
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

-- 9. IRRIGATION_ZONES
CREATE TABLE IF NOT EXISTS irrigation_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  zone_code TEXT NOT NULL,
  crop TEXT NOT NULL,
  efficiency_pct NUMERIC,
  savings_liters NUMERIC,
  status TEXT CHECK (status IN ('optimal', 'over', 'under')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. IRRIGATION_DAILY
CREATE TABLE IF NOT EXISTS irrigation_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id UUID REFERENCES irrigation_zones(id) NOT NULL,
  day DATE NOT NULL,
  scheduled_mm NUMERIC NOT NULL,
  actual_mm NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('success', 'warning', 'info')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. ACTIVITY_LOG
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'warning', 'critical')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 13. USER_SETTINGS
CREATE TABLE IF NOT EXISTS user_settings (
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

-- 14. CONTACT_MESSAGES
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_reading_history_user ON reading_history(user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_reading_history_profile ON reading_history(profile_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_reading ON recommendations(reading_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user ON recommendations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sensors_user ON sensors(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_user ON activity_log(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_water_analytics_user_day ON water_analytics(user_id, day DESC);
CREATE INDEX IF NOT EXISTS idx_health_metrics_zone ON health_metrics(zone_id);
CREATE INDEX IF NOT EXISTS idx_prediction_events_user ON prediction_events(user_id, event_date);
CREATE INDEX IF NOT EXISTS idx_irrigation_daily_zone ON irrigation_daily(zone_id, day DESC);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE prediction_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE irrigation_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE irrigation_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see their own data
CREATE POLICY "Users own their profiles"
  ON profiles FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own their sensors"
  ON sensors FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own their reading_history"
  ON reading_history FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own their recommendations"
  ON recommendations FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own their water_analytics"
  ON water_analytics FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own their field_zones"
  ON field_zones FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own their prediction_events"
  ON prediction_events FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own their irrigation_zones"
  ON irrigation_zones FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own their notifications"
  ON notifications FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own their activity_log"
  ON activity_log FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own their user_settings"
  ON user_settings FOR ALL USING (auth.uid() = user_id);

-- Contact messages: anyone can insert, only authenticated users can read
CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Only authenticated users can view contact messages"
  ON contact_messages FOR SELECT USING (auth.role() = 'authenticated');

-- (Seed data will be inserted through the app after user signup)
