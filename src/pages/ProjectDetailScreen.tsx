import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Edit3, Tag, Archive, Check, X } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { TakeCard } from "@/components/studio/TakeCard";
import { useStudio } from "@/store/StudioContext";
import { fadeUp } from "@/lib/animations";

export default function ProjectDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getProject, getProjectTakes, renameProject, setProjectCategory, setProjectDescription, deleteProject,
    archiveTake, toggleFavorite, playTake, deleteTake, categories,
  } = useStudio();

  const project = getProject(Number(id));
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg">Project not found</p>
        <Link to="/projects" className="text-primary text-sm mt-2 hover:underline">Back to Projects</Link>
      </div>
    );
  }

  const projectTakes = getProjectTakes(project.id);
  const totalDuration = projectTakes.reduce((a, t) => a + t.durationSec, 0);
  const formatDuration = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const startEditing = () => {
    setEditName(project.name);
    setEditDesc(project.description);
    setIsEditing(true);
  };

  const saveEdit = () => {
    if (editName.trim()) renameProject(project.id, editName);
    setProjectDescription(project.id, editDesc);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteProject(project.id);
    navigate("/projects");
  };

  return (
    <motion.div {...fadeUp} className="space-y-6 max-w-3xl mx-auto">
      <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Back to Projects
      </Link>

      {/* Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-secondary/50 border border-border/50 text-lg font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-secondary/50 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                />
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium active:scale-95 flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" /> Save
                  </button>
                  <button onClick={() => setIsEditing(false)} className="h-8 px-3 rounded-lg bg-secondary text-muted-foreground text-xs active:scale-95 flex items-center gap-1">
                    <X className="h-3.5 w-3.5" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-semibold text-display text-foreground">{project.name}</h1>
                <div className="flex items-center gap-3 mt-2">
                  {project.category && (
                    <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                      project.category === "Completed" ? "bg-primary/10 text-primary" :
                      project.category === "In Progress" ? "bg-warning/10 text-warning" :
                      "bg-secondary text-muted-foreground"
                    }`}>{project.category}</span>
                  )}
                  <span className="text-sm text-muted-foreground text-mono">{projectTakes.length} takes · {formatDuration(totalDuration)}</span>
                </div>
                {project.description && (
                  <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{project.description}</p>
                )}
              </>
            )}
          </div>
        </div>

        {!isEditing && (
          <div className="flex gap-2 mt-4 flex-wrap">
            <button onClick={startEditing} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/50 text-sm text-muted-foreground hover:text-foreground transition-colors active:scale-[0.97]">
              <Edit3 className="h-4 w-4" strokeWidth={1.5} /> Edit
            </button>
            <select
              value={project.category}
              onChange={(e) => setProjectCategory(project.id, e.target.value)}
              className="h-[42px] px-3 rounded-xl bg-secondary/50 border border-border/50 text-sm text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-destructive/10 text-sm text-destructive hover:bg-destructive/20 transition-colors active:scale-[0.97]"
            >
              <Archive className="h-4 w-4" strokeWidth={1.5} /> Delete Project
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Time", value: formatDuration(totalDuration) },
          { label: "Takes", value: String(projectTakes.length) },
          { label: "Favorites", value: String(projectTakes.filter((t) => t.isFavorite).length) },
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
        {projectTakes.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">No takes in this project yet.</div>
        )}
        <div className="space-y-2">
          {projectTakes.map((take) => (
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
      </div>
    </motion.div>
  );
}
