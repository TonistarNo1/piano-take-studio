import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StudioLayout } from "@/components/studio/StudioLayout";
import Dashboard from "./pages/Dashboard";
import RecordScreen from "./pages/RecordScreen";
import LibraryScreen from "./pages/LibraryScreen";
import TakeDetailScreen from "./pages/TakeDetailScreen";
import ProjectsScreen from "./pages/ProjectsScreen";
import ProjectDetailScreen from "./pages/ProjectDetailScreen";
import ArchiveScreen from "./pages/ArchiveScreen";
import CategoriesScreen from "./pages/CategoriesScreen";
import MediaEditorScreen from "./pages/MediaEditorScreen";
import SettingsScreen from "./pages/SettingsScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <StudioLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/record" element={<RecordScreen />} />
            <Route path="/library" element={<LibraryScreen />} />
            <Route path="/library/:id" element={<TakeDetailScreen />} />
            <Route path="/projects" element={<ProjectsScreen />} />
            <Route path="/projects/:id" element={<ProjectDetailScreen />} />
            <Route path="/archive" element={<ArchiveScreen />} />
            <Route path="/categories" element={<CategoriesScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/media-editor" element={<MediaEditorScreen />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </StudioLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
