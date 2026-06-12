"use client";

import { useEffect, useState } from "react";
import { Bell, Globe, Shield, User, Loader2 } from "lucide-react";
import PageHeader from "@/components/page-header";
import { getUserSettings, updateUserSettings } from "@/services/dashboard-service";

type SettingSection = {
  id: string;
  title: string;
  icon: React.ReactNode;
  settings: {
    id: string;
    label: string;
    description: string;
    type: "toggle" | "select";
    value: boolean | string;
    options?: string[];
  }[];
};

const defaultSections: SettingSection[] = [
  {
    id: "profile",
    title: "Profile",
    icon: <User size={20} />,
    settings: [
      {
        id: "email_notifications",
        label: "Email Notifications",
        description: "Receive daily farm summary and alerts via email",
        type: "toggle",
        value: true,
      },
    ],
  },
  {
    id: "notifications",
    title: "Notifications",
    icon: <Bell size={20} />,
    settings: [
      {
        id: "push_alerts",
        label: "Push Alerts",
        description: "Receive push notifications for critical alerts",
        type: "toggle",
        value: true,
      },
      {
        id: "ai_recommendations",
        label: "AI Recommendations",
        description: "Get notified when AI generates new recommendations",
        type: "toggle",
        value: true,
      },
      {
        id: "sensor_status",
        label: "Sensor Status Updates",
        description: "Alerts when sensors go offline or change status",
        type: "toggle",
        value: false,
      },
    ],
  },
  {
    id: "display",
    title: "Display",
    icon: <Globe size={20} />,
    settings: [
      {
        id: "compact_view",
        label: "Compact Dashboard",
        description: "Show more data with reduced spacing",
        type: "toggle",
        value: false,
      },
      {
        id: "time_format",
        label: "Time Format",
        description: "Choose between 12h and 24h time display",
        type: "select",
        value: "24h",
        options: ["12h", "24h"],
      },
    ],
  },
  {
    id: "security",
    title: "Security",
    icon: <Shield size={20} />,
    settings: [
      {
        id: "two_factor",
        label: "Two-Factor Authentication",
        description: "Add an extra layer of security to your account",
        type: "toggle",
        value: false,
      },
      {
        id: "session",
        label: "Session Timeout",
        description: "Automatically log out after period of inactivity",
        type: "select",
        value: "30 min",
        options: ["15 min", "30 min", "1 hour", "Never"],
      },
    ],
  },
];

export default function SettingsPage() {
  const [sections, setSections] = useState<SettingSection[]>(defaultSections);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const settings = await getUserSettings();
        if (settings) {
          setSections((prev) =>
            prev.map((section) => ({
              ...section,
              settings: section.settings.map((s) => ({
                ...s,
                value: settings[s.id] ?? s.value,
              })),
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggleSetting = (sectionId: string, settingId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              settings: section.settings.map((s) =>
                s.id === settingId && s.type === "toggle"
                  ? { ...s, value: !s.value }
                  : s
              ),
            }
          : section
      )
    );
  };

  const updateSelect = (sectionId: string, settingId: string, value: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              settings: section.settings.map((s) =>
                s.id === settingId && s.type === "select"
                  ? { ...s, value }
                  : s
              ),
            }
          : section
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const flat: Record<string, unknown> = {};
      for (const section of sections) {
        for (const setting of section.settings) {
          flat[setting.id] = setting.value;
        }
      }
      await updateUserSettings(flat);
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Settings" subtitle="Manage your account, notifications, and preferences." />
        <div className="mt-10 flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-slate-400" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account, notifications, and preferences." />

      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <div key={section.id} className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
                {section.icon}
              </div>
              <h2 className="text-xl font-bold text-white">{section.title}</h2>
            </div>

            <div className="mt-8 space-y-6">
              {section.settings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-950/40 px-6 py-4">
                  <div>
                    <h3 className="font-medium text-white">{setting.label}</h3>
                    <p className="mt-1 text-sm text-slate-400">{setting.description}</p>
                  </div>

                  <div className="shrink-0">
                    {setting.type === "toggle" && (
                      <button
                        onClick={() => toggleSetting(section.id, setting.id)}
                        className={`relative h-7 w-12 rounded-full transition ${setting.value ? "bg-green-500" : "bg-slate-700"}`}
                        aria-label={`Toggle ${setting.label}`}
                      >
                        <div className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition ${setting.value ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    )}

                    {setting.type === "select" && setting.options && (
                      <select
                        value={setting.value as string}
                        onChange={(e) => updateSelect(section.id, setting.id, e.target.value)}
                        className="rounded-xl border border-white/10 bg-slate-800 px-4 py-2 text-sm text-white outline-none"
                        aria-label={setting.label}
                      >
                        {setting.options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-green-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-green-400 disabled:opacity-50"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
