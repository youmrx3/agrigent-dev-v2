"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";

type Confidence = "high" | "medium" | "low";
type EventType = "yield" | "pest" | "weather" | "disease" | "opportunity";
type TrendType = "up" | "down" | "stable";

interface PredictionEvent {
  id: string;
  date: string;
  daysFromNow: number;
  title: string;
  description: string;
  confidence: Confidence;
  type: EventType;
  impact: string;
  trend: TrendType;
  actionRequired: boolean;
}

const PREDICTIONS: PredictionEvent[] = [
  {
    id: "p1",
    date: "May 22",
    daysFromNow: 3,
    title: "Aphid Pressure Surge",
    description:
      "Rising humidity and temperature forecast triggers high probability of aphid colonization in wheat sectors A3–A6.",
    confidence: "high",
    type: "pest",
    impact: "−8% yield if untreated",
    trend: "down",
    actionRequired: true,
  },
  {
    id: "p2",
    date: "May 26",
    daysFromNow: 7,
    title: "Optimal Irrigation Window",
    description:
      "Soil moisture models project ideal recharge conditions. Scheduling now reduces water usage by up to 23%.",
    confidence: "high",
    type: "opportunity",
    impact: "−23% water spend",
    trend: "up",
    actionRequired: false,
  },
  {
    id: "p3",
    date: "Jun 2",
    daysFromNow: 14,
    title: "Nitrogen Deficiency Risk",
    description:
      "Spectral index trends in field B2 suggest early-stage nitrogen stress. Pre-emptive topdressing recommended.",
    confidence: "medium",
    type: "disease",
    impact: "−5% protein content",
    trend: "down",
    actionRequired: true,
  },
  {
    id: "p4",
    date: "Jun 9",
    daysFromNow: 21,
    title: "Corn Yield Peak Estimate",
    description:
      "Accumulated GDD and canopy closure data align with a 6.2 t/ha yield projection — 4% above regional average.",
    confidence: "medium",
    type: "yield",
    impact: "+4% vs benchmark",
    trend: "up",
    actionRequired: false,
  },
  {
    id: "p5",
    date: "Jun 18",
    daysFromNow: 30,
    title: "Late Blight Weather Pattern",
    description:
      "30-day ensemble forecast shows 72h sustained humidity above 85%. Fungicide program pre-positioning advised.",
    confidence: "low",
    type: "weather",
    impact: "Risk: moderate",
    trend: "stable",
    actionRequired: false,
  },
];

const CONFIDENCE_CONFIG: Record<
  Confidence,
  { label: string; bar: string; text: string; width: string }
> = {
  high: {
    label: "High",
    bar: "bg-emerald-500",
    text: "text-emerald-400",
    width: "w-[88%]",
  },
  medium: {
    label: "Medium",
    bar: "bg-amber-400",
    text: "text-amber-400",
    width: "w-[62%]",
  },
  low: {
    label: "Low",
    bar: "bg-slate-500",
    text: "text-slate-400",
    width: "w-[38%]",
  },
};

const TYPE_CONFIG: Record<
  EventType,
  { icon: React.ReactNode; dot: string; bg: string }
> = {
  pest: {
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    dot: "bg-red-500",
    bg: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  opportunity: {
    icon: <Zap className="w-3.5 h-3.5" />,
    dot: "bg-emerald-500",
    bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  disease: {
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    dot: "bg-orange-500",
    bg: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
  yield: {
    icon: <TrendingUp className="w-3.5 h-3.5" />,
    dot: "bg-sky-500",
    bg: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  },
  weather: {
    icon: <Clock className="w-3.5 h-3.5" />,
    dot: "bg-violet-500",
    bg: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  },
};

function TrendIcon({ trend }: { trend: TrendType }) {
  if (trend === "up")
    return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
  if (trend === "down")
    return <TrendingDown className="w-3.5 h-3.5 text-red-400" />;
  return <Minus className="w-3.5 h-3.5 text-slate-400" />;
}

function PredictionRow({
  event,
  isLast,
}: {
  event: PredictionEvent;
  isLast: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const conf = CONFIDENCE_CONFIG[event.confidence];
  const type = TYPE_CONFIG[event.type];

  return (
    <div className="relative flex gap-4">
      {/* Timeline spine */}
      <div className="flex flex-col items-center">
        <div
          className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ring-2 ring-offset-2 ring-offset-slate-900 ${type.dot} ring-transparent`}
        />
        {!isLast && <div className="w-px flex-1 mt-1 bg-slate-800 min-h-[32px]" />}
      </div>

      {/* Content */}
      <div className="pb-5 flex-1 min-w-0">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left group"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-medium text-slate-500 tabular-nums">
                  {event.date}
                </span>
                <span className="text-[10px] text-slate-600">·</span>
                <span className="text-[11px] text-slate-500">
                  {event.daysFromNow}d
                </span>
                {event.actionRequired && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/20 font-medium leading-none">
                    Action needed
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-slate-100 mt-0.5 leading-snug">
                {event.title}
              </p>
            </div>
            <ChevronRight
              className={`w-4 h-4 text-slate-600 shrink-0 mt-1 transition-transform duration-200 group-hover:text-slate-400 ${
                expanded ? "rotate-90" : ""
              }`}
            />
          </div>

          {/* Confidence bar */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${conf.bar} ${conf.width} transition-all duration-300`}
              />
            </div>
            <span className={`text-[11px] font-medium ${conf.text} shrink-0`}>
              {conf.label} confidence
            </span>
          </div>
        </button>

        {/* Expanded detail */}
        {expanded && (
          <div className="mt-3 pl-0">
            <p className="text-[13px] text-slate-400 leading-relaxed">
              {event.description}
            </p>
            <div className="mt-3 flex items-center gap-3 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded border font-medium ${type.bg}`}
              >
                {type.icon}
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                <TrendIcon trend={event.trend} />
                {event.impact}
              </span>
              {event.actionRequired && (
                <button className="ml-auto text-[11px] px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors">
                  Create Task →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AIPredictionTimeline() {
  const [filter, setFilter] = useState<"all" | "action">("all");

  const filtered =
    filter === "action"
      ? PREDICTIONS.filter((p) => p.actionRequired)
      : PREDICTIONS;

  const actionCount = PREDICTIONS.filter((p) => p.actionRequired).length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-800">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                AI Predictions
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-100 mt-1">
              30-Day Forecast Timeline
            </h2>
          </div>
          <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg shrink-0">
            {(["all", "action"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-all ${
                  filter === f
                    ? "bg-slate-700 text-slate-100"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {f === "all" ? "All" : `Actions (${actionCount})`}
              </button>
            ))}
          </div>
        </div>

        {/* Summary chips */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {[
            { label: "5 predictions", icon: <CheckCircle2 className="w-3 h-3" /> },
            { label: `${actionCount} urgent`, icon: <AlertTriangle className="w-3 h-3 text-red-400" /> },
            { label: "AI model v3.2", icon: <Zap className="w-3 h-3 text-sky-400" /> },
          ].map(({ label, icon }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 px-2 py-0.5 bg-slate-800 rounded-full border border-slate-700"
            >
              {icon}
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="px-5 pt-5">
        {filtered.map((event, i) => (
          <PredictionRow
            key={event.id}
            event={event}
            isLast={i === filtered.length - 1}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-slate-600 text-center py-8">
            No action-required predictions in this window.
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-slate-600">
          Updated 4 min ago · Ensemble model
        </span>
        <Link href="/dashboard/ai-insights" className="text-[11px] text-emerald-500 hover:text-emerald-400 font-medium transition-colors flex items-center gap-1">
          Full forecast
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
