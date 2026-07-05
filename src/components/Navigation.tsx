import {
  ChevronRight,
  LogOut,
  MoreHorizontal,
} from 'lucide-react';
import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Logo } from '@/components/Logo';
import {
  NAVIGATION_SECTIONS,
  UTILITY_NAV_ITEMS,
  isNavItemActive,
  type ProductNavItem,
} from '@/config/navigation';

const bottomItems = [
  NAVIGATION_SECTIONS[0].items[0],
  NAVIGATION_SECTIONS[0].items[1],
  NAVIGATION_SECTIONS[1].items[0],
  NAVIGATION_SECTIONS[2].items[1],
];

const mobileMoreItems = [
  ...NAVIGATION_SECTIONS.flatMap((section) => section.items).filter(
    (item) => !bottomItems.some((bottomItem) => bottomItem.to === item.to),
  ),
  ...UTILITY_NAV_ITEMS,
];

function SidebarNavItem({ item }: { item: ProductNavItem }) {
  const location = useLocation();
  const active = isNavItemActive(location.pathname, item);
  const Icon = item.icon;

  return (
    <RouterNavLink
      to={item.to}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
      )}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={active ? 2.25 : 1.8} />
      <span className="truncate">{item.label}</span>
      {active && <span className="absolute inset-y-2 -left-4 w-0.5 rounded-full bg-primary" />}
    </RouterNavLink>
  );
}

export function DesktopSidebar() {
  const { user, signOut } = useFirebaseAuth();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-[272px] flex-col border-r border-border/70 bg-sidebar/95 backdrop-blur-xl md:flex">
      <div className="flex h-16 items-center border-b border-border/70 px-5">
        <Logo size="md" className="min-w-0 flex-1" />
        <Badge variant="secondary" className="ml-2 px-2 py-0.5 text-[9px] font-bold tracking-[0.15em]">
          OS
        </Badge>
      </div>

      <nav className="no-scrollbar flex-1 overflow-y-auto px-4 py-5" aria-label="Primary navigation">
        <div className="space-y-6">
          {NAVIGATION_SECTIONS.map((section) => (
            <section key={section.label}>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
                {section.label}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => <SidebarNavItem key={item.to} item={item} />)}
              </div>
            </section>
          ))}
        </div>
      </nav>

      <div className="border-t border-border/70 p-4">
        <RouterNavLink
          to="/profile"
          className="group mb-2 flex items-center gap-3 rounded-xl border border-border/70 bg-card/60 p-3 transition-colors hover:bg-muted/60"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10 text-sm font-semibold text-primary">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="h-full w-full object-cover" />
            ) : (
              user?.displayName?.charAt(0).toUpperCase() || 'P'
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.displayName || 'PrepTrack learner'}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email || 'View your profile'}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </RouterNavLink>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={() => void signOut()}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}

export function BottomNav() {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, signOut } = useFirebaseAuth();
  const isMoreActive = mobileMoreItems.some((item) => isNavItemActive(location.pathname, item));

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/92 backdrop-blur-xl md:hidden" aria-label="Mobile navigation">
      <div className="safe-bottom grid grid-cols-5 px-1 py-1.5">
        {bottomItems.map((item) => {
          const active = isNavItemActive(location.pathname, item);
          const Icon = item.icon;
          return (
            <RouterNavLink
              key={item.to}
              to={item.to}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg px-1 text-[10px] font-medium transition-colors',
                active ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
              <span>{item.shortLabel || item.label}</span>
            </RouterNavLink>
          );
        })}

        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                'h-auto min-h-12 flex-col gap-1 rounded-lg px-1 py-0 text-[10px] hover:bg-transparent',
                isMoreActive ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              <MoreHorizontal className="h-5 w-5" />
              More
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[82vh]">
            <DrawerHeader className="border-b border-border text-left">
              <DrawerTitle>All PrepTrack tools</DrawerTitle>
            </DrawerHeader>
            <div className="no-scrollbar grid grid-cols-3 gap-2 overflow-y-auto p-4 pb-6">
              {mobileMoreItems.map((item) => {
                const active = isNavItemActive(location.pathname, item);
                const Icon = item.icon;
                return (
                  <RouterNavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setDrawerOpen(false)}
                    className={cn(
                      'flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border p-3 text-center transition-colors',
                      active
                        ? 'border-primary/30 bg-primary/10 text-primary'
                        : 'border-border bg-card text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium leading-tight">{item.label}</span>
                  </RouterNavLink>
                );
              })}
            </div>
            {user && (
              <div className="border-t border-border px-4 py-3">
                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground"
                  onClick={() => {
                    void signOut();
                    setDrawerOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </div>
            )}
          </DrawerContent>
        </Drawer>
      </div>
    </nav>
  );
}
