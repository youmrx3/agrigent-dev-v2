import { create } from "zustand";
import { persist } from "zustand/middleware";

type Stat = {
  title: string;
  value: string;
  valueColor?: string;
};

type WaterPoint = {
  day: string;
  value: number;
};

type Sensor = {
  id: string;
  location: string;
  moisture: string;
  npk: string;
  ph: string;
  temperature: string;
  status: string;
};

type ReadingRecord = {
  id: string;
  timestamp: string;
  moisture: number;
  npk: number;
  ph: number;
  temperature: number;
  profileName: string;
  recommendation: string;
  outcome: string | null;
};

type RecommendationItem = {
  parameter: string;
  value: number;
  optimalRange: string;
  unit: string;
  status: "within" | "below" | "above";
  deviation: "mild" | "moderate" | "significant" | null;
  correctiveAction: string;
};

type AIInsight = {
  title: string;
  confidence: string;
  status: string;
};

export type LiveHistoryPoint = {
  time: string;
  moisture: number;
  temperature: number;
  ec: number;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  landId?: string;
};

export type Characteristic = {
  key: string;
  value: string;
};

export type LatLng = {
  lat: number;
  lng: number;
};

export type Land = {
  id: string;
  name: string;
  surface: number;
  surfaceUnit: "hectares" | "m²" | "acres";
  plants: string;
  address: string;
  latitude: number;
  longitude: number;
  polygon: LatLng[];
  mapSnapshot: string | null;
  growthStage: string;
  climateZone: string;
  characteristics: Characteristic[];
  createdAt: string;
};

export type LandReading = {
  time: string;
  moisture: number;
  temperature: number;
  ec: number;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
};

export type MonitoringSession = {
  id: string;
  landId: string;
  landName: string;
  startTime: string;
  endTime: string | null;
  readingCount: number;
};

type DashboardStore = {
  stats: Stat[];
  waterAnalytics: WaterPoint[];
  sensors: Sensor[];
  readings: ReadingRecord[];
  activeRecommendations: RecommendationItem[];
  aiInsights: AIInsight[];
  readingHistory: LiveHistoryPoint[];
  loading: boolean;
  error: string | null;

  lands: Land[];
  selectedLandId: string | null;
  monitoringSessions: MonitoringSession[];
  landReadings: Record<string, LandReading[]>;
  currentSessionId: string | null;

  setStats: (stats: Stat[]) => void;
  setWaterAnalytics: (data: WaterPoint[] | ((current: WaterPoint[]) => WaterPoint[])) => void;
  setSensors: (sensors: Sensor[] | ((current: Sensor[]) => Sensor[])) => void;
  setReadings: (readings: ReadingRecord[]) => void;
  setActiveRecommendations: (recommendations: RecommendationItem[]) => void;
  setAIInsights: (insights: AIInsight[] | ((current: AIInsight[]) => AIInsight[])) => void;
  addReadingHistory: (point: LiveHistoryPoint) => void;
  clearReadingHistory: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  addLand: (land: Land) => void;
  updateLand: (id: string, data: Partial<Land>) => void;
  deleteLand: (id: string) => void;
  setSelectedLandId: (id: string | null) => void;
  getSelectedLand: () => Land | undefined;

  startMonitoringSession: (landId: string) => string | null;
  stopCurrentSession: () => void;
  addLandReading: (reading: LandReading) => void;
  getLandReadings: (landId: string) => LandReading[];
  getLandSessions: (landId: string) => MonitoringSession[];
};

function generateId(): string {
  return crypto.randomUUID();
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set, get) => ({
      stats: [],
      waterAnalytics: [],
      sensors: [],
      readings: [],
      activeRecommendations: [],
      aiInsights: [],
      readingHistory: [],
      loading: true,
      error: null,

      lands: [],
      selectedLandId: null,
      monitoringSessions: [],
      landReadings: {},
      currentSessionId: null,

      setStats: (stats) => set({ stats }),

      setWaterAnalytics: (data) =>
        set((state) => ({
          waterAnalytics: typeof data === "function" ? data(state.waterAnalytics) : data,
        })),

      setSensors: (sensors) =>
        set((state) => ({
          sensors: typeof sensors === "function" ? sensors(state.sensors) : sensors,
        })),

      setReadings: (readings) => set({ readings }),

      setActiveRecommendations: (recommendations) => set({ activeRecommendations: recommendations }),

      setAIInsights: (insights) =>
        set((state) => ({
          aiInsights: typeof insights === "function" ? insights(state.aiInsights) : insights,
        })),

      addReadingHistory: (point) =>
        set((state) => ({
          readingHistory: [
            ...state.readingHistory.slice(-99),
            { ...point, landId: state.selectedLandId || undefined },
          ],
        })),

      clearReadingHistory: () => set({ readingHistory: [] }),

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      addLand: (land) =>
        set((state) => ({ lands: [...state.lands, land] })),

      updateLand: (id, data) =>
        set((state) => ({
          lands: state.lands.map((l) => (l.id === id ? { ...l, ...data } : l)),
        })),

      deleteLand: (id) =>
        set((state) => ({
          lands: state.lands.filter((l) => l.id !== id),
          selectedLandId: state.selectedLandId === id ? null : state.selectedLandId,
        })),

      setSelectedLandId: (id) => set({ selectedLandId: id }),

      getSelectedLand: () => {
        const state = get();
        return state.lands.find((l) => l.id === state.selectedLandId);
      },

      startMonitoringSession: (landId: string) => {
        const state = get();
        const land = state.lands.find((l) => l.id === landId);
        if (!land) return null;

        if (state.currentSessionId) {
          const sessions = state.monitoringSessions.map((s) =>
            s.id === state.currentSessionId ? { ...s, endTime: new Date().toISOString() } : s
          );
          set({ monitoringSessions: sessions, currentSessionId: null });
        }

        const session: MonitoringSession = {
          id: generateId(),
          landId,
          landName: land.name,
          startTime: new Date().toISOString(),
          endTime: null,
          readingCount: 0,
        };

        set({
          monitoringSessions: [...state.monitoringSessions, session],
          currentSessionId: session.id,
        });

        return session.id;
      },

      stopCurrentSession: () => {
        const state = get();
        if (!state.currentSessionId) return;

        set({
          monitoringSessions: state.monitoringSessions.map((s) =>
            s.id === state.currentSessionId
              ? { ...s, endTime: new Date().toISOString() }
              : s
          ),
          currentSessionId: null,
        });
      },

      addLandReading: (reading) => {
        const state = get();
        if (!state.selectedLandId) return;

        const landId = state.selectedLandId;
        const current = state.landReadings[landId] || [];

        set({
          landReadings: {
            ...state.landReadings,
            [landId]: [...current, reading],
          },
          monitoringSessions: state.monitoringSessions.map((s) =>
            s.id === state.currentSessionId
              ? { ...s, readingCount: s.readingCount + 1 }
              : s
          ),
        });
      },

      getLandReadings: (landId: string) => {
        return get().landReadings[landId] || [];
      },

      getLandSessions: (landId: string) => {
        return get().monitoringSessions.filter((s) => s.landId === landId);
      },
    }),
    {
      name: "agrigent-lands",
      partialize: (state) => ({
        lands: state.lands,
        selectedLandId: state.selectedLandId,
        monitoringSessions: state.monitoringSessions,
        landReadings: state.landReadings,
        currentSessionId: state.currentSessionId,
      }),
    }
  )
);
