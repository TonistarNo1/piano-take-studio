import { motion } from "framer-motion";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { SegmentedControl } from "@/components/studio/SegmentedControl";
import { TakeCard } from "@/components/studio/TakeCard";
import { Link } from "react-router-dom";

import { fadeUp } from "@/lib/animations";

const allTakes = [
  { title: "Nocturne Op.9 No.2", takeNumber: 42, date: "Today, 14:32", duration: "4:53", project: "Chopin Nocturnes", category: "In Progress", isFavorite: true, hasVideo: true, hasComments: true, thumbnailHue: 142 },
  { title: "Clair de Lune", takeNumber: 18, date: "Today, 11:05", duration: "5:21", project: "Debussy", category: "Idea", hasVideo: true, thumbnailHue: 220 },
  { title: "Prelude in C Major", takeNumber: 7, date: "Yesterday", duration: "2:15", project: "Bach WTC", hasVideo: true, thumbnailHue: 280 },
  { title: "Ballade No.1 — Opening", takeNumber: 31, date: "Yesterday", duration: "3:47", project: "Chopin Ballades", category: "In Progress", isFavorite: true, hasVideo: true, thumbnailHue: 340 },
  { title: "Gymnopédie No.1", takeNumber: 12, date: "Mar 13", duration: "3:02", project: "Satie", hasVideo: true, thumbnailHue: 180 },
  { title: "Rêverie", takeNumber: 5, date: "Mar 13", duration: "4:11", project: "Debussy", hasVideo: true, thumbnailHue: 200 },
  { title: "Liebestraum No.3", takeNumber: 22, date: "Mar 12", duration: "6:14", project: "Liszt", category: "Completed", isFavorite: true, hasVideo: true, hasComments: true, thumbnailHue: 300 },
  { title: "Moonlight Sonata — Mvt.1", takeNumber: 15, date: "Mar 11", duration: "7:02", project: "Beethoven Sonatas", category: "In Progress", hasVideo: true, thumbnailHue: 240 },
  { title: "Arabesque No.1", takeNumber: 9, date: "Mar 10", duration: "4:28", project: "Debussy", hasVideo: true, thumbnailHue: 160 },
  { title: "Waltz in C# Minor", takeNumber: 28, date: "Mar 9", duration: "3:55", project: "Chopin Waltzes", category: "Idea", hasVideo: true, thumbnailHue: 50 },
];

export default function LibraryScreen() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = allTakes.filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeTab === "Favorites") return t.isFavorite;
    if (activeTab === "Recent") return ["Today", "Yesterday"].some((d) => t.date.includes(d));
    return true;
  });

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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search takes..."
          className="w-full h-11 pl-10 pr-12 rounded-xl bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-lg bg-secondary flex items-center justify-center">
          <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
        </button>
      </div>

      {/* Tabs */}
      <SegmentedControl
        segments={["All", "Favorites", "Recent", "Archived"]}
        active={activeTab}
        onChange={setActiveTab}
      />

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {["Chopin Nocturnes", "Debussy", "Bach WTC", "Has Video", "Commented"].map((f) => (
          <button
            key={f}
            className="text-xs px-3 py-1.5 rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap shrink-0"
          >
            {f}
          </button>
        ))}
      </div>

      {/* Takes */}
      <div className="space-y-2">
        {filtered.map((take) => (
          <Link key={take.takeNumber} to={`/library/${take.takeNumber}`}>
            <TakeCard {...take} />
          </Link>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground py-4">
        Showing {filtered.length} of {allTakes.length} takes
      </p>
    </motion.div>
  );
}
