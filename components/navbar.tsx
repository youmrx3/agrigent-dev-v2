"use client";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <img src="/white.png" alt="AGRIGENT" className="h-14 w-14" />

          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              AGRIGENT
            </h1>

            <p className="text-xs text-slate-400">
              Smart Agriculture Platform
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm text-slate-300 transition hover:text-white"
          >
            Home
          </Link>

          <Link
            href="/#features"
            className="text-sm text-slate-300 transition hover:text-white"
          >
            Features
          </Link>

          <Link
            href="/technology"
            className="text-sm text-slate-300 transition hover:text-white"
          >
            Technology
          </Link>

          <Link
            href="/contact"
            className="text-sm text-slate-300 transition hover:text-white"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden text-sm text-slate-300 transition hover:text-white md:block"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="rounded-xl bg-green-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-green-400"
          >
            Get Started
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="flex h-12 w-12 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white backdrop-blur-xl md:hidden"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-slate-950/95 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-2 px-6 py-6">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              Home
            </Link>
            <Link
              href="/#features"
              onClick={() => setMobileOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              Features
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/technology"
              onClick={() => setMobileOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              Technology
            </Link>
            <div className="mt-2 border-t border-white/10 pt-4">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block rounded-2xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="mt-2 block rounded-xl bg-green-500 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-green-400"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}