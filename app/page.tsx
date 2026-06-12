import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import Features from "@/components/features";
import TrustedBy from "@/components/trusted-by";
import DashboardPreview from "@/components/dashboard-preview";
import StatsStrip from "@/components/stats-strip";
import SectionDivider from "@/components/section-divider";
import BackgroundEffects from "@/components/background-effects";
import Footer from "@/components/footer";
export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <BackgroundEffects />
      <Navbar />
      <Hero />
      <StatsStrip />
      <TrustedBy />
      <SectionDivider />
      <Features />
      <SectionDivider />
      <DashboardPreview />
      <Footer />
    </main>
  );
}