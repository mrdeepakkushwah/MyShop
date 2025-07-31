const { execSync } = require("child_process");
const os = require("os");

try {
  if (os.platform() !== "win32") {
    console.log("🔧 Linux detected: Cleaning debug module...");
    execSync("rm -rf node_modules/debug && npm install debug@4.3.4", {
      stdio: "inherit",
    });
  } else {
    console.log("⚠️ Windows detected: Skipping debug cleanup.");
  }
} catch (err) {
  console.error("❌ postinstall script failed:", err);
  process.exit(1);
}
