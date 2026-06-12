import { supabase } from "@/lib/supabase";
import type { PostgrestError } from "@supabase/supabase-js";

function handleError(error: PostgrestError | null, context: string) {
  if (error) {
    console.error(`Supabase error in ${context}:`, error);
    throw new Error(`Failed to load ${context}`);
  }
}

// ---- STATS (computed from aggregate queries) ----

export async function getDashboardStats() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not authenticated");

  const { count: sensorsOnline, error: e1 } = await supabase
    .from("sensors")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: activeProfiles, error: e2 } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: totalReadings, error: e3 } = await supabase
    .from("reading_history")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  handleError(e1, "stats sensors");
  handleError(e2, "stats profiles");
  handleError(e3, "stats readings");

  return [
    { title: "Sensors Online", value: String(sensorsOnline ?? 0), valueColor: "text-green-400" },
    { title: "Active Profiles", value: String(activeProfiles ?? 0), valueColor: "text-cyan-400" },
    { title: "Total Readings", value: String(totalReadings ?? 0) },
    { title: "AI Accuracy", value: "97%" },
  ];
}

// ---- SENSORS ----

export async function getSensorData() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("sensors")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  handleError(error, "sensors");
  return (data ?? []).map((s) => ({
    id: s.sensor_code,
    location: s.location,
    moisture: `${s.moisture ?? 0}%`,
    npk: `${s.npk ?? 0} mg/kg`,
    ph: String(s.ph ?? 0),
    temperature: `${s.temperature ?? 0}°C`,
    status: s.status,
  }));
}

// ---- WATER ANALYTICS ----

export async function getWaterAnalytics() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("water_analytics")
    .select("*")
    .eq("user_id", user.id)
    .order("day", { ascending: true })
    .limit(7);

  handleError(error, "water_analytics");
  return (data ?? []).map((w) => ({
    day: w.day ? new Date(w.day).toLocaleDateString("en-US", { weekday: "short" }) : "",
    value: w.value,
  }));
}

// ---- PROFILES ----

export async function getProfiles() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  handleError(error, "profiles");
  return (data ?? []).map((p) => ({
    id: p.id,
    cropType: p.crop_type,
    growthStage: p.growth_stage,
    climateZone: p.climate_zone,
    createdAt: p.created_at ? new Date(p.created_at).toISOString().split("T")[0] : "",
  }));
}

// ---- READINGS ----

export async function getReadings() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("reading_history")
    .select("*, profiles(crop_type, growth_stage)")
    .eq("user_id", user.id)
    .order("recorded_at", { ascending: false });

  handleError(error, "readings");
  return (data ?? []).map((r) => ({
    id: r.id?.slice(0, 8) ?? "",
    timestamp: r.recorded_at ? new Date(r.recorded_at).toLocaleString() : "",
    moisture: r.moisture,
    npk: r.npk,
    ph: r.ph,
    temperature: r.temperature,
    profileName: r.profiles ? `${r.profiles.crop_type} - ${r.profiles.growth_stage}` : "Unknown",
    recommendation: r.recommendation ?? "",
    outcome: r.outcome ?? null,
  }));
}

// ---- RECOMMENDATIONS ----

export async function getRecommendations() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("recommendations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  handleError(error, "recommendations");
  return (data ?? []).map((r) => ({
    parameter: r.parameter,
    value: r.value,
    optimalRange: r.optimal_range,
    unit: r.unit,
    status: r.status as "within" | "below" | "above",
    deviation: r.deviation as "mild" | "moderate" | "significant" | null,
    correctiveAction: r.corrective_action,
  }));
}

// ---- NOTIFICATIONS ----

export async function getNotifications() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  handleError(error, "notifications");
  return (data ?? []).map((n) => ({
    id: n.id,
    title: n.title,
    message: n.message,
    time: n.created_at ? timeAgo(new Date(n.created_at)) : "",
    type: n.type as "success" | "warning" | "info",
    read: n.is_read ?? false,
  }));
}

export async function markNotificationRead(id: string) {
  const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  if (error) throw new Error(`Failed to mark notification read: ${error.message}`);
}

export async function markAllNotificationsRead(userId: string) {
  const { error } = await supabase.from("notifications").update({ is_read: true }).eq("user_id", userId);
  if (error) throw new Error(`Failed to mark all read: ${error.message}`);
}

export async function dismissNotification(id: string) {
  const { error } = await supabase.from("notifications").delete().eq("id", id);
  if (error) throw new Error(`Failed to dismiss notification: ${error.message}`);
}

// ---- USER SETTINGS ----

export async function getUserSettings() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") handleError(error, "user_settings");
  return data ?? null;
}

export async function updateUserSettings(settings: Record<string, unknown>) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("user_settings").upsert({
    user_id: user.id,
    ...settings,
  });
  if (error) throw new Error(`Failed to update settings: ${error.message}`);
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
