import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { BottomNav, DesktopSidebar } from "@/components/Navigation";
import { useSwipeNavigation } from "@/hooks/use-swipe-navigation";

// Pages
import Dashboard from "@/pages/Dashboard";
import StudyTimer from "@/pages/StudyTimer";
import HabitsPage from "@/pages/HabitsPage";
import DSAPage from "@/pages/DSAPage";
import AptitudePage from "@/pages/AptitudePage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import PlacementsPage from "@/pages/PlacementsPage";
import CalendarPage from "@/pages/CalendarPage";
import ReflectPage from "@/pages/ReflectPage";
import ProfilePage from "@/pages/ProfilePage";
import AuthPage from "@/pages/AuthPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  useSwipeNavigation();
  
  return (
    <div className="min-h-screen flex w-full">
      <DesktopSidebar />
      <main className="flex-1 md:ml-64">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/timer" element={<ProtectedRoute><StudyTimer /></ProtectedRoute>} />
          <Route path="/habits" element={<ProtectedRoute><HabitsPage /></ProtectedRoute>} />
          <Route path="/dsa" element={<ProtectedRoute><DSAPage /></ProtectedRoute>} />
          <Route path="/aptitude" element={<ProtectedRoute><AptitudePage /></ProtectedRoute>} />
          <Route path="/placements" element={<ProtectedRoute><PlacementsPage /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
          <Route path="/reflect" element={<ProtectedRoute><ReflectPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
