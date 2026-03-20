import { Star, Play, Video, MessageCircle, Archive, Trash2, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import type { Take } from "@/store/StudioContext";

interface TakeCardProps {
  take: Take;
  onPlay?: () => void;
  onFavorite?: () => void;
  onArchive?: () => void;
  onRestore?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export function TakeCard({
  take,
  onPlay,
  onFavorite,
  onArchive,
  onRestore,
  onDelete,
  showActions = false,
}: TakeCardProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-xl p-3 flex items-center gap-3 transition-all duration-200 hover:bg-card-elevated group",
        take.isArchived && "opacity-60"
      )}
    >
      {/* Thumbnail — clicking plays */}
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onPlay?.(); }}
        className="h-16 w-24 rounded-lg shrink-0 flex items-center justify-center relative overflow-hidden active:scale-95 transition-transform"
        style={{
          background: `linear-gradient(135deg, hsl(${take.thumbnailHue} 30% 12%), hsl(${take.thumbnailHue} 40% 8%))`,
        }}
      >
        <Play className="h-5 w-5 text-foreground/60 group-hover:text-primary transition-colors" strokeWidth={1.5} />
        <span className="absolute bottom-1 right-1 text-mono text-[10px] bg-background/80 px-1 rounded text-foreground/80">
          {take.duration}
        </span>
      </button>

      {/* Content — links to detail */}
      <Link to={`/library/${take.id}`} className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground truncate">{take.title}</p>
          {take.hasVideo && <Video className="h-3.5 w-3.5 text-muted-foreground shrink-0" strokeWidth={1.5} />}
          {take.hasComments && <MessageCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0" strokeWidth={1.5} />}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Take {String(take.takeNumber).padStart(3, "0")} · {take.date}
        </p>
        <div className="flex items-center gap-1.5 mt-1.5">
          {take.project && (
            <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {take.project}
            </span>
          )}
          {take.category && (
            <span className="text-[10px] font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
              {take.category}
            </span>
          )}
        </div>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFavorite?.(); }}
          className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors active:scale-95"
          title={take.isFavorite ? "Remove favorite" : "Add favorite"}
        >
          {take.isFavorite ? (
            <Star className="h-4 w-4 text-warning fill-warning" strokeWidth={1.5} />
          ) : (
            <Star className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          )}
        </button>

        {showActions && !take.isArchived && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onArchive?.(); }}
            className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors active:scale-95"
            title="Archive"
          >
            <Archive className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          </button>
        )}

        {showActions && take.isArchived && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRestore?.(); }}
            className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-primary/10 transition-colors active:scale-95"
            title="Restore"
          >
            <Archive className="h-4 w-4 text-primary" strokeWidth={1.5} />
          </button>
        )}

        {showActions && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete?.(); }}
            className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-destructive/10 transition-colors active:scale-95"
            title="Delete"
          >
            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" strokeWidth={1.5} />
          </button>
        )}
      </div>
    </div>
  );
}
