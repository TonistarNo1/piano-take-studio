import { motion } from "framer-motion";
import { useState } from "react";
import { Mic, Video, Headphones, HardDrive, Circle, Square, FileVideo, FileAudio, FileText, Image } from "lucide-react";
import { StatusDot } from "@/components/studio/StatusDot";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.2, 0, 0, 1] },
};

export default function RecordScreen() {
  const [isRecording, setIsRecording] = useState(false);

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
          onClick={() => setIsRecording(!isRecording)}
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

      {isRecording && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <p className="text-5xl font-semibold text-mono text-foreground animate-breathe tracking-tight">
            00:04:32
          </p>
        </motion.div>
      )}

      {/* Current Recording Info */}
      <div className="glass-card rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Current Take</h3>
          <span className="text-mono text-xs text-muted-foreground">Take 104</span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Project</p>
            <p className="text-foreground font-medium">Chopin Nocturnes</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Started</p>
            <p className="text-foreground font-medium text-mono">14:32:07</p>
          </div>
        </div>
      </div>

      {/* Device Info */}
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
            { icon: FileVideo, name: "video.mp4", size: isRecording ? "24.2 MB" : "—", status: isRecording ? "WRITING" : "READY" },
            { icon: FileAudio, name: "mix.wav", size: isRecording ? "18.7 MB" : "—", status: isRecording ? "WRITING" : "READY" },
            { icon: FileAudio, name: "left.wav", size: isRecording ? "9.3 MB" : "—", status: isRecording ? "WRITING" : "READY" },
            { icon: FileAudio, name: "right.wav", size: isRecording ? "9.4 MB" : "—", status: isRecording ? "WRITING" : "READY" },
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

      {/* Waveform placeholder */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-2xl p-5"
        >
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
            <p><span className="text-primary">WRITING:</span> take_104_video.mp4... OK</p>
            <p><span className="text-primary">WRITING:</span> take_104_mix.wav... 18.7MB</p>
            <p><span className="text-primary">WRITING:</span> take_104_left.wav... OK</p>
            <p><span className="text-primary">WRITING:</span> take_104_right.wav... OK</p>
            <p><span className="text-muted-foreground">TARGET:</span> /piano/2026/03/15/take_104/</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
