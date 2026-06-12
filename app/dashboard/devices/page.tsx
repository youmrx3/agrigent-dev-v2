"use client";
import { Cpu, Radio, Satellite, Network, ArrowRight, Clock } from "lucide-react";

const features = [
  {
    icon: Radio,
    title: "Multi-Device Sync",
    desc: "All your field devices will be synchronized in real-time, providing a unified view of every sensor across your farm.",
  },
  {
    icon: Satellite,
    title: "Live Tracking",
    desc: "Track each device's status, location, and last communication — know exactly when data was collected and reported.",
  },
  {
    icon: Network,
    title: "Centralized Hub",
    desc: "Manage every device from a single dashboard. Add, remove, and configure devices without touching hardware.",
  },
];

export default function DevicesPage() {
  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
          <Cpu size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">Devices</h1>
          <p className="mt-1 text-slate-400">Connected hardware management</p>
        </div>
      </div>

      <div className="mt-10 overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-slate-900/60 p-12 text-center">
        <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-purple-500/20" />
          <div className="absolute inset-2 rounded-full bg-purple-500/30" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400">
            <Clock size={28} />
          </div>
        </div>

        <h2 className="mt-8 text-4xl font-black text-white">Coming Soon</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-400">
          We're building a centralized device management system. Soon you'll be able to connect,
          monitor, and synchronize all your field devices — regardless of how many you have.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className="group rounded-3xl border border-white/10 bg-slate-900/60 p-8 transition hover:-translate-y-1 hover:border-purple-500/20 hover:bg-slate-900"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20">
                <Icon size={26} />
              </div>
              <h3 className="mt-6 text-xl font-bold text-white">{f.title}</h3>
              <p className="mt-4 leading-7 text-slate-400">{f.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-10 rounded-3xl border border-white/10 bg-slate-900/60 p-8">
        <h3 className="text-xl font-bold text-white">What to expect</h3>
        <div className="mt-6 space-y-4">
          {[
            "Automatic device discovery — plug in and it appears in your dashboard",
            "Real-time synchronization across all devices on your account",
            "Per-device history, analytics, and health monitoring",
            "Firmware update management from the cloud",
            "Role-based access for multi-farm operations",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                <ArrowRight size={14} />
              </div>
              <p className="text-slate-300">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
