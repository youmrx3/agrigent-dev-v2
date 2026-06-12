import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Container from "@/components/container";

export const metadata: Metadata = {
  title: "Privacy Policy | AGRIGENT",
  description: "AGRIGENT privacy policy - how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />

      <section className="relative px-6 pt-40 pb-20">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="inline-flex rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-400">
              Privacy Policy
            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight text-white md:text-6xl">
              Privacy Policy
            </h1>

            <p className="mt-4 text-slate-500">
              Last updated: June 2026
            </p>

            <div className="mt-12 space-y-8 leading-8 text-slate-400">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  1. Information We Collect
                </h2>

                <p className="mt-4">
                  We collect information you provide directly to us,
                  including account details, farm data, and sensor
                  readings. We also automatically collect usage data
                  and analytics to improve our services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  2. How We Use Your Data
                </h2>

                <p className="mt-4">
                  Your data is used to provide agricultural analytics,
                  generate AI insights, and improve platform performance.
                  We do not sell your personal data to third parties.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  3. Data Security
                </h2>

                <p className="mt-4">
                  We implement industry-standard security measures to
                  protect your data. All data is encrypted in transit
                  and at rest using AES-256 encryption.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  4. Data Retention
                </h2>

                <p className="mt-4">
                  We retain your data for as long as your account is
                  active. You may request deletion of your data at
                  any time by contacting our support team.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  5. Contact
                </h2>

                <p className="mt-4">
                  For questions about this privacy policy, please
                  contact us at privacy@agrigent.ai.
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
