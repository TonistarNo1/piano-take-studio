import { motion } from "framer-motion";
import {
  HardDrive, Monitor, Cpu, Server, Activity, Globe, Clock,
  CheckCircle2, AlertTriangle, XCircle
} from "lucide-react";
import { StatusDot } from "@/components/studio/StatusDot";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.2, 0, 0, 1] },
};

const services = [
  { name: "Recorder Server", status: "active" as const, uptime: "14d 6h 32m", memory: "128 MB", port: "8080" },
  { name: "Player Service", status: "active" as const, uptime: "14d 6h 32m", memory: "64 MB", port: "8081" },
  { name: "Archive Worker", status: "active" as const, uptime: "14d 6h 32m", memory: "48 MB", port: "—" },
  { name: "Metadata Indexer", status: "active" as const, uptime: "14d 6h 30m", memory: "32 MB", port: "—" },
];

const endpoints = [
  { method: "POST", path: "/api/start", desc: "Start recording" },
  { method: "POST", path: "/api/stop", desc: "Stop recording" },
  { method: "GET", path: "/api/status", desc: "Get recorder status" },
  { method: "GET", path: "/api/takes", desc: "List all takes" },
  { method: "DELETE", path: "/api/takes/:id", desc: "Delete a take" },
];

export default function SettingsScreen() {
  return (
    <motion.div {...fadeUp} className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-display text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">System configuration and status.</p>
      </div>

      {/* Storage */}
      <section className="glass-card rounded-2xl p-5 space-y-4">
        <h3 className="text-section-label">Storage</h3>
        <div className="space-y-3">
          {[
            { label: "Storage Root", value: "/mnt/ssd/piano" },
            { label: "Archive Path", value: "/mnt/ssd/archive" },
            { label: "State Path", value: "/mnt/ssd/state" },
            { label: "Logs Path", value: "/mnt/ssd/logs" },
          ].map((p) => (
            <div key={p.label} className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">{p.label}</span>
              <span className="text-mono text-xs text-foreground">{p.value}</span>
            </div>
          ))}
        </div>
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">SSD Usage</span>
            <span className="text-mono text-xs text-foreground">158 GB / 1 TB</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: "15.8%" }} />
          </div>
        </div>
      </section>

      {/* Recording Config */}
      <section className="glass-card rounded-2xl p-5 space-y-4">
        <h3 className="text-section-label">Recording Configuration</h3>
        <div className="space-y-3">
          {[
            { label: "Resolution", value: "1920×1080" },
            { label: "Frame Rate", value: "30 fps" },
            { label: "Audio Sample Rate", value: "48 kHz · 24-bit" },
            { label: "Encoder", value: "Intel Quick Sync (H.264)" },
            { label: "Auto-Archive", value: "After 14 days" },
          ].map((c) => (
            <div key={c.label} className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <span className="text-mono text-xs text-foreground">{c.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="glass-card rounded-2xl p-5 space-y-4">
        <h3 className="text-section-label">Services</h3>
        <div className="space-y-2">
          {services.map((s) => (
            <div key={s.name} className="flex items-center gap-3 py-3 px-3 rounded-xl bg-secondary/30">
              <StatusDot status={s.status} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{s.name}</p>
                <p className="text-mono text-[11px] text-muted-foreground">
                  Up {s.uptime} · {s.memory}{s.port !== "—" ? ` · :${s.port}` : ""}
                </p>
              </div>
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" strokeWidth={1.5} />
            </div>
          ))}
        </div>
      </section>

      {/* API */}
      <section className="glass-card rounded-2xl p-5 space-y-4">
        <h3 className="text-section-label">API Endpoints</h3>
        <div className="space-y-1.5">
          {endpoints.map((e) => (
            <div key={e.path} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-secondary/30">
              <span className={`text-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                e.method === "POST" ? "bg-primary/10 text-primary" :
                e.method === "DELETE" ? "bg-destructive/10 text-destructive" :
                "bg-secondary text-muted-foreground"
              }`}>
                {e.method}
              </span>
              <span className="text-mono text-xs text-foreground flex-1">{e.path}</span>
              <span className="text-[11px] text-muted-foreground hidden sm:block">{e.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Version */}
      <div className="text-center text-xs text-muted-foreground py-4 text-mono">
        Piano Studio v2.1.0 · Build 2026.03.15 · © 2026
      </div>
    </motion.div>
  );
}
