import { companyDataMap, type InterviewExperience, type HRQuestion, type MentorTalk } from '@/data/companyData';

const CACHE_PREFIX = 'preptrack_cache_';
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CachedData<T> {
  data: T;
  timestamp: number;
}

function getCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const cached: CachedData<T> = JSON.parse(raw);
    if (Date.now() - cached.timestamp > CACHE_EXPIRY_MS) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return cached.data;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, data: T): void {
  try {
    const cached: CachedData<T> = { data, timestamp: Date.now() };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cached));
  } catch {
    // Storage full — ignore
  }
}

/**
 * Fetch interview experiences for a company.
 * Currently uses curated local data with caching.
 * Future-ready for GeeksforGeeks / Glassdoor API integration.
 */
export function fetchInterviewExperiences(companyName: string): InterviewExperience[] {
  const cacheKey = `experiences_${companyName}`;
  const cached = getCache<InterviewExperience[]>(cacheKey);
  if (cached) return cached;

  const company = companyDataMap[companyName];
  if (!company) return [];

  const data = company.interviewExperiences;
  setCache(cacheKey, data);
  return data;
}

/**
 * Fetch HR questions for a company.
 * Currently uses curated local data with caching.
 * Future-ready for API integration.
 */
export function fetchHRQuestions(companyName: string): HRQuestion[] {
  const cacheKey = `hr_${companyName}`;
  const cached = getCache<HRQuestion[]>(cacheKey);
  if (cached) return cached;

  const company = companyDataMap[companyName];
  if (!company) return [];

  const data = company.hrQuestions;
  setCache(cacheKey, data);
  return data;
}

/**
 * Fetch mentor talks/videos for a company.
 * Currently uses curated local data with caching.
 * Future-ready for YouTube API integration.
 */
export function fetchMentorVideos(companyName: string): MentorTalk[] {
  const cacheKey = `mentor_${companyName}`;
  const cached = getCache<MentorTalk[]>(cacheKey);
  if (cached) return cached;

  const company = companyDataMap[companyName];
  if (!company) return [];

  const data = company.mentorTalks;
  setCache(cacheKey, data);
  return data;
}

/**
 * Clear all cached data for a company (useful for refresh).
 */
export function clearCompanyCache(companyName: string): void {
  ['experiences', 'hr', 'mentor'].forEach(type => {
    localStorage.removeItem(`${CACHE_PREFIX}${type}_${companyName}`);
  });
}
