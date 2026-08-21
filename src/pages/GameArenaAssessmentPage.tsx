import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Gamepad2,
  Keyboard,
  MonitorSmartphone,
  MousePointer2,
  Network,
  Play,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockProfiles } from '@/features/game-arena/config';
import { getArenaConfig, getActiveSession } from '@/features/game-arena/storage';
import { useNetworkStatus } from '@/features/game-arena/hooks/useNetworkStatus';

function checkBrowser() {
  if (typeof navigator === 'undefined') return 'Unknown browser';
  const agent = navigator.userAgent;
  if (agent.includes('Chrome')) return 'Chrome compatible';
  if (agent.includes('Safari')) return 'Safari compatible';
  if (agent.includes('Firefox')) return 'Firefox compatible';
  return 'Modern browser check';
}

export default function GameArenaAssessmentPage() {
  const navigate = useNavigate();
  const online = useNetworkStatus();
  const [profile, setProfile] = useState<string>(mockProfiles[1].id);
  const [config] = useState(() => getArenaConfig());
  const activeSession = useMemo(() => getActiveSession(), []);
  const checks = [
    {
      label: 'Screen size',
      value: typeof window === 'undefined' ? 'Ready' : `${window.innerWidth} x ${window.innerHeight}`,
      icon: MonitorSmartphone,
      pass: true,
    },
    { label: 'Browser compatibility', value: checkBrowser(), icon: ShieldCheck, pass: true },
    {
      label: 'Touch input',
      value: typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0 ? 'Available' : 'Not detected',
      icon: MousePointer2,
      pass: true,
    },
    { label: 'Keyboard input', value: 'Available', icon: Keyboard, pass: true },
    {
      label: 'Fullscreen recommendation',
      value: config.fullscreenRecommended ? 'Recommended' : 'Optional',
      icon: Smartphone,
      pass: true,
    },
    {
      label: 'Network status',
      value: online ? 'Online' : 'Offline recovery enabled',
      icon: Network,
      pass: true,
    },
  ];
  const selectedProfile = mockProfiles.find((item) => item.id === profile) || mockProfiles[1];

  return (
    <div className="dashboard-canvas min-h-full pb-24 md:pb-10">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-5 sm:px-6 sm:py-7">
        <Button asChild variant="ghost" className="min-h-10 px-0 text-muted-foreground hover:bg-transparent">
          <Link to="/game-arena">
            <ArrowLeft className="h-4 w-4" />
            Back to Game Arena
          </Link>
        </Button>

        <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <Card className="border-border/70 bg-card/90 shadow-sm">
            <CardHeader className="p-5 sm:p-7">
              <Badge variant="secondary" className="mb-3 w-fit rounded-lg bg-primary/10 text-primary">
                PrepTrack Simulation
              </Badge>
              <CardTitle className="text-2xl sm:text-3xl">Game-Based Assessment</CardTitle>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                You will complete multiple cognitive games in randomized order. This is an original PrepTrack practice simulation, not an official company assessment.
              </p>
            </CardHeader>
            <CardContent className="space-y-5 p-5 pt-0 sm:p-7 sm:pt-0">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  'Read instructions carefully',
                  'Each game has a time limit',
                  'Answers cannot be changed after submission',
                  'The assessment cannot be paused',
                  'Questions may vary in difficulty',
                  'Games may appear in random order',
                ].map((rule) => (
                  <div key={rule} className="flex items-start gap-2 rounded-xl border border-border bg-background/70 p-3 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>

              {activeSession && activeSession.status === 'in_progress' && new Date(activeSession.expiresAt).getTime() > Date.now() && (
                <div className="rounded-xl border border-warning/35 bg-warning/10 p-4">
                  <p className="text-sm font-medium text-warning">Assessment recovery available</p>
                  <p className="mt-1 text-xs text-muted-foreground">A previous in-progress session is preserved locally.</p>
                  <Button onClick={() => navigate('/game-arena/assessment/run?recover=1')} className="mt-3 min-h-11">
                    Resume Assessment
                  </Button>
                </div>
              )}

              <div className="rounded-xl border border-border bg-muted/25 p-4 text-sm text-muted-foreground">
                On mobile, rotate your phone to landscape for games that benefit from a wider workspace. Landscape is recommended, not required.
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/90 shadow-sm">
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-base">Assessment Setup</CardTitle>
              <p className="text-xs text-muted-foreground">Choose a simulation profile.</p>
            </CardHeader>
            <CardContent className="space-y-4 p-5 pt-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Profile</label>
                <Select value={profile} onValueChange={setProfile}>
                  <SelectTrigger className="min-h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProfiles.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-border bg-background/70 p-3">
                  <Gamepad2 className="mb-2 h-4 w-4 text-primary" />
                  <p className="font-mono text-lg font-semibold">{selectedProfile.games}</p>
                  <p className="text-xs text-muted-foreground">Games</p>
                </div>
                <div className="rounded-xl border border-border bg-background/70 p-3">
                  <Clock3 className="mb-2 h-4 w-4 text-primary" />
                  <p className="font-mono text-lg font-semibold">{selectedProfile.minutes}m</p>
                  <p className="text-xs text-muted-foreground">Duration</p>
                </div>
              </div>
              <Button onClick={() => navigate(`/game-arena/assessment/run?profile=${profile}`)} className="min-h-12 w-full">
                <Play className="h-4 w-4 fill-current" />
                Start Assessment
              </Button>
            </CardContent>
          </Card>
        </section>

        <Card className="border-border/70 bg-card/90 shadow-sm">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-base">Device Check</CardTitle>
            <p className="text-xs text-muted-foreground">Progress is preserved locally if the network drops.</p>
          </CardHeader>
          <CardContent className="grid gap-3 p-5 pt-2 sm:grid-cols-2 lg:grid-cols-3">
            {checks.map((check) => {
              const Icon = check.icon;
              return (
                <div key={check.label} className="flex items-start gap-3 rounded-xl border border-border bg-background/70 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{check.label}</p>
                    <p className="text-xs text-muted-foreground">{check.value}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
