"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Droplets,
  TrendingDown,
  ChevronRight,
  Zap,
  AlertCircle,
  CheckCircle2,
  BarChart3,
} from "lucide-react";

type PeriodKey = "7d" | "30d" | "90d";

interface IrrigationZone {
  id: string;
  name: string;
  crop: string;
  scheduledMm: number;
  actualMm: number;
  efficiencyPct: number;
  savingsLiters: number;
  status: "optimal" | "over" | "under";
}

interface DailyBar {
  day: string;
  scheduled: number;
  actual: number;
}

const PERIOD_DATA: Record<
  PeriodKey,
  { bars: DailyBar[]; totalSaved: number; avgEfficiency: number; co2Saved: number }
> = {
  "7d": {
    bars: [
      { day: "Mon", scheduled: 22, actual: 16 },
      { day: "Tue", scheduled: 18, actual: 18 },
      { day: "Wed", scheduled: 24, actual: 14 },
      { day: "Thu", scheduled: 20, actual: 20 },
      { day: "Fri", scheduled: 26, actual: 19 },
      { day: "Sat", scheduled: 15, actual: 15 },
      { day: "Sun", scheduled: 12, actual: 9 },
    ],
    totalSaved: 84600,
    avgEfficiency: 82,
    co2Saved: 4.2,
  },
  "30d": {
    bars: [
      { day: "W1", scheduled: 88, actual: 64 },
      { day: "W2", scheduled: 76, actual: 71 },
      { day: "W3", scheduled: 92, actual: 68 },
      { day: "W4", scheduled: 81, actual: 75 },
    ],
    totalSaved: 382000,
    avgEfficiency: 79,
    co2Saved: 19.1,
  },
  "90d": {
    bars: [
      { day: "M1", scheduled: 310, actual: 248 },
      { day: "M2", scheduled: 290, actual: 261 },
      { day: "M3", scheduled: 340, actual: 258 },
    ],
    totalSaved: 1180000,
    avgEfficiency: 81,
    co2Saved: 59.0,
  },
};

const ZONES: IrrigationZone[] = [
  {
    id: "z1",
    name: "A3",
    crop: "Wheat",
    scheduledMm: 22,
    actualMm: 16,
    efficiencyPct: 91,
    savingsLiters: 25200,
    status: "optimal",
  },
  {
    id: "z2",
    name: "B2",
    crop: "Maize",
    scheduledMm: 30,
    actualMm: 38,
    efficiencyPct: 54,
    savingsLiters: -8000,
    status: "over",
  },
  {
    id: "z3",
    name: "C1",
    crop: "Canola",
    scheduledMm: 18,
    actualMm: 11,
    efficiencyPct: 78,
    savingsLiters: 12600,
    status: "under",
  },
  {
    id: "z4",
    name: "D4",
    crop: "Soy",
    scheduledMm: 20,
    actualMm: 19,
    efficiencyPct: 95,
    savingsLiters: 4200,
    status: "optimal",
  },
];

const STATUS_CONFIG = {
  optimal: {
    label: "Optimal",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
    bar: "bg-emerald-500",
  },
  over: {
    label: "Over-irrigated",
    text: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    icon: <AlertCircle className="w-3.5 h-3.5 text-red-400" />,
    bar: "bg-red-500",
  },
  under: {
    label: "Under-irrigated",
    text: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    icon: <AlertCircle className="w-3.5 h-3.5 text-amber-400" />,
    bar: "bg-amber-400",
  },
};

function formatLiters(l: number) {
  const abs = Math.abs(l);
  if (abs >= 1_000_000) return `${(abs / 1_000_000).toFixed(1)}M L`;
  if (abs >= 1_000) return `${Math.round(abs / 1000)}k L`;
  return `${abs} L`;
}

function MiniBarChart({ bars }: { bars: DailyBar[] }) {
  const maxVal = Math.max(...bars.flatMap((b) => [b.scheduled, b.actual]));

  return (
    <div className="relative">
      {/* Y-axis lines */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
        {[100, 50, 0].map((pct) => (
          <div key={pct} className="flex items-center gap-1.5">
            <span className="text-[9px] text-slate-700 w-3 tabular-nums shrink-0">
              {pct === 100 ? maxVal : pct === 50 ? Math.round(maxVal / 2) : 0}
            </span>
            <div className="flex-1 border-t border-slate-800/60" />
          </div>
        ))}
      </div>

      {/* Bars */}
      <div className="flex items-end gap-1 h-[88px] pl-6">
        {bars.map((b) => {
          const schedH = (b.scheduled / maxVal) * 80;
          const actH = (b.actual / maxVal) * 80;
          const saved = b.scheduled - b.actual;
          return (
            <div key={b.day} className="flex-1 flex flex-col items-center gap-0.5 group relative">
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-[10px] whitespace-nowrap shadow-xl">
                  <p className="text-slate-200 font-semibold">{b.day}</p>
                  <p className="text-slate-400">Sched: <span className="text-slate-200">{b.scheduled}mm</span></p>
                  <p className="text-slate-400">Actual: <span className="text-emerald-400">{b.actual}mm</span></p>
                  {saved > 0 && (
                    <p className="text-emerald-400 font-medium">−{saved}mm saved</p>
                  )}
                </div>
              </div>

              <div className="flex items-end gap-0.5 w-full">
                {/* Scheduled bar (ghost) */}
                <div
                  className="flex-1 bg-slate-700/50 rounded-t-sm transition-all duration-500"
                  style={{ height: `${schedH}px` }}
                />
                {/* Actual bar */}
                <div
                  className="flex-1 bg-sky-500/80 rounded-t-sm transition-all duration-500"
                  style={{ height: `${actH}px` }}
                />
              </div>
              <span className="text-[9px] text-slate-600 mt-0.5">{b.day}</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-2 pl-6">
        <span className="flex items-center gap-1 text-[10px] text-slate-500">
          <span className="w-2 h-2 rounded-sm bg-slate-700/80 inline-block" />
          Scheduled
        </span>
        <span className="flex items-center gap-1 text-[10px] text-slate-500">
          <span className="w-2 h-2 rounded-sm bg-sky-500/80 inline-block" />
          Actual
        </span>
      </div>
    </div>
  );
}

function ZoneRow({ zone }: { zone: IrrigationZone }) {
  const st = STATUS_CONFIG[zone.status];
  const saved = zone.savingsLiters;
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-800/60 last:border-0">
      <div className="shrink-0">
        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
          <span className="text-[11px] font-bold text-slate-300">{zone.name}</span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[12px] font-semibold text-slate-200">{zone.crop}</span>
          <span className={`text-[10px] font-semibold ${st.text}`}>
            {zone.efficiencyPct}%
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${st.bar} transition-all duration-700`}
              style={{ width: `${zone.efficiencyPct}%` }}
            />
          </div>
          <span
            className={`text-[10px] font-medium shrink-0 ${
              saved > 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {saved > 0 ? "−" : "+"}
            {formatLiters(saved)}
          </span>
        </div>
      </div>
      <div className={`shrink-0 flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${st.bg} ${st.text}`}>
        {st.icon}
        <span className="hidden sm:inline">{st.label}</span>
      </div>
    </div>
  );
}

export function IrrigationEfficiencyMetrics() {
  const [period, setPeriod] = useState<PeriodKey>("7d");
  const data = PERIOD_DATA[period];
  const effDelta = data.avgEfficiency - 74; // vs baseline

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-800">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                Irrigation AI
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-100 mt-1">
              Efficiency Metrics
            </h2>
          </div>
          <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg shrink-0">
            {(["7d", "30d", "90d"] as PeriodKey[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-all ${
                  period === p
                    ? "bg-slate-700 text-slate-100"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            {
              label: "Avg Efficiency",
              value: `${data.avgEfficiency}%`,
              delta: effDelta,
              icon: <BarChart3 className="w-3.5 h-3.5" />,
              color: "text-sky-400",
            },
            {
              label: "Water Saved",
              value: formatLiters(data.totalSaved),
              delta: 12,
              icon: <Droplets className="w-3.5 h-3.5" />,
              color: "text-emerald-400",
            },
            {
              label: "CO₂ Avoided",
              value: `${data.co2Saved} t`,
              delta: 8,
              icon: <Zap className="w-3.5 h-3.5" />,
              color: "text-violet-400",
            },
          ].map(({ label, value, delta, icon, color }) => (
            <div
              key={label}
              className="bg-slate-800 rounded-xl px-3 py-2.5 flex flex-col gap-1"
            >
              <div className={`flex items-center gap-1 ${color}`}>
                {icon}
                <span className="text-[10px] text-slate-500 font-medium">{label}</span>
              </div>
              <span className="text-sm font-black text-slate-100 tabular-nums leading-none">
                {value}
              </span>
              <span className="flex items-center gap-0.5 text-[10px] text-emerald-400 font-medium">
                <TrendingDown className="w-3 h-3" />
                {delta > 0 ? `+${delta}%` : `${delta}%`} vs prev
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Scheduled vs Actual (mm)
          </span>
          <span className="text-[10px] text-slate-600">Hover bars for detail</span>
        </div>
        <MiniBarChart bars={data.bars} />
      </div>

      {/* Divider */}
      <div className="mx-5 border-t border-slate-800 my-1" />

      {/* Zone breakdown */}
      <div className="px-5 pt-3 pb-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Zone Breakdown
          </span>
          <Link href="/dashboard/devices" className="text-[11px] text-sky-500 hover:text-sky-400 font-medium flex items-center gap-1 transition-colors">
            Manage
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        {ZONES.map((zone) => (
          <ZoneRow key={zone.id} zone={zone} />
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between mt-1">
        <span className="text-[11px] text-slate-600">
          Sensors synced · 12 min ago · 4 active zones
        </span>
        <Link href="/dashboard/analytics" className="text-[11px] text-sky-500 hover:text-sky-400 font-medium transition-colors flex items-center gap-1">
          Full report
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
