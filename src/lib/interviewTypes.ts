export type InterviewType = 'technical' | 'hr' | 'dsa' | 'system-design' | 'custom';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface InterviewConfig {
  type: InterviewType;
  difficulty: Difficulty;
  role: string;
  questionCount: number;
  timerPerQuestion: number; // seconds
  rapidFire: boolean;
  companyStyle?: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  expectedKeywords?: string[];
}

export interface InterviewAnswer {
  questionId: string;
  question: string;
  answer: string;
  timeSpent: number;
}

export interface InterviewScores {
  overall: number;
  confidence: number;
  technicalDepth: number;
  communication: number;
}

export interface InterviewFeedback {
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  topicsToRevise: string[];
}

export interface InterviewResult {
  id: string;
  date: string;
  config: InterviewConfig;
  answers: InterviewAnswer[];
  scores: InterviewScores;
  feedback: InterviewFeedback;
}

export const INTERVIEW_TYPES: { value: InterviewType; label: string; description: string; icon: string }[] = [
  { value: 'technical', label: 'Technical Interview', description: 'Core CS concepts, frameworks, and coding', icon: '💻' },
  { value: 'hr', label: 'HR Interview', description: 'Behavioral and situational questions', icon: '🤝' },
  { value: 'dsa', label: 'DSA Rapid Round', description: 'Data structures & algorithms', icon: '⚡' },
  { value: 'system-design', label: 'System Design', description: 'Architecture and scalability', icon: '🏗️' },
  { value: 'custom', label: 'Custom Interview', description: 'Define your own focus area', icon: '✏️' },
];

export const ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Analyst',
  'Software Engineer',
];

export const COMPANY_STYLES = [
  { value: 'google', label: 'Google Style', icon: '🔍' },
  { value: 'tcs', label: 'TCS Style', icon: '🏢' },
  { value: 'startup', label: 'Startup Style', icon: '🚀' },
];

export const DIFFICULTY_CONFIG: Record<Difficulty, { timer: number; questions: number; label: string; color: string }> = {
  easy: { timer: 180, questions: 5, label: 'Easy', color: 'text-green-400' },
  medium: { timer: 120, questions: 7, label: 'Medium', color: 'text-yellow-400' },
  hard: { timer: 90, questions: 10, label: 'Hard', color: 'text-red-400' },
};
