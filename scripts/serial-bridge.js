const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "data", "latest-sensor.json");

function parseSensorData(lines) {
  try {
    const result = {};
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("Moisture:"))
        result.moisture = parseFloat(trimmed.split(":")[1].trim().replace("%", ""));
      else if (trimmed.startsWith("Temperature:"))
        result.temperature = parseFloat(trimmed.split(":")[1].trim().replace("C", ""));
      else if (trimmed.startsWith("EC:"))
        result.ec = parseInt(trimmed.split(":")[1].trim(), 10);
      else if (trimmed.startsWith("pH:"))
        result.ph = parseFloat(trimmed.split(":")[1].trim());
      else if (trimmed.startsWith("Nitrogen:"))
        result.nitrogen = parseInt(trimmed.split(":")[1].trim(), 10);
      else if (trimmed.startsWith("Phosphorus:"))
        result.phosphorus = parseInt(trimmed.split(":")[1].trim(), 10);
      else if (trimmed.startsWith("Potassium:"))
        result.potassium = parseInt(trimmed.split(":")[1].trim(), 10);
    }
    if (result.moisture !== undefined) return result;
    return null;
  } catch {
    return null;
  }
}

async function findEsp32Port() {
  const ports = await SerialPort.list();
  const espPort = ports.find(
    (p) =>
      (p.vendorId && p.vendorId.toLowerCase().includes("10c4")) ||
      (p.vendorId && p.vendorId.toLowerCase().includes("1a86")) ||
      (p.manufacturer && p.manufacturer.toLowerCase().includes("silicon")) ||
      (p.manufacturer && p.manufacturer.toLowerCase().includes("ch340")) ||
      (p.manufacturer && p.manufacturer.toLowerCase().includes("wch"))
  );
  return espPort || null;
}

async function main() {
  const args = process.argv.slice(2);
  let portPath = args[0] || null;

  if (!portPath) {
    console.log("Scanning for ESP32 USB serial port...");
    const espPort = await findEsp32Port();
    if (espPort) {
      portPath = espPort.path;
      console.log(`Found: ${portPath} (${espPort.manufacturer || "Unknown device"})`);
    } else {
      const allPorts = await SerialPort.list();
      if (allPorts.length === 0) {
        console.error("No serial ports found. Plug in your ESP32.");
        process.exit(1);
      }
      console.error("Available ports:");
      allPorts.forEach((p) =>
        console.error(`  ${p.path} - ${p.manufacturer || "Unknown"} (${p.vendorId || ""}:${p.productId || ""})`)
      );
      console.error(`Usage: node scripts/serial-bridge.js <COM_PORT>`);
      process.exit(1);
    }
  }

  console.log(`Connecting to ${portPath} at 115200 baud...`);

  const port = new SerialPort({ path: portPath, baudRate: 115200 });
  const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

  let collecting = false;
  let lines = [];

  parser.on("data", (line) => {
    const trimmed = line.trim();

    if (trimmed === "========== SENSOR DATA ==========") {
      collecting = true;
      lines = [];
      return;
    }

    if (trimmed === "=================================" && collecting) {
      collecting = false;
      const reading = parseSensorData(lines);
      if (reading) {
        const payload = {
          ...reading,
          timestamp: new Date().toISOString(),
        };
        fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2));
        console.log(`[${new Date().toLocaleTimeString()}] Moisture: ${payload.moisture}% | Temp: ${payload.temperature}C | pH: ${payload.ph} | EC: ${payload.ec} | N:${payload.nitrogen} P:${payload.phosphorus} K:${payload.potassium}`);
      }
      return;
    }

    if (collecting) {
      lines.push(trimmed);
    }
  });

  port.on("error", (err) => {
    console.error("Serial error:", err.message);
    process.exit(1);
  });

  process.on("SIGINT", () => {
    console.log("\nClosing serial port...");
    port.close();
    process.exit(0);
  });

  console.log("Bridge running. Press Ctrl+C to stop.");
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
