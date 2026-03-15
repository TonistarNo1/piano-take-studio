import { motion } from "framer-motion";
import { AlertTriangle, Search } from "lucide-react";
import { TakeCard } from "@/components/studio/TakeCard";

import { fadeUp } from "@/lib/animations";

const archivedTakes = [
  { title: "Nocturne Op.55 No.1 — Draft", takeNumber: 3, date: "Feb 28", duration: "4:11", project: "Chopin Nocturnes", isArchived: true, hasVideo: true, thumbnailHue: 142 },
  { title: "Gnossienne No.1", takeNumber: 2, date: "Feb 25", duration: "3:45", project: "Satie", isArchived: true, hasVideo: true, thumbnailHue: 180 },
  { title: "Prelude Op.28 No.4", takeNumber: 14, date: "Feb 20", duration: "2:03", project: "Chopin Preludes", isArchived: true, hasVideo: true, thumbnailHue: 60 },
  { title: "Consolation No.3", takeNumber: 8, date: "Feb 18", duration: "5:22", project: "Liszt", isArchived: true, hasVideo: true, thumbnailHue: 300 },
  { title: "Rêverie — Early Take", takeNumber: 1, date: "Feb 12", duration: "3:58", project: "Debussy", isArchived: true, hasVideo: true, thumbnailHue: 200 },
];

export default function ArchiveScreen() {
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
          { label: "Archived", value: "234" },
          { label: "Storage Used", value: "48.2 GB" },
          { label: "Oldest", value: "Jan 2025" },
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
          placeholder="Search archive..."
          className="w-full h-11 pl-10 pr-4 rounded-xl bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
        />
      </div>

      {/* Takes */}
      <div className="space-y-2">
        {archivedTakes.map((take) => (
          <TakeCard key={take.takeNumber} {...take} />
        ))}
      </div>
    </motion.div>
  );
}
