import { NextRequest, NextResponse } from "next/server";
import {
  getLatestReading,
  isConnected,
  getPortPath,
  listPorts,
  connectToSensor,
  detectAndStartBridge,
  startBridge,
  stopBridge,
  isBridgeRunning,
} from "@/lib/serial-reader";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  if (searchParams.get("action") === "list") {
    const ports = await listPorts();
    return NextResponse.json({ ports });
  }

  if (searchParams.get("action") === "detect") {
    const result = await detectAndStartBridge();
    return NextResponse.json(result);
  }

  if (searchParams.get("action") === "start") {
    const result = await startBridge();
    return NextResponse.json(result);
  }

  if (searchParams.get("action") === "stop") {
    const result = stopBridge();
    return NextResponse.json(result);
  }

  const connectPort = searchParams.get("connect");
  if (connectPort) {
    if (isConnected() && getPortPath() === connectPort) {
      return NextResponse.json({ connected: true, port: connectPort });
    }
    try {
      await connectToSensor(connectPort);
      return NextResponse.json({ connected: true, port: connectPort });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ connected: false, error: msg }, { status: 500 });
    }
  }

  if (searchParams.get("action") === "status") {
    return NextResponse.json({
      connected: isConnected(),
      port: getPortPath(),
      bridge_running: isBridgeRunning(),
    });
  }

  const connected = isConnected();
  const reading = connected ? getLatestReading() : null;

  return NextResponse.json({
    connected,
    port: getPortPath(),
    bridge_running: isBridgeRunning(),
    reading,
  });
}
