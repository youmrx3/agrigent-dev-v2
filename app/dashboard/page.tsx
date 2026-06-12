"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useDashboardStore, LiveHistoryPoint } from "@/stores/dashboard-store";
import PageHeader from "@/components/page-header";
import LiveChart from "@/components/live-chart";
import LandSelector from "@/components/land-selector";
import {
  Droplets,
  Thermometer,
  Beaker,
  FlaskConical,
  Leaf,
  Plug,
  PlugZap,
  Clock,
  Activity,
  RefreshCw,
  Play,
  Square,
} from "lucide-react";

const METRICS_CONFIG = [
  { key: "moisture" as const, icon: Droplets, label: "Moisture", unit: "%", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  { key: "temperature" as const, icon: Thermometer, label: "Temperature", unit: "°C", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  { key: "ec" as const, icon: Beaker, label: "EC", unit: "µS/cm", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  { key: "ph" as const, icon: FlaskConical, label: "pH", unit: "", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { key: "nitrogen" as const, icon: Leaf, label: "Nitrogen", unit: "mg/kg", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
  { key: "phosphorus" as const, icon: Leaf, label: "Phosphorus", unit: "mg/kg", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { key: "potassium" as const, icon: Leaf, label: "Potassium", unit: "mg/kg", color: "text-lime-400", bg: "bg-lime-500/10", border: "border-lime-500/20" },
];

type Reading = {
  moisture: number;
  temperature: number;
  ec: number;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  timestamp: string;
};

export default function DashboardPage() {
  const { addReadingHistory, clearReadingHistory, readingHistory, selectedLandId, startMonitoringSession, stopCurrentSession, addLandReading, monitoringSessions } = useDashboardStore();
  const [reading, setReading] = useState<Reading | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [uptime, setUptime] = useState(0);
  const uptimeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [bridgeRunning, setBridgeRunning] = useState(false);
  const [starting, setStarting] = useState(false);

  const activeLandSessions = monitoringSessions.filter((s) => s.landId === selectedLandId);

  const fetchReading = useCallback(async () => {
    try {
      const res = await fetch("/api/sensor/live");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setBridgeRunning(data.bridge_running === true);
      if (data.connected && data.reading) {
        setReading(data.reading);
        setConnected(true);
        setError(null);
        const point: LiveHistoryPoint = {
          time: data.reading.timestamp,
          moisture: data.reading.moisture,
          temperature: data.reading.temperature,
          ec: data.reading.ec,
          ph: data.reading.ph,
          nitrogen: data.reading.nitrogen,
          phosphorus: data.reading.phosphorus,
          potassium: data.reading.potassium,
        };
        addReadingHistory(point);
        addLandReading({
          time: point.time,
          moisture: point.moisture,
          temperature: point.temperature,
          ec: point.ec,
          ph: point.ph,
          nitrogen: point.nitrogen,
          phosphorus: point.phosphorus,
          potassium: point.potassium,
        });
      } else {
        setConnected(false);
        setReading(null);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setConnected(false);
    } finally {
      setInitialLoading(false);
    }
  }, [addReadingHistory, addLandReading]);

  async function handleStartBridge() {
    if (!selectedLandId) {
      setError("Select a land before starting monitoring");
      return;
    }
    startMonitoringSession(selectedLandId);
    setStarting(true);
    setError(null);
    try {
      const res = await fetch("/api/sensor/live?action=start");
      const data = await res.json();
      if (data.success) {
        setBridgeRunning(true);
      } else {
        setError(data.error || "Failed to start bridge");
      }
    } catch {
      setError("Failed to start bridge");
    } finally {
      setStarting(false);
    }
  }

  async function handleStopBridge() {
    stopCurrentSession();
    try {
      await fetch("/api/sensor/live?action=stop");
      setBridgeRunning(false);
      setConnected(false);
      setReading(null);
    } catch {
      setError("Failed to stop bridge");
    }
  }

  useEffect(() => {
    fetchReading();
    const interval = setInterval(fetchReading, 3000);
    return () => clearInterval(interval);
  }, [fetchReading]);

  useEffect(() => {
    if (connected && !uptimeRef.current) {
      uptimeRef.current = setInterval(() => {
        setUptime((prev) => prev + 1);
      }, 1000);
    }
    if (!connected && uptimeRef.current) {
      clearInterval(uptimeRef.current);
      uptimeRef.current = null;
      setUptime(0);
    }
    return () => {
      if (uptimeRef.current) clearInterval(uptimeRef.current);
    };
  }, [connected]);

  function timeAgo(ts: string): string {
    const diff = Date.now() - new Date(ts).getTime();
    const secs = Math.floor(diff / 1000);
    if (secs < 5) return "just now";
    if (secs < 60) return `${secs}s ago`;
    return `${Math.floor(secs / 60)}m ${secs % 60}s ago`;
  }

  function formatUptime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  }

  return (
    <>
      <PageHeader title="Farm Monitoring Center" subtitle="Live soil sensor data from your ESP32 device." />

      <div className="mt-6 rounded-3xl border border-white/10 bg-slate-900/60 p-4">
        <LandSelector />
      </div>

      {error && (
        <div className="mt-6 rounded-3xl border border-red-500/20 bg-red-500/10 px-6 py-4 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="mt-6 rounded-3xl border border-white/10 bg-slate-900/60 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {connected ? (
              <span className="flex items-center gap-2 rounded-2xl bg-green-500/10 px-4 py-2 text-sm font-medium text-green-400">
                <PlugZap size={16} />
                Connected
              </span>
            ) : (
              <span className="flex items-center gap-2 rounded-2xl bg-slate-800 px-4 py-2 text-sm font-medium text-slate-400">
                <Plug size={16} />
                Disconnected
              </span>
            )}

            {reading && (
              <span className="flex items-center gap-2 text-sm text-slate-400">
                <Clock size={14} />
                {timeAgo(reading.timestamp)}
              </span>
            )}

            <span className="flex items-center gap-2 text-sm text-slate-400">
              <Activity size={14} />
              {readingHistory.length} readings
            </span>

            {connected && (
              <span className="text-sm text-slate-500">
                Uptime: {formatUptime(uptime)}
              </span>
            )}

            {activeLandSessions.length > 0 && (
              <span className="text-sm text-slate-500">
                {activeLandSessions.length} session{activeLandSessions.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {bridgeRunning ? (
              <button
                onClick={handleStopBridge}
                className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs text-red-400 transition hover:bg-red-500/20"
              >
                <Square size={14} />
                Stop Bridge
              </button>
            ) : (
              <button
                onClick={handleStartBridge}
                disabled={starting}
                className="flex items-center gap-2 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-2 text-xs text-green-400 transition hover:bg-green-500/20 disabled:opacity-50"
              >
                <Play size={14} />
                {starting ? "Starting..." : "Start Bridge"}
              </button>
            )}
            <button
              onClick={clearReadingHistory}
              className="rounded-2xl border border-white/10 px-4 py-2 text-xs text-slate-400 transition hover:border-red-500/30 hover:text-red-400"
            >
              Clear History
            </button>
            <button
              onClick={fetchReading}
              className="flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-xs text-slate-400 transition hover:border-green-500/30 hover:text-white"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
        {METRICS_CONFIG.map((m) => {
          const Icon = m.icon;
          const value = reading ? reading[m.key] : null;
          const display =
            value !== null
              ? m.key === "ec" || m.key === "nitrogen" || m.key === "phosphorus" || m.key === "potassium"
                ? Math.round(value).toString()
                : value.toFixed(1)
              : "---";

          return (
            <div
              key={m.key}
              className={`rounded-2xl border p-4 ${connected && value !== null ? `${m.border} ${m.bg}` : "border-white/10 bg-slate-900/60"}`}
            >
              <div className="flex items-center gap-2">
                <Icon size={15} className={value !== null ? m.color : "text-slate-600"} />
                <span className="text-xs text-slate-500">{m.label}</span>
              </div>
              <p className={`mt-2 text-2xl font-black ${value !== null ? m.color : "text-slate-600"}`}>
                {display}
                {value !== null && m.unit && (
                  <span className="ml-1 text-sm font-normal text-slate-500">{m.unit}</span>
                )}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Moisture Trend</h2>
              <p className="mt-1 text-sm text-slate-400">Real-time readings from your sensor</p>
            </div>
            <div className="rounded-2xl bg-green-500/10 px-3 py-1 text-xs text-green-400">
              {readingHistory.length > 1 ? `${readingHistory.length} points` : "Collecting..."}
            </div>
          </div>
          <div className="mt-6">
            <LiveChart metric="moisture" />
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Last 10 Readings</h2>
            <div className="rounded-2xl bg-green-500/10 px-3 py-1 text-xs text-green-400">Live</div>
          </div>

          <div className="mt-6 max-h-80 space-y-2 overflow-y-auto">
            {readingHistory.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-500">
                No readings yet. Connect your sensor.
              </p>
            )}

            {[...readingHistory].reverse().slice(0, 10).map((r, i) => {
              const d = new Date(r.time);
              return (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-950/40 px-4 py-3"
                >
                  <div className="text-xs text-slate-500">
                    {d.toLocaleTimeString()}
                  </div>
                  <div className="flex gap-4 text-xs">
                    <span className="text-cyan-400">{r.moisture.toFixed(1)}%</span>
                    <span className="text-orange-400">{r.temperature.toFixed(1)}°C</span>
                    <span className="text-purple-400">{r.ph.toFixed(1)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
          <h2 className="text-lg font-bold text-white">All Parameters</h2>
          <p className="mt-1 text-sm text-slate-400">Current sensor snapshot</p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs text-slate-500">
                  <th className="pb-3 font-medium">Parameter</th>
                  <th className="pb-3 font-medium">Value</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {METRICS_CONFIG.map((m) => {
                  const Icon = m.icon;
                  const value = reading ? reading[m.key] : null;
                  const isNPK = m.key === "nitrogen" || m.key === "phosphorus" || m.key === "potassium";
                  const display =
                    value !== null
                      ? isNPK
                        ? Math.round(value).toString()
                        : value.toFixed(1)
                      : "---";

                  return (
                    <tr key={m.key} className="border-b border-white/5 text-sm">
                      <td className="flex items-center gap-3 py-4">
                        <Icon size={16} className={value !== null ? m.color : "text-slate-600"} />
                        <span className="text-white">{m.label}</span>
                      </td>
                      <td className="py-4 font-medium text-white">
                        {display}
                        {value !== null && m.unit && (
                          <span className="ml-1 text-xs text-slate-500">{m.unit}</span>
                        )}
                      </td>
                      <td className="py-4">
                        {value !== null && connected ? (
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${m.bg} ${m.color}`}>
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-500">
                            Waiting
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
