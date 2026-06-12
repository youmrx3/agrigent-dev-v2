"use client";
import { useState } from "react";
import { useDashboardStore, Land, Characteristic, LandReading } from "@/stores/dashboard-store";
import { MapPin, Sprout, Sun, Ruler, Plus, X, GripVertical, Wheat, Trash2, Activity, Clock, Eye, Map as MapIcon } from "lucide-react";
import MapPicker from "@/components/map-picker";
import MapPreview from "@/components/map-preview";

const GROWTH_STAGES = ["Seedling", "Vegetative", "Flowering", "Fruiting", "Maturation", "Harvest"];
const CLIMATE_ZONES = ["Tropical", "Semi-arid", "Mediterranean", "Continental", "Temperate", "Arid", "Humid subtropical"];

function emptyLand(): Omit<Land, "id" | "createdAt"> {
  return {
    name: "",
    surface: 0,
    surfaceUnit: "hectares",
    plants: "",
    address: "",
    latitude: 0,
    longitude: 0,
    polygon: [],
    mapSnapshot: null,
    growthStage: "Vegetative",
    climateZone: "Mediterranean",
    characteristics: [],
  };
}

export default function ProfilesPage() {
  const { lands, addLand, updateLand, deleteLand, getLandSessions, getLandReadings } = useDashboardStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyLand());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [monitoringLandId, setMonitoringLandId] = useState<string | null>(null);
  const [previewLandId, setPreviewLandId] = useState<string | null>(null);

  function resetForm() {
    setForm(emptyLand());
    setEditingId(null);
    setErrors({});
  }

  function openEdit(land: Land) {
    setForm({
      name: land.name,
      surface: land.surface,
      surfaceUnit: land.surfaceUnit,
      plants: land.plants,
      address: land.address,
      latitude: land.latitude,
      longitude: land.longitude,
      polygon: land.polygon || [],
      mapSnapshot: land.mapSnapshot || null,
      growthStage: land.growthStage,
      climateZone: land.climateZone,
      characteristics: land.characteristics,
    });
    setEditingId(land.id);
    setShowForm(true);
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Land name is required";
    if (form.surface <= 0) e.surface = "Surface must be greater than 0";
    if (!form.plants.trim()) e.plants = "Plants/crops are required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    if (editingId) {
      updateLand(editingId, form);
    } else {
      const land: Land = {
        ...form,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      addLand(land);
    }
    resetForm();
    setShowForm(false);
  }

  function addCharacteristic() {
    setForm((f) => ({
      ...f,
      characteristics: [...f.characteristics, { key: "", value: "" }],
    }));
  }

  function updateCharacteristic(idx: number, field: keyof Characteristic, val: string) {
    setForm((f) => {
      const c = [...f.characteristics];
      c[idx] = { ...c[idx], [field]: val };
      return { ...f, characteristics: c };
    });
  }

  function removeCharacteristic(idx: number) {
    setForm((f) => ({
      ...f,
      characteristics: f.characteristics.filter((_, i) => i !== idx),
    }));
  }

  function avgValue(readings: LandReading[], key: keyof LandReading): string {
    if (readings.length === 0) return "---";
    const sum = readings.reduce((a, r) => a + (r[key] as number), 0);
    const avg = sum / readings.length;
    return typeof avg === "number" ? avg.toFixed(1) : "---";
  }

  const monitoringLand = monitoringLandId ? lands.find((l) => l.id === monitoringLandId) : null;
  const monitoringSessions = monitoringLandId ? getLandSessions(monitoringLandId) : [];
  const monitoringReadings = monitoringLandId ? getLandReadings(monitoringLandId) : [];
  const sortedReadings = [...monitoringReadings].reverse();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
            <MapPin size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Land Management</h1>
            <p className="mt-1 text-slate-400">Manage your farm lands, crops, and field characteristics</p>
          </div>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400"
        >
          <Plus size={18} />
          Add Land
        </button>
      </div>

      {/* Land Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
          <div className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">{editingId ? "Edit Land" : "Add New Land"}</h2>
              <button onClick={() => { resetForm(); setShowForm(false); }} className="rounded-xl border border-white/10 p-2 text-slate-400 transition hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300">Land Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`mt-2 w-full rounded-2xl border ${errors.name ? "border-red-500/50" : "border-white/10"} bg-slate-950/60 px-5 py-3 text-white outline-none transition focus:border-cyan-500/50`}
                  placeholder="e.g. North Field, Greenhouse A"
                />
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-300">Surface Area</label>
                  <div className="mt-2 flex gap-2">
                    <input
                      type="number"
                      value={form.surface || ""}
                      onChange={(e) => setForm({ ...form, surface: parseFloat(e.target.value) || 0 })}
                      className={`w-full rounded-2xl border ${errors.surface ? "border-red-500/50" : "border-white/10"} bg-slate-950/60 px-5 py-3 text-white outline-none transition focus:border-cyan-500/50`}
                      placeholder="0"
                    />
                    <select
                      value={form.surfaceUnit}
                      onChange={(e) => setForm({ ...form, surfaceUnit: e.target.value as Land["surfaceUnit"] })}
                      className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none"
                    >
                      <option value="hectares">hectares</option>
                      <option value="m²">m²</option>
                      <option value="acres">acres</option>
                    </select>
                  </div>
                  {errors.surface && <p className="mt-1 text-xs text-red-400">{errors.surface}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300">Plants / Crops</label>
                  <input
                    value={form.plants}
                    onChange={(e) => setForm({ ...form, plants: e.target.value })}
                    className={`mt-2 w-full rounded-2xl border ${errors.plants ? "border-red-500/50" : "border-white/10"} bg-slate-950/60 px-5 py-3 text-white outline-none transition focus:border-cyan-500/50`}
                    placeholder="e.g. Wheat, Tomatoes, Olives"
                  />
                  {errors.plants && <p className="mt-1 text-xs text-red-400">{errors.plants}</p>}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <MapIcon size={16} className="text-cyan-400" />
                  Location / Map
                </label>
                <div className="mt-3">
                  <MapPicker
                    latitude={form.latitude}
                    longitude={form.longitude}
                    polygon={form.polygon}
                    address={form.address}
                    onLocationChange={(lat, lng) => setForm((prev) => ({ ...prev, latitude: lat, longitude: lng }))}
                    onPolygonChange={(polygon) => setForm((prev) => ({ ...prev, polygon }))}
                    onAddressChange={(address) => setForm((prev) => ({ ...prev, address }))}
                    onSnapshot={(dataUrl) => setForm((prev) => ({ ...prev, mapSnapshot: dataUrl }))}
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-300">Growth Stage</label>
                  <select
                    value={form.growthStage}
                    onChange={(e) => setForm({ ...form, growthStage: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-5 py-3 text-white outline-none"
                  >
                    {GROWTH_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300">Climate Zone</label>
                  <select
                    value={form.climateZone}
                    onChange={(e) => setForm({ ...form, climateZone: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-5 py-3 text-white outline-none"
                  >
                    {CLIMATE_ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-300">Custom Characteristics</label>
                  <button
                    type="button"
                    onClick={addCharacteristic}
                    className="flex items-center gap-1 text-xs text-cyan-400 transition hover:text-cyan-300"
                  >
                    <Plus size={14} /> Add characteristic
                  </button>
                </div>
                <div className="mt-3 space-y-2">
                  {form.characteristics.length === 0 && (
                    <p className="text-sm text-slate-500">No custom characteristics added yet.</p>
                  )}
                  {form.characteristics.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <GripVertical size={16} className="shrink-0 text-slate-600" />
                      <input
                        value={c.key}
                        onChange={(e) => updateCharacteristic(i, "key", e.target.value)}
                        className="w-2/5 rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-white outline-none focus:border-cyan-500/50"
                        placeholder="e.g. Soil Type"
                      />
                      <input
                        value={c.value}
                        onChange={(e) => updateCharacteristic(i, "value", e.target.value)}
                        className="flex-1 rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-white outline-none focus:border-cyan-500/50"
                        placeholder="e.g. Clay loam"
                      />
                      <button
                        type="button"
                        onClick={() => removeCharacteristic(i)}
                        className="rounded-xl p-2 text-slate-500 transition hover:text-red-400"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  onClick={() => { resetForm(); setShowForm(false); }}
                  className="rounded-2xl border border-white/10 px-6 py-3 text-sm text-slate-400 transition hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="rounded-2xl bg-cyan-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400"
                >
                  {editingId ? "Save Changes" : "Add Land"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {lands.length === 0 && !showForm && (
        <div className="mt-16 rounded-3xl border border-dashed border-white/10 bg-slate-900/30 p-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
            <MapPin size={32} />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-white">No Lands Yet</h2>
          <p className="mt-3 text-slate-400">Add your first piece of land to start monitoring and tracking your crops.</p>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="mt-8 rounded-2xl bg-cyan-500 px-8 py-4 font-semibold text-white transition hover:bg-cyan-400"
          >
            Add Your First Land
          </button>
        </div>
      )}

      {/* Land Cards */}
      {lands.length > 0 && (
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {lands.map((land) => {
            const sessions = getLandSessions(land.id);
            const readings = getLandReadings(land.id);
            return (
              <div
                key={land.id}
                className="group rounded-3xl border border-white/10 bg-slate-900/60 p-6 transition hover:border-cyan-500/20"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{land.name}</h3>
                      <p className="text-sm text-slate-400">{land.plants}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
                    <button onClick={() => openEdit(land)} className="rounded-xl p-2 text-slate-500 transition hover:text-white">
                      <Wheat size={16} />
                    </button>
                    <button onClick={() => deleteLand(land.id)} className="rounded-xl p-2 text-slate-500 transition hover:text-red-400">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/5 bg-slate-950/40 px-4 py-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Ruler size={14} />
                      <span className="text-xs">Surface</span>
                    </div>
                    <p className="mt-1 font-semibold text-white">{land.surface} {land.surfaceUnit}</p>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-slate-950/40 px-4 py-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Sprout size={14} />
                      <span className="text-xs">Growth Stage</span>
                    </div>
                    <p className="mt-1 font-semibold text-white">{land.growthStage}</p>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-slate-950/40 px-4 py-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Sun size={14} />
                      <span className="text-xs">Climate Zone</span>
                    </div>
                    <p className="mt-1 font-semibold text-white">{land.climateZone}</p>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-slate-950/40 px-4 py-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin size={14} />
                      <span className="text-xs">Location</span>
                    </div>
                    <p className="mt-1 truncate font-semibold text-white" title={land.address}>
                      {land.address || (land.latitude && land.longitude ? `${land.latitude}, ${land.longitude}` : "—")}
                    </p>
                  </div>
                </div>

                {/* Map Snapshot */}
                {land.mapSnapshot && (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-white/5">
                    <img
                      src={land.mapSnapshot}
                      alt={`${land.name} map`}
                      className="h-32 w-full object-cover"
                    />
                  </div>
                )}

                {/* Monitoring Summary */}
                {(sessions.length > 0 || readings.length > 0) && (
                  <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-white/5 pt-4">
                    {sessions.length > 0 && (
                      <span className="flex items-center gap-1.5 rounded-xl bg-cyan-500/5 px-3 py-1 text-xs text-cyan-400">
                        <Activity size={12} />
                        {sessions.length} session{sessions.length > 1 ? "s" : ""}
                      </span>
                    )}
                    {readings.length > 0 && (
                      <span className="flex items-center gap-1.5 rounded-xl bg-green-500/5 px-3 py-1 text-xs text-green-400">
                        <Clock size={12} />
                        {readings.length} reading{readings.length > 1 ? "s" : ""}
                      </span>
                    )}
                    <button
                      onClick={() => setPreviewLandId(land.id)}
                      className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-1 text-xs text-slate-400 transition hover:text-white"
                    >
                      <MapIcon size={12} />
                      Map
                    </button>
                    <button
                      onClick={() => setMonitoringLandId(land.id)}
                      className="ml-auto flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-1 text-xs text-slate-400 transition hover:text-white"
                    >
                      <Eye size={12} />
                      View Details
                    </button>
                  </div>
                )}

                {sessions.length === 0 && (
                  <div className="mt-4 border-t border-white/5 pt-4">
                    <p className="text-xs text-slate-500">No monitoring sessions yet. Start monitoring from the Dashboard.</p>
                  </div>
                )}

                <p className="mt-4 text-xs text-slate-600">Added {new Date(land.createdAt).toLocaleDateString()}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Map Preview Modal */}
      {previewLandId && (() => {
        const land = lands.find((l) => l.id === previewLandId);
        if (!land) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm" onClick={() => setPreviewLandId(null)}>
            <div className="mx-4 w-full max-w-3xl rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-cyan-400" />
                  <h2 className="text-xl font-bold text-white">{land.name}</h2>
                  {land.address && <span className="text-sm text-slate-400">— {land.address}</span>}
                </div>
                <button onClick={() => setPreviewLandId(null)} className="rounded-xl border border-white/10 p-2 text-slate-400 transition hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <MapPreview latitude={land.latitude} longitude={land.longitude} polygon={land.polygon || []} />
              <div className="mt-4 flex items-center gap-6 text-sm text-slate-400">
                <span>{land.latitude?.toFixed(4)}, {land.longitude?.toFixed(4)}</span>
                {(land.polygon?.length || 0) >= 3 && <span>{land.polygon!.length} boundary points</span>}
                {land.surface > 0 && <span>{land.surface} {land.surfaceUnit}</span>}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Monitoring Details Modal */}
      {monitoringLand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
          <div className="mx-4 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                  <Activity size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{monitoringLand.name}</h2>
                  <p className="text-sm text-slate-400">Monitoring History</p>
                </div>
              </div>
              <button onClick={() => setMonitoringLandId(null)} className="rounded-xl border border-white/10 p-2 text-slate-400 transition hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Stats Summary */}
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-white/5 bg-slate-950/40 px-5 py-4">
                <p className="text-xs text-slate-500">Total Sessions</p>
                <p className="mt-1 text-2xl font-black text-white">{monitoringSessions.length}</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-slate-950/40 px-5 py-4">
                <p className="text-xs text-slate-500">Total Readings</p>
                <p className="mt-1 text-2xl font-black text-white">{monitoringReadings.length}</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-slate-950/40 px-5 py-4">
                <p className="text-xs text-slate-500">Avg Moisture</p>
                <p className="mt-1 text-2xl font-black text-cyan-400">{avgValue(monitoringReadings, "moisture")}%</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-slate-950/40 px-5 py-4">
                <p className="text-xs text-slate-500">Avg Temperature</p>
                <p className="mt-1 text-2xl font-black text-orange-400">{avgValue(monitoringReadings, "temperature")}°C</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/5 bg-slate-950/40 px-5 py-4">
                <p className="text-xs text-slate-500">Avg EC</p>
                <p className="mt-1 text-2xl font-black text-yellow-400">{avgValue(monitoringReadings, "ec")} µS/cm</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-slate-950/40 px-5 py-4">
                <p className="text-xs text-slate-500">Avg pH</p>
                <p className="mt-1 text-2xl font-black text-purple-400">{avgValue(monitoringReadings, "ph")}</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-slate-950/40 px-5 py-4">
                <p className="text-xs text-slate-500">Avg NPK</p>
                <p className="mt-1 text-lg font-black text-green-400">
                  {avgValue(monitoringReadings, "nitrogen")} / {avgValue(monitoringReadings, "phosphorus")} / {avgValue(monitoringReadings, "potassium")}
                </p>
              </div>
            </div>

            {/* Sessions */}
            {monitoringSessions.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-white">Sessions</h3>
                <div className="mt-4 space-y-3">
                  {[...monitoringSessions].reverse().map((s) => {
                    const start = new Date(s.startTime);
                    const end = s.endTime ? new Date(s.endTime) : null;
                    const durMs = end ? end.getTime() - start.getTime() : Date.now() - start.getTime();
                    const durMin = Math.floor(durMs / 60000);
                    const durSec = Math.floor((durMs % 60000) / 1000);
                    return (
                      <div key={s.id} className="rounded-2xl border border-white/5 bg-slate-950/40 px-5 py-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex flex-wrap items-center gap-4">
                            <span className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Clock size={12} />
                              {start.toLocaleDateString()} {start.toLocaleTimeString()}
                            </span>
                            {end ? (
                              <>
                                <span className="text-slate-600">&rarr;</span>
                                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                                  <Clock size={12} />
                                  {end.toLocaleDateString()} {end.toLocaleTimeString()}
                                </span>
                              </>
                            ) : (
                              <span className="rounded-xl bg-green-500/10 px-3 py-0.5 text-xs text-green-400">Active</span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span>Duration: {durMin}m {durSec}s</span>
                            <span className="rounded-xl bg-cyan-500/10 px-3 py-0.5 text-cyan-400">{s.readingCount} readings</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Latest Readings */}
            {sortedReadings.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-white">Latest Readings</h3>
                <div className="mt-4 max-h-80 overflow-y-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-left text-xs text-slate-500">
                        <th className="pb-3 font-medium">Time</th>
                        <th className="pb-3 font-medium">Moisture</th>
                        <th className="pb-3 font-medium">Temp</th>
                        <th className="pb-3 font-medium">EC</th>
                        <th className="pb-3 font-medium">pH</th>
                        <th className="pb-3 font-medium">N</th>
                        <th className="pb-3 font-medium">P</th>
                        <th className="pb-3 font-medium">K</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedReadings.slice(0, 50).map((r, i) => (
                        <tr key={i} className="border-b border-white/5 text-sm">
                          <td className="py-3 text-xs text-slate-500">{new Date(r.time).toLocaleTimeString()}</td>
                          <td className="py-3 text-cyan-400">{r.moisture.toFixed(1)}%</td>
                          <td className="py-3 text-orange-400">{r.temperature.toFixed(1)}°C</td>
                          <td className="py-3 text-yellow-400">{r.ec.toFixed(0)}</td>
                          <td className="py-3 text-purple-400">{r.ph.toFixed(1)}</td>
                          <td className="py-3 text-green-400">{r.nitrogen.toFixed(0)}</td>
                          <td className="py-3 text-emerald-400">{r.phosphorus.toFixed(0)}</td>
                          <td className="py-3 text-lime-400">{r.potassium.toFixed(0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {monitoringSessions.length === 0 && monitoringReadings.length === 0 && (
              <div className="mt-12 text-center">
                <p className="text-slate-500">No monitoring data yet. Go to Dashboard, select this land, and start the bridge.</p>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setMonitoringLandId(null)}
                className="rounded-2xl border border-white/10 px-6 py-3 text-sm text-slate-400 transition hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
