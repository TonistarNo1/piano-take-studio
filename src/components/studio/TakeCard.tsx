import { Star, Play, MoreVertical, Video, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TakeCardProps {
  title: string;
  takeNumber: number;
  date: string;
  duration: string;
  project?: string;
  category?: string;
  isFavorite?: boolean;
  hasVideo?: boolean;
  hasComments?: boolean;
  isArchived?: boolean;
  thumbnailHue?: number;
  onClick?: () => void;
}

export function TakeCard({
  title,
  takeNumber,
  date,
  duration,
  project,
  category,
  isFavorite,
  hasVideo,
  hasComments,
  isArchived,
  thumbnailHue = 142,
  onClick,
}: TakeCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "glass-card rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-all duration-200 hover:bg-card-elevated group",
        isArchived && "opacity-60"
      )}
    >
      {/* Thumbnail */}
      <div
        className="h-16 w-24 rounded-lg shrink-0 flex items-center justify-center relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, hsl(${thumbnailHue} 30% 12%), hsl(${thumbnailHue} 40% 8%))`,
        }}
      >
        <Play className="h-5 w-5 text-foreground/60 group-hover:text-primary transition-colors" strokeWidth={1.5} />
        <span className="absolute bottom-1 right-1 text-mono text-[10px] bg-background/80 px-1 rounded text-foreground/80">
          {duration}
        </span>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground truncate">{title}</p>
          {hasVideo && <Video className="h-3.5 w-3.5 text-muted-foreground shrink-0" strokeWidth={1.5} />}
          {hasComments && <MessageCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0" strokeWidth={1.5} />}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Take {String(takeNumber).padStart(3, "0")} · {date}
        </p>
        <div className="flex items-center gap-1.5 mt-1.5">
          {project && (
            <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {project}
            </span>
          )}
          {category && (
            <span className="text-[10px] font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
              {category}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {isFavorite && <Star className="h-4 w-4 text-warning fill-warning" strokeWidth={1.5} />}
        <button className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
          <MoreVertical className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
