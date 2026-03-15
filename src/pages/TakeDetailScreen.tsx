import { motion } from "framer-motion";
import {
  Play, Star, FolderOpen, Tag, MessageCircle, Archive, Download, Trash2,
  FileVideo, FileAudio, FileText, Image, ArrowLeft, Video
} from "lucide-react";
import { Link } from "react-router-dom";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.2, 0, 0, 1] },
};

const comments = [
  { author: "Me", text: "Great dynamics in the middle section. Keep the tempo more consistent in the coda.", time: "2 hours ago" },
  { author: "Me", text: "Try softer pedaling on the opening phrase.", time: "Yesterday" },
];

export default function TakeDetailScreen() {
  return (
    <motion.div {...fadeUp} className="space-y-6 max-w-3xl mx-auto">
      {/* Back */}
      <Link to="/library" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Back to Library
      </Link>

      {/* Video Preview */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-secondary flex items-center justify-center glass-card-lg">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, hsl(142 30% 8%), hsl(142 40% 4%))" }}
        />
        <div className="relative flex flex-col items-center gap-3">
          <button className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors active:scale-95">
            <Play className="h-7 w-7 text-primary ml-1" strokeWidth={2} />
          </button>
          <span className="text-mono text-sm text-muted-foreground">4:53</span>
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <Video className="h-4 w-4 text-foreground/60" strokeWidth={1.5} />
          <span className="text-xs text-foreground/60">1920×1080 · 30fps</span>
        </div>
      </div>

      {/* Title & Meta */}
      <div>
        <h1 className="text-2xl font-semibold text-display text-foreground">Nocturne Op.9 No.2</h1>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="text-[11px] font-medium bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
            Chopin Nocturnes
          </span>
          <span className="text-[11px] font-medium bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-full">
            In Progress
          </span>
          <Star className="h-4 w-4 text-warning fill-warning" strokeWidth={1.5} />
        </div>
        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground text-mono">
          <span>Take 042</span>
          <span>Mar 15, 2026 · 14:32</span>
          <span>4:53</span>
        </div>
      </div>

      {/* Audio Player */}
      <div className="glass-card rounded-2xl p-5 space-y-4">
        <h3 className="text-section-label">Playback</h3>
        <div className="space-y-3">
          <div className="h-12 flex items-end gap-[1px] rounded-lg overflow-hidden">
            {Array.from({ length: 100 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm"
                style={{
                  height: `${20 + Math.sin(i * 0.3) * 30 + Math.random() * 50}%`,
                  background: i < 35 ? "hsl(142 71% 45%)" : "hsl(240 5% 25%)",
                }}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-mono text-xs text-muted-foreground">
            <span>1:42</span>
            <span>4:53</span>
          </div>
        </div>

        {/* Mixer */}
        <div className="flex items-center gap-6 pt-2">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-2 block">Piano</label>
            <div className="h-2 bg-secondary rounded-full">
              <div className="h-full bg-primary rounded-full" style={{ width: "80%" }} />
            </div>
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-2 block">Voice</label>
            <div className="h-2 bg-secondary rounded-full">
              <div className="h-full bg-muted-foreground/50 rounded-full" style={{ width: "40%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Files */}
      <div className="glass-card rounded-2xl p-5 space-y-3">
        <h3 className="text-section-label">Files</h3>
        {[
          { icon: FileVideo, name: "take_042_video.mp4", size: "128.4 MB" },
          { icon: FileAudio, name: "take_042_mix.wav", size: "52.1 MB" },
          { icon: FileAudio, name: "take_042_left.wav", size: "26.0 MB" },
          { icon: FileAudio, name: "take_042_right.wav", size: "26.1 MB" },
          { icon: Image, name: "take_042_thumb.jpg", size: "342 KB" },
          { icon: FileText, name: "take_042_meta.json", size: "1.2 KB" },
        ].map((f) => (
          <div key={f.name} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <f.icon className="h-4 w-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
            <span className="text-mono text-xs text-foreground flex-1 truncate">{f.name}</span>
            <span className="text-mono text-[10px] text-muted-foreground">{f.size}</span>
            <Download className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" strokeWidth={1.5} />
          </div>
        ))}
      </div>

      {/* Comments */}
      <div className="glass-card rounded-2xl p-5 space-y-4">
        <h3 className="text-section-label">Comments</h3>
        <div className="space-y-3">
          {comments.map((c, i) => (
            <div key={i} className="p-3 rounded-xl bg-secondary/30">
              <p className="text-sm text-foreground">{c.text}</p>
              <p className="text-[11px] text-muted-foreground mt-1.5">{c.time}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            placeholder="Add a comment..."
            className="flex-1 h-10 px-4 rounded-xl bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
          <button className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all active:scale-95">
            Send
          </button>
        </div>
      </div>

      {/* Management */}
      <div className="glass-card rounded-2xl p-5 space-y-3">
        <h3 className="text-section-label">Manage</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: FolderOpen, label: "Change Project" },
            { icon: Tag, label: "Change Category" },
            { icon: Star, label: "Remove Favorite" },
            { icon: MessageCircle, label: "Add Comment" },
            { icon: Archive, label: "Archive Take", danger: false },
            { icon: Trash2, label: "Delete Take", danger: true },
          ].map((action) => (
            <button
              key={action.label}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition-colors ${
                action.danger
                  ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                  : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <action.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              <span className="truncate">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
