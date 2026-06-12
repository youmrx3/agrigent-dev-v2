"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  Users,
  ClipboardList,
  Sparkles,
  Bell,
  Settings,
} from "lucide-react";

const links = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Activity, label: "Devices", href: "/dashboard/devices" },
  { icon: ClipboardList, label: "Decisions & Analysis", href: "/dashboard/decisions" },
  { icon: Users, label: "Land Management", href: "/dashboard/profiles" },
  { icon: Sparkles, label: "AI & Insights", href: "/dashboard/ai-insights" },
  { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex w-72 flex-col border-r border-white/10 bg-slate-950/80 p-6 backdrop-blur-xl lg:flex">
      <div className="flex items-center gap-3">
        <img src="/white.png" alt="AGRIGENT" className="h-16 w-16 rounded-2xl" />
        <div>
          <h2 className="text-lg font-bold text-white">AGRIGENT</h2>
          <p className="text-sm text-slate-400">Smart Agriculture</p>
        </div>
      </div>

      <div className="mt-12 space-y-3">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              href={link.href}
              key={link.label}
              className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition ${
                pathname === link.href
                  ? "border-green-500/30 bg-green-500/10 text-white"
                  : "border-transparent text-slate-400 hover:border-white/10 hover:bg-slate-900/60 hover:text-white"
              }`}
            >
              <Icon size={22} />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto rounded-3xl border border-green-500/20 bg-green-500/10 p-6">
        <p className="text-sm text-green-400">System Status</p>
        <h3 className="mt-3 text-2xl font-black text-white">Phase 1 Active</h3>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Sensor acquisition and rule-based evaluation operational.
        </p>
      </div>
    </aside>
  );
}
