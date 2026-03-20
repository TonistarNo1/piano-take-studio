import { motion } from "framer-motion";
import {
  Mic, Video, Headphones, HardDrive, Cpu, Library, FolderOpen, Archive, Star, Clock, Hash,
} from "lucide-react";
import { StatusCard } from "@/components/studio/StatusCard";
import { TakeCard } from "@/components/studio/TakeCard";
import { Link } from "react-router-dom";
import { useStudio } from "@/store/StudioContext";
import { fadeUp } from "@/lib/animations";

export default function Dashboard() {
  const { getActiveTakes, getStats, recorder, projects, playTake, toggleFavorite } = useStudio();
  const stats = getStats();
  const recentTakes = getActiveTakes().slice(0, 5);
  const activeProject = projects[0];

  return (
    <motion.div {...fadeUp} className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-display text-foreground">Studio Ready.</h1>
        <p className="text-sm text-muted-foreground mt-1 text-mono">
          Inputs active. SSD mounted. Ready for Take {recorder.currentTakeNumber}.
        </p>
      </div>

      {/* System Status */}
      <section>
        <h2 className="text-section-label mb-3">System Status</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <StatusCard icon={Mic} label="Recorder" value={recorder.status === "recording" ? "Recording" : "Idle"} status={recorder.status === "recording" ? "active" : "idle"} />
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
            { icon: Clock, label: "Takes Today", value: String(stats.takesToday) },
            { icon: FolderOpen, label: "Projects", value: String(stats.totalProjects) },
            { icon: Star, label: "Favorites", value: String(stats.favorites) },
            { icon: Hash, label: "Total Takes", value: String(stats.totalTakes) },
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
      {activeProject && (
        <section>
          <h2 className="text-section-label mb-3">Active Project</h2>
          <Link to={`/projects/${activeProject.id}`} className="glass-card rounded-xl p-5 block hover:bg-card-elevated transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-display text-foreground">{activeProject.name}</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {getActiveTakes().filter((t) => t.project === activeProject.name).length} takes · Last updated today
                </p>
              </div>
              {activeProject.category && (
                <span className="text-[11px] font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {activeProject.category}
                </span>
              )}
            </div>
          </Link>
        </section>
      )}

      {/* Recent Takes */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-section-label">Recent Takes</h2>
          <Link to="/library" className="text-xs text-primary hover:underline">View All</Link>
        </div>
        <div className="space-y-2">
          {recentTakes.map((take) => (
            <TakeCard
              key={take.id}
              take={take}
              onPlay={() => playTake(take.id)}
              onFavorite={() => toggleFavorite(take.id)}
            />
          ))}
        </div>
      </section>
    </motion.div>
  );
}
