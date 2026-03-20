import { motion } from "framer-motion";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { SegmentedControl } from "@/components/studio/SegmentedControl";
import { TakeCard } from "@/components/studio/TakeCard";
import { useStudio } from "@/store/StudioContext";
import { fadeUp } from "@/lib/animations";

export default function LibraryScreen() {
  const [activeTab, setActiveTab] = useState("All");
  const { getFilteredTakes, searchQuery, setSearch, activeFilters, toggleFilter, playTake, toggleFavorite, archiveTake, deleteTake, takes, projects } = useStudio();

  const filtered = getFilteredTakes(activeTab);

  const uniqueProjects = [...new Set(takes.filter((t) => !t.isArchived && t.project).map((t) => t.project))];
  const filterOptions = [...uniqueProjects, "Has Video", "Commented"];

  return (
    <motion.div {...fadeUp} className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-display text-foreground">Library</h1>
        <p className="text-sm text-muted-foreground mt-1">All your recordings in one place.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
        <input
          value={searchQuery}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search takes..."
          className="w-full h-11 pl-10 pr-12 rounded-xl bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-lg bg-secondary flex items-center justify-center text-xs text-muted-foreground"
          >
            ✕
          </button>
        )}
      </div>

      {/* Tabs */}
      <SegmentedControl
        segments={["All", "Favorites", "Recent"]}
        active={activeTab}
        onChange={setActiveTab}
      />

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {filterOptions.map((f) => (
          <button
            key={f}
            onClick={() => toggleFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors whitespace-nowrap shrink-0 active:scale-95 ${
              activeFilters.includes(f)
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
        {activeFilters.length > 0 && (
          <button
            onClick={() => { toggleFilter(activeFilters[0]); }}
            className="text-xs px-3 py-1.5 rounded-full bg-destructive/10 text-destructive whitespace-nowrap shrink-0"
          >
            Clear
          </button>
        )}
      </div>

      {/* Takes */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No takes match your filters.
          </div>
        )}
        {filtered.map((take) => (
          <TakeCard
            key={take.id}
            take={take}
            showActions
            onPlay={() => playTake(take.id)}
            onFavorite={() => toggleFavorite(take.id)}
            onArchive={() => archiveTake(take.id)}
            onDelete={() => deleteTake(take.id)}
          />
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground py-4">
        Showing {filtered.length} of {takes.filter((t) => !t.isArchived).length} takes
      </p>
    </motion.div>
  );
}
