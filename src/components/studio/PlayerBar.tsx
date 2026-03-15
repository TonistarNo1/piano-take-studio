import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2 } from "lucide-react";
import { useState } from "react";

export function PlayerBar() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border/50 safe-bottom">
      {/* Progress bar */}
      <div className="h-1 w-full bg-secondary">
        <div className="h-full bg-primary rounded-r-full" style={{ width: "35%" }} />
      </div>

      <div className="flex items-center gap-3 px-4 py-2 max-w-screen-xl mx-auto">
        {/* Track info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="h-10 w-10 rounded-lg bg-secondary shrink-0 flex items-center justify-center">
            <Play className="h-4 w-4 text-primary" strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">Take 042 — Nocturne Op.9 No.2</p>
            <p className="text-xs text-muted-foreground truncate">Chopin Nocturnes</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <button className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
            <SkipBack className="h-4 w-4 text-foreground" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-10 w-10 rounded-full bg-primary flex items-center justify-center hover:brightness-110 transition-all active:scale-95"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 text-primary-foreground" strokeWidth={2} />
            ) : (
              <Play className="h-4 w-4 text-primary-foreground ml-0.5" strokeWidth={2} />
            )}
          </button>
          <button className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
            <SkipForward className="h-4 w-4 text-foreground" strokeWidth={1.5} />
          </button>
        </div>

        {/* Time + extras */}
        <div className="hidden sm:flex items-center gap-3 flex-1 justify-end">
          <span className="text-mono text-xs text-muted-foreground">1:42 / 4:53</span>
          <Volume2 className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          <div className="w-20 h-1 bg-secondary rounded-full">
            <div className="h-full bg-muted-foreground/50 rounded-full" style={{ width: "70%" }} />
          </div>
          <button className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
            <Maximize2 className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
