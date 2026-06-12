"use client";

import { useEffect, useState } from "react";
import { useLiveSensor, PortInfo } from "@/hooks/useLiveSensor";
import {
  Thermometer,
  Droplets,
  FlaskConical,
  Beaker,
  Leaf,
  Plug,
  PlugZap,
  RefreshCw,
} from "lucide-react";

export default function LiveSensorPanel() {
  const { connected, port, reading, loading, error, ports, listPorts, connect } =
    useLiveSensor();
  const [showPortPicker, setShowPortPicker] = useState(false);
  const [availablePorts, setAvailablePorts] = useState<PortInfo[]>([]);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (showPortPicker) {
      listPorts().then(setAvailablePorts);
    }
  }, [showPortPicker, listPorts]);

  async function handleConnect(portPath: string) {
    setConnecting(true);
    await connect(portPath);
    setConnecting(false);
    setShowPortPicker(false);
  }

  const metrics = reading
    ? [
        { icon: Droplets, label: "Moisture", value: `${reading.moisture}%`, color: "text-cyan-400" },
        { icon: Thermometer, label: "Temperature", value: `${reading.temperature}°C`, color: "text-orange-400" },
        { icon: Beaker, label: "EC", value: `${reading.ec} µS/cm`, color: "text-yellow-400" },
        { icon: FlaskConical, label: "pH", value: `${reading.ph}`, color: "text-purple-400" },
        { icon: Leaf, label: "Nitrogen", value: `${reading.nitrogen} mg/kg`, color: "text-green-400" },
        { icon: Leaf, label: "Phosphorus", value: `${reading.phosphorus} mg/kg`, color: "text-emerald-400" },
        { icon: Leaf, label: "Potassium", value: `${reading.potassium} mg/kg`, color: "text-lime-400" },
      ]
    : [];

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Live Sensor Data</h2>
          <p className="mt-2 text-slate-400">
            {connected
              ? `Reading from ${port}`
              : "No sensor connected"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {connected ? (
            <span className="flex items-center gap-2 rounded-2xl bg-green-500/10 px-4 py-2 text-sm text-green-400">
              <PlugZap size={16} />
              Live
            </span>
          ) : (
            <button
              onClick={() => setShowPortPicker(!showPortPicker)}
              className="flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-400 transition hover:border-green-500/30 hover:text-white"
            >
              <Plug size={16} />
              {connecting ? "Connecting..." : "Connect Sensor"}
            </button>
          )}
        </div>
      </div>

      {showPortPicker && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950 p-4">
          <p className="mb-3 text-sm text-slate-400">Select COM port:</p>
          <div className="space-y-2">
            {availablePorts.length === 0 && (
              <p className="text-sm text-slate-500">No serial ports detected.</p>
            )}
            {availablePorts.map((p) => (
              <button
                key={p.path}
                onClick={() => handleConnect(p.path)}
                className="flex w-full items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-left text-sm transition hover:border-green-500/30 hover:bg-green-500/5"
              >
                <span className="font-medium text-white">{p.path}</span>
                <span className="text-slate-400">
                  {p.manufacturer || "Unknown device"}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && !reading && (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-800" />
          ))}
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {reading && metrics.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"
              >
                <div className="flex items-center gap-2">
                  <Icon size={16} className={metric.color} />
                  <span className="text-xs text-slate-500">{metric.label}</span>
                </div>
                <p className={`mt-3 text-2xl font-black ${metric.color}`}>
                  {metric.value}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {!reading && !loading && !error && (
        <div className="mt-12 flex flex-col items-center justify-center py-8 text-center">
          <RefreshCw size={40} className="text-slate-600" />
          <p className="mt-4 text-slate-500">
            {connected
              ? "Waiting for sensor data..."
              : "Connect your ESP32 sensor via USB and select the COM port above."}
          </p>
        </div>
      )}
    </div>
  );
}
