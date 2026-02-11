import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface StudySession {
  id: string;
  category: 'dsa' | 'aptitude' | 'core-cs' | 'development';
  duration: number;
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

export type GovtExamStatus = 'form-filled' | 'admit-card' | 'prelims' | 'mains' | 'interview' | 'result';
export type GovtExamResult = 'pending' | 'qualified' | 'not-qualified' | 'waitlisted';

export interface GovtExam {
  id: string;
  examName: string;
  organization: string;
  category: 'banking' | 'ssc' | 'railway' | 'upsc' | 'state-psc' | 'other';
  status: GovtExamStatus;
  result: GovtExamResult;
  formFilledDate: string;
  examDate?: string;
  admitCardDate?: string;
  resultDate?: string;
  notes: string;
  reminderDate?: string;
  postName?: string;
  vacancies?: string;
}

export interface Resource {
  id: string;
  title: string;
  link: string;
  category: 'notes' | 'pdf' | 'video' | 'article' | 'other';
  subject?: string;
  description?: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  degree: string;
  semester: number;
  targetCompanies: string[];
  careerGoals: string;
  skills: string[];
  resumeUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
}

// NEW: Task Tracker types
export type TaskCategory = 'Coding' | 'Aptitude' | 'CS Fundamentals' | 'Interview' | 'Project' | 'Other';
export type TaskDifficulty = 'Easy' | 'Medium' | 'Hard';
export type TaskSource = 'LeetCode' | 'HackerRank' | 'PrepInsta' | 'Custom';
export type TaskStatus = 'Pending' | 'Completed';

export interface TrackedTask {
  id: string;
  name: string;
  category: TaskCategory;
  difficulty: TaskDifficulty;
  source: TaskSource;
  dateAdded: string;
  completionDate?: string;
  status: TaskStatus;
}

// NEW: LeetCode Progress
export interface LeetCodeProgress {
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  target: number;
}

// Company Hub: HR question answers & interview experiences
export interface HRQuestionAnswer {
  questionId: string;
  company: string;
  practiced: boolean;
  answer: string;
}

export interface UserInterviewExperience {
  id: string;
  company: string;
  role: string;
  date: string;
  rounds: string;
  questions: string;
  tips: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

// NEW: Daily streak tracking
export interface DailyActivity {
  date: string;
  tasksCompleted: number;
}

// Community Hub types
export interface CommunityExperience {
  id: string;
  userId: string;
  username: string;
  company: string;
  role: string;
  interviewDate: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rounds: string;
  questions: string;
  tips: string;
  likes: number;
  createdAt: string;
}

export interface CommunityQuestion {
  id: string;
  userId: string;
  username: string;
  title: string;
  description: string;
  company: string;
  answers: CommunityAnswer[];
  bestAnswerId?: string;
  likes: number;
  createdAt: string;
}

export interface CommunityAnswer {
  id: string;
  userId: string;
  username: string;
  answerText: string;
  upvotes: number;
  createdAt: string;
}

export interface CommunityVlog {
  id: string;
  userId: string;
  username: string;
  title: string;
  description: string;
  company: string;
  videoUrl: string;
  type: 'youtube' | 'text';
  textContent?: string;
  likes: number;
  createdAt: string;
}

export interface CompanyEligibility {
  id: string;
  userId: string;
  username: string;
  company: string;
  minCGPA: string;
  backlogs: string;
  branches: string;
  additionalInfo: string;
  createdAt: string;
}

// Initial DSA topics
const initialDSATopics: DSATopic[] = [
  { id: 'tc', name: 'Time & Space Complexity', category: 'foundations', status: 'not-started', questionsSolved: 0, confidence: 0, notes: '' },
  { id: 'recursion', name: 'Recursion', category: 'foundations', status: 'not-started', questionsSolved: 0, confidence: 0, notes: '' },
  { id: 'arrays', name: 'Arrays', category: 'core', status: 'not-started', questionsSolved: 0, confidence: 0, notes: '' },
  { id: 'strings', name: 'Strings', category: 'core', status: 'not-started', questionsSolved: 0, confidence: 0, notes: '' },
  { id: 'searching', name: 'Searching & Sorting', category: 'core', status: 'not-started', questionsSolved: 0, confidence: 0, notes: '' },
  { id: 'linkedlist', name: 'Linked Lists', category: 'core', status: 'not-started', questionsSolved: 0, confidence: 0, notes: '' },
  { id: 'stackqueue', name: 'Stack & Queue', category: 'core', status: 'not-started', questionsSolved: 0, confidence: 0, notes: '' },
  { id: 'hashing', name: 'Hashing', category: 'core', status: 'not-started', questionsSolved: 0, confidence: 0, notes: '' },
  { id: 'trees', name: 'Trees', category: 'advanced', status: 'not-started', questionsSolved: 0, confidence: 0, notes: '' },
  { id: 'heaps', name: 'Heaps', category: 'advanced', status: 'not-started', questionsSolved: 0, confidence: 0, notes: '' },
  { id: 'graphs', name: 'Graphs', category: 'advanced', status: 'not-started', questionsSolved: 0, confidence: 0, notes: '' },
  { id: 'dp', name: 'Dynamic Programming', category: 'advanced', status: 'not-started', questionsSolved: 0, confidence: 0, notes: '' },
  { id: 'greedy', name: 'Greedy Algorithms', category: 'advanced', status: 'not-started', questionsSolved: 0, confidence: 0, notes: '' },
  { id: 'backtracking', name: 'Backtracking', category: 'advanced', status: 'not-started', questionsSolved: 0, confidence: 0, notes: '' },
];

const initialAptitudeTopics: AptitudeTopic[] = [
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
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  
  studySessions: StudySession[];
  addStudySession: (session: StudySession) => void;
  
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
  
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'completedDates' | 'createdAt'>) => void;
  toggleHabitCompletion: (habitId: string, date: string) => void;
  deleteHabit: (habitId: string) => void;
  
  dsaTopics: DSATopic[];
  updateDSATopic: (id: string, updates: Partial<DSATopic>) => void;
  
  aptitudeTopics: AptitudeTopic[];
  updateAptitudeTopic: (id: string, updates: Partial<AptitudeTopic>) => void;
  logAptitudePractice: (id: string, attempted: number, correct: number) => void;
  
  reflections: DailyReflection[];
  addReflection: (reflection: Omit<DailyReflection, 'id'>) => void;
  
  applications: PlacementApplication[];
  addApplication: (app: Omit<PlacementApplication, 'id'>) => void;
  updateApplication: (id: string, updates: Partial<PlacementApplication>) => void;
  deleteApplication: (id: string) => void;
  
  govtExams: GovtExam[];
  addGovtExam: (exam: Omit<GovtExam, 'id'>) => void;
  updateGovtExam: (id: string, updates: Partial<GovtExam>) => void;
  deleteGovtExam: (id: string) => void;
  
  resources: Resource[];
  addResource: (resource: Omit<Resource, 'id' | 'createdAt'>) => void;
  updateResource: (id: string, updates: Partial<Resource>) => void;
  deleteResource: (id: string) => void;

  // NEW: Task Tracker
  trackedTasks: TrackedTask[];
  addTrackedTask: (task: Omit<TrackedTask, 'id'>) => void;
  updateTrackedTask: (id: string, updates: Partial<TrackedTask>) => void;
  deleteTrackedTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;

  // NEW: LeetCode Progress
  leetCodeProgress: LeetCodeProgress;
  updateLeetCodeProgress: (updates: Partial<LeetCodeProgress>) => void;

  // NEW: Daily Activity for streak
  dailyActivities: DailyActivity[];
  recordDailyActivity: (date: string) => void;

  // Company Hub
  hrAnswers: HRQuestionAnswer[];
  setHRAnswer: (questionId: string, company: string, answer: string) => void;
  toggleHRPracticed: (questionId: string, company: string) => void;

  userInterviewExperiences: UserInterviewExperience[];
  addInterviewExperience: (exp: Omit<UserInterviewExperience, 'id'>) => void;
  deleteInterviewExperience: (id: string) => void;

  // Community Hub
  communityExperiences: CommunityExperience[];
  addCommunityExperience: (exp: Omit<CommunityExperience, 'id' | 'likes' | 'createdAt'>) => void;
  deleteCommunityExperience: (id: string) => void;
  likeCommunityExperience: (id: string) => void;

  communityQuestions: CommunityQuestion[];
  addCommunityQuestion: (q: Omit<CommunityQuestion, 'id' | 'answers' | 'likes' | 'createdAt'>) => void;
  deleteCommunityQuestion: (id: string) => void;
  likeCommunityQuestion: (id: string) => void;
  addCommunityAnswer: (questionId: string, answer: Omit<CommunityAnswer, 'id' | 'upvotes' | 'createdAt'>) => void;
  upvoteCommunityAnswer: (questionId: string, answerId: string) => void;
  markBestAnswer: (questionId: string, answerId: string) => void;

  communityVlogs: CommunityVlog[];
  addCommunityVlog: (vlog: Omit<CommunityVlog, 'id' | 'likes' | 'createdAt'>) => void;
  deleteCommunityVlog: (id: string) => void;
  likeCommunityVlog: (id: string) => void;

  companyEligibilities: CompanyEligibility[];
  addCompanyEligibility: (e: Omit<CompanyEligibility, 'id' | 'createdAt'>) => void;
  deleteCompanyEligibility: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'dark' ? 'light' : 'dark' 
      })),
      
      profile: {
        name: '',
        degree: '',
        semester: 1,
        targetCompanies: [],
        careerGoals: '',
        skills: [],
        resumeUrl: '',
        linkedinUrl: '',
        githubUrl: '',
        portfolioUrl: '',
        email: '',
        phone: '',
        avatarUrl: '',
      },
      updateProfile: (updates) => set((state) => ({
        profile: { ...state.profile, ...updates }
      })),
      
      studySessions: [],
      addStudySession: (session) => set((state) => ({
        studySessions: [...state.studySessions, session]
      })),
      
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
        if (activeTimer.elapsed > 10) {
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
      
      dsaTopics: initialDSATopics,
      updateDSATopic: (id, updates) => set((state) => ({
        dsaTopics: state.dsaTopics.map((t) =>
          t.id === id ? { ...t, ...updates } : t
        )
      })),
      
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
      
      reflections: [],
      addReflection: (reflection) => set((state) => ({
        reflections: [...state.reflections, { ...reflection, id: Date.now().toString() }]
      })),
      
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
      
      govtExams: [],
      addGovtExam: (exam) => set((state) => ({
        govtExams: [...state.govtExams, { ...exam, id: Date.now().toString() }]
      })),
      updateGovtExam: (id, updates) => set((state) => ({
        govtExams: state.govtExams.map((e) =>
          e.id === id ? { ...e, ...updates } : e
        )
      })),
      deleteGovtExam: (id) => set((state) => ({
        govtExams: state.govtExams.filter((e) => e.id !== id)
      })),
      
      resources: [],
      addResource: (resource) => set((state) => ({
        resources: [...state.resources, { 
          ...resource, 
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        }]
      })),
      updateResource: (id, updates) => set((state) => ({
        resources: state.resources.map((r) =>
          r.id === id ? { ...r, ...updates } : r
        )
      })),
      deleteResource: (id) => set((state) => ({
        resources: state.resources.filter((r) => r.id !== id)
      })),

      // NEW: Task Tracker
      trackedTasks: [],
      addTrackedTask: (task) => set((state) => {
        const newTask = { ...task, id: Date.now().toString() };
        // Record daily activity
        const today = getTodayString();
        return { trackedTasks: [...state.trackedTasks, newTask] };
      }),
      updateTrackedTask: (id, updates) => set((state) => ({
        trackedTasks: state.trackedTasks.map((t) =>
          t.id === id ? { ...t, ...updates } : t
        )
      })),
      deleteTrackedTask: (id) => set((state) => ({
        trackedTasks: state.trackedTasks.filter((t) => t.id !== id)
      })),
      toggleTaskStatus: (id) => set((state) => {
        const today = getTodayString();
        const updated = state.trackedTasks.map((t) => {
          if (t.id !== id) return t;
          const newStatus: TaskStatus = t.status === 'Pending' ? 'Completed' : 'Pending';
          return {
            ...t,
            status: newStatus,
            completionDate: newStatus === 'Completed' ? today : undefined,
          };
        });
        
        // Auto-record daily activity
        const completedToday = updated.filter(t => t.completionDate === today).length;
        const existingActivity = state.dailyActivities.find(a => a.date === today);
        const newActivities = existingActivity
          ? state.dailyActivities.map(a => a.date === today ? { ...a, tasksCompleted: completedToday } : a)
          : [...state.dailyActivities, { date: today, tasksCompleted: completedToday }];
        
        return { trackedTasks: updated, dailyActivities: newActivities };
      }),

      // NEW: LeetCode Progress
      leetCodeProgress: {
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        target: 200,
      },
      updateLeetCodeProgress: (updates) => set((state) => ({
        leetCodeProgress: { ...state.leetCodeProgress, ...updates }
      })),

      // NEW: Daily Activity for streak
      dailyActivities: [],
      recordDailyActivity: (date) => set((state) => {
        const existing = state.dailyActivities.find(a => a.date === date);
        if (existing) {
          return {
            dailyActivities: state.dailyActivities.map(a =>
              a.date === date ? { ...a, tasksCompleted: a.tasksCompleted + 1 } : a
            )
          };
        }
        return {
          dailyActivities: [...state.dailyActivities, { date, tasksCompleted: 1 }]
        };
      }),

      // Company Hub
      hrAnswers: [],
      setHRAnswer: (questionId, company, answer) => set((state) => {
        const existing = state.hrAnswers.find(a => a.questionId === questionId && a.company === company);
        if (existing) {
          return { hrAnswers: state.hrAnswers.map(a => a.questionId === questionId && a.company === company ? { ...a, answer } : a) };
        }
        return { hrAnswers: [...state.hrAnswers, { questionId, company, practiced: false, answer }] };
      }),
      toggleHRPracticed: (questionId, company) => set((state) => {
        const existing = state.hrAnswers.find(a => a.questionId === questionId && a.company === company);
        if (existing) {
          return { hrAnswers: state.hrAnswers.map(a => a.questionId === questionId && a.company === company ? { ...a, practiced: !a.practiced } : a) };
        }
        return { hrAnswers: [...state.hrAnswers, { questionId, company, practiced: true, answer: '' }] };
      }),

      userInterviewExperiences: [],
      addInterviewExperience: (exp) => set((state) => ({
        userInterviewExperiences: [...state.userInterviewExperiences, { ...exp, id: Date.now().toString() }]
      })),
      deleteInterviewExperience: (id) => set((state) => ({
        userInterviewExperiences: state.userInterviewExperiences.filter(e => e.id !== id)
      })),

      // Community Hub
      communityExperiences: [],
      addCommunityExperience: (exp) => set((state) => ({
        communityExperiences: [{ ...exp, id: Date.now().toString(), likes: 0, createdAt: new Date().toISOString() }, ...state.communityExperiences]
      })),
      deleteCommunityExperience: (id) => set((state) => ({
        communityExperiences: state.communityExperiences.filter(e => e.id !== id)
      })),
      likeCommunityExperience: (id) => set((state) => ({
        communityExperiences: state.communityExperiences.map(e => e.id === id ? { ...e, likes: e.likes + 1 } : e)
      })),

      communityQuestions: [],
      addCommunityQuestion: (q) => set((state) => ({
        communityQuestions: [{ ...q, id: Date.now().toString(), answers: [], likes: 0, createdAt: new Date().toISOString() }, ...state.communityQuestions]
      })),
      deleteCommunityQuestion: (id) => set((state) => ({
        communityQuestions: state.communityQuestions.filter(q => q.id !== id)
      })),
      likeCommunityQuestion: (id) => set((state) => ({
        communityQuestions: state.communityQuestions.map(q => q.id === id ? { ...q, likes: q.likes + 1 } : q)
      })),
      addCommunityAnswer: (questionId, answer) => set((state) => ({
        communityQuestions: state.communityQuestions.map(q => q.id === questionId ? {
          ...q, answers: [...q.answers, { ...answer, id: Date.now().toString(), upvotes: 0, createdAt: new Date().toISOString() }]
        } : q)
      })),
      upvoteCommunityAnswer: (questionId, answerId) => set((state) => ({
        communityQuestions: state.communityQuestions.map(q => q.id === questionId ? {
          ...q, answers: q.answers.map(a => a.id === answerId ? { ...a, upvotes: a.upvotes + 1 } : a)
        } : q)
      })),
      markBestAnswer: (questionId, answerId) => set((state) => ({
        communityQuestions: state.communityQuestions.map(q => q.id === questionId ? { ...q, bestAnswerId: answerId } : q)
      })),

      communityVlogs: [],
      addCommunityVlog: (vlog) => set((state) => ({
        communityVlogs: [{ ...vlog, id: Date.now().toString(), likes: 0, createdAt: new Date().toISOString() }, ...state.communityVlogs]
      })),
      deleteCommunityVlog: (id) => set((state) => ({
        communityVlogs: state.communityVlogs.filter(v => v.id !== id)
      })),
      likeCommunityVlog: (id) => set((state) => ({
        communityVlogs: state.communityVlogs.map(v => v.id === id ? { ...v, likes: v.likes + 1 } : v)
      })),

      companyEligibilities: [],
      addCompanyEligibility: (e) => set((state) => ({
        companyEligibilities: [{ ...e, id: Date.now().toString(), createdAt: new Date().toISOString() }, ...state.companyEligibilities]
      })),
      deleteCompanyEligibility: (id) => set((state) => ({
        companyEligibilities: state.companyEligibilities.filter(e => e.id !== id)
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

// Helper to calculate streak from daily activities
export const calculateStreak = (activities: DailyActivity[]): { current: number; longest: number } => {
  if (activities.length === 0) return { current: 0, longest: 0 };
  
  const sortedDates = [...new Set(activities.filter(a => a.tasksCompleted > 0).map(a => a.date))].sort().reverse();
  
  if (sortedDates.length === 0) return { current: 0, longest: 0 };
  
  // Current streak
  let current = 0;
  const today = getTodayString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  // Start from today or yesterday
  let startDate = sortedDates[0] === today || sortedDates[0] === yesterdayStr ? sortedDates[0] : null;
  if (startDate) {
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(startDate);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      if (sortedDates.includes(dateStr)) {
        current++;
      } else {
        break;
      }
    }
  }
  
  // Longest streak
  let longest = 0;
  let tempStreak = 1;
  const allDates = sortedDates.sort();
  for (let i = 1; i < allDates.length; i++) {
    const prev = new Date(allDates[i - 1]);
    const curr = new Date(allDates[i]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      tempStreak++;
    } else {
      longest = Math.max(longest, tempStreak);
      tempStreak = 1;
    }
  }
  longest = Math.max(longest, tempStreak, current);
  
  return { current, longest };
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
