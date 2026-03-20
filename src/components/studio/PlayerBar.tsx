import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2 } from "lucide-react";
import { useStudio } from "@/store/StudioContext";

export function PlayerBar() {
  const { player, togglePlay, seek, setVolume, getTake, takes, playTake } = useStudio();
  const currentTake = player.currentTakeId ? getTake(player.currentTakeId) : null;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    seek((e.clientX - rect.left) / rect.width);
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setVolume((e.clientX - rect.left) / rect.width);
  };

  const skipTrack = (dir: -1 | 1) => {
    if (!currentTake) return;
    const activeTakes = takes.filter((t) => !t.isArchived);
    const idx = activeTakes.findIndex((t) => t.id === currentTake.id);
    const next = activeTakes[idx + dir];
    if (next) playTake(next.id);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const elapsed = currentTake ? player.progress * currentTake.durationSec : 0;
  const total = currentTake?.durationSec ?? 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border/50 safe-bottom">
      {/* Progress bar */}
      <div className="h-1 w-full bg-secondary cursor-pointer group" onClick={handleSeek}>
        <div
          className="h-full bg-primary rounded-r-full transition-[width] duration-200"
          style={{ width: `${player.progress * 100}%` }}
        />
      </div>

      <div className="flex items-center gap-3 px-4 py-2 max-w-screen-xl mx-auto">
        {/* Track info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className="h-10 w-10 rounded-lg shrink-0 flex items-center justify-center"
            style={{
              background: currentTake
                ? `linear-gradient(135deg, hsl(${currentTake.thumbnailHue} 30% 15%), hsl(${currentTake.thumbnailHue} 40% 8%))`
                : undefined,
            }}
          >
            <Play className="h-4 w-4 text-primary" strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">
              {currentTake ? `Take ${String(currentTake.takeNumber).padStart(3, "0")} — ${currentTake.title}` : "No track selected"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {currentTake?.project || "Select a take to play"}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => skipTrack(-1)}
            className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-secondary transition-colors active:scale-95"
          >
            <SkipBack className="h-4 w-4 text-foreground" strokeWidth={1.5} />
          </button>
          <button
            onClick={togglePlay}
            className="h-10 w-10 rounded-full bg-primary flex items-center justify-center hover:brightness-110 transition-all active:scale-95"
          >
            {player.isPlaying ? (
              <Pause className="h-4 w-4 text-primary-foreground" strokeWidth={2} />
            ) : (
              <Play className="h-4 w-4 text-primary-foreground ml-0.5" strokeWidth={2} />
            )}
          </button>
          <button
            onClick={() => skipTrack(1)}
            className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-secondary transition-colors active:scale-95"
          >
            <SkipForward className="h-4 w-4 text-foreground" strokeWidth={1.5} />
          </button>
        </div>

        {/* Time + volume */}
        <div className="hidden sm:flex items-center gap-3 flex-1 justify-end">
          <span className="text-mono text-xs text-muted-foreground">
            {formatTime(elapsed)} / {formatTime(total)}
          </span>
          <Volume2 className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          <div className="w-20 h-1 bg-secondary rounded-full cursor-pointer" onClick={handleVolumeChange}>
            <div
              className="h-full bg-muted-foreground/50 rounded-full transition-[width] duration-100"
              style={{ width: `${player.volume * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
