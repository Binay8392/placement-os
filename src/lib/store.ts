import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface StudySession {
  id: string;
  category: 'dsa' | 'aptitude' | 'core-cs' | 'development';
  duration: number; // in seconds
  date: string;
  notes?: string;
}

export interface Habit {
  id: string;
  name: string;
  type: 'good' | 'bad';
  streak: number;
  completedDates: string[];
  createdAt: string;
}

export interface DSATopic {
  id: string;
  name: string;
  category: 'foundations' | 'core' | 'advanced';
  status: 'not-started' | 'in-progress' | 'mastered';
  questionsSolved: number;
  confidence: number;
  notes: string;
}

export interface DailyReflection {
  id: string;
  date: string;
  learned: string;
  wentWrong: string;
  improve: string;
}

export interface UserProfile {
  name: string;
  degree: string;
  semester: number;
  targetCompanies: string[];
  careerGoals: string;
}

// Initial DSA topics
const initialDSATopics: DSATopic[] = [
  // Foundations
  { id: 'tc', name: 'Time & Space Complexity', category: 'foundations', status: 'not-started', questionsSolved: 0, confidence: 0, notes: '' },
  { id: 'recursion', name: 'Recursion', category: 'foundations', status: 'not-started', questionsSolved: 0, confidence: 0, notes: '' },
  // Core
  { id: 'arrays', name: 'Arrays', category: 'core', status: 'not-started', questionsSolved: 0, confidence: 0, notes: '' },
  { id: 'strings', name: 'Strings', category: 'core', status: 'not-started', questionsSolved: 0, confidence: 0, notes: '' },
  { id: 'searching', name: 'Searching & Sorting', category: 'core', status: 'not-started', questionsSolved: 0, confidence: 0, notes: '' },
  { id: 'linkedlist', name: 'Linked Lists', category: 'core', status: 'not-started', questionsSolved: 0, confidence: 0, notes: '' },
  { id: 'stackqueue', name: 'Stack & Queue', category: 'core', status: 'not-started', questionsSolved: 0, confidence: 0, notes: '' },
  { id: 'hashing', name: 'Hashing', category: 'core', status: 'not-started', questionsSolved: 0, confidence: 0, notes: '' },
  // Advanced
  { id: 'trees', name: 'Trees', category: 'advanced', status: 'not-started', questionsSolved: 0, confidence: 0, notes: '' },
  { id: 'heaps', name: 'Heaps', category: 'advanced', status: 'not-started', questionsSolved: 0, confidence: 0, notes: '' },
  { id: 'graphs', name: 'Graphs', category: 'advanced', status: 'not-started', questionsSolved: 0, confidence: 0, notes: '' },
  { id: 'dp', name: 'Dynamic Programming', category: 'advanced', status: 'not-started', questionsSolved: 0, confidence: 0, notes: '' },
  { id: 'greedy', name: 'Greedy Algorithms', category: 'advanced', status: 'not-started', questionsSolved: 0, confidence: 0, notes: '' },
  { id: 'backtracking', name: 'Backtracking', category: 'advanced', status: 'not-started', questionsSolved: 0, confidence: 0, notes: '' },
];

interface AppState {
  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  
  // Profile
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  
  // Study Sessions
  studySessions: StudySession[];
  addStudySession: (session: StudySession) => void;
  
  // Active Timer
  activeTimer: {
    isRunning: boolean;
    category: StudySession['category'];
    startTime: number | null;
    elapsed: number;
    pausedAt: number | null;
  };
  startTimer: (category: StudySession['category']) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  updateElapsed: (elapsed: number) => void;
  
  // Habits
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'completedDates' | 'createdAt'>) => void;
  toggleHabitCompletion: (habitId: string, date: string) => void;
  deleteHabit: (habitId: string) => void;
  
  // DSA Topics
  dsaTopics: DSATopic[];
  updateDSATopic: (id: string, updates: Partial<DSATopic>) => void;
  
  // Reflections
  reflections: DailyReflection[];
  addReflection: (reflection: Omit<DailyReflection, 'id'>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'dark' ? 'light' : 'dark' 
      })),
      
      // Profile
      profile: {
        name: 'Binay Paramanik',
        degree: 'B.Tech in Computer Science & Engineering',
        semester: 6,
        targetCompanies: ['Google', 'Microsoft', 'Amazon', 'Meta'],
        careerGoals: 'Software Engineer at a top tech company',
      },
      updateProfile: (updates) => set((state) => ({
        profile: { ...state.profile, ...updates }
      })),
      
      // Study Sessions
      studySessions: [],
      addStudySession: (session) => set((state) => ({
        studySessions: [...state.studySessions, session]
      })),
      
      // Active Timer
      activeTimer: {
        isRunning: false,
        category: 'dsa',
        startTime: null,
        elapsed: 0,
        pausedAt: null,
      },
      startTimer: (category) => set({
        activeTimer: {
          isRunning: true,
          category,
          startTime: Date.now(),
          elapsed: 0,
          pausedAt: null,
        }
      }),
      pauseTimer: () => set((state) => ({
        activeTimer: {
          ...state.activeTimer,
          isRunning: false,
          pausedAt: Date.now(),
        }
      })),
      resumeTimer: () => set((state) => {
        const pauseDuration = state.activeTimer.pausedAt 
          ? Date.now() - state.activeTimer.pausedAt 
          : 0;
        return {
          activeTimer: {
            ...state.activeTimer,
            isRunning: true,
            startTime: (state.activeTimer.startTime || Date.now()) + pauseDuration,
            pausedAt: null,
          }
        };
      }),
      stopTimer: () => {
        const { activeTimer, addStudySession } = get();
        if (activeTimer.elapsed > 10) { // Save if more than 10 seconds (for testing)
          addStudySession({
            id: Date.now().toString(),
            category: activeTimer.category,
            duration: activeTimer.elapsed,
            date: new Date().toISOString().split('T')[0],
          });
        }
        set({
          activeTimer: {
            isRunning: false,
            category: 'dsa',
            startTime: null,
            elapsed: 0,
            pausedAt: null,
          }
        });
      },
      updateElapsed: (elapsed) => set((state) => ({
        activeTimer: { ...state.activeTimer, elapsed }
      })),
      resetTimer: () => set((state) => ({
        activeTimer: {
          ...state.activeTimer,
          isRunning: false,
          startTime: null,
          elapsed: 0,
          pausedAt: null,
        }
      })),
      
      // Habits
      habits: [
        { id: '1', name: 'Solve 3 DSA problems', type: 'good', streak: 0, completedDates: [], createdAt: new Date().toISOString() },
        { id: '2', name: 'Read tech articles', type: 'good', streak: 0, completedDates: [], createdAt: new Date().toISOString() },
        { id: '3', name: 'Practice aptitude', type: 'good', streak: 0, completedDates: [], createdAt: new Date().toISOString() },
        { id: '4', name: 'Excessive social media', type: 'bad', streak: 0, completedDates: [], createdAt: new Date().toISOString() },
      ],
      addHabit: (habit) => set((state) => ({
        habits: [...state.habits, {
          ...habit,
          id: Date.now().toString(),
          streak: 0,
          completedDates: [],
          createdAt: new Date().toISOString(),
        }]
      })),
      toggleHabitCompletion: (habitId, date) => set((state) => ({
        habits: state.habits.map((h) => {
          if (h.id !== habitId) return h;
          const isCompleted = h.completedDates.includes(date);
          const newDates = isCompleted
            ? h.completedDates.filter((d) => d !== date)
            : [...h.completedDates, date];
          
          // Calculate streak
          let streak = 0;
          const today = new Date();
          for (let i = 0; i < 365; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() - i);
            const dateStr = checkDate.toISOString().split('T')[0];
            if (newDates.includes(dateStr)) {
              streak++;
            } else if (i > 0) {
              break;
            }
          }
          
          return { ...h, completedDates: newDates, streak };
        })
      })),
      deleteHabit: (habitId) => set((state) => ({
        habits: state.habits.filter((h) => h.id !== habitId)
      })),
      
      // DSA Topics
      dsaTopics: initialDSATopics,
      updateDSATopic: (id, updates) => set((state) => ({
        dsaTopics: state.dsaTopics.map((t) =>
          t.id === id ? { ...t, ...updates } : t
        )
      })),
      
      // Reflections
      reflections: [],
      addReflection: (reflection) => set((state) => ({
        reflections: [...state.reflections, { ...reflection, id: Date.now().toString() }]
      })),
    }),
    {
      name: 'preptrack-storage',
    }
  )
);

// Helper function to get today's date string
export const getTodayString = () => new Date().toISOString().split('T')[0];

// Helper to calculate study time for a period
export const getStudyTimeForPeriod = (sessions: StudySession[], days: number) => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().split('T')[0];
  
  return sessions.filter((s) => s.date >= cutoffStr);
};

// Motivational quotes
export const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
];

export const getRandomQuote = () => quotes[Math.floor(Math.random() * quotes.length)];
