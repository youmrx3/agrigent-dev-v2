"use client";

import { useMemo } from "react";
import { useDashboardStore, LiveHistoryPoint } from "@/stores/dashboard-store";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const COLORS = {
  moisture: "#22d3ee",
  temperature: "#fb923c",
};

type ChartType = "moisture" | "temperature";

export default function LiveChart({ metric = "moisture" }: { metric?: ChartType }) {
  const { readingHistory } = useDashboardStore();

  const data = useMemo(() => {
    if (readingHistory.length < 2) return readingHistory;
    return readingHistory.filter((_, i) => i % 2 === 0 || i === readingHistory.length - 1);
  }, [readingHistory]);

  if (data.length < 2) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/60">
        <p className="text-sm text-slate-500">Collecting data for chart...</p>
      </div>
    );
  }

  const key = metric;
  const color = COLORS[metric];
  const label = metric === "moisture" ? "Moisture (%)" : "Temperature (°C)";

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`color${metric}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />

          <XAxis
            dataKey="time"
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => {
              const d = new Date(val);
              return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
            }}
          />

          <YAxis
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            domain={["auto", "auto"]}
            width={50}
          />

          <Tooltip
            contentStyle={{
              background: "#0B1120",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "13px",
            }}
            labelFormatter={(val) => {
              const d = new Date(val);
              return d.toLocaleTimeString();
            }}
            formatter={(value) => [
              `${Number(value).toFixed(1)}${metric === "moisture" ? "%" : "°C"}`,
              label,
            ]}
          />

          <Area
            type="monotone"
            dataKey={key}
            stroke={color}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#color${metric})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
