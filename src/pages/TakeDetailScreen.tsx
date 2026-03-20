import { motion } from "framer-motion";
import { useState } from "react";
import {
  Play, Pause, Star, FolderOpen, Tag, MessageCircle, Archive, Download, Trash2,
  FileVideo, FileAudio, FileText, Image, ArrowLeft, Video
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useStudio } from "@/store/StudioContext";
import { fadeUp } from "@/lib/animations";

export default function TakeDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getTake, toggleFavorite, archiveTake, restoreTake, deleteTake, setTakeCategory, setTakeProject,
    addComment, deleteComment, playTake, player, togglePlay, seek, setPianoMix, setVoiceMix,
    projects, categories,
  } = useStudio();

  const take = getTake(Number(id));
  const [commentText, setCommentText] = useState("");

  if (!take) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg">Take not found</p>
        <Link to="/library" className="text-primary text-sm mt-2 hover:underline">Back to Library</Link>
      </div>
    );
  }

  const isCurrentlyPlaying = player.currentTakeId === take.id;
  const progress = isCurrentlyPlaying ? player.progress : 0;
  const currentTime = progress * take.durationSec;

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCurrentlyPlaying) playTake(take.id);
    const rect = e.currentTarget.getBoundingClientRect();
    seek((e.clientX - rect.left) / rect.width);
  };

  const handlePlayPause = () => {
    if (isCurrentlyPlaying) {
      togglePlay();
    } else {
      playTake(take.id);
    }
  };

  const handleDelete = () => {
    deleteTake(take.id);
    navigate("/library");
  };

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    addComment(take.id, commentText);
    setCommentText("");
  };

  return (
    <motion.div {...fadeUp} className="space-y-6 max-w-3xl mx-auto">
      <Link to="/library" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Back to Library
      </Link>

      {/* Video Preview */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-secondary flex items-center justify-center glass-card-lg">
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, hsl(${take.thumbnailHue} 30% 8%), hsl(${take.thumbnailHue} 40% 4%))` }}
        />
        <div className="relative flex flex-col items-center gap-3">
          <button
            onClick={handlePlayPause}
            className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors active:scale-95"
          >
            {isCurrentlyPlaying && player.isPlaying ? (
              <Pause className="h-7 w-7 text-primary" strokeWidth={2} />
            ) : (
              <Play className="h-7 w-7 text-primary ml-1" strokeWidth={2} />
            )}
          </button>
          <span className="text-mono text-sm text-muted-foreground">{take.duration}</span>
        </div>
        {take.hasVideo && (
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <Video className="h-4 w-4 text-foreground/60" strokeWidth={1.5} />
            <span className="text-xs text-foreground/60">1920×1080 · 30fps</span>
          </div>
        )}
      </div>

      {/* Title & Meta */}
      <div>
        <h1 className="text-2xl font-semibold text-display text-foreground">{take.title}</h1>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {take.project && (
            <span className="text-[11px] font-medium bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
              {take.project}
            </span>
          )}
          {take.category && (
            <span className="text-[11px] font-medium bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-full">
              {take.category}
            </span>
          )}
          <button onClick={() => toggleFavorite(take.id)} className="active:scale-95 transition-transform">
            <Star className={`h-4 w-4 ${take.isFavorite ? "text-warning fill-warning" : "text-muted-foreground"}`} strokeWidth={1.5} />
          </button>
        </div>
        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground text-mono">
          <span>Take {String(take.takeNumber).padStart(3, "0")}</span>
          <span>{take.date}</span>
          <span>{take.duration}</span>
        </div>
      </div>

      {/* Audio Player */}
      <div className="glass-card rounded-2xl p-5 space-y-4">
        <h3 className="text-section-label">Playback</h3>
        <div className="space-y-3">
          <div
            className="h-12 flex items-end gap-[1px] rounded-lg overflow-hidden cursor-pointer"
            onClick={handleSeek}
          >
            {Array.from({ length: 100 }).map((_, i) => {
              const ratio = i / 100;
              const played = ratio < progress;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm transition-colors duration-75"
                  style={{
                    height: `${20 + Math.sin(i * 0.3) * 30 + ((i * 7 + 13) % 50)}%`,
                    background: played ? "hsl(142 71% 45%)" : "hsl(240 5% 25%)",
                  }}
                />
              );
            })}
          </div>
          <div className="flex items-center justify-between text-mono text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{take.duration}</span>
          </div>
        </div>

        {/* Mixer */}
        <div className="flex items-center gap-6 pt-2">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-2 block">Piano</label>
            <div
              className="h-2 bg-secondary rounded-full cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setPianoMix((e.clientX - rect.left) / rect.width);
              }}
            >
              <div className="h-full bg-primary rounded-full transition-[width] duration-100" style={{ width: `${player.pianoMix * 100}%` }} />
            </div>
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-2 block">Voice</label>
            <div
              className="h-2 bg-secondary rounded-full cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setVoiceMix((e.clientX - rect.left) / rect.width);
              }}
            >
              <div className="h-full bg-muted-foreground/50 rounded-full transition-[width] duration-100" style={{ width: `${player.voiceMix * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Files */}
      <div className="glass-card rounded-2xl p-5 space-y-3">
        <h3 className="text-section-label">Files</h3>
        {[
          { icon: FileVideo, name: `take_${String(take.takeNumber).padStart(3, "0")}_video.mp4`, size: "128.4 MB" },
          { icon: FileAudio, name: `take_${String(take.takeNumber).padStart(3, "0")}_mix.wav`, size: "52.1 MB" },
          { icon: FileAudio, name: `take_${String(take.takeNumber).padStart(3, "0")}_left.wav`, size: "26.0 MB" },
          { icon: FileAudio, name: `take_${String(take.takeNumber).padStart(3, "0")}_right.wav`, size: "26.1 MB" },
          { icon: Image, name: `take_${String(take.takeNumber).padStart(3, "0")}_thumb.jpg`, size: "342 KB" },
          { icon: FileText, name: `take_${String(take.takeNumber).padStart(3, "0")}_meta.json`, size: "1.2 KB" },
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
        <h3 className="text-section-label">Comments ({take.comments.length})</h3>
        <div className="space-y-3">
          {take.comments.length === 0 && (
            <p className="text-sm text-muted-foreground">No comments yet.</p>
          )}
          {take.comments.map((c) => (
            <div key={c.id} className="p-3 rounded-xl bg-secondary/30 group/comment">
              <p className="text-sm text-foreground">{c.text}</p>
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-[11px] text-muted-foreground">{c.time}</p>
                <button
                  onClick={() => deleteComment(take.id, c.id)}
                  className="text-[11px] text-muted-foreground hover:text-destructive opacity-0 group-hover/comment:opacity-100 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
            placeholder="Add a comment..."
            className="flex-1 h-10 px-4 rounded-xl bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
          <button
            onClick={handleSubmitComment}
            disabled={!commentText.trim()}
            className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all active:scale-95 disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>

      {/* Manage */}
      <div className="glass-card rounded-2xl p-5 space-y-3">
        <h3 className="text-section-label">Manage</h3>

        {/* Project assignment */}
        <div className="flex items-center gap-3 py-2">
          <FolderOpen className="h-4 w-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
          <span className="text-sm text-muted-foreground">Project</span>
          <select
            value={take.project}
            onChange={(e) => setTakeProject(take.id, e.target.value)}
            className="ml-auto h-8 px-2 rounded-lg bg-secondary/50 border border-border/50 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          >
            <option value="">None</option>
            {projects.map((p) => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Category assignment */}
        <div className="flex items-center gap-3 py-2">
          <Tag className="h-4 w-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
          <span className="text-sm text-muted-foreground">Category</span>
          <select
            value={take.category}
            onChange={(e) => setTakeCategory(take.id, e.target.value)}
            className="ml-auto h-8 px-2 rounded-lg bg-secondary/50 border border-border/50 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          >
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={() => toggleFavorite(take.id)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition-colors bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary active:scale-[0.97]"
          >
            <Star className={`h-4 w-4 shrink-0 ${take.isFavorite ? "text-warning fill-warning" : ""}`} strokeWidth={1.5} />
            <span className="truncate">{take.isFavorite ? "Remove Favorite" : "Add Favorite"}</span>
          </button>
          <button
            onClick={() => take.isArchived ? restoreTake(take.id) : archiveTake(take.id)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition-colors bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary active:scale-[0.97]"
          >
            <Archive className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            <span className="truncate">{take.isArchived ? "Restore Take" : "Archive Take"}</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition-colors bg-destructive/10 text-destructive hover:bg-destructive/20 active:scale-[0.97] col-span-2"
          >
            <Trash2 className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            <span className="truncate">Delete Take</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
