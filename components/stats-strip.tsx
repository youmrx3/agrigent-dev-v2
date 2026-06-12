"use client";

import { motion } from "framer-motion";

const stats = [
  {
    value: "12K+",
    label: "Sensor Readings Daily",
  },
  {
    value: "98%",
    label: "Monitoring Accuracy",
  },
  {
    value: "350+",
    label: "Connected Devices",
  },
  {
    value: "24/7",
    label: "Real-Time Analytics",
  },
];

export default function StatsStrip() {
  return (
    <section className="relative overflow-hidden py-10">
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-green-500/5" />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="relative mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 md:grid-cols-4"
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-center backdrop-blur-xl"
          >
            <h3 className="text-4xl font-black text-green-400">
              {stat.value}
            </h3>

            <p className="mt-3 text-sm text-slate-400">
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}