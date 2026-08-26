import { useState, useMemo } from 'react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useDSAProgress } from '@/features/dsa/hooks/useDSAProgress';
import { useDSAContinueLearning } from '@/features/dsa/hooks/useDSAContinueLearning';
import { DSA_TOPICS, DSA_VIDEOS } from '@/features/dsa/data/dsaVideos';
import { DSAProgressOverview } from '@/features/dsa/components/DSAProgressOverview';
import { ContinueLearningCard } from '@/features/dsa/components/ContinueLearningCard';
import { DSATopicCard } from '@/features/dsa/components/DSATopicCard';
import { DSAVideoCard } from '@/features/dsa/components/DSAVideoCard';

import { useStore, DSATopic } from '@/lib/store';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  ChevronRight,
  Star,
  CheckCircle2,
  Clock,
  Circle,
  Video,
  ListChecks,
  Search,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const categoryLabels = {
  foundations: 'Foundations',
  core: 'Core Data Structures',
  advanced: 'Advanced Topics',
};

const statusConfig = {
  'not-started': { icon: Circle, color: 'text-muted-foreground', label: 'Not Started' },
  'in-progress': { icon: Clock, color: 'text-warning', label: 'In Progress' },
  mastered: { icon: CheckCircle2, color: 'text-success', label: 'Mastered' },
};

export default function DSAPage() {
  const { user } = useFirebaseAuth();
  const { allProgress, loading: progressLoading } = useDSAProgress(user?.uid);
  const {
    totalVideos,
    completedCount,
    inProgressCount,
    remainingCount,
    progressPercent,
    totalWatchedSeconds,
    continueVideo,
    continueProgress,
  } = useDSAContinueLearning(allProgress);

  // Search & Filter state for Video Roadmap
  const [activeTab, setActiveTab] = useState<'video-roadmap' | 'topic-checklist'>('video-roadmap');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'not_started' | 'in_progress' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'playlist' | 'incomplete' | 'completed'>('playlist');

  // Legacy Topic Checklist state
  const { dsaTopics, updateDSATopic } = useStore();
  const [expandedCategory, setExpandedCategory] = useState<string | null>('foundations');
  const [selectedTopic, setSelectedTopic] = useState<DSATopic | null>(null);

  // Grouped legacy topics
  const groupedLegacyTopics = {
    foundations: dsaTopics.filter((t) => t.category === 'foundations'),
    core: dsaTopics.filter((t) => t.category === 'core'),
    advanced: dsaTopics.filter((t) => t.category === 'advanced'),
  };
  const totalMasteredChecklist = dsaTopics.filter((t) => t.status === 'mastered').length;
  const totalInProgressChecklist = dsaTopics.filter((t) => t.status === 'in-progress').length;
  const overallChecklistProgress = dsaTopics.length > 0 ? (totalMasteredChecklist / dsaTopics.length) * 100 : 0;

  const handleUpdateTopic = (updates: Partial<DSATopic>) => {
    if (selectedTopic) {
      updateDSATopic(selectedTopic.id, updates);
      setSelectedTopic({ ...selectedTopic, ...updates });
    }
  };

  // Filtered & Sorted Videos for Video Roadmap
  const filteredVideos = useMemo(() => {
    return DSA_VIDEOS.filter((v) => {
      const prog = allProgress[v.id] || allProgress[v.videoId];
      const status = prog?.status || 'not_started';

      const matchesSearch =
        !searchQuery ||
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.tags && v.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesStatus = statusFilter === 'all' || status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || v.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    }).sort((a, b) => {
      const pA = allProgress[a.id] || allProgress[a.videoId];
      const pB = allProgress[b.id] || allProgress[b.videoId];
      const sA = pA?.status || 'not_started';
      const sB = pB?.status || 'not_started';

      if (sortBy === 'incomplete') {
        if (sA !== 'completed' && sB === 'completed') return -1;
        if (sA === 'completed' && sB !== 'completed') return 1;
      } else if (sortBy === 'completed') {
        if (sA === 'completed' && sB !== 'completed') return -1;
        if (sA !== 'completed' && sB === 'completed') return 1;
      }
      return a.order - b.order;
    });
  }, [searchQuery, statusFilter, categoryFilter, sortBy, allProgress]);

  return (
    <div className="min-h-screen pb-24 md:pb-12">
      <header className="px-4 pt-6 pb-4 safe-top max-w-[1400px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">DSA Preparation</h1>
          <p className="text-muted-foreground text-xs md:text-sm mt-0.5">
            Master Data Structures & Algorithms with structured video lectures & practice checklists
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-2 w-full sm:w-auto">
            <TabsTrigger value="video-roadmap" className="gap-1.5 text-xs">
              <Video className="h-3.5 w-3.5" /> Video Roadmap
            </TabsTrigger>
            <TabsTrigger value="topic-checklist" className="gap-1.5 text-xs">
              <ListChecks className="h-3.5 w-3.5" /> Topic Checklist
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      <main className="px-4 max-w-[1400px] mx-auto space-y-6">
        {/* TAB 1: VIDEO ROADMAP */}
        {activeTab === 'video-roadmap' && (
          <div className="space-y-6">
            {/* Overview Card */}
            <DSAProgressOverview
              completedCount={completedCount}
              totalVideos={totalVideos}
              inProgressCount={inProgressCount}
              remainingCount={remainingCount}
              progressPercent={progressPercent}
              totalWatchedSeconds={totalWatchedSeconds}
            />

            {/* Continue Learning Hero Card */}
            <ContinueLearningCard
              continueVideo={continueVideo}
              progress={continueProgress}
            />

            {/* Search & Filter Bar */}
            <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search DSA lectures..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 text-xs"
                  />
                </div>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Status: All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Status: All Videos</SelectItem>
                    <SelectItem value="not_started">Status: Not Started</SelectItem>
                    <SelectItem value="in_progress">Status: In Progress</SelectItem>
                    <SelectItem value="completed">Status: Completed</SelectItem>
                  </SelectContent>
                </Select>

                {/* Category Filter */}
                <Select value={categoryFilter} onValueChange={(v: any) => setCategoryFilter(v)}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Category: All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Category: All Modules</SelectItem>
                    <SelectItem value="foundations">Category: Foundations</SelectItem>
                    <SelectItem value="core">Category: Core DSA</SelectItem>
                    <SelectItem value="advanced">Category: Advanced DSA</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sorting */}
                <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Sort: Playlist Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="playlist">Sort: Playlist Order</SelectItem>
                    <SelectItem value="incomplete">Sort: Incomplete First</SelectItem>
                    <SelectItem value="completed">Sort: Completed First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Topic Sections / Filtered Video Grid */}
            {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' ? (
              /* Search / Filter View */
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground font-medium">
                  Found {filteredVideos.length} lecture{filteredVideos.length !== 1 ? 's' : ''}
                </p>
                <div className="space-y-2">
                  {filteredVideos.length === 0 ? (
                    <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground text-sm">
                      No lecture videos match your current filter settings.
                    </div>
                  ) : (
                    filteredVideos.map((video) => (
                      <DSAVideoCard
                        key={video.id}
                        video={video}
                        progress={allProgress[video.id] || allProgress[video.videoId]}
                      />
                    ))
                  )}
                </div>
              </div>
            ) : (
              /* Structured Roadmap View grouped by Topics */
              <div className="space-y-4">
                {DSA_TOPICS.map((topic, idx) => {
                  const topicVideos = DSA_VIDEOS.filter((v) => v.topicId === topic.id);
                  return (
                    <DSATopicCard
                      key={topic.id}
                      topic={topic}
                      videos={topicVideos}
                      allProgress={allProgress}
                      defaultExpanded={idx === 0}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TOPIC CHECKLIST (LEGACY) */}
        {activeTab === 'topic-checklist' && (
          <div className="space-y-6">
            {/* Progress Overview */}
            <section className="bg-card border border-border rounded-2xl p-4 md:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl md:text-3xl font-bold">{Math.round(overallChecklistProgress)}%</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Overall Topic Checklist Mastery</p>
                </div>
                <div className="text-right">
                  <p className="text-xs md:text-sm">
                    <span className="text-success font-semibold">{totalMasteredChecklist}</span>
                    <span className="text-muted-foreground"> mastered</span>
                  </p>
                  <p className="text-xs md:text-sm">
                    <span className="text-warning font-semibold">{totalInProgressChecklist}</span>
                    <span className="text-muted-foreground"> in progress</span>
                  </p>
                </div>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full gradient-primary rounded-full transition-all duration-500"
                  style={{ width: `${overallChecklistProgress}%` }}
                />
              </div>
            </section>

            {/* Topics by Category */}
            <section className="space-y-3">
              {(Object.keys(groupedLegacyTopics) as Array<keyof typeof groupedLegacyTopics>).map(
                (category) => {
                  const topics = groupedLegacyTopics[category];
                  const isExpanded = expandedCategory === category;
                  const categoryMastered = topics.filter((t) => t.status === 'mastered').length;

                  return (
                    <div key={category} className="bg-card border border-border rounded-2xl overflow-hidden">
                      <button
                        onClick={() => setExpandedCategory(isExpanded ? null : category)}
                        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          )}
                          <span className="font-semibold text-sm md:text-base">{categoryLabels[category]}</span>
                        </div>
                        <span className="text-xs md:text-sm text-muted-foreground">
                          {categoryMastered}/{topics.length} Mastered
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-border">
                          {topics.map((topic) => {
                            const StatusIcon = statusConfig[topic.status].icon;
                            return (
                              <button
                                key={topic.id}
                                onClick={() => setSelectedTopic(topic)}
                                className="w-full flex items-center gap-3 p-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors text-left"
                              >
                                <StatusIcon className={cn('w-5 h-5 shrink-0', statusConfig[topic.status].color)} />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate">{topic.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {topic.questionsSolved} questions solved
                                  </p>
                                </div>
                                <div className="flex items-center gap-0.5 shrink-0">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={cn(
                                        'w-3 h-3',
                                        star <= topic.confidence
                                          ? 'text-warning fill-warning'
                                          : 'text-muted-foreground/30'
                                      )}
                                    />
                                  ))}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </section>
          </div>
        )}
      </main>

      {/* Topic Detail Dialog (Legacy Checklist) */}
      <Dialog open={!!selectedTopic} onOpenChange={() => setSelectedTopic(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedTopic?.name}</DialogTitle>
          </DialogHeader>

          {selectedTopic && (
            <div className="space-y-4 pt-2">
              {/* Status */}
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Status</label>
                <Select
                  value={selectedTopic.status}
                  onValueChange={(value: DSATopic['status']) => handleUpdateTopic({ status: value })}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="mastered">Mastered</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Questions Solved */}
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Questions Solved</label>
                <Input
                  type="number"
                  min={0}
                  value={selectedTopic.questionsSolved}
                  onChange={(e) => handleUpdateTopic({ questionsSolved: parseInt(e.target.value) || 0 })}
                  className="text-xs"
                />
              </div>

              {/* Confidence */}
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
                  Confidence Level ({selectedTopic.confidence}/5)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => handleUpdateTopic({ confidence: level })}
                      className="p-2 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={cn(
                          'w-6 h-6',
                          level <= selectedTopic.confidence
                            ? 'text-warning fill-warning'
                            : 'text-muted-foreground/30'
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Notes</label>
                <Textarea
                  placeholder="Add your notes here..."
                  value={selectedTopic.notes}
                  onChange={(e) => handleUpdateTopic({ notes: e.target.value })}
                  rows={4}
                  className="text-xs"
                />
              </div>

              <Button onClick={() => setSelectedTopic(null)} className="w-full gradient-primary">
                Save & Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
