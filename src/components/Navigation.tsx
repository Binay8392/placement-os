import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Timer, 
  CheckCircle2, 
  Code2, 
  User,
  BookOpen,
  Briefcase,
  Calendar,
  BarChart3,
  Lightbulb
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/timer', icon: Timer, label: 'Timer' },
  { to: '/habits', icon: CheckCircle2, label: 'Habits' },
  { to: '/dsa', icon: Code2, label: 'DSA' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const allNavItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/timer', icon: Timer, label: 'Study Timer' },
  { to: '/habits', icon: CheckCircle2, label: 'Habits' },
  { to: '/dsa', icon: Code2, label: 'DSA Prep' },
  { to: '/aptitude', icon: BookOpen, label: 'Aptitude' },
  { to: '/placements', icon: Briefcase, label: 'Placements' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/reflect', icon: Lightbulb, label: 'Reflect' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="glass-card border-t border-border safe-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to;
            return (
              <RouterNavLink
                key={to}
                to={to}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-xl transition-all duration-200",
                  isActive && "gradient-primary shadow-glow"
                )}>
                  <Icon className={cn(
                    "w-5 h-5 transition-all",
                    isActive && "text-primary-foreground"
                  )} />
                </div>
                <span className="text-[10px] font-medium">{label}</span>
              </RouterNavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export function DesktopSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-border bg-sidebar p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gradient">PrepTrack OS</h1>
        <p className="text-xs text-muted-foreground mt-1">Personal Placement System</p>
      </div>
      
      <nav className="flex-1 space-y-1">
        {allNavItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <RouterNavLink
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-all",
                isActive && "text-primary"
              )} />
              <span className="text-sm font-medium">{label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full gradient-primary" />
              )}
            </RouterNavLink>
          );
        })}
      </nav>
      
      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Stay focused. Stay consistent.
        </p>
      </div>
    </aside>
  );
}
