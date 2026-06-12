import type { Metadata } from "next";
import { Handshake, Building2, GraduationCap, Globe } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Container from "@/components/container";

export const metadata: Metadata = {
  title: "Partnerships | AGRIGENT",
  description: "Partner with AGRIGENT to drive innovation in smart agriculture and sustainable farming.",
};

export default function PartnershipsPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />

      <section className="relative flex items-center justify-center overflow-hidden px-6 pt-40 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#16a34a20,transparent_40%)]" />

        <Container>
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="inline-flex rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-400">
              Partner With Us
            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight text-white md:text-7xl">
              Grow Together with{" "}
              <span className="text-green-400">AGRIGENT</span>
            </h1>

            <p className="mt-8 text-lg leading-8 text-slate-400">
              We collaborate with agricultural organizations, research
              institutions, and technology partners to advance smart
              farming worldwide.
            </p>
          </div>
        </Container>
      </section>

      <section className="relative pb-20">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-green-500/10 text-green-400">
                <Building2 size={28} />
              </div>

              <h3 className="mt-6 text-xl font-bold text-white">
                Agricultural Organizations
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                Partner with us to bring precision agriculture technology
                to your members and community.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-green-500/10 text-green-400">
                <GraduationCap size={28} />
              </div>

              <h3 className="mt-6 text-xl font-bold text-white">
                Research Institutions
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                Collaborate on agricultural research using our platform
                and data analytics capabilities.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-green-500/10 text-green-400">
                <Globe size={28} />
              </div>

              <h3 className="mt-6 text-xl font-bold text-white">
                Technology Partners
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                Integrate your IoT hardware or software solutions with
                the AGRIGENT platform.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-green-500/10 text-green-400">
                <Handshake size={28} />
              </div>

              <h3 className="mt-6 text-xl font-bold text-white">
                Distribution Partners
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                Become an authorized AGRIGENT distributor and bring
                smart farming to your region.
              </p>
            </div>
          </div>

          <div className="mt-16 rounded-3xl border border-green-500/20 bg-green-500/10 p-12 text-center">
            <h2 className="text-3xl font-black text-white">
              Interested in Partnering?
            </h2>

            <p className="mt-4 text-slate-300">
              Contact our partnerships team to discuss collaboration opportunities.
            </p>

            <a
              href="/contact"
              className="mt-8 inline-block rounded-3xl bg-green-500 px-8 py-4 text-sm font-semibold text-white transition hover:bg-green-400"
            >
              Get in Touch
            </a>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  );
}
