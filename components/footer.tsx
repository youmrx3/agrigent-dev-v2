import Link from "next/link";
import Container from "./container";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 py-20">
      <Container>
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <img src="/white.png" alt="AGRIGENT" className="h-14 w-14" />

              <div>
                <h3 className="text-lg font-bold text-white">
                  AGRIGENT
                </h3>

                <p className="text-sm text-slate-400">
                  Smart Agriculture Platform
                </p>
              </div>
            </Link>

            <p className="mt-6 leading-7 text-slate-400">
              AI-powered agricultural monitoring and intelligent
              farming analytics platform for modern agriculture.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Platform
            </h4>

            <div className="mt-6 space-y-4">
              <Link href="/dashboard" className="block text-slate-400 transition hover:text-white">
                Dashboard
              </Link>

              <Link href="/dashboard/analytics" className="block text-slate-400 transition hover:text-white">
                Analytics
              </Link>

              <Link href="/dashboard/devices" className="block text-slate-400 transition hover:text-white">
                Devices
              </Link>

              <Link href="/dashboard/ai-insights" className="block text-slate-400 transition hover:text-white">
                AI Insights
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Company
            </h4>

            <div className="mt-6 space-y-4">
              <Link href="/about" className="block text-slate-400 transition hover:text-white">
                About
              </Link>

              <Link href="/technology" className="block text-slate-400 transition hover:text-white">
                Technology
              </Link>

              <Link href="/contact" className="block text-slate-400 transition hover:text-white">
                Contact
              </Link>

              <Link href="/partnerships" className="block text-slate-400 transition hover:text-white">
                Partnerships
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Contact
            </h4>

            <div className="mt-6 space-y-4 text-slate-400">
              <p>agrigent.tech@gmail.com</p>
              <p>Algiers, Algeria</p>
              <p>+213 696955909</p>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 text-sm text-slate-500 md:flex-row">
          <p>
            © 2026 AGRIGENT. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="transition hover:text-white">
              Privacy
            </Link>

            <Link href="/terms" className="transition hover:text-white">
              Terms
            </Link>

            <Link href="/security" className="transition hover:text-white">
              Security
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}