import { motion } from "framer-motion";
import { Plus, Edit3, Trash2, Tag, FolderOpen, MessageCircle } from "lucide-react";

import { fadeUp } from "@/lib/animations";

const categories = [
  { name: "In Progress", color: "hsl(38 92% 50%)", count: 47, isDefault: true },
  { name: "Idea", color: "hsl(220 70% 55%)", count: 23, isDefault: true },
  { name: "Completed", color: "hsl(142 71% 45%)", count: 18, isDefault: true },
  { name: "Performance Ready", color: "hsl(280 60% 55%)", count: 5, isDefault: false },
  { name: "Needs Review", color: "hsl(0 70% 55%)", count: 12, isDefault: false },
  { name: "Warm-Up", color: "hsl(180 50% 45%)", count: 34, isDefault: false },
];

export default function CategoriesScreen() {
  return (
    <motion.div {...fadeUp} className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-display text-foreground">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">Organize your takes and projects.</p>
        </div>
        <button className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:brightness-110 transition-all active:scale-95">
          <Plus className="h-4 w-4" strokeWidth={2} />
          New Category
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.name} className="glass-card rounded-xl p-4 flex items-center gap-3">
            <div
              className="h-4 w-4 rounded-full shrink-0"
              style={{ backgroundColor: cat.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">{cat.name}</p>
                {cat.isDefault && (
                  <span className="text-[9px] font-medium bg-secondary text-muted-foreground px-1.5 py-0.5 rounded">
                    DEFAULT
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{cat.count} items</p>
            </div>
            <div className="flex items-center gap-1">
              <button className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
                <Edit3 className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
              </button>
              {!cat.isDefault && (
                <button className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-destructive/10 transition-colors">
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" strokeWidth={1.5} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Assignment sections */}
      <section>
        <h2 className="text-section-label mb-3">Quick Assignment</h2>
        <div className="glass-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
            <FolderOpen className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
            <div className="flex-1">
              <p className="text-sm text-foreground">Assign category to project</p>
              <p className="text-xs text-muted-foreground">Select a project and choose a category</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
            <Tag className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
            <div className="flex-1">
              <p className="text-sm text-foreground">Assign category to take</p>
              <p className="text-xs text-muted-foreground">Select a take and choose a category</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
            <MessageCircle className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
            <div className="flex-1">
              <p className="text-sm text-foreground">Manage comments</p>
              <p className="text-xs text-muted-foreground">View and manage all take comments</p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
