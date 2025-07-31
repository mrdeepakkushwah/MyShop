const { execSync } = require("child_process");
const os = require("os");

try {
  if (os.platform() !== "win32") {
    console.log("🔧 Linux detected: Reinstalling debug module...");
    execSync("npm install debug@4.3.4 --save", { stdio: "inherit" });
  } else {
    console.log("⚠️ Windows detected: Skipping debug reinstall.");
  }
} catch (err) {
  console.error("❌ postinstall script failed:", err);
  process.exit(1);
}
