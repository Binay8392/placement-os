import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BottomNav, DesktopSidebar } from "@/components/Navigation";

// Pages
import Dashboard from "@/pages/Dashboard";
import StudyTimer from "@/pages/StudyTimer";
import HabitsPage from "@/pages/HabitsPage";
import DSAPage from "@/pages/DSAPage";
import AptitudePage from "@/pages/AptitudePage";
import ProfilePage from "@/pages/ProfilePage";
import ComingSoon from "@/pages/ComingSoon";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex w-full">
            <DesktopSidebar />
            <main className="flex-1 md:ml-64">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/timer" element={<StudyTimer />} />
                <Route path="/habits" element={<HabitsPage />} />
                <Route path="/dsa" element={<DSAPage />} />
                <Route path="/aptitude" element={<AptitudePage />} />
                <Route path="/placements" element={<ComingSoon title="Placement Tracker" description="Track your applications, interviews, and results." />} />
                <Route path="/calendar" element={<ComingSoon title="Calendar" description="Plan your study schedule and track deadlines." />} />
                <Route path="/analytics" element={<ComingSoon title="Analytics" description="View detailed insights about your progress." />} />
                <Route path="/reflect" element={<ComingSoon title="Daily Reflection" description="Reflect on your learning and growth." />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <BottomNav />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
