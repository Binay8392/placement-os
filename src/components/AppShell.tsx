import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, LogOut, Moon, Settings, Sun, UserRound } from 'lucide-react';
import { BottomNav, DesktopSidebar } from '@/components/Navigation';
import { ALL_NAV_ITEMS, isNavItemActive } from '@/config/navigation';
import { CommandPalette } from '@/components/CommandPalette';
import { FloatingChat } from '@/components/FloatingChat';
import { Logo } from '@/components/Logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useStore } from '@/lib/store';

function AppTopbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useFirebaseAuth();
  const { theme, toggleTheme } = useStore();
  const activeItem = ALL_NAV_ITEMS.find((item) => isNavItemActive(location.pathname, item));
  const pageTitle = activeItem?.label || (location.pathname.startsWith('/company/') ? 'Company workspace' : 'PrepTrack');
  const initials = user?.displayName
    ?.split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'PT';

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center border-b border-border/70 bg-background/85 px-4 backdrop-blur-xl sm:px-6">
      <div className="mr-4 flex min-w-0 items-center gap-3 md:hidden">
        <Logo size="sm" iconOnly />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{pageTitle}</p>
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">PrepTrack OS</p>
        </div>
      </div>

      <div className="hidden min-w-0 flex-1 md:block">
        <p className="truncate text-sm font-semibold">{pageTitle}</p>
        <p className="text-xs text-muted-foreground">Your placement workspace</p>
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <CommandPalette />

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          className="h-9 w-9 text-muted-foreground"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative hidden h-9 w-9 text-muted-foreground sm:inline-flex" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 p-2">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <div className="flex items-start gap-3 rounded-lg bg-muted/60 p-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />
              <div>
                <p className="text-sm font-medium">You’re all caught up</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  New reminders and placement updates will appear here.
                </p>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 rounded-lg px-1.5 sm:pr-2" aria-label="Open account menu">
              <Avatar className="h-7 w-7 rounded-md">
                <AvatarImage src={user?.photoURL || undefined} alt="" className="object-cover" />
                <AvatarFallback className="rounded-md bg-primary/10 text-[10px] font-semibold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden max-w-28 truncate text-xs font-medium lg:block">
                {user?.displayName || 'Learner'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <p className="font-medium">{user?.displayName || 'PrepTrack learner'}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => navigate('/profile')}>
              <UserRound className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => navigate('/profile')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => void signOut()} className="text-muted-foreground">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();

  if (location.pathname === '/auth') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main-content"
        className="fixed left-3 top-3 z-[100] -translate-y-20 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <DesktopSidebar />
      <div className="min-w-0 md:pl-[272px]">
        <AppTopbar />
        <main id="main-content" className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
      <FloatingChat />
      <BottomNav />
    </div>
  );
}
