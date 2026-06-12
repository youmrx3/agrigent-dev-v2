"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Container from "./container";
export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#16a34a20,transparent_40%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:80px_80px]" />
<Container>
      <motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  className="relative z-10 grid items-center gap-20 lg:grid-cols-2"
>
        <div>
          <div className="mb-6 inline-flex items-center rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-400">
            AI-Powered Smart Agriculture
          </div>
<h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-7xl">
  Precision Agriculture Powered by{" "}
  <span className="text-green-400">
    Data Intelligence
  </span>
</h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-400">
            AGRIGENT combines IoT monitoring, agricultural analytics,
            and AI-driven insights to help farmers optimize irrigation,
            fertilization, and crop productivity.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
  href="/signup"
  className="rounded-3xl bg-green-500 px-8 py-4 text-sm font-semibold text-white transition hover:bg-green-400"
>
  Start Monitoring
</Link>

           <Link
  href="/login"
  className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
>
  Sign In
</Link>
          </div>

          <div className="mt-14 grid grid-cols-3 gap-8">
            <div>
              <h3 className="text-3xl font-bold text-white sm:text-4xl">
                500+
              </h3>

              <p className="mt-2 text-sm text-slate-400 sm:text-base">
                Connected Sensors
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-white sm:text-4xl">
                120+
              </h3>

              <p className="mt-2 text-sm text-slate-400 sm:text-base">
                Active Farms
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-white sm:text-4xl">
                35%
              </h3>

              <p className="mt-2 text-sm text-slate-400 sm:text-base">
                Water Savings
              </p>
            </div>
          </div>
        </div>
        

        <motion.div
  initial={{ opacity: 0, x: 60 }}
  animate={{
    opacity: 1,
    x: 0,
    y: [0, -10, 0],
  }}
  transition={{
    opacity: { duration: 1 },
    x: { duration: 1 },
    y: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  }}
  className="relative"
>
          <div className="absolute -inset-10 rounded-full bg-green-500/20 blur-3xl" />

          <div className="relative rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Farm Analytics
                </h3>

                <p className="text-sm text-slate-400">
                  Real-time Monitoring
                </p>
              </div>

              <div className="rounded-xl bg-green-500 px-3 py-1 text-sm font-medium text-white">
                Live
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-800 p-5">
                <p className="text-sm text-slate-400">
                  Soil Moisture
                </p>

                <h3 className="mt-3 text-3xl font-bold text-white">
                  68%
                </h3>
              </div>

              <div className="rounded-3xl bg-slate-800 p-5">
                <p className="text-sm text-slate-400">
                  Temperature
                </p>

                <h3 className="mt-3 text-3xl font-bold text-white">
                  24°C
                </h3>
              </div>

              <div className="rounded-3xl bg-slate-800 p-5">
                <p className="text-sm text-slate-400">
                  Soil pH
                </p>

                <h3 className="mt-3 text-3xl font-bold text-white">
                  6.8
                </h3>
              </div>

              <div className="rounded-3xl bg-slate-800 p-5">
                <p className="text-sm text-slate-400">
                  NPK Status
                </p>

                <h3 className="mt-3 text-3xl font-bold text-green-400">
                  Optimal
                </h3>
              </div>
            </div>

            <div className="mt-6 rounded-3xl bg-gradient-to-r from-green-500 to-emerald-400 p-5">
              <p className="text-sm text-white/80">
                AI Recommendation
              </p>

              <h3 className="mt-2 text-xl font-bold text-white">
                Reduce irrigation by 12% this week
              </h3>
            </div>
          </div>
        </motion.div>
      </motion.div>
      </Container>
    </section>
  );
}