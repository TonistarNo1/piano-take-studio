import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Mic,
  Library,
  FolderOpen,
  Archive,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PlayerBar } from "./PlayerBar";
import { TakeTicker } from "./TakeTicker";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Mic, label: "Record", path: "/record" },
  { icon: Library, label: "Library", path: "/library" },
  { icon: FolderOpen, label: "Projects", path: "/projects" },
  { icon: Archive, label: "Archive", path: "/archive" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function StudioLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <TakeTicker progress={35} />

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[220px] shrink-0 border-r border-border/50 bg-card/30 pt-4 pb-20">
        <div className="px-5 mb-8">
          <h1 className="text-lg font-semibold text-display tracking-tight text-foreground">
            Piano Studio
          </h1>
          <p className="text-[11px] text-muted-foreground mt-0.5 text-mono">v2.1.0 · Studio Ready</p>
        </div>
        <nav className="flex-1 px-3">
          {navItems.map((item) => {
            const isActive =
              item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all duration-200 text-sm",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <item.icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile nav overlay */}
      {mobileNav && (
        <div className="fixed inset-0 z-[70] bg-background/95 backdrop-blur-sm lg:hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
            <h1 className="text-lg font-semibold text-display text-foreground">Piano Studio</h1>
            <button onClick={() => setMobileNav(false)} className="h-10 w-10 flex items-center justify-center">
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
          <nav className="px-4 py-4">
            {navItems.map((item) => {
              const isActive =
                item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileNav(false)}
                  className={cn(
                    "flex items-center gap-4 px-4 py-4 rounded-xl mb-1 transition-all text-base",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" strokeWidth={1.5} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0 pb-24">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-40 glass-card border-b border-border/50 flex items-center justify-between px-4 py-3">
          <button onClick={() => setMobileNav(true)} className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-secondary transition-colors">
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <h1 className="text-sm font-semibold text-display text-foreground">Piano Studio</h1>
          <div className="w-10" />
        </header>

        <div className="px-4 lg:px-8 py-6 max-w-6xl mx-auto">{children}</div>
      </main>

      <PlayerBar />
    </div>
  );
}
