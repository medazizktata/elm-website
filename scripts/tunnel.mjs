import { spawn } from "node:child_process";
import { existsSync } from "node:fs";

const port = process.env.PORT || "5173";
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

const child = spawn(bin, ["tunnel", "--url", `http://localhost:${port}`], {
  stdio: "inherit",
  shell: bin === "cloudflared",
});

child.on("exit", (code) => process.exit(code ?? 1));
