"use client";
import { useDashboardStore } from "@/stores/dashboard-store";
import { MapPin, ChevronDown } from "lucide-react";

export default function LandSelector() {
  const { lands, selectedLandId, setSelectedLandId, getSelectedLand } = useDashboardStore();
  const selected = getSelectedLand();

  if (lands.length === 0) {
    return (
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <MapPin size={16} className="text-slate-600" />
        <span>No lands added yet.</span>
        <a href="/dashboard/profiles" className="text-cyan-400 underline transition hover:text-cyan-300">
          Add your first land
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <MapPin size={18} className="shrink-0 text-cyan-400" />
      <span className="text-sm text-slate-400">Monitoring:</span>
      <div className="relative">
        <select
          value={selectedLandId || ""}
          onChange={(e) => setSelectedLandId(e.target.value || null)}
          className="appearance-none rounded-2xl border border-white/10 bg-slate-950/80 px-5 py-2 pr-10 text-sm font-medium text-white outline-none transition focus:border-cyan-500/50"
        >
          <option value="">-- Select a land --</option>
          {lands.map((land) => (
            <option key={land.id} value={land.id}>
              {land.name} — {land.plants} ({land.surface} {land.surfaceUnit})
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
      </div>
      {selected && (
        <span className="hidden text-xs text-slate-500 md:block">
          {selected.growthStage} · {selected.climateZone}
        </span>
      )}
    </div>
  );
}
