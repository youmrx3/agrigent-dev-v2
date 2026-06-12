import { useThemeStore } from "@/stores/theme-store";
type StatCardProps = {
  title: string;
  value: string;
  valueColor?: string;
};

export default function StatCard({
  title,
  value,
  valueColor = "text-white",
}: StatCardProps) {
    const { theme } = useThemeStore();
  return (
    <div className={`rounded-3xl p-6 border ${
  theme === "dark"
    ? "border-white/10 bg-slate-900/60"
    : "border-slate-300 bg-white"
}`}>
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <h3 className={`mt-4 text-5xl font-black ${valueColor}`}>
        {value}
      </h3>
    </div>
  );
}