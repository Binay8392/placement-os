import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { FirebaseAuthProvider } from "@/hooks/useFirebaseAuth";
import { FirebaseProtectedRoute } from "@/components/FirebaseProtectedRoute";
import { AppShell } from "@/components/AppShell";
import { useSwipeNavigation } from "@/hooks/use-swipe-navigation";
import { Skeleton } from "@/components/ui/skeleton";

// Pages
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const StudyTimer = lazy(() => import("@/pages/StudyTimer"));
const HabitsPage = lazy(() => import("@/pages/HabitsPage"));
const DSAPage = lazy(() => import("@/pages/DSAPage"));
const DSAVideoPage = lazy(() => import("@/pages/DSAVideoPage"));
const AptitudePage = lazy(() => import("@/pages/AptitudePage"));
const AptitudeTopicPage = lazy(() => import("@/pages/AptitudeTopicPage"));
const AptitudePracticePage = lazy(() => import("@/pages/AptitudePracticePage"));
const AptitudeResultsPage = lazy(() => import("@/pages/AptitudeResultsPage"));
const AptitudeLearnPage = lazy(() => import("@/pages/AptitudeLearnPage"));
const AptitudeBookmarksPage = lazy(() => import("@/pages/AptitudeBookmarksPage"));
const AptitudeWrongAnswersPage = lazy(() => import("@/pages/AptitudeWrongAnswersPage"));
const AptitudeMockPage = lazy(() => import("@/pages/AptitudeMockPage"));
const AptitudeDailyPage = lazy(() => import("@/pages/AptitudeDailyPage"));
const AnalyticsPage = lazy(() => import("@/pages/AnalyticsPage"));
const PlacementsPage = lazy(() => import("@/pages/PlacementsPage"));
const CalendarPage = lazy(() => import("@/pages/CalendarPage"));
const ReflectPage = lazy(() => import("@/pages/ReflectPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const FirebaseAuthPage = lazy(() => import("@/pages/FirebaseAuthPage"));
const VerifyEmailPage = lazy(() => import("@/pages/VerifyEmailPage"));
const TaskTrackerPage = lazy(() => import("@/pages/TaskTrackerPage"));
const LeetCodePage = lazy(() => import("@/pages/LeetCodePage"));
const CodeWarRoomPage = lazy(() => import("@/pages/CodeWarRoomPage"));
const CompanyReadinessPage = lazy(() => import("@/pages/CompanyReadinessPage"));
const CompanyTaskGeneratorPage = lazy(() => import("@/pages/CompanyTaskGeneratorPage"));
const CompanyDashboardPage = lazy(() => import("@/pages/CompanyDashboardPage"));
const CommunityPage = lazy(() => import("@/pages/CommunityPage"));
const DailyPlanPage = lazy(() => import("@/pages/DailyPlanPage"));
const ResumeBuilderPage = lazy(() => import("@/pages/ResumeBuilderPage"));
const MockInterviewPage = lazy(() => import("@/pages/MockInterviewPage"));
const AIChatPage = lazy(() => import("@/pages/AIChatPage"));
const SupportUsPage = lazy(() => import("@/pages/SupportUsPage"));
const GameArenaPage = lazy(() => import("@/pages/GameArenaPage"));
const GameArenaPlayPage = lazy(() => import("@/pages/GameArenaPlayPage"));
const GameArenaAssessmentPage = lazy(() => import("@/pages/GameArenaAssessmentPage"));
const GameArenaAssessmentRunPage = lazy(() => import("@/pages/GameArenaAssessmentRunPage"));
const GameArenaResultsPage = lazy(() => import("@/pages/GameArenaResultsPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient();

function RouteLoading() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 xl:px-8" aria-label="Loading page">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-32 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-80 rounded-xl" />
    </div>
  );
}

function AppContent() {
  useSwipeNavigation();
  
  return (
    <AppShell>
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route path="/auth" element={<FirebaseAuthPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/" element={<FirebaseProtectedRoute><Dashboard /></FirebaseProtectedRoute>} />
          <Route path="/timer" element={<FirebaseProtectedRoute><StudyTimer /></FirebaseProtectedRoute>} />
          <Route path="/habits" element={<FirebaseProtectedRoute><HabitsPage /></FirebaseProtectedRoute>} />
          <Route path="/dsa" element={<FirebaseProtectedRoute><DSAPage /></FirebaseProtectedRoute>} />
          <Route path="/dsa/video/:videoId" element={<FirebaseProtectedRoute><DSAVideoPage /></FirebaseProtectedRoute>} />
          <Route path="/aptitude" element={<FirebaseProtectedRoute><AptitudePage /></FirebaseProtectedRoute>} />
          <Route path="/aptitude/topic/:topicId" element={<FirebaseProtectedRoute><AptitudeTopicPage /></FirebaseProtectedRoute>} />
          <Route path="/aptitude/practice/:topicId" element={<FirebaseProtectedRoute><AptitudePracticePage /></FirebaseProtectedRoute>} />
          <Route path="/aptitude/results/:attemptId" element={<FirebaseProtectedRoute><AptitudeResultsPage /></FirebaseProtectedRoute>} />
          <Route path="/aptitude/learn/:topicId" element={<FirebaseProtectedRoute><AptitudeLearnPage /></FirebaseProtectedRoute>} />
          <Route path="/aptitude/bookmarks" element={<FirebaseProtectedRoute><AptitudeBookmarksPage /></FirebaseProtectedRoute>} />
          <Route path="/aptitude/wrong-answers" element={<FirebaseProtectedRoute><AptitudeWrongAnswersPage /></FirebaseProtectedRoute>} />
          <Route path="/aptitude/mock" element={<FirebaseProtectedRoute><AptitudeMockPage /></FirebaseProtectedRoute>} />
          <Route path="/aptitude/daily" element={<FirebaseProtectedRoute><AptitudeDailyPage /></FirebaseProtectedRoute>} />
          <Route path="/placements" element={<FirebaseProtectedRoute><PlacementsPage /></FirebaseProtectedRoute>} />
          <Route path="/calendar" element={<FirebaseProtectedRoute><CalendarPage /></FirebaseProtectedRoute>} />
          <Route path="/analytics" element={<FirebaseProtectedRoute><AnalyticsPage /></FirebaseProtectedRoute>} />
          <Route path="/reflect" element={<FirebaseProtectedRoute><ReflectPage /></FirebaseProtectedRoute>} />
          <Route path="/profile" element={<FirebaseProtectedRoute><ProfilePage /></FirebaseProtectedRoute>} />
          <Route path="/tasks" element={<FirebaseProtectedRoute><TaskTrackerPage /></FirebaseProtectedRoute>} />
          <Route path="/leetcode" element={<FirebaseProtectedRoute><LeetCodePage /></FirebaseProtectedRoute>} />
          <Route path="/code-war-room" element={<FirebaseProtectedRoute><CodeWarRoomPage /></FirebaseProtectedRoute>} />
          <Route path="/company-readiness" element={<FirebaseProtectedRoute><CompanyReadinessPage /></FirebaseProtectedRoute>} />
          <Route path="/company-tasks" element={<FirebaseProtectedRoute><CompanyTaskGeneratorPage /></FirebaseProtectedRoute>} />
          <Route path="/company/:companyId" element={<FirebaseProtectedRoute><CompanyDashboardPage /></FirebaseProtectedRoute>} />
          <Route path="/community" element={<FirebaseProtectedRoute><CommunityPage /></FirebaseProtectedRoute>} />
          <Route path="/daily-plan" element={<FirebaseProtectedRoute><DailyPlanPage /></FirebaseProtectedRoute>} />
          <Route path="/resume-builder" element={<FirebaseProtectedRoute><ResumeBuilderPage /></FirebaseProtectedRoute>} />
          <Route path="/mock-interview" element={<FirebaseProtectedRoute><MockInterviewPage /></FirebaseProtectedRoute>} />
          <Route path="/ai-chat" element={<FirebaseProtectedRoute><AIChatPage /></FirebaseProtectedRoute>} />
          <Route path="/support-us" element={<FirebaseProtectedRoute><SupportUsPage /></FirebaseProtectedRoute>} />
          <Route path="/game-arena" element={<FirebaseProtectedRoute><GameArenaPage /></FirebaseProtectedRoute>} />
          <Route path="/game-arena/assessment" element={<FirebaseProtectedRoute><GameArenaAssessmentPage /></FirebaseProtectedRoute>} />
          <Route path="/game-arena/assessment/run" element={<FirebaseProtectedRoute><GameArenaAssessmentRunPage /></FirebaseProtectedRoute>} />
          <Route path="/game-arena/results/:sessionId" element={<FirebaseProtectedRoute><GameArenaResultsPage /></FirebaseProtectedRoute>} />
          <Route path="/game-arena/:gameId" element={<FirebaseProtectedRoute><GameArenaPlayPage /></FirebaseProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AppShell>
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
