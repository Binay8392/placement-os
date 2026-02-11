import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { FirebaseAuthProvider } from "@/hooks/useFirebaseAuth";
import { FirebaseProtectedRoute } from "@/components/FirebaseProtectedRoute";
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
import FirebaseAuthPage from "@/pages/FirebaseAuthPage";
import TaskTrackerPage from "@/pages/TaskTrackerPage";
import LeetCodePage from "@/pages/LeetCodePage";
import CompanyReadinessPage from "@/pages/CompanyReadinessPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  useSwipeNavigation();
  
  return (
    <div className="min-h-screen flex w-full">
      <DesktopSidebar />
      <main className="flex-1 md:ml-64">
        <Routes>
          <Route path="/auth" element={<FirebaseAuthPage />} />
          <Route path="/" element={<FirebaseProtectedRoute><Dashboard /></FirebaseProtectedRoute>} />
          <Route path="/timer" element={<FirebaseProtectedRoute><StudyTimer /></FirebaseProtectedRoute>} />
          <Route path="/habits" element={<FirebaseProtectedRoute><HabitsPage /></FirebaseProtectedRoute>} />
          <Route path="/dsa" element={<FirebaseProtectedRoute><DSAPage /></FirebaseProtectedRoute>} />
          <Route path="/aptitude" element={<FirebaseProtectedRoute><AptitudePage /></FirebaseProtectedRoute>} />
          <Route path="/placements" element={<FirebaseProtectedRoute><PlacementsPage /></FirebaseProtectedRoute>} />
          <Route path="/calendar" element={<FirebaseProtectedRoute><CalendarPage /></FirebaseProtectedRoute>} />
          <Route path="/analytics" element={<FirebaseProtectedRoute><AnalyticsPage /></FirebaseProtectedRoute>} />
          <Route path="/reflect" element={<FirebaseProtectedRoute><ReflectPage /></FirebaseProtectedRoute>} />
          <Route path="/profile" element={<FirebaseProtectedRoute><ProfilePage /></FirebaseProtectedRoute>} />
          <Route path="/tasks" element={<FirebaseProtectedRoute><TaskTrackerPage /></FirebaseProtectedRoute>} />
          <Route path="/leetcode" element={<FirebaseProtectedRoute><LeetCodePage /></FirebaseProtectedRoute>} />
          <Route path="/company-readiness" element={<FirebaseProtectedRoute><CompanyReadinessPage /></FirebaseProtectedRoute>} />
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
      <FirebaseAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </FirebaseAuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
