import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, Edit3, Trash2, Tag, FolderOpen, MessageCircle, Check, X } from "lucide-react";
import { useStudio } from "@/store/StudioContext";
import { fadeUp } from "@/lib/animations";

export default function CategoriesScreen() {
  const { categories, addCategory, renameCategory, deleteCategory, takes, projects } = useStudio();
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("hsl(200 60% 50%)");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const handleCreate = () => {
    if (!newName.trim()) return;
    addCategory(newName, newColor);
    setNewName("");
    setNewColor("hsl(200 60% 50%)");
    setShowNew(false);
  };

  const startEdit = (id: number, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      renameCategory(editingId, editName);
    }
    setEditingId(null);
  };

  const getCategoryCount = (name: string) => {
    return takes.filter((t) => t.category === name).length + projects.filter((p) => p.category === name).length;
  };

  return (
    <motion.div {...fadeUp} className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-display text-foreground">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">Organize your takes and projects.</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:brightness-110 transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          New Category
        </button>
      </div>

      {/* New category form */}
      {showNew && (
        <div className="glass-card rounded-xl p-4 flex gap-2 items-end">
          <div className="flex-1 space-y-1.5">
            <span className="text-xs text-muted-foreground">Name</span>
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="Category name..."
              className="w-full h-9 px-3 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <input
            type="color"
            value="#3388cc"
            onChange={(e) => {
              // Convert hex to hsl-ish for display
              setNewColor(e.target.value);
            }}
            className="h-9 w-9 rounded-lg border-0 cursor-pointer"
          />
          <button onClick={handleCreate} disabled={!newName.trim()} className="h-9 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium disabled:opacity-40 active:scale-95">Add</button>
          <button onClick={() => { setShowNew(false); setNewName(""); }} className="h-9 px-3 rounded-lg bg-secondary text-muted-foreground text-xs active:scale-95">Cancel</button>
        </div>
      )}

      {/* Categories list */}
      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className="glass-card rounded-xl p-4 flex items-center gap-3">
            <div
              className="h-4 w-4 rounded-full shrink-0"
              style={{ backgroundColor: cat.color }}
            />
            <div className="flex-1 min-w-0">
              {editingId === cat.id ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditingId(null); }}
                    className="h-8 px-2 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                  <button onClick={saveEdit} className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center active:scale-95">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="h-7 w-7 rounded-lg bg-secondary flex items-center justify-center active:scale-95">
                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{cat.name}</p>
                    {cat.isDefault && (
                      <span className="text-[9px] font-medium bg-secondary text-muted-foreground px-1.5 py-0.5 rounded">DEFAULT</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{getCategoryCount(cat.name)} items</p>
                </>
              )}
            </div>
            {editingId !== cat.id && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => startEdit(cat.id, cat.name)}
                  className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors active:scale-95"
                >
                  <Edit3 className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
                </button>
                {!cat.isDefault && (
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-destructive/10 transition-colors active:scale-95"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" strokeWidth={1.5} />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
