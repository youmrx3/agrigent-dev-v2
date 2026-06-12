import Container from "./container";

const companies = [
  "AgriTech Solutions",
  "SmartFarm Africa",
  "GreenField Systems",
  "CropVision",
  "AgroAnalytics",
];

export default function TrustedBy() {
  return (
    <section className="relative py-16">
      <Container>
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            Trusted by innovative agricultural organizations
          </p>

          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-5">
            {companies.map((company) => (
              <div
                key={company}
                className="flex h-24 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] text-sm font-semibold text-slate-400 backdrop-blur-xl transition hover:border-green-500/20 hover:text-white"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}