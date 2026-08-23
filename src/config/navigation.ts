import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  Code2,
  Factory,
  Gamepad2,
  FileText,
  Heart,
  LayoutDashboard,
  Lightbulb,
  ListChecks,
  Mic2,
  Sparkles,
  Swords,
  Terminal,
  Timer,
  UserRound,
  Users,
} from 'lucide-react';

export interface ProductNavItem {
  to: string;
  label: string;
  shortLabel?: string;
  description: string;
  icon: LucideIcon;
  matchPrefix?: string;
}

export interface ProductNavSection {
  label: string;
  items: ProductNavItem[];
}

export const NAVIGATION_SECTIONS: ProductNavSection[] = [
  {
    label: 'Workspace',
    items: [
      { to: '/', label: 'Overview', description: 'Your placement command center', icon: LayoutDashboard },
      { to: '/daily-plan', label: 'Daily plan', description: 'Build a focused plan for today', icon: CalendarDays },
      { to: '/tasks', label: 'Task tracker', description: 'Organize and complete your work', icon: ListChecks },
      { to: '/analytics', label: 'Analytics', description: 'Understand your progress', icon: BarChart3 },
    ],
  },
  {
    label: 'Practice',
    items: [
      { to: '/dsa', label: 'DSA roadmap', description: 'Master every core pattern', icon: Code2 },
      { to: '/leetcode', label: 'Coding tracker', description: 'Track coding problem progress', icon: Terminal },
      { to: '/code-war-room', label: 'Code War Room', shortLabel: 'War Room', description: 'Practice hardcoded coding battles', icon: Swords },
      { to: '/game-arena', label: 'Game Arena', shortLabel: 'Arena', description: 'Aptitude games and full simulations', icon: Gamepad2, matchPrefix: '/game-arena' },
      { to: '/aptitude', label: 'Aptitude', description: 'Quant, logic, and verbal practice', icon: BookOpen, matchPrefix: '/aptitude' },
      { to: '/timer', label: 'Focus timer', description: 'Log deep work sessions', icon: Timer },
      { to: '/habits', label: 'Habits', description: 'Build placement-ready consistency', icon: CheckCircle2 },
    ],
  },
  {
    label: 'Career',
    items: [
      {
        to: '/company-readiness',
        label: 'Company prep',
        description: 'Target company roadmaps',
        icon: Building2,
        matchPrefix: '/company/',
      },
      { to: '/placements', label: 'Applications', description: 'Track every placement stage', icon: BriefcaseBusiness },
      { to: '/resume-builder', label: 'Resume builder', description: 'Create an ATS-ready résumé', icon: FileText },
      { to: '/mock-interview', label: 'Mock interview', description: 'Practice under real pressure', icon: Mic2 },
      { to: '/ai-chat', label: 'AI tutor', description: 'Learn with guided AI support', icon: Sparkles },
    ],
  },
];

export const UTILITY_NAV_ITEMS: ProductNavItem[] = [
  { to: '/calendar', label: 'Calendar', description: 'See plans and deadlines', icon: CalendarRange },
  { to: '/reflect', label: 'Reflection', description: 'Review and improve each day', icon: Lightbulb },
  { to: '/company-tasks', label: 'Task generator', description: 'Generate company-specific work', icon: Factory },
  { to: '/community', label: 'Community', description: 'Learn from placement experiences', icon: Users },
  { to: '/profile', label: 'Profile & settings', description: 'Personalize your workspace', icon: UserRound },
  { to: '/support-us', label: 'Support PrepTrack', description: 'Help keep PrepTrack accessible', icon: Heart },
];

export const ALL_NAV_ITEMS = [
  ...NAVIGATION_SECTIONS.flatMap((section) => section.items),
  ...UTILITY_NAV_ITEMS,
];

export function isNavItemActive(pathname: string, item: ProductNavItem) {
  if (item.to === '/') return pathname === '/';
  return pathname === item.to || Boolean(item.matchPrefix && pathname.startsWith(item.matchPrefix));
}
