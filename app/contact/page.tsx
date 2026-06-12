import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Container from "@/components/container";

export const metadata: Metadata = {
  title: "Contact | AGRIGENT",
  description: "Get in touch with the AGRIGENT team. We're here to help you transform your farming operations.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />

      <section className="relative flex items-center justify-center overflow-hidden px-6 pt-40 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#16a34a20,transparent_40%)]" />

        <Container>
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="inline-flex rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-400">
              Get In Touch
            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight text-white md:text-7xl">
              Let&apos;s Talk About{" "}
              <span className="text-green-400">Smart Farming</span>
            </h1>

            <p className="mt-8 text-lg leading-8 text-slate-400">
              Have questions about AGRIGENT? Want to schedule a demo?
              Our team is ready to help.
            </p>
          </div>
        </Container>
      </section>

      <section className="relative pb-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
                    <Mail size={22} />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Email
                    </h3>

                    <p className="mt-2 text-slate-400">
                      contact@agrigent.ai
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
                    <MapPin size={22} />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Location
                    </h3>

                    <p className="mt-2 text-slate-400">
                      Algiers, Algeria
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
                    <Phone size={22} />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Phone
                    </h3>

                    <p className="mt-2 text-slate-400">
                      +213 XX XX XX XX
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
              <h3 className="text-2xl font-bold text-white">
                Send Us a Message
              </h3>

              <form className="mt-8 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-300">
                      Name
                    </label>

                    <input
                      type="text"
                      placeholder="Your name"
                      aria-label="Your name"
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-green-500/40"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300">
                      Email
                    </label>

                    <input
                      type="email"
                      placeholder="your@email.com"
                      aria-label="Your email"
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-green-500/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300">
                    Subject
                  </label>

                  <input
                    type="text"
                    placeholder="How can we help?"
                    aria-label="Subject"
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-green-500/40"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300">
                    Message
                  </label>

                  <textarea
                    placeholder="Tell us about your project..."
                    aria-label="Your message"
                    rows={5}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-green-500/40 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-green-500 px-8 py-4 text-sm font-semibold text-white transition hover:bg-green-400"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  );
}
