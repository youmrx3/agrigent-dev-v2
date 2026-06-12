import type { Metadata } from "next";
import { Shield, Lock, Eye, Server } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Container from "@/components/container";

export const metadata: Metadata = {
  title: "Security | AGRIGENT",
  description: "AGRIGENT security practices - how we protect your agricultural data.",
};

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />

      <section className="relative flex items-center justify-center overflow-hidden px-6 pt-40 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#16a34a20,transparent_40%)]" />

        <Container>
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="inline-flex rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-400">
              Security
            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight text-white md:text-7xl">
              Your Data is{" "}
              <span className="text-green-400">Protected</span>
            </h1>

            <p className="mt-8 text-lg leading-8 text-slate-400">
              Security is foundational to AGRIGENT. We employ
              enterprise-grade measures to safeguard your agricultural data.
            </p>
          </div>
        </Container>
      </section>

      <section className="relative pb-20">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-green-500/10 text-green-400">
                <Lock size={28} />
              </div>

              <h3 className="mt-6 text-xl font-bold text-white">
                End-to-End Encryption
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                All data transmitted between sensors, our servers, and
                your dashboard is encrypted using TLS 1.3 and AES-256.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-green-500/10 text-green-400">
                <Shield size={28} />
              </div>

              <h3 className="mt-6 text-xl font-bold text-white">
                Access Control
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                Role-based access control ensures that only authorized
                users can view or manage your farm data.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-green-500/10 text-green-400">
                <Eye size={28} />
              </div>

              <h3 className="mt-6 text-xl font-bold text-white">
                Continuous Monitoring
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                Our security team monitors systems 24/7 for potential
                threats and anomalous activity.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-green-500/10 text-green-400">
                <Server size={28} />
              </div>

              <h3 className="mt-6 text-xl font-bold text-white">
                Secure Infrastructure
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                Our cloud infrastructure is hosted in secure data centers
                with redundancy, backup, and disaster recovery.
              </p>
            </div>
          </div>

          <div className="mt-16 rounded-3xl border border-white/10 bg-slate-900/60 p-8">
            <h2 className="text-2xl font-bold text-white">
              Security Certifications
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/5 bg-slate-950/50 px-6 py-4 text-center">
                <p className="text-sm font-semibold text-white">SOC 2</p>

                <p className="mt-1 text-xs text-slate-500">
                  Compliance in progress
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-slate-950/50 px-6 py-4 text-center">
                <p className="text-sm font-semibold text-white">GDPR</p>

                <p className="mt-1 text-xs text-slate-500">
                  Fully compliant
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-slate-950/50 px-6 py-4 text-center">
                <p className="text-sm font-semibold text-white">ISO 27001</p>

                <p className="mt-1 text-xs text-slate-500">
                  Certification pending
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  );
}
