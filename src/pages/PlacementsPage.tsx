import { useState } from 'react';
import { useStore, PlacementApplication, ApplicationStatus, ApplicationResult } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar,
  FileText,
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Trash2,
  Edit,
  Briefcase,
  GraduationCap,
  Mail,
  Send
} from 'lucide-react';
import { format, isAfter, parseISO } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const statusSteps: { key: ApplicationStatus; label: string; icon: React.ElementType }[] = [
  { key: 'applied', label: 'Applied', icon: FileText },
  { key: 'oa', label: 'Online Assessment', icon: Clock },
  { key: 'interview', label: 'Interview', icon: Calendar },
  { key: 'result', label: 'Result', icon: CheckCircle2 },
];

const resultColors: Record<ApplicationResult, string> = {
  pending: 'bg-muted text-muted-foreground',
  selected: 'bg-green-500/20 text-green-400 border-green-500/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
  waitlisted: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

const resultIcons: Record<ApplicationResult, React.ElementType> = {
  pending: Clock,
  selected: CheckCircle2,
  rejected: XCircle,
  waitlisted: AlertCircle,
};

function StatusTimeline({ application }: { application: PlacementApplication }) {
  const statusIndex = statusSteps.findIndex(s => s.key === application.status);
  
  return (
    <div className="flex items-center gap-1 mt-3">
      {statusSteps.map((step, index) => {
        const isCompleted = index <= statusIndex;
        const isCurrent = index === statusIndex;
        const Icon = step.icon;
        
        return (
          <div key={step.key} className="flex items-center flex-1">
            <div className={`
              flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all
              ${isCompleted 
                ? 'bg-primary border-primary text-primary-foreground' 
                : 'border-muted bg-background text-muted-foreground'}
              ${isCurrent ? 'ring-2 ring-primary/30 ring-offset-2 ring-offset-background' : ''}
            `}>
              <Icon className="w-4 h-4" />
            </div>
            {index < statusSteps.length - 1 && (
              <div className={`
                flex-1 h-0.5 mx-1
                ${index < statusIndex ? 'bg-primary' : 'bg-muted'}
              `} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function CompanyCard({ application, onEdit, onSendReminder }: { 
  application: PlacementApplication; 
  onEdit: () => void;
  onSendReminder: (app: PlacementApplication, type: 'interview' | 'followup') => void;
}) {
  const { deleteApplication } = useStore();
  const ResultIcon = resultIcons[application.result];
  
  const hasUpcomingReminder = application.reminderDate && 
    isAfter(parseISO(application.reminderDate), new Date());
  
  const hasUpcomingInterview = application.interviewDate && 
    isAfter(parseISO(application.interviewDate), new Date());

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/30">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{application.company}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <span>{application.role}</span>
                <Badge variant="outline" className="text-xs">
                  {application.type === 'placement' ? <Briefcase className="w-3 h-3 mr-1" /> : <GraduationCap className="w-3 h-3 mr-1" />}
                  {application.type}
                </Badge>
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasUpcomingReminder && (
              <Bell className="w-4 h-4 text-yellow-400 animate-pulse" />
            )}
            <Badge className={`${resultColors[application.result]} border`}>
              <ResultIcon className="w-3 h-3 mr-1" />
              {application.result}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <StatusTimeline application={application} />
        
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          {application.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{application.location}</span>
            </div>
          )}
          {application.ctc && (
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" />
              <span>{application.ctc}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 col-span-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Applied: {format(parseISO(application.appliedDate), 'MMM d, yyyy')}</span>
          </div>
        </div>
        
        {application.notes && (
          <p className="mt-3 text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg line-clamp-2">
            {application.notes}
          </p>
        )}
        
        {application.reminderDate && (
          <div className="mt-3 flex items-center gap-2 text-sm text-yellow-400 bg-yellow-500/10 px-3 py-1.5 rounded-lg">
            <Bell className="w-4 h-4" />
            <span>Reminder: {format(parseISO(application.reminderDate), 'MMM d, yyyy')}</span>
          </div>
        )}
        
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" onClick={onEdit} className="flex-1">
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          {(hasUpcomingInterview || hasUpcomingReminder) && (
            <Button 
              variant="outline" 
              size="sm"
              className="text-primary hover:text-primary"
              onClick={() => onSendReminder(
                application, 
                hasUpcomingInterview ? 'interview' : 'followup'
              )}
            >
              <Mail className="w-4 h-4" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-destructive hover:text-destructive"
            onClick={() => {
              deleteApplication(application.id);
              toast({ title: "Application deleted" });
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ApplicationForm({ 
  application, 
  onClose 
}: { 
  application?: PlacementApplication; 
  onClose: () => void;
}) {
  const { addApplication, updateApplication } = useStore();
  const isEditing = !!application;
  
  const [formData, setFormData] = useState({
    company: application?.company || '',
    role: application?.role || '',
    type: application?.type || 'placement' as 'placement' | 'internship',
    status: application?.status || 'applied' as ApplicationStatus,
    result: application?.result || 'pending' as ApplicationResult,
    appliedDate: application?.appliedDate || new Date().toISOString().split('T')[0],
    oaDate: application?.oaDate || '',
    interviewDate: application?.interviewDate || '',
    resultDate: application?.resultDate || '',
    notes: application?.notes || '',
    reminderDate: application?.reminderDate || '',
    ctc: application?.ctc || '',
    location: application?.location || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company.trim() || !formData.role.trim()) {
      toast({ title: "Please fill in company and role", variant: "destructive" });
      return;
    }

    const appData = {
      company: formData.company.trim(),
      role: formData.role.trim(),
      type: formData.type,
      status: formData.status,
      result: formData.result,
      appliedDate: formData.appliedDate,
      oaDate: formData.oaDate || undefined,
      interviewDate: formData.interviewDate || undefined,
      resultDate: formData.resultDate || undefined,
      notes: formData.notes.trim(),
      reminderDate: formData.reminderDate || undefined,
      ctc: formData.ctc.trim() || undefined,
      location: formData.location.trim() || undefined,
    };

    if (isEditing && application) {
      updateApplication(application.id, appData);
      toast({ title: "Application updated!" });
    } else {
      addApplication(appData);
      toast({ title: "Application added!" });
    }
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company">Company *</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="e.g., Google"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role *</Label>
          <Input
            id="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            placeholder="e.g., SDE Intern"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as 'placement' | 'internship' })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="placement">Placement</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as ApplicationStatus })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="oa">Online Assessment</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="result">Result</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Result</Label>
          <Select value={formData.result} onValueChange={(v) => setFormData({ ...formData, result: v as ApplicationResult })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="selected">Selected</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="waitlisted">Waitlisted</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="appliedDate">Applied Date</Label>
          <Input
            id="appliedDate"
            type="date"
            value={formData.appliedDate}
            onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ctc">CTC / Stipend</Label>
          <Input
            id="ctc"
            value={formData.ctc}
            onChange={(e) => setFormData({ ...formData, ctc: e.target.value })}
            placeholder="e.g., 12 LPA"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g., Bangalore"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reminderDate">Follow-up Reminder</Label>
        <Input
          id="reminderDate"
          type="date"
          value={formData.reminderDate}
          onChange={(e) => setFormData({ ...formData, reminderDate: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Add any notes about this application..."
          rows={3}
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">{isEditing ? 'Update' : 'Add'} Application</Button>
      </DialogFooter>
    </form>
  );
}

export default function PlacementsPage() {
  const { applications, profile } = useStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<PlacementApplication | undefined>();
  const [filter, setFilter] = useState<'all' | 'placement' | 'internship'>('all');
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailData, setEmailData] = useState<{ app: PlacementApplication; type: 'interview' | 'followup' } | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  const filteredApps = applications.filter(app => 
    filter === 'all' || app.type === filter
  );

  const stats = {
    total: applications.length,
    inProgress: applications.filter(a => a.result === 'pending').length,
    selected: applications.filter(a => a.result === 'selected').length,
    rejected: applications.filter(a => a.result === 'rejected').length,
  };

  const upcomingReminders = applications
    .filter(a => a.reminderDate && isAfter(parseISO(a.reminderDate), new Date()))
    .sort((a, b) => parseISO(a.reminderDate!).getTime() - parseISO(b.reminderDate!).getTime())
    .slice(0, 3);

  const handleOpenDialog = (app?: PlacementApplication) => {
    setEditingApp(app);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingApp(undefined);
    setDialogOpen(false);
  };

  const handleSendReminder = (app: PlacementApplication, type: 'interview' | 'followup') => {
    setEmailData({ app, type });
    setEmailDialogOpen(true);
  };

  const sendEmailReminder = async () => {
    if (!emailData || !userEmail.trim()) {
      toast({ title: "Please enter your email", variant: "destructive" });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail.trim())) {
      toast({ title: "Please enter a valid email", variant: "destructive" });
      return;
    }

    setIsSending(true);
    try {
      const date = emailData.type === 'interview' 
        ? emailData.app.interviewDate 
        : emailData.app.reminderDate;

      const { data, error } = await supabase.functions.invoke('send-reminder', {
        body: {
          email: userEmail.trim(),
          company: emailData.app.company,
          role: emailData.app.role,
          type: emailData.type,
          date: date ? format(parseISO(date), 'MMMM d, yyyy') : 'TBD',
          notes: emailData.app.notes,
        },
      });

      if (error) throw error;

      toast({ title: "Reminder email sent!", description: `Email sent to ${userEmail}` });
      setEmailDialogOpen(false);
      setUserEmail('');
      setEmailData(null);
    } catch (error: any) {
      console.error('Error sending reminder:', error);
      toast({ 
        title: "Failed to send email", 
        description: error.message || "Please try again later",
        variant: "destructive" 
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:ml-64">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gradient">Placement Tracker</h1>
            <p className="text-sm text-muted-foreground mt-1">Track your applications and interviews</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Application
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingApp ? 'Edit' : 'Add'} Application</DialogTitle>
                <DialogDescription>
                  {editingApp ? 'Update your application details' : 'Track a new job application'}
                </DialogDescription>
              </DialogHeader>
              <ApplicationForm application={editingApp} onClose={handleCloseDialog} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Applied</p>
                </div>
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.inProgress}</p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.selected}</p>
                  <p className="text-xs text-muted-foreground">Selected</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                  <p className="text-xs text-muted-foreground">Rejected</p>
                </div>
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Reminders */}
        {upcomingReminders.length > 0 && (
          <Card className="mb-6 border-yellow-500/30 bg-yellow-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="w-4 h-4 text-yellow-400" />
                Upcoming Follow-ups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {upcomingReminders.map(app => (
                  <div key={app.id} className="flex items-center justify-between text-sm">
                    <span>{app.company} - {app.role}</span>
                    <Badge variant="outline">{format(parseISO(app.reminderDate!), 'MMM d')}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filter Tabs & Applications */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
            <TabsTrigger value="placement">Placements</TabsTrigger>
            <TabsTrigger value="internship">Internships</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-0">
            {filteredApps.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No applications yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => handleOpenDialog()}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add your first application
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredApps.map(app => (
                  <CompanyCard 
                    key={app.id} 
                    application={app} 
                    onEdit={() => handleOpenDialog(app)}
                    onSendReminder={handleSendReminder}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Email Reminder Dialog */}
        <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" />
                Send Reminder Email
              </DialogTitle>
              <DialogDescription>
                Get a reminder email for {emailData?.app.company} - {emailData?.app.role}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reminderEmail">Your Email</Label>
                <Input
                  id="reminderEmail"
                  type="email"
                  placeholder="your@email.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
              </div>
              <div className="bg-muted/50 p-3 rounded-lg text-sm">
                <p className="font-medium mb-1">
                  {emailData?.type === 'interview' ? '🎯 Interview Reminder' : '📋 Follow-up Reminder'}
                </p>
                <p className="text-muted-foreground">
                  {emailData?.type === 'interview' 
                    ? `Interview scheduled for ${emailData?.app.interviewDate ? format(parseISO(emailData.app.interviewDate), 'MMMM d, yyyy') : 'TBD'}`
                    : `Follow up on ${emailData?.app.reminderDate ? format(parseISO(emailData.app.reminderDate), 'MMMM d, yyyy') : 'TBD'}`
                  }
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={sendEmailReminder} disabled={isSending} className="gradient-primary">
                {isSending ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
