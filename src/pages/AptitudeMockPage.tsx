import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Building2, ArrowLeft, ArrowRight, Clock, Target, Play, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MOCK_CONFIGS, COMPANY_SIM_CONFIGS, SECTION_CONFIG } from '@/features/aptitude/config';
import type { AptitudeSection } from '@/features/aptitude/types';

export default function AptitudeMockPage() {
  const navigate = useNavigate();
  const [selectedMock, setSelectedMock] = useState<string>('full-aptitude');
  const [questionCount, setQuestionCount] = useState<number>(30);

  const mockConfig = MOCK_CONFIGS.find((m) => m.id === selectedMock) ?? MOCK_CONFIGS[6];

  const handleStartMock = (mockId: string, countOverride?: number) => {
    const finalCount = countOverride ?? questionCount;
    // Map mock setup to first available topic or section practice in assessment mode
    // We navigate to practice with assessment mode
    if (mockId.endsWith('-style')) {
      const sim = COMPANY_SIM_CONFIGS.find((s) => s.id === mockId);
      const firstTopic = sim?.focus[0] ?? 'number-system';
      navigate(`/aptitude/practice/${firstTopic}?count=${sim?.questions ?? 30}&mode=assessment&time=${sim?.timeMinutes ?? 45}`);
    } else {
      const mock = MOCK_CONFIGS.find((m) => m.id === mockId) ?? mockConfig;
      const targetTopic = mock.sections.includes('quantitative') ? 'number-system' : mock.sections.includes('logical') ? 'number-series' : 'vocabulary';
      navigate(`/aptitude/practice/${targetTopic}?count=${finalCount}&mode=assessment&time=${Math.round(finalCount * 1.5)}`);
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 safe-top border-b border-border">
        <div className="max-w-[900px] mx-auto">
          <Button variant="ghost" size="sm" className="-ml-2 mb-3" onClick={() => navigate('/aptitude')}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Aptitude Arena
          </Button>
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-warning" /> Mock Tests & Placement Simulations
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">Simulate real campus placement timed assessments in strict exam mode</p>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 py-6 space-y-8">
        {/* Standard Mock Selector */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" /> Standard Aptitude Mocks
          </h2>

          <div className="grid gap-3 sm:grid-cols-2">
            {MOCK_CONFIGS.map((mock) => {
              const isSelected = selectedMock === mock.id;
              return (
                <div
                  key={mock.id}
                  onClick={() => setSelectedMock(mock.id)}
                  className={cn(
                    'bg-card border rounded-2xl p-4 cursor-pointer transition-all flex flex-col justify-between space-y-3',
                    isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:border-primary/40'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm md:text-base">{mock.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {mock.sections.map((s: AptitudeSection) => SECTION_CONFIG[s].shortLabel).join(' + ')}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold rounded-lg bg-muted px-2 py-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {mock.timeMinutes}m
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                    <span className="text-muted-foreground">{mock.questions} Questions</span>
                    <Button
                      size="sm"
                      variant={isSelected ? 'default' : 'outline'}
                      className={cn('h-7 text-xs', isSelected ? 'gradient-primary' : '')}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartMock(mock.id, mock.questions);
                      }}
                    >
                      Start <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Custom Mock Configurator */}
        <section className="bg-card border border-border rounded-2xl p-5 md:p-6 space-y-4">
          <h3 className="font-bold text-sm md:text-base">Customize Mixed Aptitude Test</h3>
          <p className="text-xs text-muted-foreground">Select question count for {mockConfig.label}:</p>
          <div className="grid grid-cols-4 gap-2">
            {[10, 25, 50, 90].map((c) => (
              <button
                key={c}
                onClick={() => setQuestionCount(c)}
                className={cn(
                  'rounded-xl border p-3 text-center transition-all text-xs font-bold',
                  questionCount === c ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card hover:border-primary/30'
                )}
              >
                {c} Qs
              </button>
            ))}
          </div>
          <Button
            onClick={() => handleStartMock(selectedMock)}
            className="w-full gradient-primary"
            size="lg"
          >
            <Play className="h-4 w-4 mr-2" /> Launch Custom Assessment ({questionCount} Qs · {Math.round(questionCount * 1.5)} min)
          </Button>
        </section>

        {/* Company-style Simulations */}
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4 text-warning" /> Company-Style Simulations
            </h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-warning shrink-0" />
              PrepTrack original assessments matching common placement exam patterns.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {COMPANY_SIM_CONFIGS.map((sim) => (
              <div
                key={sim.id}
                className="bg-card border border-border rounded-2xl p-4 space-y-3 hover:border-warning/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="rounded-md bg-warning/10 text-warning px-2 py-0.5 text-[10px] font-bold uppercase">{sim.company}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                      <Clock className="h-3 w-3" /> {sim.timeMinutes}m
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm text-foreground">{sim.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{sim.questions} Questions · Timed Assessment</p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs hover:border-warning/50 hover:bg-warning/10 hover:text-warning"
                  onClick={() => handleStartMock(sim.id)}
                >
                  Start Simulation <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
