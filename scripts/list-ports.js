const { SerialPort } = require("serialport");
SerialPort.list().then((ports) => {
  const result = ports.map((p) => ({
    path: p.path,
    manufacturer: p.manufacturer || p.friendlyName || null,
  }));
  process.stdout.write(JSON.stringify(result));
}).catch((err) => {
  process.stderr.write(err.message);
  process.exit(1);
});
