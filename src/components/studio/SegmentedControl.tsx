import { cn } from "@/lib/utils";

interface SegmentedControlProps {
  segments: string[];
  active: string;
  onChange: (segment: string) => void;
}

export function SegmentedControl({ segments, active, onChange }: SegmentedControlProps) {
  return (
    <div className="flex gap-1 bg-secondary/50 p-1 rounded-xl">
      {segments.map((seg) => (
        <button
          key={seg}
          onClick={() => onChange(seg)}
          className={cn(
            "px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
            active === seg
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {seg}
        </button>
      ))}
    </div>
  );
}
