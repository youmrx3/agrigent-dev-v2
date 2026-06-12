import fs from "fs";
import path from "path";
import { execSync, spawn, ChildProcess } from "child_process";

export type LiveSensorReading = {
  moisture: number;
  temperature: number;
  ec: number;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  timestamp: string;
};

const DATA_FILE = path.join(process.cwd(), "data", "latest-sensor.json");

export function getLatestReading(): LiveSensorReading | null {
  try {
    if (!fs.existsSync(DATA_FILE)) return null;
    const raw = fs.readFileSync(DATA_FILE, "utf-8").trim();
    if (!raw || raw === "{}") return null;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed.moisture !== "number" ||
      typeof parsed.temperature !== "number"
    ) {
      return null;
    }
    return parsed as LiveSensorReading;
  } catch {
    return null;
  }
}

export function isConnected(): boolean {
  const reading = getLatestReading();
  if (!reading) return false;
  const age = Date.now() - new Date(reading.timestamp).getTime();
  return age < 15000;
}

let cachedPortName: string | null = null;

export function getPortPath(): string | null {
  if (!isConnected()) return null;
  if (cachedPortName) return cachedPortName;
  const reading = getLatestReading();
  return reading ? "USB (bridge active)" : null;
}

export async function listPorts(): Promise<{ path: string; manufacturer: string | null }[]> {
  try {
    const scriptPath = path.join(process.cwd(), "scripts", "list-ports.js");
    if (!fs.existsSync(scriptPath)) return [];
    const output = execSync(`"${process.execPath}" "${scriptPath}"`, {
      cwd: process.cwd(),
      encoding: "utf-8",
      timeout: 5000,
      shell: "cmd.exe",
    });
    return JSON.parse(output);
  } catch {
    return [];
  }
}

export async function detectAndStartBridge(): Promise<{ success: boolean; port?: string; error?: string }> {
  try {
    const ports = await listPorts();
    const espPort = ports.find(
      (p) =>
        p.path.toUpperCase().startsWith("COM") ||
        (p.manufacturer && p.manufacturer.toLowerCase().includes("silicon"))
    );
    if (!espPort) {
      return { success: false, error: "No ESP32 serial device found. Plug in your sensor." };
    }
    cachedPortName = `${espPort.path} (${espPort.manufacturer || "ESP32"})`;
    return { success: true, port: cachedPortName };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

let bridgeProcess: ChildProcess | null = null;

export function isBridgeRunning(): boolean {
  return bridgeProcess !== null && !bridgeProcess.killed;
}

export async function startBridge(): Promise<{ success: boolean; port?: string; error?: string }> {
  if (isBridgeRunning()) {
    return { success: true, port: cachedPortName || "bridge active" };
  }

  const detect = await detectAndStartBridge();
  if (!detect.success) {
    return detect;
  }

  const scriptPath = path.join(process.cwd(), "scripts", "serial-bridge.js");

  if (!fs.existsSync(scriptPath)) {
    return { success: false, error: "serial-bridge.js not found" };
  }

  try {
    bridgeProcess = spawn(process.execPath, [scriptPath], {
      cwd: process.cwd(),
      stdio: "ignore",
    });

    bridgeProcess.on("error", (err) => {
      bridgeProcess = null;
    });

    bridgeProcess.on("exit", () => {
      bridgeProcess = null;
    });

    return { success: true, port: cachedPortName || "bridge active" };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

export function stopBridge(): { success: boolean } {
  if (bridgeProcess && !bridgeProcess.killed) {
    bridgeProcess.kill();
    bridgeProcess = null;
  }
  cachedPortName = null;
  return { success: true };
}

export async function connectToSensor(_path: string): Promise<void> {
  cachedPortName = _path;
}

export function disconnectSensor(): void {
  cachedPortName = null;
}
