import Link from "next/link";
import {
  Droplets,
  Thermometer,
  Activity,
  Leaf,
} from "lucide-react";

import Container from "./container";
import SensorCard from "./sensor-card";

export default function DashboardPreview() {
  return (
    <section className="relative py-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-400">
            Real-Time Farm Intelligence
          </div>

          <h2 className="mt-6 text-4xl font-black tracking-tight text-white md:text-6xl">
            Monitor Your Farm in Real Time
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            AGRIGENT provides farmers with advanced monitoring,
            live analytics, and AI-powered agricultural insights.
          </p>
        </div>

        <div className="mt-20 grid gap-6 lg:grid-cols-4">
          <SensorCard
            title="Soil Moisture"
            value="68%"
            status="Optimal"
            icon={Droplets}
          />

          <SensorCard
            title="Temperature"
            value="24°C"
            status="Stable"
            icon={Thermometer}
          />

          <SensorCard
            title="NPK Level"
            value="82%"
            status="Healthy"
            icon={Leaf}
          />

          <SensorCard
            title="System Activity"
            value="99%"
            status="Online"
            icon={Activity}
          />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur-xl lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  Water Consumption Analytics
                </h3>

                <p className="mt-2 text-slate-400">
                  Weekly irrigation performance
                </p>
              </div>

              <div className="rounded-3xl bg-green-500/10 px-4 py-2 text-sm text-green-400">
                Live Data
              </div>
            </div>

            <div className="mt-10 flex h-80 items-end gap-4">
              <div className="h-[40%] flex-1 rounded-t-3xl bg-green-500/40" />
              <div className="h-[65%] flex-1 rounded-t-3xl bg-green-500/50" />
              <div className="h-[50%] flex-1 rounded-t-3xl bg-green-500/60" />
              <div className="h-[80%] flex-1 rounded-t-3xl bg-green-500" />
              <div className="h-[70%] flex-1 rounded-t-3xl bg-green-500/70" />
              <div className="h-[90%] flex-1 rounded-t-3xl bg-green-400" />
              <div className="h-[60%] flex-1 rounded-t-3xl bg-green-500/60" />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-green-500 to-emerald-400 p-8 text-white">
            <p className="text-sm uppercase tracking-[0.2em] text-white/70">
              AI Recommendation
            </p>

            <h3 className="mt-6 text-3xl font-black leading-tight">
              Reduce irrigation by 12% this week
            </h3>

            <p className="mt-6 leading-8 text-white/80">
              Based on environmental conditions and soil moisture
              trends, the system recommends reducing irrigation
              frequency during the next 5 days.
            </p>
<div className="mt-8 space-y-3">
  <div className="flex items-center justify-between rounded-3xl bg-white/10 px-4 py-3">
    <span className="text-sm text-white/80">
      Sensor #A12 Updated
    </span>

    <span className="text-xs text-white/60">
      2 min ago
    </span>
  </div>

  <div className="flex items-center justify-between rounded-3xl bg-white/10 px-4 py-3">
    <span className="text-sm text-white/80">
      Irrigation Reduced
    </span>

    <span className="text-xs text-white/60">
      5 min ago
    </span>
  </div>

  <div className="flex items-center justify-between rounded-3xl bg-white/10 px-4 py-3">
    <span className="text-sm text-white/80">
      AI Analysis Completed
    </span>

    <span className="text-xs text-white/60">
      12 min ago
    </span>
  </div>
</div>
            <Link href="/dashboard/ai-insights" className="mt-10 inline-block rounded-3xl bg-white/20 px-6 py-3 text-sm font-semibold backdrop-blur-xl transition hover:bg-white/30">
              View Insights
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}