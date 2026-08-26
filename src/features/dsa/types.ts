export type DSAVideoStatus = 'not_started' | 'in_progress' | 'completed';

export type DSADifficulty = 'easy' | 'medium' | 'hard';

export interface DSAVideo {
  id: string; // e.g. "dsa-v-001"
  videoId: string; // YouTube video ID e.g. "WQoB2z67hvY"
  title: string;
  topicId: string;
  topic: string;
  category: 'foundations' | 'core' | 'advanced';
  order: number;
  playlistId: string; // "PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA"
  durationSeconds: number;
  thumbnailUrl: string;
  description?: string;
  sheetUrl?: string; // Love Babbar DSA Sheet or topic resource link
  codeUrl?: string; // Solution GitHub repository / code link
  practiceUrl?: string; // LeetCode / problem link
  notesUrl?: string; // Lecture notes PDF link
  difficulty?: DSADifficulty;
  tags?: string[];
}

export interface DSAVideoProgress {
  videoId: string;
  status: DSAVideoStatus;
  watchedSeconds: number;
  durationSeconds: number;
  progressPercent: number; // 0 to 100
  completedAt: string | null; // ISO timestamp string
  lastWatchedAt: string; // ISO timestamp string
  lastPositionSeconds: number;
}

export interface DSATopicMeta {
  id: string;
  name: string;
  category: 'foundations' | 'core' | 'advanced';
  order: number;
  description: string;
  totalVideos: number;
  sheetUrl?: string;
}
