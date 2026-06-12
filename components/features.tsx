"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Droplets,
  Leaf,
  BarChart3,
} from "lucide-react";

import Container from "./container";

const features = [
  {
    icon: Droplets,
    title: "Smart Irrigation",
    description:
      "Optimize water consumption using real-time soil moisture monitoring and intelligent recommendations.",
  },
  {
    icon: Leaf,
    title: "Soil Health Analysis",
    description:
      "Monitor NPK levels, soil pH, and environmental conditions with precision agriculture tools.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Access powerful dashboards, agricultural insights, and historical farm performance data.",
  },
  {
    icon: Activity,
    title: "Real-Time Monitoring",
    description:
      "Track sensor activity, environmental changes, and crop conditions instantly.",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-400">
            Platform Features
          </div>

          <h2 className="mt-6 text-4xl font-black tracking-tight text-white md:text-6xl">
            Smart Agriculture Infrastructure
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            AGRIGENT combines IoT monitoring, AI intelligence,
            and advanced agricultural analytics to modernize
            farming operations.
          </p>
        </div>

        <motion.div
  initial={{ opacity: 0, y: 60 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: true }}
  className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-4"
>
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-3xl border border-white/10 bg-slate-900/60 p-8 transition hover:-translate-y-2 hover:border-green-500/20 hover:bg-slate-900"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-green-500/10 text-green-400">
                  <Icon size={28} />
                </div>

                <h3 className="mt-8 text-xl font-bold text-white">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}