import { ReactNode } from "react";

import DashboardSidebar from "@/components/dashboard-sidebar";
import DashboardTopbar from "@/components/dashboard-topbar";
import AuthGuard from "@/components/auth-guard";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <AuthGuard>
      <main className="flex min-h-screen bg-slate-950 text-white">
        <DashboardSidebar />

        <div className="flex-1">
          <DashboardTopbar />

          <div className="mx-auto max-w-7xl px-6 py-10">
            {children}
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}