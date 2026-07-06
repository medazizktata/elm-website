import { spawn } from "node:child_process";
import { existsSync } from "node:fs";

const port = process.env.PORT || "5173";

function parseDuration(input) {
 if (input == null || input === "") return null;
 if (/^\d+$/.test(String(input))) return Number(input);

 const match = String(input).trim().match(/^(\d+(?:\.\d+)?)(ms|s|m|h)?$/i);
 if (!match) {
 throw new Error(`Invalid duration: ${input}`);
 }

 const value = Number(match[1]);
 const unit = (match[2] || "ms").toLowerCase();
 const multipliers = { ms: 1, s: 1000, m: 60_000, h: 3_600_000 };
 return Math.round(value * multipliers[unit]);
}

function readTimeoutMs() {
 const arg = process.argv.find((value) => value.startsWith("--timeout="));
 if (arg) return parseDuration(arg.slice("--timeout=".length));
 if (process.env.TUNNEL_TIMEOUT) return parseDuration(process.env.TUNNEL_TIMEOUT);
 if (process.env.TUNNEL_TIMEOUT_MS) return parseDuration(process.env.TUNNEL_TIMEOUT_MS);
 return null;
}

function formatDuration(ms) {
 const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
 const hours = Math.floor(totalSeconds / 3600);
 const minutes = Math.floor((totalSeconds % 3600) / 60);
 const seconds = totalSeconds % 60;

 if (hours > 0) return `${hours}h ${minutes}m`;
 if (minutes > 0) return `${minutes}m ${seconds}s`;
 return `${seconds}s`;
}

const candidates = [
 process.env.CLOUDFLARED_PATH,
 "C:\\Program Files (x86)\\cloudflared\\cloudflared.exe",
 "C:\\Program Files\\cloudflared\\cloudflared.exe",
 "cloudflared",
].filter(Boolean);

const bin = candidates.find((path) => path === "cloudflared" || existsSync(path));

if (!bin) {
 console.error("cloudflared not found.");
 console.error("Install: winget install Cloudflare.cloudflared");
 console.error("Then restart the terminal, or set CLOUDFLARED_PATH to the .exe");
 process.exit(1);
}

const timeoutMs = readTimeoutMs();
let closed = false;
let timeoutTimer;
let statusTimer;

const child = spawn(bin, ["tunnel", "--url", `http://localhost:${port}`], {
 stdio: "inherit",
 shell: bin === "cloudflared",
});

function shutdown(reason, code = 0) {
 if (closed) return;
 closed = true;

 if (timeoutTimer) clearTimeout(timeoutTimer);
 if (statusTimer) clearInterval(statusTimer);

 console.log(`\n[tunnel] ${reason}`);

 if (child.exitCode == null && !child.killed) {
 child.once("exit", () => process.exit(code));
 child.kill("SIGTERM");
 setTimeout(() => {
 if (child.exitCode == null && !child.killed) {
 child.kill("SIGKILL");
 }
 }, 5000).unref();
 return;
 }

 process.exit(code);
}

if (timeoutMs) {
 const endsAt = Date.now() + timeoutMs;
 console.log(`[tunnel] Auto-close in ${formatDuration(timeoutMs)} (${new Date(endsAt).toLocaleTimeString()})`);

 statusTimer = setInterval(() => {
 const remaining = endsAt - Date.now();
 if (remaining <= 0) return;
 console.log(`[tunnel] ${formatDuration(remaining)} remaining`);
 }, 5 * 60 * 1000);

 timeoutTimer = setTimeout(() => {
 shutdown("Timeout reached closing tunnel.");
 }, timeoutMs);
}

child.on("exit", (code) => {
 if (closed) return;
 closed = true;
 if (timeoutTimer) clearTimeout(timeoutTimer);
 if (statusTimer) clearInterval(statusTimer);
 process.exit(code ?? 1);
});

process.on("SIGINT", () => shutdown("Interrupted.", 130));
process.on("SIGTERM", () => shutdown("Terminated.", 143));
