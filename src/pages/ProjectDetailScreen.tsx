import { motion } from "framer-motion";
import { ArrowLeft, Edit3, Tag, Archive } from "lucide-react";
import { Link } from "react-router-dom";
import { TakeCard } from "@/components/studio/TakeCard";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.2, 0, 0, 1] },
};

const projectTakes = [
  { title: "Nocturne Op.9 No.2", takeNumber: 42, date: "Today, 14:32", duration: "4:53", project: "Chopin Nocturnes", category: "In Progress", isFavorite: true, hasVideo: true, hasComments: true, thumbnailHue: 142 },
  { title: "Nocturne Op.9 No.2 — Slower", takeNumber: 41, date: "Today, 13:10", duration: "5:12", project: "Chopin Nocturnes", hasVideo: true, thumbnailHue: 142 },
  { title: "Nocturne Op.27 No.2", takeNumber: 38, date: "Yesterday", duration: "6:42", project: "Chopin Nocturnes", isFavorite: true, hasVideo: true, thumbnailHue: 150 },
  { title: "Nocturne Op.48 No.1", takeNumber: 35, date: "Mar 13", duration: "7:18", project: "Chopin Nocturnes", category: "In Progress", hasVideo: true, thumbnailHue: 130 },
  { title: "Nocturne Op.15 No.2", takeNumber: 29, date: "Mar 12", duration: "3:55", project: "Chopin Nocturnes", hasVideo: true, thumbnailHue: 155 },
];

export default function ProjectDetailScreen() {
  return (
    <motion.div {...fadeUp} className="space-y-6 max-w-3xl mx-auto">
      <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Back to Projects
      </Link>

      {/* Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-display text-foreground">Chopin Nocturnes</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[11px] font-medium bg-warning/10 text-warning px-2.5 py-0.5 rounded-full">In Progress</span>
              <span className="text-sm text-muted-foreground text-mono">23 takes · 1h 42m</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
          Working through the complete Chopin Nocturnes. Focus on Op.9 and Op.27 this week. 
          Goal: Record clean takes of all 21 Nocturnes by end of April.
        </p>

        <div className="flex gap-2 mt-4">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/50 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Edit3 className="h-4 w-4" strokeWidth={1.5} />
            Rename
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/50 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Tag className="h-4 w-4" strokeWidth={1.5} />
            Category
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/50 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Archive className="h-4 w-4" strokeWidth={1.5} />
            Archive
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Time", value: "1h 42m" },
          { label: "Takes", value: "23" },
          { label: "Favorites", value: "5" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4 text-center">
            <p className="text-xl font-semibold text-mono text-foreground">{s.value}</p>
            <p className="text-[11px] text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Takes */}
      <div>
        <h2 className="text-section-label mb-3">Takes</h2>
        <div className="space-y-2">
          {projectTakes.map((take) => (
            <TakeCard key={take.takeNumber} {...take} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
