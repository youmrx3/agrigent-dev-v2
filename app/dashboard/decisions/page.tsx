"use client";
import { useEffect, useState, useCallback } from "react";
import { useDashboardStore, LandReading, MonitoringSession } from "@/stores/dashboard-store";
import { ClipboardList, AlertTriangle, AlertCircle, CheckCircle, X, Eye, EyeOff, Pencil, Save } from "lucide-react";

type RuleSet = {
  parameters: Record<string, ParameterRule>;
  overall: OverallConfig;
};

type Level = {
  min: number;
  max: number;
  status: string;
  label: string;
  action: string;
};

type ParameterRule = {
  label: string;
  unit: string;
  optimal: { min: number; max: number };
  levels: Level[];
};

type OverallConfig = {
  status_priority: string[];
  summary_templates: Record<string, string>;
};

type ParameterResult = {
  key: string;
  label: string;
  unit: string;
  avg: number;
  level: Level;
};

type SessionAnalysis = {
  session: MonitoringSession;
  readings: LandReading[];
  parameters: ParameterResult[];
  overallStatus: string;
  summary: string;
  decisionOverride?: string;
};

type LandAnalysis = {
  landId: string;
  landName: string;
  sessions: SessionAnalysis[];
};

const STORAGE_KEY = "agrigent-decision-overrides";

function loadOverrides(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveOverrides(overrides: Record<string, string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

function evaluateParameter(rules: ParameterRule, readings: LandReading[], key: string): ParameterResult {
  const values = readings.map((r) => r[key as keyof LandReading] as number);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;

  const matched = rules.levels.find((l) => avg >= l.min && avg < l.max);
  const level = matched || rules.levels[rules.levels.length - 1];

  return { key, label: rules.label, unit: rules.unit, avg, level };
}

function buildSummary(overallStatus: string, params: ParameterResult[], template: string, landName: string): string {
  if (overallStatus === "good") {
    return template.replace("{landName}", landName);
  }

  const criticalCount = params.filter((p) => p.level.status === "critical").length;
  const warningCount = params.filter((p) => p.level.status === "warning").length;

  if (overallStatus === "critical") {
    const t = template.replace("{landName}", landName).replace("{criticalCount}", String(criticalCount));
    return t;
  }

  const offParams = params.filter((p) => p.level.status !== "good");
  const details = offParams
    .slice(0, 3)
    .map((p) => `${p.label} (${p.avg.toFixed(1)}${p.unit}) is ${p.level.label.toLowerCase()}`)
    .join("; ");

  return `${landName}: ${details}. Review recommendations.`;
}

function analyzeLand(
  landId: string,
  landName: string,
  sessions: MonitoringSession[],
  readings: LandReading[],
  rules: RuleSet,
  overrides: Record<string, string>
): LandAnalysis {
  const sessionAnalyses: SessionAnalysis[] = [];
  const statusPriority = rules.overall.status_priority;

  for (const session of sessions) {
    const sessionReadings = readings.filter((r) => {
      const rt = new Date(r.time).getTime();
      const st = new Date(session.startTime).getTime();
      const et = session.endTime ? new Date(session.endTime).getTime() : Infinity;
      return rt >= st && rt <= et;
    });

    if (sessionReadings.length === 0) continue;

    const params: ParameterResult[] = [];
    let worstIdx = statusPriority.length;

    for (const [key, rule] of Object.entries(rules.parameters)) {
      if (!(key in sessionReadings[0])) continue;
      const result = evaluateParameter(rule, sessionReadings, key);
      params.push(result);
      const idx = statusPriority.indexOf(result.level.status);
      if (idx >= 0 && idx < worstIdx) worstIdx = idx;
    }

    const overallStatus = worstIdx < statusPriority.length ? statusPriority[worstIdx] : "good";
    const templateKey = overallStatus === "critical" ? "critical_action" : overallStatus === "good" ? "all_good" : "some_issues";
    const template = rules.overall.summary_templates[templateKey] || "";
    const summary = buildSummary(overallStatus, params, template, landName);

    sessionAnalyses.push({
      session,
      readings: sessionReadings,
      parameters: params,
      overallStatus,
      summary,
      decisionOverride: overrides[session.id] || undefined,
    });
  }

  return { landId, landName, sessions: sessionAnalyses };
}

function StatusIcon({ status }: { status: string }) {
  if (status === "good") return <CheckCircle size={16} className="text-green-400" />;
  if (status === "low") return <AlertTriangle size={16} className="text-yellow-400" />;
  if (status === "warning") return <AlertTriangle size={16} className="text-orange-400" />;
  return <AlertCircle size={16} className="text-red-400" />;
}

function getStatusColor(status: string): string {
  if (status === "good") return "text-green-400 border-green-500/20 bg-green-500/10";
  if (status === "low") return "text-yellow-400 border-yellow-500/20 bg-yellow-500/10";
  if (status === "warning") return "text-orange-400 border-orange-500/20 bg-orange-500/10";
  return "text-red-400 border-red-500/20 bg-red-500/10";
}

export default function DecisionsPage() {
  const { lands, monitoringSessions, landReadings } = useDashboardStore();
  const [rules, setRules] = useState<RuleSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState<LandAnalysis | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [showRulesEditor, setShowRulesEditor] = useState(false);
  const [rulesEditText, setRulesEditText] = useState("");
  const [showLandsWithoutData, setShowLandsWithoutData] = useState(false);

  useEffect(() => {
    fetch("/api/decision-rules")
      .then((r) => r.json())
      .then(setRules)
      .catch(() => setRules(null))
      .finally(() => setLoading(false));
  }, []);

  const overrides = loadOverrides();

  const analyses: LandAnalysis[] = [];
  for (const land of lands) {
    const sessions = monitoringSessions.filter((s) => s.landId === land.id);
    const readings = landReadings[land.id] || [];
    if (sessions.length === 0 && !showLandsWithoutData) continue;
    if (rules) {
      analyses.push(analyzeLand(land.id, land.name, sessions, readings, rules, overrides));
    }
  }

  function getWorstOverall(analysis: LandAnalysis): string {
    const priority = rules?.overall.status_priority || [];
    let worst = priority.length;
    for (const s of analysis.sessions) {
      const idx = priority.indexOf(s.overallStatus);
      if (idx >= 0 && idx < worst) worst = idx;
    }
    return worst < priority.length ? priority[worst] : "good";
  }

  function getOverallReadingsCount(analysis: LandAnalysis): number {
    return analysis.sessions.reduce((a, s) => a + s.readings.length, 0);
  }

  function handleSaveDecisionOverride(sessionId: string) {
    const current = loadOverrides();
    if (editText.trim()) {
      current[sessionId] = editText.trim();
    } else {
      delete current[sessionId];
    }
    saveOverrides(current);
    setEditingSessionId(null);
  }

  const handleEditRulesSave = useCallback(() => {
    try {
      const parsed = JSON.parse(rulesEditText);
      setRules(parsed);
      setShowRulesEditor(false);
    } catch {
      alert("Invalid JSON. Check the syntax and try again.");
    }
  }, [rulesEditText]);

  function openRulesEditor() {
    setRulesEditText(JSON.stringify(rules, null, 2));
    setShowRulesEditor(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
            <ClipboardList size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Decisions & Analysis</h1>
            <p className="mt-1 text-slate-400">
              Rule-based crop analysis and recommendations per monitoring session
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLandsWithoutData(!showLandsWithoutData)}
            className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm transition ${
              showLandsWithoutData
                ? "border-cyan-500/30 text-cyan-400"
                : "border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            {showLandsWithoutData ? <EyeOff size={16} /> : <Eye size={16} />}
            {showLandsWithoutData ? "Hide Empty" : "Show All Lands"}
          </button>
          <button
            onClick={openRulesEditor}
            className="flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-400 transition hover:text-white"
          >
            <Pencil size={16} />
            Edit Rules
          </button>
        </div>
      </div>

      {loading && (
        <div className="mt-16 text-center">
          <p className="text-slate-500">Loading decision rules...</p>
        </div>
      )}

      {!loading && !rules && (
        <div className="mt-16 rounded-3xl border border-dashed border-red-500/20 bg-red-500/5 p-12 text-center">
          <AlertCircle size={32} className="mx-auto text-red-400" />
          <h2 className="mt-4 text-xl font-bold text-white">Failed to Load Rules</h2>
          <p className="mt-2 text-slate-400">Could not load decision rules. Make sure config/decision-rules.json exists.</p>
        </div>
      )}

      {!loading && rules && analyses.length === 0 && (
        <div className="mt-16 rounded-3xl border border-dashed border-white/10 bg-slate-900/30 p-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
            <ClipboardList size={32} />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-white">No Monitoring Data Yet</h2>
          <p className="mt-3 text-slate-400">
            Start monitoring a land from the Dashboard to see analysis here.
          </p>
        </div>
      )}

      {rules && analyses.length > 0 && (
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {analyses.map((analysis) => {
            const worst = getWorstOverall(analysis);
            const totalReadings = getOverallReadingsCount(analysis);
            return (
              <div
                key={analysis.landId}
                className={`group cursor-pointer rounded-3xl border p-6 transition hover:border-cyan-500/30 ${getStatusColor(worst)}`}
                onClick={() => setSelectedAnalysis(analysis)}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${getStatusColor(worst)}`}>
                    <StatusIcon status={worst} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{analysis.landName}</h3>
                    <p className="text-sm text-slate-400">
                      {analysis.sessions.length} session{analysis.sessions.length > 1 ? "s" : ""} &middot; {totalReadings} reading{totalReadings !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {analysis.sessions.slice(0, 3).map((s) => {
                    const statusColor = getStatusColor(s.overallStatus).split(" ")[0];
                    return (
                      <span
                        key={s.session.id}
                        className={`rounded-xl px-3 py-1 text-xs ${s.overallStatus === "good" ? "bg-green-500/10 text-green-400" : s.overallStatus === "warning" ? "bg-orange-500/10 text-orange-400" : s.overallStatus === "critical" ? "bg-red-500/10 text-red-400" : "bg-yellow-500/10 text-yellow-400"}`}
                      >
                        {new Date(s.session.startTime).toLocaleDateString()}
                      </span>
                    );
                  })}
                  {analysis.sessions.length > 3 && (
                    <span className="text-xs text-slate-500">+{analysis.sessions.length - 3} more</span>
                  )}
                </div>

                <p className="mt-4 line-clamp-2 text-sm text-slate-300">
                  {analysis.sessions[0]?.summary || "No analysis available."}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Session Analysis Modal */}
      {selectedAnalysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
          <div className="mx-4 max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                  <ClipboardList size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedAnalysis.landName}</h2>
                  <p className="text-sm text-slate-400">
                    {selectedAnalysis.sessions.length} session{selectedAnalysis.sessions.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAnalysis(null)}
                className="rounded-xl border border-white/10 p-2 text-slate-400 transition hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-8 space-y-8">
              {selectedAnalysis.sessions.map((sa, si) => (
                <div key={sa.session.id} className="rounded-3xl border border-white/10 bg-slate-950/40 p-6">
                  {/* Session header */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className={`rounded-2xl border px-4 py-1.5 text-sm font-medium ${getStatusColor(sa.overallStatus)}`}>
                        <span className="flex items-center gap-2">
                          <StatusIcon status={sa.overallStatus} />
                          Session {si + 1}
                        </span>
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(sa.session.startTime).toLocaleString()}
                        {sa.session.endTime && (
                          <> &rarr; {new Date(sa.session.endTime).toLocaleString()}</>
                        )}
                        {!sa.session.endTime && <span className="ml-2 text-green-400">(Active)</span>}
                      </span>
                    </div>
                    <span className="rounded-xl bg-slate-800 px-3 py-1 text-xs text-slate-400">
                      {sa.readings.length} readings
                    </span>
                  </div>

                  {/* Parameters grid */}
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {sa.parameters.map((p) => {
                      const color = getStatusColor(p.level.status);
                      return (
                        <div key={p.key} className={`rounded-2xl border p-4 ${color}`}>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400">{p.label}</span>
                            <StatusIcon status={p.level.status} />
                          </div>
                          <p className="mt-1 text-xl font-black text-white">
                            {p.avg.toFixed(1)}
                            {p.unit && <span className="ml-1 text-xs font-normal text-slate-500">{p.unit}</span>}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">{p.level.label}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Decision / Summary */}
                  <div className="mt-5 rounded-2xl border border-white/5 bg-slate-950/60 p-5">
                    <h4 className="text-sm font-semibold text-white">Decision &mdash; {sa.overallStatus === "good" ? "No Action Needed" : sa.overallStatus === "critical" ? "Urgent Action Required" : "Action Recommended"}</h4>

                    {editingSessionId === sa.session.id ? (
                      <div className="mt-3 space-y-3">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full rounded-2xl border border-white/10 bg-slate-950 px-5 py-3 text-sm text-white outline-none focus:border-cyan-500/50"
                          rows={4}
                        />
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleSaveDecisionOverride(sa.session.id)}
                            className="flex items-center gap-2 rounded-2xl bg-cyan-500 px-5 py-2 text-sm font-semibold text-white hover:bg-cyan-400"
                          >
                            <Save size={14} />
                            Save
                          </button>
                          <button
                            onClick={() => setEditingSessionId(null)}
                            className="rounded-2xl border border-white/10 px-5 py-2 text-sm text-slate-400 hover:text-white"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="mt-3 text-sm leading-relaxed text-slate-200">
                          {sa.decisionOverride || sa.summary}
                        </p>
                        {sa.overallStatus !== "good" && (
                          <div className="mt-3 space-y-1">
                            {sa.parameters
                              .filter((p) => p.level.status !== "good")
                              .map((p) => (
                                <p key={p.key} className="text-xs text-slate-400">
                                  &bull; <span className="font-medium text-slate-300">{p.label}</span>: {p.level.action}
                                </p>
                              ))}
                          </div>
                        )}
                        <button
                          onClick={() => {
                            setEditingSessionId(sa.session.id);
                            setEditText(sa.decisionOverride || sa.summary);
                          }}
                          className="mt-3 flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
                        >
                          <Pencil size={12} />
                          Edit decision
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setSelectedAnalysis(null)}
                className="rounded-2xl border border-white/10 px-6 py-3 text-sm text-slate-400 transition hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rules Editor Modal */}
      {showRulesEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
          <div className="mx-4 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Edit Decision Rules</h2>
              <button
                onClick={() => setShowRulesEditor(false)}
                className="rounded-xl border border-white/10 p-2 text-slate-400 transition hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-400">
              Edit the JSON rules below. Changes apply immediately in the current session.
              To make permanent changes, update config/decision-rules.json.
            </p>
            <textarea
              value={rulesEditText}
              onChange={(e) => setRulesEditText(e.target.value)}
              className="mt-6 h-96 w-full rounded-2xl border border-white/10 bg-slate-950 px-5 py-4 font-mono text-sm text-white outline-none focus:border-cyan-500/50"
              spellCheck={false}
            />
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setShowRulesEditor(false)}
                className="rounded-2xl border border-white/10 px-6 py-3 text-sm text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleEditRulesSave}
                className="rounded-2xl bg-cyan-500 px-8 py-3 text-sm font-semibold text-white hover:bg-cyan-400"
              >
                Apply Rules
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
