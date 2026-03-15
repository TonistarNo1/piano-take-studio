import { motion } from "framer-motion";
import {
  Mic,
  Video,
  Headphones,
  HardDrive,
  Cpu,
  Play,
  Library,
  FolderOpen,
  Archive,
  Star,
  Clock,
  Hash,
} from "lucide-react";
import { StatusCard } from "@/components/studio/StatusCard";
import { TakeCard } from "@/components/studio/TakeCard";
import { Link } from "react-router-dom";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.2, 0, 0, 1] },
};

const recentTakes = [
  { title: "Nocturne Op.9 No.2", takeNumber: 42, date: "Today, 14:32", duration: "4:53", project: "Chopin Nocturnes", category: "In Progress", isFavorite: true, hasVideo: true, hasComments: true, thumbnailHue: 142 },
  { title: "Clair de Lune", takeNumber: 18, date: "Today, 11:05", duration: "5:21", project: "Debussy", category: "Idea", hasVideo: true, thumbnailHue: 220 },
  { title: "Prelude in C Major", takeNumber: 7, date: "Yesterday", duration: "2:15", project: "Bach WTC", hasVideo: true, thumbnailHue: 280 },
  { title: "Ballade No.1 — Opening", takeNumber: 31, date: "Yesterday", duration: "3:47", project: "Chopin Ballades", category: "In Progress", isFavorite: true, hasVideo: true, thumbnailHue: 340 },
  { title: "Gymnopédie No.1", takeNumber: 12, date: "Mar 13", duration: "3:02", project: "Satie", hasVideo: true, thumbnailHue: 180 },
];

export default function Dashboard() {
  return (
    <motion.div {...fadeUp} className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-display text-foreground">Studio Ready.</h1>
        <p className="text-sm text-muted-foreground mt-1 text-mono">
          Inputs active. SSD mounted. Ready for Take 104.
        </p>
      </div>

      {/* System Status */}
      <section>
        <h2 className="text-section-label mb-3">System Status</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <StatusCard icon={Mic} label="Recorder" value="Idle" status="active" />
          <StatusCard icon={Video} label="Video" value="Cam Link 4K" status="active" />
          <StatusCard icon={Headphones} label="Audio" value="Scarlett 2i2" status="active" />
          <StatusCard icon={HardDrive} label="Storage" value="842 GB Free" status="active" />
          <StatusCard icon={Cpu} label="Encoder" value="Quick Sync" status="active" />
        </div>
      </section>

      {/* Stats */}
      <section>
        <h2 className="text-section-label mb-3">Quick Stats</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: Clock, label: "Takes Today", value: "7" },
            { icon: FolderOpen, label: "Projects", value: "12" },
            { icon: Star, label: "Favorites", value: "34" },
            { icon: Hash, label: "Total Takes", value: "1,247" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-2xl font-semibold text-display text-foreground text-mono">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-section-label mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Link to="/record" className="glass-card rounded-xl p-4 flex items-center gap-3 hover:bg-card-elevated transition-colors group cursor-pointer bg-primary/5 border-primary/20">
            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <Mic className="h-5 w-5 text-primary" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-primary">Start Recording</p>
              <p className="text-[11px] text-muted-foreground">Begin new take</p>
            </div>
          </Link>
          {[
            { icon: Library, label: "Library", desc: "Browse takes", path: "/library" },
            { icon: FolderOpen, label: "Projects", desc: "Manage projects", path: "/projects" },
            { icon: Archive, label: "Archive", desc: "View archive", path: "/archive" },
          ].map((a) => (
            <Link key={a.path} to={a.path} className="glass-card rounded-xl p-4 flex items-center gap-3 hover:bg-card-elevated transition-colors cursor-pointer">
              <div className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center">
                <a.icon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{a.label}</p>
                <p className="text-[11px] text-muted-foreground">{a.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Active Project */}
      <section>
        <h2 className="text-section-label mb-3">Active Project</h2>
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-display text-foreground">Chopin Nocturnes</p>
              <p className="text-sm text-muted-foreground mt-0.5">23 takes · 1h 42m total · Last updated today</p>
            </div>
            <span className="text-[11px] font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
              In Progress
            </span>
          </div>
        </div>
      </section>

      {/* Recent Takes */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-section-label">Recent Takes</h2>
          <Link to="/library" className="text-xs text-primary hover:underline">View All</Link>
        </div>
        <div className="space-y-2">
          {recentTakes.map((take) => (
            <TakeCard key={take.takeNumber} {...take} />
          ))}
        </div>
      </section>
    </motion.div>
  );
}
