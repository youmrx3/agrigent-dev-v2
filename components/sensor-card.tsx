import { LucideIcon } from "lucide-react";

interface SensorCardProps {
  title: string;
  value: string;
  status: string;
  icon: LucideIcon;
}

export default function SensorCard({
  title,
  value,
  status,
  icon: Icon,
}: SensorCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-green-500/20">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">
            {title}
          </p>

          <h3 className="mt-4 text-4xl font-black text-white">
            {value}
          </h3>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-green-500/10 text-green-400">
          <Icon size={28} />
        </div>
      </div>

      <div className="mt-6 inline-flex rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
        {status}
      </div>
    </div>
  );
}