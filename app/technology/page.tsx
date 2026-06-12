import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Container from "@/components/container";

export const metadata: Metadata = {
  title: "Technology | AGRIGENT",
  description: "Explore AGRIGENT's technology stack: IoT sensors, AI analytics, and smart farming infrastructure.",
};

export default function TechnologyPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />

      <section className="relative flex items-center justify-center overflow-hidden px-6 pt-40 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#16a34a20,transparent_40%)]" />

        <Container>
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="inline-flex rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-400">
              Technology Stack
            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight text-white md:text-7xl">
              Built for{" "}
              <span className="text-green-400">Modern Farming</span>
            </h1>

            <p className="mt-8 text-lg leading-8 text-slate-400">
              AGRIGENT leverages cutting-edge technology to deliver
              precision agriculture solutions that are reliable, scalable,
              and easy to use.
            </p>
          </div>
        </Container>
      </section>

      <section className="relative py-20">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
              <h3 className="text-2xl font-bold text-white">
                IoT Sensor Network
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                Our wireless sensor network monitors soil moisture,
                temperature, humidity, NPK levels, and environmental
                conditions in real time with 98% accuracy.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
              <h3 className="text-2xl font-bold text-white">
                AI & Machine Learning
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                Advanced ML models analyze sensor data, weather patterns,
                and historical trends to generate predictive insights and
                actionable recommendations.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
              <h3 className="text-2xl font-bold text-white">
                Real-Time Analytics
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                Cloud-based dashboards provide live monitoring, historical
                analysis, and performance metrics accessible from any device.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
              <h3 className="text-2xl font-bold text-white">
                Satellite Integration
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                Multi-spectral satellite imagery combined with ground sensors
                delivers comprehensive crop health assessments at 10m resolution.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="relative border-t border-white/10 py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-black text-white">
              Ready to Modernize Your Farm?
            </h2>

            <p className="mt-6 leading-8 text-slate-400">
              Join hundreds of farmers using AGRIGENT to increase yield,
              reduce costs, and farm smarter.
            </p>

            <div className="mt-10 flex justify-center gap-4">
              <a
                href="/signup"
                className="rounded-3xl bg-green-500 px-8 py-4 text-sm font-semibold text-white transition hover:bg-green-400"
              >
                Get Started
              </a>

              <a
                href="/contact"
                className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Contact Us
              </a>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  );
}
