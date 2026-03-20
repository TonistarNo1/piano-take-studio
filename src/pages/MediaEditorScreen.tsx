import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Play, Pause, Heart, X, Plus, Music, Calendar, Clock,
  Image as ImageIcon, ChevronRight
} from "lucide-react";
import { fadeUp } from "@/lib/animations";

interface MediaState {
  title: string;
  artist: string;
  description: string;
  categories: string[];
  tags: string[];
  coverImage: string;
  duration: number; // seconds
  date: string;
  status: "draft" | "published" | "archived";
  isPlaying: boolean;
  isFavorite: boolean;
  progress: number; // 0-1
  activeCategories: string[];
  activeTags: string[];
}

const DEFAULT_STATE: MediaState = {
  title: "Nocturne Op.9 No.2",
  artist: "Frédéric Chopin",
  description: "A gentle, lyrical nocturne with a flowing melody over a broken-chord accompaniment.",
  categories: ["Classical", "Romantic", "Piano Solo"],
  tags: ["nocturne", "chopin", "practice", "performance-ready"],
  coverImage: "",
  duration: 293,
  date: "2026-03-15",
  status: "published",
  isPlaying: false,
  isFavorite: false,
  progress: 0.35,
  activeCategories: [],
  activeTags: [],
};

const STATUS_OPTIONS = ["draft", "published", "archived"] as const;

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function ChipInput({
  items,
  onAdd,
  onRemove,
  placeholder,
}: {
  items: string[];
  onAdd: (v: string) => void;
  onRemove: (i: number) => void;
  placeholder: string;
}) {
  const [value, setValue] = useState("");
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && value.trim()) {
      e.preventDefault();
      onAdd(value.trim());
      setValue("");
    }
  };
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground"
          >
            {item}
            <button
              onClick={() => onRemove(i)}
              className="h-3.5 w-3.5 rounded-full flex items-center justify-center hover:bg-destructive/20 hover:text-destructive transition-colors"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
      </div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full h-9 px-3 rounded-xl bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
      />
    </div>
  );
}

export default function MediaEditorScreen() {
  const [state, setState] = useState<MediaState>(DEFAULT_STATE);

  const update = useCallback(
    <K extends keyof MediaState>(key: K, value: MediaState[K]) => {
      setState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const toggleCategory = (cat: string) => {
    setState((prev) => ({
      ...prev,
      activeCategories: prev.activeCategories.includes(cat)
        ? prev.activeCategories.filter((c) => c !== cat)
        : [...prev.activeCategories, cat],
    }));
  };

  const toggleTag = (tag: string) => {
    setState((prev) => ({
      ...prev,
      activeTags: prev.activeTags.includes(tag)
        ? prev.activeTags.filter((t) => t !== tag)
        : [...prev.activeTags, tag],
    }));
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    update("progress", ratio);
  };

  const currentTime = state.progress * state.duration;

  return (
    <motion.div {...fadeUp} className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Media Editor</h1>
        <p className="text-sm text-muted-foreground mt-1">Edit metadata and preview in real time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ─── SETTINGS PANEL ─── */}
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5 space-y-5">
            <h3 className="text-section-label">Metadata</h3>

            {/* Title */}
            <label className="block space-y-1.5">
              <span className="text-xs text-muted-foreground">Title</span>
              <input
                value={state.title}
                onChange={(e) => update("title", e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </label>

            {/* Artist */}
            <label className="block space-y-1.5">
              <span className="text-xs text-muted-foreground">Artist</span>
              <input
                value={state.artist}
                onChange={(e) => update("artist", e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </label>

            {/* Description */}
            <label className="block space-y-1.5">
              <span className="text-xs text-muted-foreground">Description</span>
              <textarea
                value={state.description}
                onChange={(e) => update("description", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
              />
            </label>

            {/* Cover Image URL */}
            <label className="block space-y-1.5">
              <span className="text-xs text-muted-foreground">Cover Image URL</span>
              <input
                value={state.coverImage}
                onChange={(e) => update("coverImage", e.target.value)}
                placeholder="https://..."
                className="w-full h-10 px-3 rounded-xl bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </label>

            <div className="grid grid-cols-2 gap-4">
              {/* Duration */}
              <label className="block space-y-1.5">
                <span className="text-xs text-muted-foreground">Duration (sec)</span>
                <input
                  type="number"
                  min={0}
                  value={state.duration}
                  onChange={(e) => update("duration", Math.max(0, Number(e.target.value)))}
                  className="w-full h-10 px-3 rounded-xl bg-secondary/50 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </label>

              {/* Date */}
              <label className="block space-y-1.5">
                <span className="text-xs text-muted-foreground">Date</span>
                <input
                  type="date"
                  value={state.date}
                  onChange={(e) => update("date", e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-secondary/50 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 [color-scheme:dark]"
                />
              </label>
            </div>

            {/* Status */}
            <label className="block space-y-1.5">
              <span className="text-xs text-muted-foreground">Status</span>
              <div className="flex gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => update("status", s)}
                    className={`flex-1 h-9 rounded-xl text-xs font-medium capitalize transition-all active:scale-[0.97] ${
                      state.status === s
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </label>
          </div>

          {/* Categories & Tags */}
          <div className="glass-card rounded-2xl p-5 space-y-5">
            <h3 className="text-section-label">Categories</h3>
            <ChipInput
              items={state.categories}
              onAdd={(v) => update("categories", [...state.categories, v])}
              onRemove={(i) =>
                update(
                  "categories",
                  state.categories.filter((_, idx) => idx !== i)
                )
              }
              placeholder="Add category + Enter"
            />

            <h3 className="text-section-label pt-2">Tags</h3>
            <ChipInput
              items={state.tags}
              onAdd={(v) => update("tags", [...state.tags, v])}
              onRemove={(i) =>
                update(
                  "tags",
                  state.tags.filter((_, idx) => idx !== i)
                )
              }
              placeholder="Add tag + Enter"
            />
          </div>
        </div>

        {/* ─── LIVE PREVIEW ─── */}
        <div className="space-y-4">
          <div className="glass-card rounded-2xl overflow-hidden">
            {/* Cover */}
            <div className="relative aspect-[16/9] bg-secondary flex items-center justify-center overflow-hidden group">
              {state.coverImage ? (
                <img
                  src={state.coverImage}
                  alt="cover"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(142 30% 8%), hsl(240 10% 6%))",
                  }}
                />
              )}
              {/* Play overlay */}
              <button
                onClick={() => update("isPlaying", !state.isPlaying)}
                className="relative z-10 h-16 w-16 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center hover:bg-primary/30 transition-all active:scale-95 group-hover:scale-105"
              >
                {state.isPlaying ? (
                  <Pause className="h-7 w-7 text-primary" strokeWidth={2} />
                ) : (
                  <Play className="h-7 w-7 text-primary ml-1" strokeWidth={2} />
                )}
              </button>
              {/* Status badge */}
              <span
                className={`absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm ${
                  state.status === "published"
                    ? "bg-primary/20 text-primary"
                    : state.status === "archived"
                    ? "bg-destructive/20 text-destructive"
                    : "bg-secondary/60 text-muted-foreground"
                }`}
              >
                {state.status}
              </span>
            </div>

            {/* Progress bar */}
            <div
              className="h-1.5 bg-secondary cursor-pointer group/bar relative"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-primary rounded-r-full transition-[width] duration-100"
                style={{ width: `${state.progress * 100}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-primary opacity-0 group-hover/bar:opacity-100 transition-opacity"
                style={{ left: `calc(${state.progress * 100}% - 7px)` }}
              />
            </div>

            {/* Info */}
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-foreground truncate">
                    {state.title || "Untitled"}
                  </h2>
                  <p className="text-sm text-muted-foreground truncate">
                    {state.artist || "Unknown artist"}
                  </p>
                </div>
                <button
                  onClick={() => update("isFavorite", !state.isFavorite)}
                  className="shrink-0 h-9 w-9 rounded-full flex items-center justify-center hover:bg-secondary transition-colors active:scale-95"
                >
                  <Heart
                    className={`h-5 w-5 transition-colors ${
                      state.isFavorite
                        ? "text-destructive fill-destructive"
                        : "text-muted-foreground"
                    }`}
                    strokeWidth={1.5}
                  />
                </button>
              </div>

              {state.description && (
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {state.description}
                </p>
              )}

              {/* Time row */}
              <div className="flex items-center gap-4 text-mono text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {formatTime(currentTime)} / {formatTime(state.duration)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {state.date || "—"}
                </span>
              </div>

              {/* Categories */}
              {state.categories.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    Categories
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {state.categories.map((cat) => {
                      const active = state.activeCategories.includes(cat);
                      return (
                        <button
                          key={cat}
                          onClick={() => toggleCategory(cat)}
                          className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-all active:scale-95 ${
                            active
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary/60 text-secondary-foreground hover:bg-secondary"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tags */}
              {state.tags.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    Tags
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {state.tags.map((tag) => {
                      const active = state.activeTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`text-[11px] px-2.5 py-1 rounded-full transition-all active:scale-95 ${
                            active
                              ? "bg-primary/20 text-primary border border-primary/40"
                              : "bg-secondary/40 text-muted-foreground border border-border/50 hover:text-foreground hover:bg-secondary/60"
                          }`}
                        >
                          #{tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mini waveform */}
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={() => update("isPlaying", !state.isPlaying)}
                className="h-9 w-9 rounded-full bg-primary flex items-center justify-center hover:brightness-110 transition-all active:scale-95 shrink-0"
              >
                {state.isPlaying ? (
                  <Pause className="h-4 w-4 text-primary-foreground" strokeWidth={2} />
                ) : (
                  <Play className="h-4 w-4 text-primary-foreground ml-0.5" strokeWidth={2} />
                )}
              </button>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{state.title || "Untitled"}</p>
                <p className="text-xs text-muted-foreground truncate">{state.artist || "Unknown"}</p>
              </div>
              <span className="text-mono text-xs text-muted-foreground shrink-0">
                {formatTime(currentTime)}
              </span>
            </div>
            <div
              className="h-10 flex items-end gap-[1px] rounded-lg overflow-hidden cursor-pointer"
              onClick={handleSeek}
            >
              {Array.from({ length: 80 }).map((_, i) => {
                const ratio = i / 80;
                const played = ratio < state.progress;
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm transition-colors duration-75"
                    style={{
                      height: `${20 + Math.sin(i * 0.35) * 30 + ((i * 7 + 13) % 50)}%`,
                      background: played
                        ? "hsl(142 71% 45%)"
                        : "hsl(240 5% 20%)",
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
