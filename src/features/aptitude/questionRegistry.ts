import type { AptitudeQuestion } from './types';
import { TOPIC_REGISTRY } from './config';

type QuestionModule = { default: AptitudeQuestion[] };

// Dynamic import registry — only loads topics on demand for existing data files
const importMap: Record<string, () => Promise<QuestionModule>> = {
  // QUANTITATIVE (14 implemented)
  'quantitative/numberSystem': () => import('./data/quantitative/numberSystem'),
  'quantitative/hcfLcm': () => import('./data/quantitative/hcfLcm'),
  'quantitative/simplification': () => import('./data/quantitative/simplification'),
  'quantitative/approximation': () => import('./data/quantitative/approximation'),
  'quantitative/percentages': () => import('./data/quantitative/percentages'),
  'quantitative/ratioProportion': () => import('./data/quantitative/ratioProportion'),
  'quantitative/averages': () => import('./data/quantitative/averages'),
  'quantitative/profitLoss': () => import('./data/quantitative/profitLoss'),
  'quantitative/trains': () => import('./data/quantitative/trains'),
  'quantitative/ages': () => import('./data/quantitative/ages'),
  'quantitative/partnership': () => import('./data/quantitative/partnership'),
  'quantitative/mixtureAlligation': () => import('./data/quantitative/mixtureAlligation'),
  'quantitative/probability': () => import('./data/quantitative/probability'),
  'quantitative/permutationCombination': () => import('./data/quantitative/permutationCombination'),
  // LOGICAL (6 implemented)
  'logical/numberSeries': () => import('./data/logical/numberSeries'),
  'logical/alphabetSeries': () => import('./data/logical/alphabetSeries'),
  'logical/alphanumericSeries': () => import('./data/logical/alphanumericSeries'),
  'logical/analogy': () => import('./data/logical/analogy'),
  'logical/classification': () => import('./data/logical/classification'),
  'logical/codingDecoding': () => import('./data/logical/codingDecoding'),
  // VERBAL (8 implemented)
  'verbal/readingComprehension': () => import('./data/verbal/readingComprehension'),
  'verbal/vocabulary': () => import('./data/verbal/vocabulary'),
  'verbal/synonyms': () => import('./data/verbal/synonyms'),
  'verbal/antonyms': () => import('./data/verbal/antonyms'),
  'verbal/oneWordSubstitution': () => import('./data/verbal/oneWordSubstitution'),
  'verbal/idiomsPhrases': () => import('./data/verbal/idiomsPhrases'),
  'verbal/sentenceCompletion': () => import('./data/verbal/sentenceCompletion'),
  'verbal/sentenceCorrection': () => import('./data/verbal/sentenceCorrection'),
};

/**
 * Load questions for a given topic ID.
 * Uses dynamic imports so only the requested topic's questions are bundled at runtime.
 */
export async function getQuestionsForTopic(topicId: string): Promise<AptitudeQuestion[]> {
  const entry = TOPIC_REGISTRY.find((t) => t.id === topicId);
  if (!entry) return [];
  const importer = importMap[entry.file];
  if (!importer) return [];
  try {
    const mod = await importer();
    return mod.default || [];
  } catch (e) {
    // Topic data file not yet implemented
    return [];
  }
}

/**
 * Load questions for multiple topics at once.
 */
export async function getQuestionsForTopics(topicIds: string[]): Promise<AptitudeQuestion[]> {
  const results = await Promise.all(topicIds.map(getQuestionsForTopic));
  return results.flat();
}

/**
 * Load questions for an entire section.
 */
export async function getQuestionsForSection(section: string): Promise<AptitudeQuestion[]> {
  const topics = TOPIC_REGISTRY.filter((t) => t.section === section);
  return getQuestionsForTopics(topics.map((t) => t.id));
}

/**
 * Filter a question set by difficulty and/or count.
 */
export function filterQuestions(
  questions: AptitudeQuestion[],
  opts: {
    difficulty?: 'easy' | 'medium' | 'hard' | 'mixed';
    count?: number;
    shuffle?: boolean;
  } = {}
): AptitudeQuestion[] {
  let result = [...questions];
  if (opts.difficulty && opts.difficulty !== 'mixed') {
    result = result.filter((q) => q.difficulty === opts.difficulty);
  }
  if (opts.shuffle) {
    result = result.sort(() => Math.random() - 0.5);
  }
  if (opts.count && opts.count < result.length) {
    result = result.slice(0, opts.count);
  }
  return result;
}
