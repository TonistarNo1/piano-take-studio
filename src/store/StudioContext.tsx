import { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from "react";

// ── Types ──
export interface Take {
  id: number;
  title: string;
  takeNumber: number;
  date: string;
  duration: string;
  durationSec: number;
  project: string;
  category: string;
  isFavorite: boolean;
  isArchived: boolean;
  hasVideo: boolean;
  hasComments: boolean;
  thumbnailHue: number;
  comments: Comment[];
}

export interface Comment {
  id: number;
  author: string;
  text: string;
  time: string;
}

export interface Project {
  id: number;
  name: string;
  category: string;
  description: string;
  createdAt: string;
  hue: number;
}

export interface Category {
  id: number;
  name: string;
  color: string;
  isDefault: boolean;
}

export type RecorderStatus = "idle" | "recording" | "stopping";

export interface PlayerState {
  currentTakeId: number | null;
  isPlaying: boolean;
  progress: number; // 0-1
  volume: number; // 0-1
  pianoMix: number;
  voiceMix: number;
}

export interface RecorderState {
  status: RecorderStatus;
  currentTakeNumber: number;
  activeProjectId: number | null;
  startedAt: string | null;
  elapsed: number; // seconds
}

interface StudioState {
  takes: Take[];
  projects: Project[];
  categories: Category[];
  player: PlayerState;
  recorder: RecorderState;
  activeFilters: string[];
  searchQuery: string;
}

interface StudioActions {
  // Takes
  toggleFavorite: (id: number) => void;
  archiveTake: (id: number) => void;
  restoreTake: (id: number) => void;
  deleteTake: (id: number) => void;
  setTakeCategory: (id: number, category: string) => void;
  setTakeProject: (id: number, project: string) => void;
  addComment: (takeId: number, text: string) => void;
  deleteComment: (takeId: number, commentId: number) => void;

  // Projects
  addProject: (name: string) => void;
  renameProject: (id: number, name: string) => void;
  setProjectCategory: (id: number, category: string) => void;
  setProjectDescription: (id: number, desc: string) => void;
  deleteProject: (id: number) => void;

  // Categories
  addCategory: (name: string, color: string) => void;
  renameCategory: (id: number, name: string) => void;
  deleteCategory: (id: number) => void;

  // Player
  playTake: (id: number) => void;
  togglePlay: () => void;
  seek: (progress: number) => void;
  setVolume: (v: number) => void;
  setPianoMix: (v: number) => void;
  setVoiceMix: (v: number) => void;

  // Recorder
  startRecording: () => void;
  stopRecording: () => void;
  setActiveProject: (id: number | null) => void;

  // Filters
  toggleFilter: (filter: string) => void;
  setSearch: (q: string) => void;
  clearFilters: () => void;

  // Derived
  getTake: (id: number) => Take | undefined;
  getProject: (id: number) => Project | undefined;
  getProjectTakes: (projectId: number) => Take[];
  getFilteredTakes: (tab: string) => Take[];
  getActiveTakes: () => Take[];
  getArchivedTakes: () => Take[];
  getStats: () => { takesToday: number; totalProjects: number; favorites: number; totalTakes: number };
}

const StudioContext = createContext<(StudioState & StudioActions) | null>(null);

// ── Seed Data ──
const SEED_TAKES: Take[] = [
  { id: 1, title: "Nocturne Op.9 No.2", takeNumber: 42, date: "Today, 14:32", duration: "4:53", durationSec: 293, project: "Chopin Nocturnes", category: "In Progress", isFavorite: true, isArchived: false, hasVideo: true, hasComments: true, thumbnailHue: 142, comments: [{ id: 1, author: "Me", text: "Great dynamics in the middle section.", time: "2 hours ago" }] },
  { id: 2, title: "Clair de Lune", takeNumber: 18, date: "Today, 11:05", duration: "5:21", durationSec: 321, project: "Debussy", category: "Idea", isFavorite: false, isArchived: false, hasVideo: true, hasComments: false, thumbnailHue: 220, comments: [] },
  { id: 3, title: "Prelude in C Major", takeNumber: 7, date: "Yesterday", duration: "2:15", durationSec: 135, project: "Bach WTC", category: "", isFavorite: false, isArchived: false, hasVideo: true, hasComments: false, thumbnailHue: 280, comments: [] },
  { id: 4, title: "Ballade No.1 — Opening", takeNumber: 31, date: "Yesterday", duration: "3:47", durationSec: 227, project: "Chopin Ballades", category: "In Progress", isFavorite: true, isArchived: false, hasVideo: true, hasComments: false, thumbnailHue: 340, comments: [] },
  { id: 5, title: "Gymnopédie No.1", takeNumber: 12, date: "Mar 13", duration: "3:02", durationSec: 182, project: "Satie", category: "", isFavorite: false, isArchived: false, hasVideo: true, hasComments: false, thumbnailHue: 180, comments: [] },
  { id: 6, title: "Rêverie", takeNumber: 5, date: "Mar 13", duration: "4:11", durationSec: 251, project: "Debussy", category: "", isFavorite: false, isArchived: false, hasVideo: true, hasComments: false, thumbnailHue: 200, comments: [] },
  { id: 7, title: "Liebestraum No.3", takeNumber: 22, date: "Mar 12", duration: "6:14", durationSec: 374, project: "Liszt", category: "Completed", isFavorite: true, isArchived: false, hasVideo: true, hasComments: true, thumbnailHue: 300, comments: [{ id: 1, author: "Me", text: "Final version — ready for performance.", time: "5 days ago" }] },
  { id: 8, title: "Moonlight Sonata — Mvt.1", takeNumber: 15, date: "Mar 11", duration: "7:02", durationSec: 422, project: "Beethoven Sonatas", category: "In Progress", isFavorite: false, isArchived: false, hasVideo: true, hasComments: false, thumbnailHue: 240, comments: [] },
  { id: 9, title: "Arabesque No.1", takeNumber: 9, date: "Mar 10", duration: "4:28", durationSec: 268, project: "Debussy", category: "", isFavorite: false, isArchived: false, hasVideo: true, hasComments: false, thumbnailHue: 160, comments: [] },
  { id: 10, title: "Waltz in C# Minor", takeNumber: 28, date: "Mar 9", duration: "3:55", durationSec: 235, project: "Chopin Waltzes", category: "Idea", isFavorite: false, isArchived: false, hasVideo: true, hasComments: false, thumbnailHue: 50, comments: [] },
  // Archived
  { id: 11, title: "Nocturne Op.55 No.1 — Draft", takeNumber: 3, date: "Feb 28", duration: "4:11", durationSec: 251, project: "Chopin Nocturnes", category: "", isFavorite: false, isArchived: true, hasVideo: true, hasComments: false, thumbnailHue: 142, comments: [] },
  { id: 12, title: "Gnossienne No.1", takeNumber: 2, date: "Feb 25", duration: "3:45", durationSec: 225, project: "Satie", category: "", isFavorite: false, isArchived: true, hasVideo: true, hasComments: false, thumbnailHue: 180, comments: [] },
  { id: 13, title: "Prelude Op.28 No.4", takeNumber: 14, date: "Feb 20", duration: "2:03", durationSec: 123, project: "Chopin Preludes", category: "", isFavorite: false, isArchived: true, hasVideo: true, hasComments: false, thumbnailHue: 60, comments: [] },
  { id: 14, title: "Consolation No.3", takeNumber: 8, date: "Feb 18", duration: "5:22", durationSec: 322, project: "Liszt", category: "", isFavorite: false, isArchived: true, hasVideo: true, hasComments: false, thumbnailHue: 300, comments: [] },
  { id: 15, title: "Rêverie — Early Take", takeNumber: 1, date: "Feb 12", duration: "3:58", durationSec: 238, project: "Debussy", category: "", isFavorite: false, isArchived: true, hasVideo: true, hasComments: false, thumbnailHue: 200, comments: [] },
];

const SEED_PROJECTS: Project[] = [
  { id: 1, name: "Chopin Nocturnes", category: "In Progress", description: "Working through the complete Chopin Nocturnes. Focus on Op.9 and Op.27 this week. Goal: Record clean takes of all 21 Nocturnes by end of April.", createdAt: "Jan 15, 2026", hue: 142 },
  { id: 2, name: "Debussy", category: "In Progress", description: "Selected works from Debussy's piano repertoire.", createdAt: "Feb 2, 2026", hue: 220 },
  { id: 3, name: "Bach WTC", category: "Idea", description: "Well-Tempered Clavier Book I explorations.", createdAt: "Feb 10, 2026", hue: 280 },
  { id: 4, name: "Chopin Ballades", category: "In Progress", description: "All four Ballades — currently focusing on No.1.", createdAt: "Jan 20, 2026", hue: 340 },
  { id: 5, name: "Satie", category: "Completed", description: "Gymnopédies and Gnossiennes.", createdAt: "Dec 1, 2025", hue: 180 },
  { id: 6, name: "Liszt", category: "In Progress", description: "Consolations and Liebesträume.", createdAt: "Jan 5, 2026", hue: 300 },
  { id: 7, name: "Beethoven Sonatas", category: "In Progress", description: "Moonlight, Pathétique, Waldstein.", createdAt: "Feb 20, 2026", hue: 240 },
  { id: 8, name: "Chopin Waltzes", category: "Idea", description: "Selected waltzes for recital program.", createdAt: "Mar 1, 2026", hue: 50 },
  { id: 9, name: "Ravel — Miroirs", category: "Idea", description: "Exploring Ravel's Miroirs suite.", createdAt: "Mar 3, 2026", hue: 160 },
];

const SEED_CATEGORIES: Category[] = [
  { id: 1, name: "In Progress", color: "hsl(38 92% 50%)", isDefault: true },
  { id: 2, name: "Idea", color: "hsl(220 70% 55%)", isDefault: true },
  { id: 3, name: "Completed", color: "hsl(142 71% 45%)", isDefault: true },
  { id: 4, name: "Performance Ready", color: "hsl(280 60% 55%)", isDefault: false },
  { id: 5, name: "Needs Review", color: "hsl(0 70% 55%)", isDefault: false },
  { id: 6, name: "Warm-Up", color: "hsl(180 50% 45%)", isDefault: false },
];

let nextId = 100;
const genId = () => ++nextId;

export function StudioProvider({ children }: { children: ReactNode }) {
  const [takes, setTakes] = useState<Take[]>(SEED_TAKES);
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS);
  const [categories, setCategories] = useState<Category[]>(SEED_CATEGORIES);
  const [player, setPlayer] = useState<PlayerState>({
    currentTakeId: null,
    isPlaying: false,
    progress: 0,
    volume: 0.7,
    pianoMix: 0.8,
    voiceMix: 0.4,
  });
  const [recorder, setRecorder] = useState<RecorderState>({
    status: "idle",
    currentTakeNumber: takes.reduce((max, t) => Math.max(max, t.takeNumber), 0) + 1,
    activeProjectId: 1,
    startedAt: null,
    elapsed: 0,
  });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Recording timer
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  useEffect(() => {
    if (recorder.status === "recording") {
      timerRef.current = setInterval(() => {
        setRecorder((r) => ({ ...r, elapsed: r.elapsed + 1 }));
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [recorder.status]);

  // Playback progress ticker
  const playRef = useRef<ReturnType<typeof setInterval>>();
  useEffect(() => {
    if (player.isPlaying && player.currentTakeId) {
      const take = takes.find((t) => t.id === player.currentTakeId);
      if (!take) return;
      playRef.current = setInterval(() => {
        setPlayer((p) => {
          const next = p.progress + 1 / take.durationSec;
          if (next >= 1) return { ...p, progress: 0, isPlaying: false };
          return { ...p, progress: next };
        });
      }, 1000);
    } else {
      clearInterval(playRef.current);
    }
    return () => clearInterval(playRef.current);
  }, [player.isPlaying, player.currentTakeId, takes]);

  // ── Take actions ──
  const toggleFavorite = useCallback((id: number) => {
    setTakes((ts) => ts.map((t) => (t.id === id ? { ...t, isFavorite: !t.isFavorite } : t)));
  }, []);

  const archiveTake = useCallback((id: number) => {
    setTakes((ts) => ts.map((t) => (t.id === id ? { ...t, isArchived: true } : t)));
  }, []);

  const restoreTake = useCallback((id: number) => {
    setTakes((ts) => ts.map((t) => (t.id === id ? { ...t, isArchived: false } : t)));
  }, []);

  const deleteTake = useCallback((id: number) => {
    setTakes((ts) => ts.filter((t) => t.id !== id));
    setPlayer((p) => (p.currentTakeId === id ? { ...p, currentTakeId: null, isPlaying: false, progress: 0 } : p));
  }, []);

  const setTakeCategory = useCallback((id: number, category: string) => {
    setTakes((ts) => ts.map((t) => (t.id === id ? { ...t, category } : t)));
  }, []);

  const setTakeProject = useCallback((id: number, project: string) => {
    setTakes((ts) => ts.map((t) => (t.id === id ? { ...t, project } : t)));
  }, []);

  const addComment = useCallback((takeId: number, text: string) => {
    if (!text.trim()) return;
    setTakes((ts) =>
      ts.map((t) =>
        t.id === takeId
          ? { ...t, hasComments: true, comments: [...t.comments, { id: genId(), author: "Me", text: text.trim(), time: "Just now" }] }
          : t
      )
    );
  }, []);

  const deleteComment = useCallback((takeId: number, commentId: number) => {
    setTakes((ts) =>
      ts.map((t) => {
        if (t.id !== takeId) return t;
        const comments = t.comments.filter((c) => c.id !== commentId);
        return { ...t, comments, hasComments: comments.length > 0 };
      })
    );
  }, []);

  // ── Project actions ──
  const addProject = useCallback((name: string) => {
    if (!name.trim()) return;
    setProjects((ps) => [
      ...ps,
      { id: genId(), name: name.trim(), category: "", description: "", createdAt: "Today", hue: Math.floor(Math.random() * 360) },
    ]);
  }, []);

  const renameProject = useCallback((id: number, name: string) => {
    if (!name.trim()) return;
    setProjects((ps) => ps.map((p) => (p.id === id ? { ...p, name: name.trim() } : p)));
    // Update takes referencing old name
    setProjects((ps) => {
      const proj = ps.find((p) => p.id === id);
      if (!proj) return ps;
      return ps;
    });
  }, []);

  const setProjectCategory = useCallback((id: number, category: string) => {
    setProjects((ps) => ps.map((p) => (p.id === id ? { ...p, category } : p)));
  }, []);

  const setProjectDescription = useCallback((id: number, desc: string) => {
    setProjects((ps) => ps.map((p) => (p.id === id ? { ...p, description: desc } : p)));
  }, []);

  const deleteProject = useCallback((id: number) => {
    setProjects((ps) => ps.filter((p) => p.id !== id));
  }, []);

  // ── Category actions ──
  const addCategory = useCallback((name: string, color: string) => {
    if (!name.trim()) return;
    setCategories((cs) => [...cs, { id: genId(), name: name.trim(), color, isDefault: false }]);
  }, []);

  const renameCategory = useCallback((id: number, name: string) => {
    if (!name.trim()) return;
    setCategories((cs) => {
      const old = cs.find((c) => c.id === id);
      if (!old) return cs;
      const oldName = old.name;
      // Also update references
      setTakes((ts) => ts.map((t) => (t.category === oldName ? { ...t, category: name.trim() } : t)));
      setProjects((ps) => ps.map((p) => (p.category === oldName ? { ...p, category: name.trim() } : p)));
      return cs.map((c) => (c.id === id ? { ...c, name: name.trim() } : c));
    });
  }, []);

  const deleteCategory = useCallback((id: number) => {
    setCategories((cs) => {
      const cat = cs.find((c) => c.id === id);
      if (!cat || cat.isDefault) return cs;
      setTakes((ts) => ts.map((t) => (t.category === cat.name ? { ...t, category: "" } : t)));
      setProjects((ps) => ps.map((p) => (p.category === cat.name ? { ...p, category: "" } : p)));
      return cs.filter((c) => c.id !== id);
    });
  }, []);

  // ── Player ──
  const playTake = useCallback((id: number) => {
    setPlayer((p) => ({
      ...p,
      currentTakeId: id,
      isPlaying: true,
      progress: 0,
    }));
  }, []);

  const togglePlay = useCallback(() => {
    setPlayer((p) => {
      if (!p.currentTakeId) return p;
      return { ...p, isPlaying: !p.isPlaying };
    });
  }, []);

  const seek = useCallback((progress: number) => {
    setPlayer((p) => ({ ...p, progress: Math.max(0, Math.min(1, progress)) }));
  }, []);

  const setVolume = useCallback((v: number) => {
    setPlayer((p) => ({ ...p, volume: Math.max(0, Math.min(1, v)) }));
  }, []);

  const setPianoMix = useCallback((v: number) => {
    setPlayer((p) => ({ ...p, pianoMix: Math.max(0, Math.min(1, v)) }));
  }, []);

  const setVoiceMix = useCallback((v: number) => {
    setPlayer((p) => ({ ...p, voiceMix: Math.max(0, Math.min(1, v)) }));
  }, []);

  // ── Recorder ──
  const startRecording = useCallback(() => {
    setRecorder((r) => ({
      ...r,
      status: "recording" as const,
      startedAt: new Date().toLocaleTimeString("en-US", { hour12: false }),
      elapsed: 0,
    }));
  }, []);

  const stopRecording = useCallback(() => {
    setRecorder((r) => {
      const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
      const newTake: Take = {
        id: genId(),
        title: `Take ${r.currentTakeNumber}`,
        takeNumber: r.currentTakeNumber,
        date: "Just now",
        duration: fmt(r.elapsed),
        durationSec: r.elapsed,
        project: SEED_PROJECTS.find((p) => p.id === r.activeProjectId)?.name ?? "",
        category: "",
        isFavorite: false,
        isArchived: false,
        hasVideo: true,
        hasComments: false,
        thumbnailHue: Math.floor(Math.random() * 360),
        comments: [],
      };
      setTakes((ts) => [newTake, ...ts]);
      return { ...r, status: "idle" as const, currentTakeNumber: r.currentTakeNumber + 1, elapsed: 0, startedAt: null };
    });
  }, []);

  const setActiveProject = useCallback((id: number | null) => {
    setRecorder((r) => ({ ...r, activeProjectId: id }));
  }, []);

  // ── Filters ──
  const toggleFilter = useCallback((filter: string) => {
    setActiveFilters((fs) => (fs.includes(filter) ? fs.filter((f) => f !== filter) : [...fs, filter]));
  }, []);

  const setSearch = useCallback((q: string) => setSearchQuery(q), []);
  const clearFilters = useCallback(() => { setActiveFilters([]); setSearchQuery(""); }, []);

  // ── Derived ──
  const getTake = useCallback((id: number) => takes.find((t) => t.id === id), [takes]);
  const getProject = useCallback((id: number) => projects.find((p) => p.id === id), [projects]);

  const getProjectTakes = useCallback((projectId: number) => {
    const proj = projects.find((p) => p.id === projectId);
    if (!proj) return [];
    return takes.filter((t) => t.project === proj.name && !t.isArchived);
  }, [takes, projects]);

  const getFilteredTakes = useCallback(
    (tab: string) => {
      let result = takes.filter((t) => !t.isArchived);
      if (tab === "Favorites") result = result.filter((t) => t.isFavorite);
      if (tab === "Recent") result = result.filter((t) => ["Today", "Yesterday", "Just now"].some((d) => t.date.includes(d)));
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        result = result.filter((t) => t.title.toLowerCase().includes(q) || t.project.toLowerCase().includes(q));
      }
      if (activeFilters.length > 0) {
        result = result.filter((t) => {
          return activeFilters.every((f) => {
            if (f === "Has Video") return t.hasVideo;
            if (f === "Commented") return t.hasComments;
            return t.project === f || t.category === f;
          });
        });
      }
      return result;
    },
    [takes, searchQuery, activeFilters]
  );

  const getActiveTakes = useCallback(() => takes.filter((t) => !t.isArchived), [takes]);
  const getArchivedTakes = useCallback(() => takes.filter((t) => t.isArchived), [takes]);

  const getStats = useCallback(() => ({
    takesToday: takes.filter((t) => t.date.includes("Today") || t.date === "Just now").length,
    totalProjects: projects.length,
    favorites: takes.filter((t) => t.isFavorite).length,
    totalTakes: takes.length,
  }), [takes, projects]);

  const value = {
    takes, projects, categories, player, recorder, activeFilters, searchQuery,
    toggleFavorite, archiveTake, restoreTake, deleteTake, setTakeCategory, setTakeProject, addComment, deleteComment,
    addProject, renameProject, setProjectCategory, setProjectDescription, deleteProject,
    addCategory, renameCategory, deleteCategory,
    playTake, togglePlay, seek, setVolume, setPianoMix, setVoiceMix,
    startRecording, stopRecording, setActiveProject,
    toggleFilter, setSearch, clearFilters,
    getTake, getProject, getProjectTakes, getFilteredTakes, getActiveTakes, getArchivedTakes, getStats,
  };

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error("useStudio must be used within StudioProvider");
  return ctx;
}
