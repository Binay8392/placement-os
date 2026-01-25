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
  Lightbulb,
  MoreHorizontal,
  LogOut
} from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useState } from 'react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/timer', icon: Timer, label: 'Timer' },
  { to: '/habits', icon: CheckCircle2, label: 'Habits' },
  { to: '/dsa', icon: Code2, label: 'DSA' },
];

const moreNavItems = [
  { to: '/aptitude', icon: BookOpen, label: 'Aptitude' },
  { to: '/placements', icon: Briefcase, label: 'Placements' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/reflect', icon: Lightbulb, label: 'Reflect' },
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, signOut } = useFirebaseAuth();
  const isMoreActive = moreNavItems.some(item => location.pathname === item.to);

  // Don't show nav on auth page
  if (location.pathname === '/auth') {
    return null;
  }

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
          
          {/* More Menu */}
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <button
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200",
                  isMoreActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-xl transition-all duration-200",
                  isMoreActive && "gradient-primary shadow-glow"
                )}>
                  <MoreHorizontal className={cn(
                    "w-5 h-5 transition-all",
                    isMoreActive && "text-primary-foreground"
                  )} />
                </div>
                <span className="text-[10px] font-medium">More</span>
              </button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>More Features</DrawerTitle>
              </DrawerHeader>
              <div className="p-4 pb-4 grid grid-cols-3 gap-4">
                {moreNavItems.map(({ to, icon: Icon, label }) => {
                  const isActive = location.pathname === to;
                  return (
                    <RouterNavLink
                      key={to}
                      to={to}
                      onClick={() => setDrawerOpen(false)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200",
                        isActive 
                          ? "bg-primary/10 text-primary" 
                          : "bg-muted/50 text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-xs font-medium">{label}</span>
                    </RouterNavLink>
                  );
                })}
              </div>
              {user && (
                <div className="px-4 pb-8 pt-2 border-t border-border">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-center text-muted-foreground"
                    onClick={() => {
                      signOut();
                      setDrawerOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              )}
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </nav>
  );
}

export function DesktopSidebar() {
  const location = useLocation();
  const { user, signOut } = useFirebaseAuth();

  // Don't show sidebar on auth page
  if (location.pathname === '/auth') {
    return null;
  }

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-border bg-sidebar p-4">
      <div className="mb-8">
        <Logo size="md" showTagline />
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
      
      <div className="pt-4 border-t border-border space-y-3">
        {user && (
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={signOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        )}
        <p className="text-xs text-muted-foreground text-center">
          Stay focused. Stay consistent.
        </p>
      </div>
    </aside>
  );
}
