"use client";

import { useEffect, useState, useCallback } from "react";

export type SensorReading = {
  moisture: number;
  temperature: number;
  ec: number;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  timestamp: string;
};

type SensorStatus = {
  connected: boolean;
  port: string | null;
  reading: SensorReading | null;
};

export type PortInfo = {
  path: string;
  manufacturer: string | null;
};

export function useLiveSensor() {
  const [status, setStatus] = useState<SensorStatus>({
    connected: false,
    port: null,
    reading: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ports, setPorts] = useState<PortInfo[]>([]);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/sensor/live");
      if (!res.ok) throw new Error("Failed to fetch sensor data");
      const data: SensorStatus & { ports?: PortInfo[] } = await res.json();
      setStatus({
        connected: data.connected,
        port: data.port,
        reading: data.reading,
      });
      setError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const listPorts = useCallback(async () => {
    try {
      const res = await fetch("/api/sensor/live?action=list");
      if (!res.ok) throw new Error("Failed to list ports");
      const data = await res.json();
      setPorts(data.ports || []);
      return data.ports || [];
    } catch {
      return [];
    }
  }, []);

  const connect = useCallback(async (portPath: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sensor/live?connect=${encodeURIComponent(portPath)}`);
      if (!res.ok) throw new Error("Failed to connect");
      const data = await res.json();
      if (data.connected) {
        setStatus((prev) => ({ ...prev, connected: true, port: portPath }));
      }
      return data.connected;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  return { ...status, loading, error, ports, listPorts, connect };
}
