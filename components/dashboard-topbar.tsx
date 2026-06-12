"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, Search, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";

export default function DashboardTopbar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-8 py-5">
        <div>
          <p className="text-sm text-green-400">AGRIGENT Platform</p>
          <h1 className="mt-1 text-2xl font-bold text-white">Smart Farm Dashboard</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 lg:flex">
            <Search size={18} className="text-slate-400" />
            <input
              placeholder="Search analytics..."
              aria-label="Search analytics"
              className="bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </div>

          <Link
            href="/dashboard/notifications"
            className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/60 text-slate-300 transition hover:text-white"
          >
            <Bell size={20} />
            <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-green-400" />
          </Link>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-2">
            <img src="/white.png" alt="AGRIGENT" className="h-14 w-14 rounded-2xl" />
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium text-white">{user?.name ?? "User"}</p>
              <p className="text-xs text-slate-400 capitalize">{user?.role ?? "Farmer"}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            aria-label="Log out"
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/60 text-slate-300 transition hover:border-red-500/30 hover:text-red-400"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
