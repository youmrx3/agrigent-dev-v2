import { useDashboardStore } from "@/stores/dashboard-store";

export default function SensorTable() {
  const { sensors } = useDashboardStore();

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Sensor Units</h2>
          <p className="mt-2 text-slate-400">Field device status</p>
        </div>
        <div className="rounded-2xl bg-green-500/10 px-4 py-2 text-sm text-green-400">Live Data</div>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-left text-sm text-slate-400">
              <th className="pb-4 font-medium">Sensor ID</th>
              <th className="pb-4 font-medium">Location</th>
              <th className="pb-4 font-medium">Moisture</th>
              <th className="pb-4 font-medium">NPK</th>
              <th className="pb-4 font-medium">pH</th>
              <th className="pb-4 font-medium">Temperature</th>
              <th className="pb-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {sensors.map((sensor) => (
              <tr key={sensor.id} className="border-b border-white/5 text-sm text-white">
                <td className="py-5 font-medium">{sensor.id}</td>
                <td className="py-5 text-slate-300">{sensor.location}</td>
                <td className="py-5">{sensor.moisture}</td>
                <td className="py-5">{sensor.npk}</td>
                <td className="py-5">{sensor.ph}</td>
                <td className="py-5">{sensor.temperature}</td>
                <td className="py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      sensor.status === "Active"
                        ? "bg-green-500/10 text-green-400"
                        : sensor.status === "Warning"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-cyan-500/10 text-cyan-400"
                    }`}
                  >
                    {sensor.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
