"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Leaf,
  Droplets,
  Sun,
  Wind,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";

interface HealthMetric {
  id: string;
  label: string;
  score: number;
  delta: number;
  unit: string;
  icon: React.ReactNode;
  description: string;
  status: "optimal" | "warning" | "critical";
}

interface CropZone {
  id: string;
  name: string;
  crop: string;
  area: string;
  overallScore: number;
  trend: "up" | "down" | "stable";
  metrics: HealthMetric[];
}

const ZONES: CropZone[] = [
  {
    id: "z1",
    name: "Field A3",
    crop: "Winter Wheat",
    area: "42 ha",
    overallScore: 87,
    trend: "up",
    metrics: [
      {
        id: "ndvi",
        label: "NDVI Index",
        score: 91,
        delta: 3.2,
        unit: "",
        icon: <Leaf className="w-4 h-4" />,
        description: "Vegetation density above seasonal norm",
        status: "optimal",
      },
      {
        id: "moisture",
        label: "Soil Moisture",
        score: 78,
        delta: -1.4,
        unit: "%",
        icon: <Droplets className="w-4 h-4" />,
        description: "Approaching lower threshold — monitor daily",
        status: "warning",
      },
      {
        id: "radiation",
        label: "Solar Absorption",
        score: 94,
        delta: 0.8,
        unit: "MJ/m²",
        icon: <Sun className="w-4 h-4" />,
        description: "Canopy interception at peak efficiency",
        status: "optimal",
      },
      {
        id: "stress",
        label: "Stress Index",
        score: 82,
        delta: 5.1,
        unit: "",
        icon: <Wind className="w-4 h-4" />,
        description: "Heat stress reduced after last irrigation",
        status: "optimal",
      },
    ],
  },
  {
    id: "z2",
    name: "Field B2",
    crop: "Maize",
    area: "58 ha",
    overallScore: 63,
    trend: "down",
    metrics: [
      {
        id: "ndvi",
        label: "NDVI Index",
        score: 58,
        delta: -6.1,
        unit: "",
        icon: <Leaf className="w-4 h-4" />,
        description: "Yellowing in mid-field rows detected",
        status: "critical",
      },
      {
        id: "moisture",
        label: "Soil Moisture",
        score: 61,
        delta: -9.3,
        unit: "%",
        icon: <Droplets className="w-4 h-4" />,
        description: "Below optimal — irrigation recommended",
        status: "warning",
      },
      {
        id: "radiation",
        label: "Solar Absorption",
        score: 72,
        delta: -2.0,
        unit: "MJ/m²",
        icon: <Sun className="w-4 h-4" />,
        description: "Reduced canopy coverage affecting uptake",
        status: "warning",
      },
      {
        id: "stress",
        label: "Stress Index",
        score: 55,
        delta: -8.4,
        unit: "",
        icon: <Wind className="w-4 h-4" />,
        description: "High combined heat and drought stress",
        status: "critical",
      },
    ],
  },
  {
    id: "z3",
    name: "Field C1",
    crop: "Canola",
    area: "29 ha",
    overallScore: 76,
    trend: "stable",
    metrics: [
      {
        id: "ndvi",
        label: "NDVI Index",
        score: 80,
        delta: 0.4,
        unit: "",
        icon: <Leaf className="w-4 h-4" />,
        description: "Stable and within optimal range",
        status: "optimal",
      },
      {
        id: "moisture",
        label: "Soil Moisture",
        score: 74,
        delta: 1.1,
        unit: "%",
        icon: <Droplets className="w-4 h-4" />,
        description: "Good soil water retention post-rain",
        status: "optimal",
      },
      {
        id: "radiation",
        label: "Solar Absorption",
        score: 77,
        delta: -0.2,
        unit: "MJ/m²",
        icon: <Sun className="w-4 h-4" />,
        description: "Normal for crop growth stage",
        status: "optimal",
      },
      {
        id: "stress",
        label: "Stress Index",
        score: 71,
        delta: 2.3,
        unit: "",
        icon: <Wind className="w-4 h-4" />,
        description: "Mild wind stress — acceptable levels",
        status: "warning",
      },
    ],
  },
];

const STATUS_STYLES = {
  optimal: "text-emerald-400",
  warning: "text-amber-400",
  critical: "text-red-400",
};

const BAR_STYLES = {
  optimal: "bg-emerald-500",
  warning: "bg-amber-400",
  critical: "bg-red-500",
};

function ScoreRing({ score, size = 64 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color =
    score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#1e293b"
        strokeWidth="5"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        className="transition-all duration-700"
      />
    </svg>
  );
}

function DeltaIndicator({ delta }: { delta: number }) {
  if (delta > 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-[11px] text-emerald-400 font-medium">
        <ArrowUpRight className="w-3 h-3" />+{delta.toFixed(1)}
      </span>
    );
  if (delta < 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-[11px] text-red-400 font-medium">
        <ArrowDownRight className="w-3 h-3" />{delta.toFixed(1)}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-0.5 text-[11px] text-slate-500 font-medium">
      <Minus className="w-3 h-3" />0.0
    </span>
  );
}

function TrendBadge({ trend }: { trend: "up" | "down" | "stable" }) {
  const config = {
    up: { label: "↑ Improving", cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    down: { label: "↓ Declining", cls: "bg-red-500/10 text-red-400 border-red-500/20" },
    stable: { label: "→ Stable", cls: "bg-slate-700 text-slate-400 border-slate-600" },
  };
  const { label, cls } = config[trend];
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${cls}`}>
      {label}
    </span>
  );
}

function MetricBar({ metric }: { metric: HealthMetric }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={`${STATUS_STYLES[metric.status]}`}>{metric.icon}</span>
          <span className="text-[12px] text-slate-300 font-medium">{metric.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <DeltaIndicator delta={metric.delta} />
          <span className="text-[12px] font-bold text-slate-100 tabular-nums w-7 text-right">
            {metric.score}
          </span>
        </div>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${BAR_STYLES[metric.status]}`}
          style={{ width: `${metric.score}%` }}
        />
      </div>
      <p className="text-[11px] text-slate-600 leading-snug">{metric.description}</p>
    </div>
  );
}

export function CropHealthScorePanel() {
  const [activeZone, setActiveZone] = useState(ZONES[0]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            Crop Health
          </span>
        </div>
        <h2 className="text-base font-bold text-slate-100 mt-1">
          Field Health Score Panel
        </h2>

        {/* Zone selector tabs */}
        <div className="flex gap-1.5 mt-3 overflow-x-auto pb-0.5 scrollbar-none">
          {ZONES.map((zone) => {
            const isActive = zone.id === activeZone.id;
            const scoreColor =
              zone.overallScore >= 80
                ? "text-emerald-400"
                : zone.overallScore >= 65
                ? "text-amber-400"
                : "text-red-400";
            return (
              <button
                key={zone.id}
                onClick={() => setActiveZone(zone)}
                className={`shrink-0 flex flex-col items-start px-3 py-2 rounded-xl border text-left transition-all duration-200 ${
                  isActive
                    ? "bg-slate-800 border-slate-600 shadow-sm"
                    : "border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
                }`}
              >
                <span className="text-[11px] font-bold text-slate-200">{zone.name}</span>
                <span className="text-[10px] text-slate-500">{zone.crop}</span>
                <span className={`text-[13px] font-black tabular-nums mt-0.5 ${scoreColor}`}>
                  {zone.overallScore}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Score hero + metrics */}
      <div className="px-5 py-5">
        {/* Zone summary */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <ScoreRing score={activeZone.overallScore} size={72} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[15px] font-black text-slate-100 tabular-nums">
                  {activeZone.overallScore}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-100">{activeZone.name}</p>
              <p className="text-[12px] text-slate-500">{activeZone.crop} · {activeZone.area}</p>
              <div className="mt-1.5">
                <TrendBadge trend={activeZone.trend} />
              </div>
            </div>
          </div>
          <Link href="/dashboard/ai-insights" className="text-[11px] text-emerald-500 hover:text-emerald-400 font-medium flex items-center gap-1 transition-colors">
            Report
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Metric bars */}
        <div className="space-y-4">
          {activeZone.metrics.map((metric) => (
            <MetricBar key={metric.id} metric={metric} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-slate-600">
          Satellite pass · 6h ago · 10m resolution
        </span>
        <Link href="/dashboard/devices" className="text-[11px] text-emerald-500 hover:text-emerald-400 font-medium transition-colors flex items-center gap-1">
          All fields
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
