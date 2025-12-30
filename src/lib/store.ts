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

export interface AptitudeTopic {
  id: string;
  name: string;
  section: 'quantitative' | 'logical' | 'verbal';
  attempted: number;
  correct: number;
  lastPracticed: string | null;
  notes: string;
}

export type ApplicationStatus = 'applied' | 'oa' | 'interview' | 'result';
export type ApplicationResult = 'pending' | 'selected' | 'rejected' | 'waitlisted';

export interface PlacementApplication {
  id: string;
  company: string;
  role: string;
  type: 'placement' | 'internship';
  status: ApplicationStatus;
  result: ApplicationResult;
  appliedDate: string;
  oaDate?: string;
  interviewDate?: string;
  resultDate?: string;
  notes: string;
  reminderDate?: string;
  ctc?: string;
  location?: string;
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

// Initial Aptitude topics
const initialAptitudeTopics: AptitudeTopic[] = [
  // Quantitative Aptitude
  { id: 'numbers', name: 'Number Systems', section: 'quantitative', attempted: 0, correct: 0, lastPracticed: null, notes: '' },
  { id: 'percentages', name: 'Percentages', section: 'quantitative', attempted: 0, correct: 0, lastPracticed: null, notes: '' },
  { id: 'profit-loss', name: 'Profit & Loss', section: 'quantitative', attempted: 0, correct: 0, lastPracticed: null, notes: '' },
  { id: 'ratio', name: 'Ratio & Proportion', section: 'quantitative', attempted: 0, correct: 0, lastPracticed: null, notes: '' },
  { id: 'time-work', name: 'Time & Work', section: 'quantitative', attempted: 0, correct: 0, lastPracticed: null, notes: '' },
  { id: 'time-distance', name: 'Time, Speed & Distance', section: 'quantitative', attempted: 0, correct: 0, lastPracticed: null, notes: '' },
  { id: 'averages', name: 'Averages', section: 'quantitative', attempted: 0, correct: 0, lastPracticed: null, notes: '' },
  { id: 'algebra', name: 'Algebra', section: 'quantitative', attempted: 0, correct: 0, lastPracticed: null, notes: '' },
  { id: 'geometry', name: 'Geometry', section: 'quantitative', attempted: 0, correct: 0, lastPracticed: null, notes: '' },
  { id: 'probability', name: 'Probability', section: 'quantitative', attempted: 0, correct: 0, lastPracticed: null, notes: '' },
  { id: 'permutation', name: 'Permutation & Combination', section: 'quantitative', attempted: 0, correct: 0, lastPracticed: null, notes: '' },
  { id: 'di', name: 'Data Interpretation', section: 'quantitative', attempted: 0, correct: 0, lastPracticed: null, notes: '' },
  
  // Logical Reasoning
  { id: 'puzzles', name: 'Puzzles', section: 'logical', attempted: 0, correct: 0, lastPracticed: null, notes: '' },
  { id: 'seating', name: 'Seating Arrangement', section: 'logical', attempted: 0, correct: 0, lastPracticed: null, notes: '' },
  { id: 'syllogism', name: 'Syllogism', section: 'logical', attempted: 0, correct: 0, lastPracticed: null, notes: '' },
  { id: 'blood-relation', name: 'Blood Relations', section: 'logical', attempted: 0, correct: 0, lastPracticed: null, notes: '' },
  { id: 'coding', name: 'Coding-Decoding', section: 'logical', attempted: 0, correct: 0, lastPracticed: null, notes: '' },
  { id: 'direction', name: 'Direction Sense', section: 'logical', attempted: 0, correct: 0, lastPracticed: null, notes: '' },
  { id: 'order-ranking', name: 'Order & Ranking', section: 'logical', attempted: 0, correct: 0, lastPracticed: null, notes: '' },
  { id: 'series', name: 'Number & Letter Series', section: 'logical', attempted: 0, correct: 0, lastPracticed: null, notes: '' },
  { id: 'analogy', name: 'Analogy', section: 'logical', attempted: 0, correct: 0, lastPracticed: null, notes: '' },
  { id: 'input-output', name: 'Input-Output', section: 'logical', attempted: 0, correct: 0, lastPracticed: null, notes: '' },
  
  // Verbal Ability
  { id: 'rc', name: 'Reading Comprehension', section: 'verbal', attempted: 0, correct: 0, lastPracticed: null, notes: '' },
  { id: 'vocabulary', name: 'Vocabulary', section: 'verbal', attempted: 0, correct: 0, lastPracticed: null, notes: '' },
  { id: 'grammar', name: 'Grammar', section: 'verbal', attempted: 0, correct: 0, lastPracticed: null, notes: '' },
  { id: 'parajumbles', name: 'Para Jumbles', section: 'verbal', attempted: 0, correct: 0, lastPracticed: null, notes: '' },
  { id: 'sentence-correction', name: 'Sentence Correction', section: 'verbal', attempted: 0, correct: 0, lastPracticed: null, notes: '' },
  { id: 'fill-blanks', name: 'Fill in the Blanks', section: 'verbal', attempted: 0, correct: 0, lastPracticed: null, notes: '' },
  { id: 'synonyms', name: 'Synonyms & Antonyms', section: 'verbal', attempted: 0, correct: 0, lastPracticed: null, notes: '' },
  { id: 'idioms', name: 'Idioms & Phrases', section: 'verbal', attempted: 0, correct: 0, lastPracticed: null, notes: '' },
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
  
  // Aptitude Topics
  aptitudeTopics: AptitudeTopic[];
  updateAptitudeTopic: (id: string, updates: Partial<AptitudeTopic>) => void;
  logAptitudePractice: (id: string, attempted: number, correct: number) => void;
  
  // Reflections
  reflections: DailyReflection[];
  addReflection: (reflection: Omit<DailyReflection, 'id'>) => void;
  
  // Placement Applications
  applications: PlacementApplication[];
  addApplication: (app: Omit<PlacementApplication, 'id'>) => void;
  updateApplication: (id: string, updates: Partial<PlacementApplication>) => void;
  deleteApplication: (id: string) => void;
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
      
      // Aptitude Topics
      aptitudeTopics: initialAptitudeTopics,
      updateAptitudeTopic: (id, updates) => set((state) => ({
        aptitudeTopics: state.aptitudeTopics.map((t) =>
          t.id === id ? { ...t, ...updates } : t
        )
      })),
      logAptitudePractice: (id, attempted, correct) => set((state) => ({
        aptitudeTopics: state.aptitudeTopics.map((t) =>
          t.id === id 
            ? { 
                ...t, 
                attempted: t.attempted + attempted, 
                correct: t.correct + correct,
                lastPracticed: new Date().toISOString().split('T')[0]
              } 
            : t
        )
      })),
      
      // Reflections
      reflections: [],
      addReflection: (reflection) => set((state) => ({
        reflections: [...state.reflections, { ...reflection, id: Date.now().toString() }]
      })),
      
      // Placement Applications
      applications: [],
      addApplication: (app) => set((state) => ({
        applications: [...state.applications, { ...app, id: Date.now().toString() }]
      })),
      updateApplication: (id, updates) => set((state) => ({
        applications: state.applications.map((a) =>
          a.id === id ? { ...a, ...updates } : a
        )
      })),
      deleteApplication: (id) => set((state) => ({
        applications: state.applications.filter((a) => a.id !== id)
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

export const getDailyQuote = () => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return quotes[dayOfYear % quotes.length];
};

export const getRandomQuote = () => quotes[Math.floor(Math.random() * quotes.length)];
