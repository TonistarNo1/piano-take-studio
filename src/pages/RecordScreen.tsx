import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Mic, Video, Headphones, HardDrive, Circle, Square, FileVideo, FileAudio, FileText, Image } from "lucide-react";
import { StatusDot } from "@/components/studio/StatusDot";
import { useStudio } from "@/store/StudioContext";
import { fadeUp } from "@/lib/animations";

export default function RecordScreen() {
  const { recorder, startRecording, stopRecording, projects, setActiveProject } = useStudio();
  const isRecording = recorder.status === "recording";

  const formatElapsed = (s: number) => {
    const h = String(Math.floor(s / 3600)).padStart(2, "0");
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  const activeProject = projects.find((p) => p.id === recorder.activeProjectId);

  return (
    <motion.div {...fadeUp} className="space-y-6 max-w-2xl mx-auto">
      {/* Status Badge */}
      <div className="flex items-center justify-center gap-2 py-2">
        <StatusDot status={isRecording ? "active" : "idle"} pulse={isRecording} size="md" />
        <span className={`text-sm font-semibold uppercase tracking-widest ${isRecording ? "text-primary" : "text-muted-foreground"}`}>
          {isRecording ? "Recording" : "Idle"}
        </span>
      </div>

      {/* Recording Button */}
      <div className="flex justify-center py-6">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`h-28 w-28 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 ${
            isRecording
              ? "bg-destructive/20 ring-2 ring-destructive"
              : "bg-secondary ring-1 ring-muted-foreground/30 hover:ring-primary/50"
          }`}
        >
          {isRecording ? (
            <Square className="h-10 w-10 text-destructive" strokeWidth={2} fill="currentColor" />
          ) : (
            <Circle className="h-14 w-14 text-primary btn-primary-glow rounded-full" strokeWidth={0} fill="currentColor" />
          )}
        </button>
      </div>

      {/* Live timer */}
      {isRecording && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <p className="text-5xl font-semibold text-mono text-foreground animate-breathe tracking-tight">
            {formatElapsed(recorder.elapsed)}
          </p>
        </motion.div>
      )}

      {/* Current Take Info */}
      <div className="glass-card rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Current Take</h3>
          <span className="text-mono text-xs text-muted-foreground">Take {recorder.currentTakeNumber}</span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Project</p>
            <select
              value={recorder.activeProjectId ?? ""}
              onChange={(e) => setActiveProject(e.target.value ? Number(e.target.value) : null)}
              className="mt-1 w-full h-9 px-2 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              <option value="">None</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Started</p>
            <p className="text-foreground font-medium text-mono mt-1">{recorder.startedAt ?? "—"}</p>
          </div>
        </div>
      </div>

      {/* Devices */}
      <div className="glass-card rounded-2xl p-5 space-y-3">
        <h3 className="text-section-label">Devices</h3>
        <div className="space-y-2">
          {[
            { icon: Video, label: "Video", value: "Elgato Cam Link 4K", detail: "1920×1080 · 30fps" },
            { icon: Headphones, label: "Audio", value: "Focusrite Scarlett 2i2", detail: "48kHz · 24-bit" },
            { icon: HardDrive, label: "Storage", value: "External SSD", detail: "842 GB available" },
            { icon: Mic, label: "Encoder", value: "Intel Quick Sync", detail: "H.264 hardware" },
          ].map((d) => (
            <div key={d.label} className="flex items-center gap-3 py-2">
              <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <d.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{d.value}</p>
                <p className="text-[11px] text-muted-foreground text-mono">{d.detail}</p>
              </div>
              <StatusDot status="active" />
            </div>
          ))}
        </div>
      </div>

      {/* Output Files */}
      <div className="glass-card rounded-2xl p-5 space-y-3">
        <h3 className="text-section-label">Generated Outputs</h3>
        <div className="space-y-1.5">
          {[
            { icon: FileVideo, name: "video.mp4", size: isRecording ? `${(recorder.elapsed * 0.09).toFixed(1)} MB` : "—", status: isRecording ? "WRITING" : "READY" },
            { icon: FileAudio, name: "mix.wav", size: isRecording ? `${(recorder.elapsed * 0.07).toFixed(1)} MB` : "—", status: isRecording ? "WRITING" : "READY" },
            { icon: FileAudio, name: "left.wav", size: isRecording ? `${(recorder.elapsed * 0.035).toFixed(1)} MB` : "—", status: isRecording ? "WRITING" : "READY" },
            { icon: FileAudio, name: "right.wav", size: isRecording ? `${(recorder.elapsed * 0.035).toFixed(1)} MB` : "—", status: isRecording ? "WRITING" : "READY" },
            { icon: FileText, name: "metadata.json", size: "1.2 KB", status: "READY" },
            { icon: Image, name: "thumbnail.jpg", size: "—", status: isRecording ? "PENDING" : "READY" },
          ].map((f) => (
            <div key={f.name} className="flex items-center gap-3 py-1.5 px-3 rounded-lg bg-secondary/30">
              <f.icon className="h-4 w-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
              <span className="text-mono text-xs text-foreground flex-1">{f.name}</span>
              <span className="text-mono text-[10px] text-muted-foreground">{f.size}</span>
              <span className={`text-mono text-[10px] ${f.status === "WRITING" ? "text-primary" : "text-muted-foreground"}`}>
                {f.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Waveform */}
      {isRecording && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-5">
          <h3 className="text-section-label mb-3">Live Audio</h3>
          <div className="h-16 flex items-end gap-[2px]">
            {Array.from({ length: 60 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-primary/40 rounded-t-sm animate-pulse"
                style={{
                  height: `${Math.random() * 100}%`,
                  animationDelay: `${i * 50}ms`,
                  animationDuration: `${800 + Math.random() * 400}ms`,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Metadata ticker */}
      {isRecording && (
        <div className="glass-card rounded-2xl p-4 overflow-hidden">
          <div className="space-y-1 text-mono text-[11px] text-muted-foreground">
            <p><span className="text-primary">WRITING:</span> take_{recorder.currentTakeNumber}_video.mp4... OK</p>
            <p><span className="text-primary">WRITING:</span> take_{recorder.currentTakeNumber}_mix.wav... {(recorder.elapsed * 0.07).toFixed(1)}MB</p>
            <p><span className="text-primary">WRITING:</span> take_{recorder.currentTakeNumber}_left.wav... OK</p>
            <p><span className="text-primary">WRITING:</span> take_{recorder.currentTakeNumber}_right.wav... OK</p>
            <p><span className="text-muted-foreground">TARGET:</span> /piano/2026/03/20/take_{recorder.currentTakeNumber}/</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
