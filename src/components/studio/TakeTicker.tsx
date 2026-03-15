interface TakeTickerProps {
  progress?: number;
  visible?: boolean;
}

export function TakeTicker({ progress = 0, visible = true }: TakeTickerProps) {
  if (!visible) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent">
      <div
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
