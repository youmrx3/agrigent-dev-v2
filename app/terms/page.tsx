import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Container from "@/components/container";

export const metadata: Metadata = {
  title: "Terms of Service | AGRIGENT",
  description: "AGRIGENT terms of service - conditions for using the smart agriculture platform.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />

      <section className="relative px-6 pt-40 pb-20">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="inline-flex rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-400">
              Terms of Service
            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight text-white md:text-6xl">
              Terms of Service
            </h1>

            <p className="mt-4 text-slate-500">
              Last updated: June 2026
            </p>

            <div className="mt-12 space-y-8 leading-8 text-slate-400">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  1. Acceptance of Terms
                </h2>

                <p className="mt-4">
                  By accessing or using AGRIGENT, you agree to be bound
                  by these terms. If you do not agree, please do not use
                  our services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  2. Service Description
                </h2>

                <p className="mt-4">
                  AGRIGENT provides AI-powered agricultural monitoring,
                  analytics, and recommendations. We strive for accuracy
                  but do not guarantee specific outcomes.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  3. User Responsibilities
                </h2>

                <p className="mt-4">
                  You are responsible for maintaining the confidentiality
                  of your account credentials and for all activities
                  that occur under your account.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  4. Limitation of Liability
                </h2>

                <p className="mt-4">
                  AGRIGENT is provided as-is. We are not liable for any
                  indirect damages arising from the use of our platform,
                  including but not limited to crop loss or data inaccuracies.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  5. Contact
                </h2>

                <p className="mt-4">
                  For questions about these terms, please contact us at
                  legal@agrigent.ai.
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
