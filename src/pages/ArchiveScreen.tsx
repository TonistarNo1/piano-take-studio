import { motion } from "framer-motion";
import { useState } from "react";
import { AlertTriangle, Search } from "lucide-react";
import { TakeCard } from "@/components/studio/TakeCard";
import { useStudio } from "@/store/StudioContext";
import { fadeUp } from "@/lib/animations";

export default function ArchiveScreen() {
  const { getArchivedTakes, restoreTake, deleteTake, toggleFavorite, playTake } = useStudio();
  const [search, setSearch] = useState("");

  const archived = getArchivedTakes().filter((t) =>
    search ? t.title.toLowerCase().includes(search.toLowerCase()) : true
  );

  const totalSize = archived.length * 9.6; // approximate GB

  return (
    <motion.div {...fadeUp} className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-display text-foreground">Archive</h1>
        <p className="text-sm text-muted-foreground mt-1">Older recordings safely stored on SSD.</p>
      </div>

      {/* Banner */}
      <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: "hsl(38 92% 50% / 0.08)" }}>
        <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" strokeWidth={1.5} />
        <div>
          <p className="text-sm font-medium text-warning">Auto-Archive Active</p>
          <p className="text-xs text-muted-foreground mt-1">
            Takes older than 14 days are automatically moved to the SSD archive.
            Archived content is still browsable and can be restored at any time.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Archived", value: String(archived.length) },
          { label: "Storage Used", value: `${totalSize.toFixed(1)} GB` },
          { label: "Oldest", value: archived.length > 0 ? archived[archived.length - 1].date : "—" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4 text-center">
            <p className="text-xl font-semibold text-mono text-foreground">{s.value}</p>
            <p className="text-[11px] text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search archive..."
          className="w-full h-11 pl-10 pr-4 rounded-xl bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
        />
      </div>

      {/* Takes */}
      <div className="space-y-2">
        {archived.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">Archive is empty.</div>
        )}
        {archived.map((take) => (
          <TakeCard
            key={take.id}
            take={take}
            showActions
            onPlay={() => playTake(take.id)}
            onFavorite={() => toggleFavorite(take.id)}
            onRestore={() => restoreTake(take.id)}
            onDelete={() => deleteTake(take.id)}
          />
        ))}
      </div>
    </motion.div>
  );
}
