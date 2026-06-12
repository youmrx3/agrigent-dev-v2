import { supabase } from "@/lib/supabase";

export async function seedInitialData(userId: string) {
  const { count } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (count && count > 0) return;

  const { data: profiles, error: profilesErr } = await supabase
    .from("profiles")
    .insert([
      { user_id: userId, crop_type: "Wheat", growth_stage: "Flowering", climate_zone: "Semi-arid" },
      { user_id: userId, crop_type: "Tomatoes", growth_stage: "Fruiting", climate_zone: "Mediterranean" },
    ])
    .select();

  if (profilesErr || !profiles) {
    throw new Error(`Seed failed at profiles: ${profilesErr?.message ?? "no data returned"}`);
  }

  const { data: sensors, error: sensorsErr } = await supabase
    .from("sensors")
    .insert([
      { user_id: userId, sensor_code: "SN-A12", location: "North Field", moisture: 68, npk: 45, ph: 6.8, temperature: 24, status: "Active" },
      { user_id: userId, sensor_code: "SN-B44", location: "Greenhouse", moisture: 72, npk: 52, ph: 7.1, temperature: 26, status: "Active" },
      { user_id: userId, sensor_code: "SN-C91", location: "South Farm", moisture: 51, npk: 28, ph: 6.2, temperature: 22, status: "Warning" },
    ])
    .select();

  if (sensorsErr || !sensors) {
    throw new Error(`Seed failed at sensors: ${sensorsErr?.message ?? "no data returned"}`);
  }

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const waterData = days.map((_, i) => ({
    user_id: userId,
    day: new Date(Date.now() - (6 - i) * 86400000).toISOString().split("T")[0],
    value: [10, 15, 60, 30, 80, 85, 100][i],
  }));
  const { error: waterErr } = await supabase.from("water_analytics").insert(waterData);
  if (waterErr) throw new Error(`Seed failed at water_analytics: ${waterErr.message}`);

  const wheatProfile = profiles[0];
  const tomatProfile = profiles[1];
  const sensor1 = sensors[0];
  const sensor2 = sensors[1];

  const { data: readings, error: readingsErr } = await supabase
    .from("reading_history")
    .insert([
      {
        user_id: userId, profile_id: wheatProfile.id, sensor_id: sensor1.id,
        moisture: 72, npk: 48, ph: 6.8, temperature: 24,
        recommendation: "Optimal conditions — no action needed",
        outcome: "Healthy growth",
        recorded_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        user_id: userId, profile_id: tomatProfile.id, sensor_id: sensor2.id,
        moisture: 45, npk: 52, ph: 7.1, temperature: 26,
        recommendation: "Low moisture — irrigate to 70%",
        outcome: null,
        recorded_at: new Date(Date.now() - 7200000).toISOString(),
      },
    ])
    .select();

  if (readingsErr || !readings) {
    throw new Error(`Seed failed at reading_history: ${readingsErr?.message ?? "no data returned"}`);
  }

  const { error: recErr } = await supabase.from("recommendations").insert([
    {
      reading_id: readings[0].id, user_id: userId,
      parameter: "Soil Moisture", value: 45, optimal_range: "60% – 80%", unit: "%",
      status: "below", deviation: "moderate",
      corrective_action: "Initiate irrigation to bring moisture to 70%. Monitor for 2 hours post-irrigation.",
    },
    {
      reading_id: readings[1].id, user_id: userId,
      parameter: "NPK (Nitrogen)", value: 28, optimal_range: "40 – 60 mg/kg", unit: "mg/kg",
      status: "below", deviation: "moderate",
      corrective_action: "Apply nitrogen-rich fertilizer (urea 50 kg/ha). Re-test after 48 hours.",
    },
  ]);
  if (recErr) throw new Error(`Seed failed at recommendations: ${recErr.message}`);

  const { error: notifErr } = await supabase.from("notifications").insert([
    { user_id: userId, title: "Welcome to AGRIGENT", message: "Your farm monitoring system is ready. Start by exploring the dashboard.", type: "success" },
    { user_id: userId, title: "Sensor SN-A12 Active", message: "North Field sensor is online and transmitting data.", type: "info" },
  ]);
  if (notifErr) throw new Error(`Seed failed at notifications: ${notifErr.message}`);

  const { error: settingsErr } = await supabase.from("user_settings").upsert({
    user_id: userId,
    email_notifications: true,
    push_alerts: true,
    ai_recommendations: true,
  });
  if (settingsErr) throw new Error(`Seed failed at user_settings: ${settingsErr.message}`);

  const { error: logErr } = await supabase.from("activity_log").insert([
    { user_id: userId, message: "AGRIGENT platform initialized", status: "success" },
    { user_id: userId, message: "Sensors configured and active", status: "success" },
  ]);
  if (logErr) throw new Error(`Seed failed at activity_log: ${logErr.message}`);
}
