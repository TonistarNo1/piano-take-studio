import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, Search, FolderOpen } from "lucide-react";
import { Link } from "react-router-dom";

import { fadeUp } from "@/lib/animations";

const projects = [
  { id: 1, name: "Chopin Nocturnes", takes: 23, category: "In Progress", lastUpdated: "Today", hue: 142 },
  { id: 2, name: "Debussy Collection", takes: 15, category: "In Progress", lastUpdated: "Today", hue: 220 },
  { id: 3, name: "Bach WTC Book I", takes: 8, category: "Idea", lastUpdated: "Yesterday", hue: 280 },
  { id: 4, name: "Chopin Ballades", takes: 31, category: "In Progress", lastUpdated: "Yesterday", hue: 340 },
  { id: 5, name: "Satie — Gymnopédies", takes: 12, category: "Completed", lastUpdated: "Mar 13", hue: 180 },
  { id: 6, name: "Liszt — Consolations", takes: 22, category: "In Progress", lastUpdated: "Mar 12", hue: 300 },
  { id: 7, name: "Beethoven Sonatas", takes: 19, category: "In Progress", lastUpdated: "Mar 11", hue: 240 },
  { id: 8, name: "Chopin Waltzes", takes: 28, category: "Idea", lastUpdated: "Mar 9", hue: 50 },
  { id: 9, name: "Ravel — Miroirs", takes: 6, category: "Idea", lastUpdated: "Mar 5", hue: 160 },
];

export default function ProjectsScreen() {
  const [search, setSearch] = useState("");
  const filtered = projects.filter((p) =>
    search ? p.name.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <motion.div {...fadeUp} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-display text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">{projects.length} projects</p>
        </div>
        <button className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:brightness-110 transition-all active:scale-95">
          <Plus className="h-4 w-4" strokeWidth={2} />
          New Project
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="w-full h-11 pl-10 pr-4 rounded-xl bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="glass-card rounded-2xl p-5 hover:bg-card-elevated transition-all duration-200 cursor-pointer group"
          >
            <div
              className="h-20 w-20 rounded-xl mb-4 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, hsl(${project.hue} 30% 15%), hsl(${project.hue} 40% 8%))`,
              }}
            >
              <FolderOpen className="h-8 w-8 text-foreground/40 group-hover:text-foreground/60 transition-colors" strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-semibold text-foreground">{project.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {project.takes} takes · {project.lastUpdated}
            </p>
            <span className={`inline-block mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full ${
              project.category === "Completed"
                ? "bg-primary/10 text-primary"
                : project.category === "In Progress"
                ? "bg-warning/10 text-warning"
                : "bg-secondary text-muted-foreground"
            }`}>
              {project.category}
            </span>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
