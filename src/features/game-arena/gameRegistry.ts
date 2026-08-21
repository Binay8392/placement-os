import {
  Binary,
  Brain,
  CircleDot,
  Compass,
  Diamond,
  Gamepad2,
  Grid3X3,
  Shuffle,
} from 'lucide-react';
import type { GameDefinition, GameId, QuestionGenerator } from './types';
import { generateDigitQuestion } from './games/DigitChallenge/digitGenerator';
import { generateGeoSudoQuestion } from './games/GeoSudoChallenge/geoGenerator';
import { generateGridQuestion } from './games/GridChallenge/gridGenerator';
import { generateMotionQuestion } from './games/MotionChallenge/motionGenerator';
import { generateOddoQuestion } from './games/OddoChallenge/oddoGenerator';
import { generateSwitchQuestion } from './games/SwitchChallenge/switchGenerator';
import { generateInductiveQuestion } from './games/InductiveChallenge/inductiveGenerator';
import { generatePatternQuestion } from './games/PatternChallenge/patternGenerator';

export const GAME_DEFINITIONS: Record<GameId, GameDefinition> = {
  digit: {
    id: 'digit',
    name: 'Digit Challenge',
    shortName: 'Digit',
    route: '/game-arena/digit',
    description: 'Number logic and rapid calculation.',
    purpose: 'Rapid numerical reasoning',
    icon: Binary,
    accent: 'primary',
  },
  'geo-sudo': {
    id: 'geo-sudo',
    name: 'Geo-Sudo Challenge',
    shortName: 'Geo-Sudo',
    route: '/game-arena/geo-sudo',
    description: 'Shape-based deduction on compact logic grids.',
    purpose: 'Visual deduction and spatial reasoning',
    icon: Diamond,
    accent: 'success',
  },
  grid: {
    id: 'grid',
    name: 'Grid Challenge',
    shortName: 'Grid',
    route: '/game-arena/grid',
    description: 'Memorize a hidden pattern and recall it fast.',
    purpose: 'Memory and visual pattern recognition',
    icon: Grid3X3,
    accent: 'warning',
  },
  motion: {
    id: 'motion',
    name: 'Motion Challenge',
    shortName: 'Motion',
    route: '/game-arena/motion',
    description: 'Plan efficient paths through obstacle maps.',
    purpose: 'Spatial planning and movement prediction',
    icon: Compass,
    accent: 'sky',
  },
  oddo: {
    id: 'oddo',
    name: 'Oddo Challenge',
    shortName: 'Oddo',
    route: '/game-arena/oddo',
    description: 'Spot the item that breaks a hidden rule.',
    purpose: 'Pattern classification and rule recognition',
    icon: CircleDot,
    accent: 'destructive',
  },
  switch: {
    id: 'switch',
    name: 'Switch Challenge',
    shortName: 'Switch',
    route: '/game-arena/switch',
    description: 'Apply chained symbol transformation rules.',
    purpose: 'Transformation and rule application',
    icon: Shuffle,
    accent: 'violet',
  },
  inductive: {
    id: 'inductive',
    name: 'Inductive Challenge',
    shortName: 'Inductive',
    route: '/game-arena/inductive',
    description: 'Infer future states from visual examples.',
    purpose: 'Inductive visual reasoning',
    icon: Brain,
    accent: 'slate',
  },
  pattern: {
    id: 'pattern',
    name: 'Pattern Challenge',
    shortName: 'Pattern',
    route: '/game-arena/pattern',
    description: 'Solve mixed number, symbol, and matrix patterns.',
    purpose: 'Mixed cognitive pattern reasoning',
    icon: Gamepad2,
    accent: 'primary',
  },
};

export const GAME_ORDER: GameId[] = [
  'digit',
  'geo-sudo',
  'grid',
  'motion',
  'oddo',
  'switch',
  'inductive',
  'pattern',
];

export const GAME_GENERATORS: Record<GameId, QuestionGenerator> = {
  digit: generateDigitQuestion,
  'geo-sudo': generateGeoSudoQuestion,
  grid: generateGridQuestion,
  motion: generateMotionQuestion,
  oddo: generateOddoQuestion,
  switch: generateSwitchQuestion,
  inductive: generateInductiveQuestion,
  pattern: generatePatternQuestion,
};

export function isGameId(value: string | undefined): value is GameId {
  return Boolean(value && value in GAME_DEFINITIONS);
}
