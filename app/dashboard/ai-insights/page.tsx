"use client";

import { Sparkles, BrainCircuit, LineChart, BellRing, ArrowRight } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: BrainCircuit,
    title: "AI-Powered Predictions",
    description:
      "Machine learning models will forecast crop yields, detect diseases early, and predict optimal harvest windows based on historical and real-time data.",
  },
  {
    icon: LineChart,
    title: "Smart Recommendations",
    description:
      "Rule-based and AI-driven corrective actions for soil nutrients, irrigation scheduling, pH balancing, and pest management tailored to your crops.",
  },
  {
    icon: BellRing,
    title: "Intelligent Alerts",
    description:
      "Proactive notifications for water stress, fungal risks, nutrient deficiencies, and weather anomalies — before they impact your yield.",
  },
  {
    icon: Sparkles,
    title: "Predictive Analytics",
    description:
      "30-day forecast timelines, crop health scoring across field zones, and irrigation efficiency metrics with scheduled vs actual comparisons.",
  },
];

export default function AIInsightsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-green-400">
            AGRIGENT Dashboard
          </p>

          <h1 className="mt-2 text-5xl font-black">
            AI & Insights
          </h1>

          <p className="mt-4 text-slate-400">
            AI-powered agricultural analysis and smart recommendations.
          </p>
        </div>
      </div>

      <div className="relative mt-12 overflow-hidden rounded-3xl border border-green-500/20 bg-gradient-to-br from-green-500/5 via-slate-900 to-slate-950 p-12">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-green-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative">
          <span className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-5 py-2 text-sm font-semibold text-green-400">
            Coming Soon
          </span>

          <h2 className="mt-6 text-4xl font-black text-white">
            Unified AI & Recommendations Hub
          </h2>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            We&apos;re merging AI Insights and Recommendations into a single
            powerful dashboard. Get predictive analytics, crop health scoring,
            and intelligent corrective actions — all in one place.
          </p>
        </div>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="group rounded-3xl border border-white/10 bg-slate-900/60 p-8 transition hover:border-green-500/20 hover:bg-green-500/5"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
                <Icon size={28} />
              </div>

              <h3 className="mt-6 text-xl font-bold text-white">
                {feature.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-12 rounded-3xl border border-white/10 bg-slate-900/60 p-8">
        <h3 className="text-xl font-bold text-white">What&apos;s Changing</h3>
        <p className="mt-4 leading-8 text-slate-400">
          Previously, AI predictions and rule-based recommendations were on
          separate pages. The new hub combines them so you can view predictions,
          health scores, irrigation metrics, and corrective actions side by side
          — with a unified dashboard experience coming soon.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-2xl border border-green-500/30 bg-green-500/10 px-6 py-3 text-sm font-medium text-green-400 transition hover:bg-green-500/20"
          >
            Back to Dashboard
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
