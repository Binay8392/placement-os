import type { AptitudeSection } from './types';
import { Calculator, Brain, MessageSquare } from 'lucide-react';

export interface TopicRegistryEntry {
  id: string;
  section: AptitudeSection;
  name: string;
  order: number;
  questionCount: number;
  tags: string[];
  companyRelevance: string[];
  file: string; // import path
}

export const SECTION_CONFIG = {
  quantitative: {
    label: 'Quantitative Aptitude',
    shortLabel: 'Quant',
    icon: Calculator,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30',
    gradient: 'from-primary/20 to-primary/5',
  },
  logical: {
    label: 'Logical Reasoning',
    shortLabel: 'Logical',
    icon: Brain,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/30',
    gradient: 'from-warning/20 to-warning/5',
  },
  verbal: {
    label: 'Verbal Ability',
    shortLabel: 'Verbal',
    icon: MessageSquare,
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/30',
    gradient: 'from-success/20 to-success/5',
  },
} as const;

export const TOPIC_REGISTRY: TopicRegistryEntry[] = [
  // QUANTITATIVE (30 topics)
  { id: 'number-system', section: 'quantitative', name: 'Number System', order: 1, questionCount: 10, tags: ['numbers', 'divisibility', 'factors'], companyRelevance: ['TCS', 'Infosys', 'Wipro', 'Accenture'], file: 'quantitative/numberSystem' },
  { id: 'hcf-lcm', section: 'quantitative', name: 'HCF & LCM', order: 2, questionCount: 10, tags: ['hcf', 'lcm', 'factors'], companyRelevance: ['TCS', 'Cognizant', 'Capgemini'], file: 'quantitative/hcfLcm' },
  { id: 'simplification', section: 'quantitative', name: 'Simplification', order: 3, questionCount: 10, tags: ['bodmas', 'arithmetic'], companyRelevance: ['Wipro', 'Infosys', 'HCLTech'], file: 'quantitative/simplification' },
  { id: 'approximation', section: 'quantitative', name: 'Approximation', order: 4, questionCount: 10, tags: ['rounding', 'estimation'], companyRelevance: ['TCS', 'Deloitte'], file: 'quantitative/approximation' },
  { id: 'percentages', section: 'quantitative', name: 'Percentages', order: 5, questionCount: 10, tags: ['percent', 'ratio', 'change'], companyRelevance: ['TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant'], file: 'quantitative/percentages' },
  { id: 'ratio-proportion', section: 'quantitative', name: 'Ratio & Proportion', order: 6, questionCount: 10, tags: ['ratio', 'proportion', 'variation'], companyRelevance: ['Infosys', 'Wipro', 'Capgemini'], file: 'quantitative/ratioProportion' },
  { id: 'averages', section: 'quantitative', name: 'Averages', order: 7, questionCount: 10, tags: ['mean', 'weighted', 'average'], companyRelevance: ['TCS', 'Accenture', 'Tech Mahindra'], file: 'quantitative/averages' },
  { id: 'profit-loss', section: 'quantitative', name: 'Profit & Loss', order: 8, questionCount: 10, tags: ['profit', 'loss', 'cp', 'sp'], companyRelevance: ['TCS', 'Infosys', 'Wipro', 'Deloitte'], file: 'quantitative/profitLoss' },
  { id: 'discount', section: 'quantitative', name: 'Discount', order: 9, questionCount: 10, tags: ['discount', 'marked price', 'successive'], companyRelevance: ['Cognizant', 'Capgemini'], file: 'quantitative/discount' },
  { id: 'simple-interest', section: 'quantitative', name: 'Simple Interest', order: 10, questionCount: 10, tags: ['interest', 'principal', 'rate'], companyRelevance: ['TCS', 'Infosys', 'Wipro'], file: 'quantitative/simpleInterest' },
  { id: 'compound-interest', section: 'quantitative', name: 'Compound Interest', order: 11, questionCount: 10, tags: ['compound', 'interest', 'amount'], companyRelevance: ['TCS', 'Accenture', 'HCLTech'], file: 'quantitative/compoundInterest' },
  { id: 'time-work', section: 'quantitative', name: 'Time & Work', order: 12, questionCount: 10, tags: ['work', 'efficiency', 'pipes'], companyRelevance: ['TCS', 'Infosys', 'Wipro', 'Capgemini'], file: 'quantitative/timeWork' },
  { id: 'pipes-cisterns', section: 'quantitative', name: 'Pipes & Cisterns', order: 13, questionCount: 10, tags: ['pipes', 'cistern', 'fill', 'drain'], companyRelevance: ['Wipro', 'LTIMindtree'], file: 'quantitative/pipesCisterns' },
  { id: 'time-speed-distance', section: 'quantitative', name: 'Time, Speed & Distance', order: 14, questionCount: 10, tags: ['speed', 'distance', 'time'], companyRelevance: ['TCS', 'Infosys', 'Wipro', 'Accenture'], file: 'quantitative/timeSpeedDistance' },
  { id: 'boats-streams', section: 'quantitative', name: 'Boats & Streams', order: 15, questionCount: 10, tags: ['boats', 'upstream', 'downstream'], companyRelevance: ['Cognizant', 'Capgemini'], file: 'quantitative/boatsStreams' },
  { id: 'trains', section: 'quantitative', name: 'Trains', order: 16, questionCount: 10, tags: ['trains', 'relative speed', 'crossing'], companyRelevance: ['TCS', 'Infosys'], file: 'quantitative/trains' },
  { id: 'ages', section: 'quantitative', name: 'Problems on Ages', order: 17, questionCount: 10, tags: ['ages', 'equations', 'ratio'], companyRelevance: ['Wipro', 'Accenture', 'Tech Mahindra'], file: 'quantitative/ages' },
  { id: 'partnership', section: 'quantitative', name: 'Partnership', order: 18, questionCount: 10, tags: ['partnership', 'profit sharing', 'capital'], companyRelevance: ['Deloitte', 'LTIMindtree'], file: 'quantitative/partnership' },
  { id: 'mixture-alligation', section: 'quantitative', name: 'Mixture & Alligation', order: 19, questionCount: 10, tags: ['mixture', 'alligation', 'concentration'], companyRelevance: ['TCS', 'Cognizant'], file: 'quantitative/mixtureAlligation' },
  { id: 'probability', section: 'quantitative', name: 'Probability', order: 20, questionCount: 10, tags: ['probability', 'events', 'outcomes'], companyRelevance: ['TCS', 'Infosys', 'Accenture', 'HCLTech'], file: 'quantitative/probability' },
  { id: 'permutation-combination', section: 'quantitative', name: 'Permutation & Combination', order: 21, questionCount: 10, tags: ['permutation', 'combination', 'factorial'], companyRelevance: ['Infosys', 'Wipro', 'Deloitte'], file: 'quantitative/permutationCombination' },
  { id: 'data-interpretation', section: 'quantitative', name: 'Data Interpretation', order: 22, questionCount: 10, tags: ['tables', 'graphs', 'pie chart', 'bar chart'], companyRelevance: ['TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant'], file: 'quantitative/dataInterpretation' },
  { id: 'data-sufficiency', section: 'quantitative', name: 'Data Sufficiency', order: 23, questionCount: 10, tags: ['data sufficiency', 'logical', 'conditions'], companyRelevance: ['Infosys', 'Accenture'], file: 'quantitative/dataSufficiency' },
  { id: 'clocks-quant', section: 'quantitative', name: 'Clocks', order: 24, questionCount: 10, tags: ['clocks', 'angles', 'time'], companyRelevance: ['TCS', 'Wipro', 'Capgemini'], file: 'quantitative/clocks' },
  { id: 'calendars-quant', section: 'quantitative', name: 'Calendars', order: 25, questionCount: 10, tags: ['calendars', 'days', 'odd days'], companyRelevance: ['Cognizant', 'HCLTech'], file: 'quantitative/calendars' },
  { id: 'algebra', section: 'quantitative', name: 'Algebra', order: 26, questionCount: 10, tags: ['algebra', 'variables', 'expressions'], companyRelevance: ['Infosys', 'Accenture'], file: 'quantitative/algebra' },
  { id: 'linear-equations', section: 'quantitative', name: 'Linear Equations', order: 27, questionCount: 10, tags: ['linear', 'equations', 'simultaneous'], companyRelevance: ['TCS', 'Wipro'], file: 'quantitative/linearEquations' },
  { id: 'quadratic-equations', section: 'quantitative', name: 'Quadratic Equations', order: 28, questionCount: 10, tags: ['quadratic', 'roots', 'discriminant'], companyRelevance: ['Deloitte', 'LTIMindtree'], file: 'quantitative/quadraticEquations' },
  { id: 'geometry', section: 'quantitative', name: 'Geometry', order: 29, questionCount: 10, tags: ['geometry', 'triangles', 'circles', 'angles'], companyRelevance: ['Wipro', 'Capgemini'], file: 'quantitative/geometry' },
  { id: 'mensuration', section: 'quantitative', name: 'Mensuration', order: 30, questionCount: 10, tags: ['area', 'volume', 'perimeter', '2D', '3D'], companyRelevance: ['TCS', 'Infosys', 'HCLTech'], file: 'quantitative/mensuration' },

  // LOGICAL (30 topics)
  { id: 'number-series', section: 'logical', name: 'Number Series', order: 1, questionCount: 10, tags: ['series', 'pattern', 'numbers'], companyRelevance: ['TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant'], file: 'logical/numberSeries' },
  { id: 'alphabet-series', section: 'logical', name: 'Alphabet Series', order: 2, questionCount: 10, tags: ['alphabet', 'series', 'letters'], companyRelevance: ['TCS', 'Cognizant', 'Capgemini'], file: 'logical/alphabetSeries' },
  { id: 'alphanumeric-series', section: 'logical', name: 'Alphanumeric Series', order: 3, questionCount: 10, tags: ['alphanumeric', 'mixed', 'series'], companyRelevance: ['Infosys', 'Wipro'], file: 'logical/alphanumericSeries' },
  { id: 'analogy', section: 'logical', name: 'Analogy', order: 4, questionCount: 10, tags: ['analogy', 'relation', 'pair'], companyRelevance: ['TCS', 'Wipro', 'HCLTech'], file: 'logical/analogy' },
  { id: 'classification', section: 'logical', name: 'Classification', order: 5, questionCount: 10, tags: ['odd one out', 'classification'], companyRelevance: ['Accenture', 'Capgemini'], file: 'logical/classification' },
  { id: 'coding-decoding', section: 'logical', name: 'Coding-Decoding', order: 6, questionCount: 10, tags: ['coding', 'decoding', 'cipher'], companyRelevance: ['TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant'], file: 'logical/codingDecoding' },
  { id: 'blood-relations', section: 'logical', name: 'Blood Relations', order: 7, questionCount: 10, tags: ['blood', 'family', 'relations'], companyRelevance: ['TCS', 'Wipro', 'Deloitte'], file: 'logical/bloodRelations' },
  { id: 'direction-sense', section: 'logical', name: 'Direction Sense', order: 8, questionCount: 10, tags: ['direction', 'navigation', 'distance'], companyRelevance: ['Infosys', 'Capgemini', 'LTIMindtree'], file: 'logical/directionSense' },
  { id: 'ranking-ordering', section: 'logical', name: 'Ranking & Ordering', order: 9, questionCount: 10, tags: ['ranking', 'position', 'ordering'], companyRelevance: ['TCS', 'Cognizant'], file: 'logical/rankingOrdering' },
  { id: 'seating-arrangement', section: 'logical', name: 'Seating Arrangement', order: 10, questionCount: 10, tags: ['seating', 'arrangement', 'linear', 'circular'], companyRelevance: ['TCS', 'Infosys', 'Wipro', 'Accenture'], file: 'logical/seatingArrangement' },
  { id: 'linear-arrangement', section: 'logical', name: 'Linear Arrangement', order: 11, questionCount: 10, tags: ['linear', 'arrangement', 'row'], companyRelevance: ['Cognizant', 'HCLTech'], file: 'logical/linearArrangement' },
  { id: 'circular-arrangement', section: 'logical', name: 'Circular Arrangement', order: 12, questionCount: 10, tags: ['circular', 'arrangement', 'round table'], companyRelevance: ['Infosys', 'Deloitte'], file: 'logical/circularArrangement' },
  { id: 'puzzles', section: 'logical', name: 'Puzzles', order: 13, questionCount: 10, tags: ['puzzles', 'logic', 'deduction'], companyRelevance: ['TCS', 'Infosys', 'Wipro', 'Accenture'], file: 'logical/puzzles' },
  { id: 'syllogism', section: 'logical', name: 'Syllogism', order: 14, questionCount: 10, tags: ['syllogism', 'statements', 'conclusions', 'venn'], companyRelevance: ['TCS', 'Cognizant', 'Capgemini'], file: 'logical/syllogism' },
  { id: 'statement-conclusion', section: 'logical', name: 'Statement & Conclusion', order: 15, questionCount: 10, tags: ['statement', 'conclusion', 'inference'], companyRelevance: ['Wipro', 'Accenture', 'HCLTech'], file: 'logical/statementConclusion' },
  { id: 'statement-assumption', section: 'logical', name: 'Statement & Assumption', order: 16, questionCount: 10, tags: ['assumption', 'implicit', 'statement'], companyRelevance: ['Deloitte', 'LTIMindtree'], file: 'logical/statementAssumption' },
  { id: 'statement-argument', section: 'logical', name: 'Statement & Argument', order: 17, questionCount: 10, tags: ['argument', 'strong', 'weak', 'statement'], companyRelevance: ['Infosys', 'Accenture'], file: 'logical/statementArgument' },
  { id: 'cause-effect', section: 'logical', name: 'Cause & Effect', order: 18, questionCount: 10, tags: ['cause', 'effect', 'relationship'], companyRelevance: ['Cognizant', 'Capgemini'], file: 'logical/causeEffect' },
  { id: 'assertion-reason', section: 'logical', name: 'Assertion & Reason', order: 19, questionCount: 10, tags: ['assertion', 'reason', 'logical'], companyRelevance: ['TCS', 'Wipro'], file: 'logical/assertionReason' },
  { id: 'data-sufficiency-logical', section: 'logical', name: 'Data Sufficiency', order: 20, questionCount: 10, tags: ['data sufficiency', 'conditions'], companyRelevance: ['Infosys', 'Deloitte'], file: 'logical/dataSufficiency' },
  { id: 'venn-diagram', section: 'logical', name: 'Venn Diagrams', order: 21, questionCount: 10, tags: ['venn', 'sets', 'intersection'], companyRelevance: ['TCS', 'Wipro', 'HCLTech'], file: 'logical/vennDiagram' },
  { id: 'clocks-logical', section: 'logical', name: 'Clocks', order: 22, questionCount: 10, tags: ['clocks', 'time', 'angles'], companyRelevance: ['Capgemini', 'LTIMindtree'], file: 'logical/clocks' },
  { id: 'calendars-logical', section: 'logical', name: 'Calendars', order: 23, questionCount: 10, tags: ['calendars', 'days', 'leap year'], companyRelevance: ['Cognizant', 'TCS'], file: 'logical/calendars' },
  { id: 'missing-numbers', section: 'logical', name: 'Missing Numbers', order: 24, questionCount: 10, tags: ['missing', 'matrix', 'table', 'pattern'], companyRelevance: ['TCS', 'Accenture'], file: 'logical/missingNumbers' },
  { id: 'mathematical-operations', section: 'logical', name: 'Mathematical Operations', order: 25, questionCount: 10, tags: ['operations', 'symbols', 'substitution'], companyRelevance: ['Wipro', 'Cognizant'], file: 'logical/mathematicalOperations' },
  { id: 'logical-deduction', section: 'logical', name: 'Logical Deduction', order: 26, questionCount: 10, tags: ['deduction', 'reasoning', 'conclusions'], companyRelevance: ['Infosys', 'Deloitte'], file: 'logical/logicalDeduction' },
  { id: 'input-output', section: 'logical', name: 'Input-Output', order: 27, questionCount: 10, tags: ['input', 'output', 'machine', 'steps'], companyRelevance: ['TCS', 'Wipro'], file: 'logical/inputOutput' },
  { id: 'decision-making', section: 'logical', name: 'Decision Making', order: 28, questionCount: 10, tags: ['decision', 'conditions', 'criteria'], companyRelevance: ['Accenture', 'HCLTech'], file: 'logical/decisionMaking' },
  { id: 'non-verbal-reasoning', section: 'logical', name: 'Non-Verbal Reasoning', order: 29, questionCount: 10, tags: ['figures', 'shapes', 'visual', 'pattern'], companyRelevance: ['Capgemini', 'LTIMindtree'], file: 'logical/nonVerbalReasoning' },
  { id: 'figure-pattern', section: 'logical', name: 'Figure/Pattern Reasoning', order: 30, questionCount: 10, tags: ['matrix', 'figure', 'next in series'], companyRelevance: ['TCS', 'Infosys'], file: 'logical/figurePattern' },

  // VERBAL (30 topics)
  { id: 'reading-comprehension', section: 'verbal', name: 'Reading Comprehension', order: 1, questionCount: 10, tags: ['passage', 'comprehension', 'inference'], companyRelevance: ['TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant'], file: 'verbal/readingComprehension' },
  { id: 'vocabulary', section: 'verbal', name: 'Vocabulary', order: 2, questionCount: 10, tags: ['vocabulary', 'words', 'meaning'], companyRelevance: ['TCS', 'Deloitte'], file: 'verbal/vocabulary' },
  { id: 'synonyms', section: 'verbal', name: 'Synonyms', order: 3, questionCount: 10, tags: ['synonyms', 'similar meaning'], companyRelevance: ['TCS', 'Infosys', 'Capgemini'], file: 'verbal/synonyms' },
  { id: 'antonyms', section: 'verbal', name: 'Antonyms', order: 4, questionCount: 10, tags: ['antonyms', 'opposite meaning'], companyRelevance: ['Wipro', 'Accenture'], file: 'verbal/antonyms' },
  { id: 'one-word-substitution', section: 'verbal', name: 'One Word Substitution', order: 5, questionCount: 10, tags: ['one word', 'substitution', 'vocabulary'], companyRelevance: ['TCS', 'Cognizant'], file: 'verbal/oneWordSubstitution' },
  { id: 'idioms-phrases', section: 'verbal', name: 'Idioms & Phrases', order: 6, questionCount: 10, tags: ['idioms', 'phrases', 'meaning'], companyRelevance: ['Infosys', 'HCLTech'], file: 'verbal/idiomsPhrases' },
  { id: 'sentence-completion', section: 'verbal', name: 'Sentence Completion', order: 7, questionCount: 10, tags: ['fill', 'blank', 'sentence'], companyRelevance: ['TCS', 'Wipro', 'Deloitte'], file: 'verbal/sentenceCompletion' },
  { id: 'sentence-correction', section: 'verbal', name: 'Sentence Correction', order: 8, questionCount: 10, tags: ['correction', 'grammar', 'sentence'], companyRelevance: ['Infosys', 'Accenture', 'LTIMindtree'], file: 'verbal/sentenceCorrection' },
  { id: 'error-detection', section: 'verbal', name: 'Error Detection', order: 9, questionCount: 10, tags: ['error', 'grammatical', 'detection'], companyRelevance: ['TCS', 'Cognizant', 'Capgemini'], file: 'verbal/errorDetection' },
  { id: 'grammar', section: 'verbal', name: 'Grammar', order: 10, questionCount: 10, tags: ['grammar', 'rules', 'usage'], companyRelevance: ['Wipro', 'HCLTech'], file: 'verbal/grammar' },
  { id: 'subject-verb-agreement', section: 'verbal', name: 'Subject-Verb Agreement', order: 11, questionCount: 10, tags: ['subject', 'verb', 'agreement', 'concord'], companyRelevance: ['TCS', 'Infosys'], file: 'verbal/subjectVerbAgreement' },
  { id: 'tenses', section: 'verbal', name: 'Tenses', order: 12, questionCount: 10, tags: ['tense', 'past', 'present', 'future'], companyRelevance: ['Accenture', 'Deloitte'], file: 'verbal/tenses' },
  { id: 'articles', section: 'verbal', name: 'Articles', order: 13, questionCount: 10, tags: ['articles', 'a', 'an', 'the'], companyRelevance: ['Wipro', 'Capgemini'], file: 'verbal/articles' },
  { id: 'prepositions', section: 'verbal', name: 'Prepositions', order: 14, questionCount: 10, tags: ['prepositions', 'in', 'on', 'at'], companyRelevance: ['TCS', 'Cognizant'], file: 'verbal/prepositions' },
  { id: 'conjunctions', section: 'verbal', name: 'Conjunctions', order: 15, questionCount: 10, tags: ['conjunctions', 'connectors', 'joining'], companyRelevance: ['LTIMindtree', 'HCLTech'], file: 'verbal/conjunctions' },
  { id: 'active-passive', section: 'verbal', name: 'Active & Passive Voice', order: 16, questionCount: 10, tags: ['active', 'passive', 'voice', 'transformation'], companyRelevance: ['TCS', 'Infosys', 'Wipro'], file: 'verbal/activePassive' },
  { id: 'direct-indirect', section: 'verbal', name: 'Direct & Indirect Speech', order: 17, questionCount: 10, tags: ['direct', 'indirect', 'reported speech'], companyRelevance: ['Accenture', 'Deloitte'], file: 'verbal/directIndirect' },
  { id: 'para-jumbles', section: 'verbal', name: 'Para Jumbles', order: 18, questionCount: 10, tags: ['para jumbles', 'rearrangement', 'coherence'], companyRelevance: ['TCS', 'Capgemini', 'Cognizant'], file: 'verbal/paraJumbles' },
  { id: 'sentence-rearrangement', section: 'verbal', name: 'Sentence Rearrangement', order: 19, questionCount: 10, tags: ['rearrangement', 'order', 'sequence'], companyRelevance: ['Wipro', 'HCLTech'], file: 'verbal/sentenceRearrangement' },
  { id: 'fill-blanks', section: 'verbal', name: 'Fill in the Blanks', order: 20, questionCount: 10, tags: ['fill blanks', 'vocabulary', 'grammar'], companyRelevance: ['TCS', 'Infosys', 'Accenture'], file: 'verbal/fillBlanks' },
  { id: 'cloze-test', section: 'verbal', name: 'Cloze Test', order: 21, questionCount: 10, tags: ['cloze', 'passage', 'fill'], companyRelevance: ['Deloitte', 'LTIMindtree'], file: 'verbal/clozeTest' },
  { id: 'critical-reasoning', section: 'verbal', name: 'Critical Reasoning', order: 22, questionCount: 10, tags: ['critical', 'reasoning', 'argument', 'logical'], companyRelevance: ['TCS', 'Infosys'], file: 'verbal/criticalReasoning' },
  { id: 'inference', section: 'verbal', name: 'Inference', order: 23, questionCount: 10, tags: ['inference', 'conclusion', 'passage'], companyRelevance: ['Accenture', 'Cognizant'], file: 'verbal/inference' },
  { id: 'main-idea', section: 'verbal', name: 'Main Idea', order: 24, questionCount: 10, tags: ['main idea', 'central theme', 'passage'], companyRelevance: ['Wipro', 'Capgemini'], file: 'verbal/mainIdea' },
  { id: 'tone-purpose', section: 'verbal', name: 'Tone & Purpose', order: 25, questionCount: 10, tags: ['tone', 'purpose', 'author intent'], companyRelevance: ['TCS', 'Deloitte'], file: 'verbal/tonePurpose' },
  { id: 'vocabulary-context', section: 'verbal', name: 'Vocabulary in Context', order: 26, questionCount: 10, tags: ['context', 'meaning', 'word usage'], companyRelevance: ['Infosys', 'HCLTech'], file: 'verbal/vocabularyContext' },
  { id: 'sentence-improvement', section: 'verbal', name: 'Sentence Improvement', order: 27, questionCount: 10, tags: ['improvement', 'better', 'rewrite'], companyRelevance: ['TCS', 'Wipro', 'Accenture'], file: 'verbal/sentenceImprovement' },
  { id: 'word-usage', section: 'verbal', name: 'Word Usage', order: 28, questionCount: 10, tags: ['word usage', 'correct word', 'confusing words'], companyRelevance: ['Cognizant', 'LTIMindtree'], file: 'verbal/wordUsage' },
  { id: 'spelling', section: 'verbal', name: 'Spelling', order: 29, questionCount: 10, tags: ['spelling', 'correct', 'misspelled'], companyRelevance: ['Capgemini', 'HCLTech'], file: 'verbal/spelling' },
  { id: 'communication-skills', section: 'verbal', name: 'Communication Skills', order: 30, questionCount: 10, tags: ['communication', 'professional', 'email', 'letter'], companyRelevance: ['Accenture', 'Deloitte', 'Tech Mahindra'], file: 'verbal/communicationSkills' },
];

export const MOCK_CONFIGS = [
  { id: 'quant-mock', label: 'Quantitative Mock', sections: ['quantitative'] as AptitudeSection[], questions: 30, timeMinutes: 30 },
  { id: 'logical-mock', label: 'Logical Mock', sections: ['logical'] as AptitudeSection[], questions: 30, timeMinutes: 30 },
  { id: 'verbal-mock', label: 'Verbal Mock', sections: ['verbal'] as AptitudeSection[], questions: 30, timeMinutes: 30 },
  { id: 'quant-logical', label: 'Quant + Logical', sections: ['quantitative', 'logical'] as AptitudeSection[], questions: 60, timeMinutes: 50 },
  { id: 'quant-verbal', label: 'Quant + Verbal', sections: ['quantitative', 'verbal'] as AptitudeSection[], questions: 60, timeMinutes: 50 },
  { id: 'logical-verbal', label: 'Logical + Verbal', sections: ['logical', 'verbal'] as AptitudeSection[], questions: 60, timeMinutes: 50 },
  { id: 'full-aptitude', label: 'Full Aptitude Test', sections: ['quantitative', 'logical', 'verbal'] as AptitudeSection[], questions: 90, timeMinutes: 60 },
] as const;

export const COMPANY_SIM_CONFIGS = [
  { id: 'tcs-style', company: 'TCS', label: 'PrepTrack TCS-style Simulation', questions: 30, timeMinutes: 50, focus: ['number-system', 'percentages', 'time-work', 'number-series', 'coding-decoding', 'reading-comprehension', 'sentence-correction'] },
  { id: 'infosys-style', company: 'Infosys', label: 'PrepTrack Infosys-style Simulation', questions: 30, timeMinutes: 50, focus: ['data-interpretation', 'probability', 'seating-arrangement', 'puzzles', 'reading-comprehension', 'sentence-completion'] },
  { id: 'wipro-style', company: 'Wipro', label: 'PrepTrack Wipro-style Simulation', questions: 30, timeMinutes: 45, focus: ['percentages', 'time-speed-distance', 'analogy', 'coding-decoding', 'fill-blanks', 'error-detection'] },
  { id: 'accenture-style', company: 'Accenture', label: 'PrepTrack Accenture-style Simulation', questions: 30, timeMinutes: 50, focus: ['data-sufficiency', 'probability', 'syllogism', 'statement-conclusion', 'reading-comprehension', 'para-jumbles'] },
  { id: 'cognizant-style', company: 'Cognizant', label: 'PrepTrack Cognizant-style Simulation', questions: 30, timeMinutes: 50, focus: ['number-series', 'analogy', 'blood-relations', 'simplification', 'vocabulary', 'sentence-correction'] },
  { id: 'capgemini-style', company: 'Capgemini', label: 'PrepTrack Capgemini-style Simulation', questions: 30, timeMinutes: 45, focus: ['time-work', 'percentages', 'seating-arrangement', 'missing-numbers', 'fill-blanks', 'articles'] },
  { id: 'deloitte-style', company: 'Deloitte', label: 'PrepTrack Deloitte-style Simulation', questions: 30, timeMinutes: 45, focus: ['data-interpretation', 'critical-reasoning', 'logical-deduction', 'tenses', 'tone-purpose'] },
  { id: 'tech-mahindra-style', company: 'Tech Mahindra', label: 'PrepTrack Tech Mahindra-style Simulation', questions: 30, timeMinutes: 45, focus: ['averages', 'ratio-proportion', 'analogy', 'coding-decoding', 'sentence-completion'] },
  { id: 'ltimindtree-style', company: 'LTIMindtree', label: 'PrepTrack LTIMindtree-style Simulation', questions: 30, timeMinutes: 50, focus: ['compound-interest', 'pipes-cisterns', 'seating-arrangement', 'data-sufficiency', 'cloze-test'] },
  { id: 'hcltech-style', company: 'HCLTech', label: 'PrepTrack HCLTech-style Simulation', questions: 30, timeMinutes: 45, focus: ['mensuration', 'probability', 'clocks-quant', 'number-series', 'synonyms', 'grammar'] },
] as const;

export type MockConfigId = typeof MOCK_CONFIGS[number]['id'];
export type CompanySimId = typeof COMPANY_SIM_CONFIGS[number]['id'];

export const DAILY_CHALLENGE_CONFIG = {
  questionCount: 10,
  distribution: { quantitative: 3, logical: 3, verbal: 4 },
  timeMinutes: 12,
};
