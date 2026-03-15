import { cn } from "@/lib/utils";

interface StatusDotProps {
  status: "active" | "idle" | "warning" | "error";
  pulse?: boolean;
  size?: "sm" | "md";
}

export function StatusDot({ status, pulse = false, size = "sm" }: StatusDotProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-full",
        size === "sm" ? "h-2 w-2" : "h-3 w-3",
        status === "active" && "bg-primary",
        status === "idle" && "bg-muted-foreground",
        status === "warning" && "bg-warning",
        status === "error" && "bg-destructive",
        pulse && "pulse-recording"
      )}
    />
  );
}
