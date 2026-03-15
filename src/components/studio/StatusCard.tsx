import { LucideIcon } from "lucide-react";
import { StatusDot } from "./StatusDot";

interface StatusCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  status: "active" | "idle" | "warning" | "error";
}

export function StatusCard({ icon: Icon, label, value, status }: StatusCardProps) {
  return (
    <div className="glass-card rounded-xl p-4 flex items-center gap-3">
      <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground truncate">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">{value}</p>
      </div>
      <StatusDot status={status} pulse={status === "active"} />
    </div>
  );
}
