"use client";
import { useDashboardStore } from "@/stores/dashboard-store";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";


export default function WaterChart() {
    const { waterAnalytics } =
  useDashboardStore();
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={waterAnalytics}>
          <defs>
            <linearGradient
              id="colorWater"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#22c55e"
                stopOpacity={0.8}
              />

              <stop
                offset="95%"
                stopColor="#22c55e"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="day"
            tick={{ fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
  contentStyle={{
    background: "#0B1120",
    border:
      "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    color: "#fff",
  }}
/>

          <Area
          isAnimationActive
            type="monotone"
            dataKey="value"
            stroke="#22c55e"
            fillOpacity={1}
            fill="url(#colorWater)"
            strokeWidth={4}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}