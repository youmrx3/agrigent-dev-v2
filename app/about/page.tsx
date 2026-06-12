import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Container from "@/components/container";

export const metadata: Metadata = {
  title: "About | AGRIGENT",
  description: "Learn about AGRIGENT - the smart agriculture platform transforming farming with AI and IoT.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />

      <section className="relative flex items-center justify-center overflow-hidden px-6 pt-40 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#16a34a20,transparent_40%)]" />

        <Container>
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="inline-flex rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-400">
              About AGRIGENT
            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight text-white md:text-7xl">
              Transforming Agriculture with{" "}
              <span className="text-green-400">Intelligence</span>
            </h1>

            <p className="mt-8 text-lg leading-8 text-slate-400">
              AGRIGENT is an AI-powered agricultural monitoring platform that
              combines IoT sensors, machine learning, and data analytics to
              help farmers optimize irrigation, fertilization, and crop
              productivity.
            </p>
          </div>
        </Container>
      </section>

      <section className="relative py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-black text-white">Our Mission</h2>

            <p className="mt-6 leading-8 text-slate-400">
              We believe that data-driven agriculture is the key to feeding a
              growing global population while preserving natural resources.
              AGRIGENT was built to make precision agriculture accessible to
              farms of all sizes.
            </p>

            <h2 className="mt-16 text-3xl font-black text-white">
              Our Technology
            </h2>

            <p className="mt-6 leading-8 text-slate-400">
              Our platform integrates real-time sensor data, satellite imagery,
              and weather forecasting with advanced AI models to provide
              actionable insights. From soil moisture monitoring to crop health
              prediction, AGRIGENT delivers the intelligence farmers need to
              make informed decisions.
            </p>

            <h2 className="mt-16 text-3xl font-black text-white">
              Our Team
            </h2>

            <p className="mt-6 leading-8 text-slate-400">
              Founded in Algiers, Algeria, our team combines expertise in
              agronomy, artificial intelligence, and software engineering.
              We are committed to building technology that makes a real
              difference in agricultural productivity.
            </p>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  );
}
