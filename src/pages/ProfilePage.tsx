import { useStore, Resource } from '@/lib/store';
import { User, Target, Building2, Moon, Sun, FileText, Plus, ExternalLink, Trash2, Edit, Link2, Video, BookOpen, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

const categoryIcons: Record<Resource['category'], React.ElementType> = {
  notes: FileText,
  pdf: File,
  video: Video,
  article: BookOpen,
  other: Link2,
};

const categoryColors: Record<Resource['category'], string> = {
  notes: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  pdf: 'bg-red-500/10 text-red-400 border-red-500/30',
  video: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  article: 'bg-green-500/10 text-green-400 border-green-500/30',
  other: 'bg-muted text-muted-foreground',
};

function ResourceForm({ 
  resource, 
  onClose 
}: { 
  resource?: Resource; 
  onClose: () => void;
}) {
  const { addResource, updateResource } = useStore();
  const isEditing = !!resource;
  
  const [formData, setFormData] = useState({
    title: resource?.title || '',
    link: resource?.link || '',
    category: resource?.category || 'pdf' as Resource['category'],
    subject: resource?.subject || '',
    description: resource?.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.link.trim()) {
      toast({ title: "Please fill in title and link", variant: "destructive" });
      return;
    }

    // Basic URL validation
    try {
      new URL(formData.link);
    } catch {
      toast({ title: "Please enter a valid URL", variant: "destructive" });
      return;
    }

    const resourceData = {
      title: formData.title.trim(),
      link: formData.link.trim(),
      category: formData.category,
      subject: formData.subject.trim() || undefined,
      description: formData.description.trim() || undefined,
    };

    if (isEditing && resource) {
      updateResource(resource.id, resourceData);
      toast({ title: "Resource updated!" });
    } else {
      addResource(resourceData);
      toast({ title: "Resource added!" });
    }
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., DSA Notes - Arrays"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="link">Link (Drive/PDF URL) *</Label>
        <Input
          id="link"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          placeholder="https://drive.google.com/..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v as Resource['category'] })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="notes">Notes</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="e.g., DSA, Aptitude"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of this resource..."
          rows={2}
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">{isEditing ? 'Update' : 'Add'} Resource</Button>
      </DialogFooter>
    </form>
  );
}

function ResourceCard({ resource, onEdit }: { resource: Resource; onEdit: () => void }) {
  const { deleteResource } = useStore();
  const CategoryIcon = categoryIcons[resource.category];

  return (
    <Card className="hover:shadow-md transition-all duration-200 hover:border-primary/30">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`p-2 rounded-lg ${categoryColors[resource.category]} border`}>
              <CategoryIcon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{resource.title}</h4>
              <div className="flex items-center gap-2 mt-1">
                {resource.subject && (
                  <Badge variant="outline" className="text-xs">{resource.subject}</Badge>
                )}
                <span className="text-xs text-muted-foreground capitalize">{resource.category}</span>
              </div>
              {resource.description && (
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{resource.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => window.open(resource.link, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onEdit}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => {
                deleteResource(resource.id);
                toast({ title: "Resource deleted" });
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProfilePage() {
  const { profile, updateProfile, theme, toggleTheme, resources } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [resourceDialogOpen, setResourceDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | undefined>();
  const [resourceFilter, setResourceFilter] = useState<'all' | Resource['category']>('all');

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleOpenResourceDialog = (resource?: Resource) => {
    setEditingResource(resource);
    setResourceDialogOpen(true);
  };

  const handleCloseResourceDialog = () => {
    setEditingResource(undefined);
    setResourceDialogOpen(false);
  };

  const filteredResources = resources.filter(r => 
    resourceFilter === 'all' || r.category === resourceFilter
  );

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:ml-64">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gradient">Profile</h1>
          <p className="text-muted-foreground text-sm">Your career journey & resources</p>
        </header>

        <main className="space-y-6">
          {/* Avatar & Name */}
          <section className="flex flex-col items-center py-6">
            <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-3xl font-bold mb-4">
              {profile.name.charAt(0)}
            </div>
            {!isEditing ? (
              <>
                <h2 className="text-xl font-bold">{profile.name}</h2>
                <p className="text-muted-foreground text-sm">{profile.degree}</p>
                <p className="text-muted-foreground text-sm">Semester {profile.semester}</p>
              </>
            ) : (
              <div className="w-full max-w-md space-y-3 mt-2">
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full Name"
                />
                <Input
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="Degree"
                />
                <Input
                  type="number"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) || 1 })}
                  placeholder="Semester"
                  min={1}
                  max={8}
                />
              </div>
            )}
          </section>

          {/* Info Cards */}
          <section className="grid md:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold">Career Goals</h3>
              </div>
              {!isEditing ? (
                <p className="text-muted-foreground text-sm">{profile.careerGoals}</p>
              ) : (
                <Textarea
                  value={formData.careerGoals}
                  onChange={(e) => setFormData({ ...formData, careerGoals: e.target.value })}
                  placeholder="What's your career goal?"
                  rows={2}
                />
              )}
            </div>

            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-green-500/10">
                  <Building2 className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="font-semibold">Target Companies</h3>
              </div>
              {!isEditing ? (
                <div className="flex flex-wrap gap-2">
                  {profile.targetCompanies.map((company) => (
                    <span
                      key={company}
                      className="px-3 py-1 bg-muted rounded-full text-sm"
                    >
                      {company}
                    </span>
                  ))}
                </div>
              ) : (
                <Input
                  value={formData.targetCompanies.join(', ')}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    targetCompanies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                  })}
                  placeholder="Google, Microsoft, Amazon..."
                />
              )}
            </div>
          </section>

          {/* Theme Toggle */}
          <section className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-primary" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-500" />
                )}
                <div>
                  <p className="font-medium">Appearance</p>
                  <p className="text-sm text-muted-foreground">
                    {theme === 'dark' ? 'Dark mode' : 'Light mode'}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
              >
                Toggle
              </Button>
            </div>
          </section>

          {/* Edit Profile Button */}
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setFormData(profile);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 gradient-primary"
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setIsEditing(true)}
              >
                <User className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>

          {/* Resources Section */}
          <section className="pt-6 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  My Resources
                </h2>
                <p className="text-sm text-muted-foreground">Save your notes, PDFs & study materials</p>
              </div>
              <Dialog open={resourceDialogOpen} onOpenChange={setResourceDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleOpenResourceDialog()} size="sm" className="gradient-primary">
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingResource ? 'Edit' : 'Add'} Resource</DialogTitle>
                    <DialogDescription>
                      {editingResource ? 'Update your resource' : 'Add a new study resource link'}
                    </DialogDescription>
                  </DialogHeader>
                  <ResourceForm resource={editingResource} onClose={handleCloseResourceDialog} />
                </DialogContent>
              </Dialog>
            </div>

            {/* Resource Filters */}
            {resources.length > 0 && (
              <div className="flex gap-2 mb-4 flex-wrap">
                <Badge 
                  variant={resourceFilter === 'all' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setResourceFilter('all')}
                >
                  All ({resources.length})
                </Badge>
                {(['pdf', 'notes', 'video', 'article', 'other'] as const).map(cat => {
                  const count = resources.filter(r => r.category === cat).length;
                  if (count === 0) return null;
                  return (
                    <Badge 
                      key={cat}
                      variant={resourceFilter === cat ? 'default' : 'outline'}
                      className="cursor-pointer capitalize"
                      onClick={() => setResourceFilter(cat)}
                    >
                      {cat} ({count})
                    </Badge>
                  );
                })}
              </div>
            )}

            {/* Resources List */}
            {filteredResources.length === 0 ? (
              <Card className="text-center py-8">
                <CardContent>
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground mb-3">No resources saved yet</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleOpenResourceDialog()}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add your first resource
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3">
                {filteredResources.map(resource => (
                  <ResourceCard 
                    key={resource.id} 
                    resource={resource} 
                    onEdit={() => handleOpenResourceDialog(resource)}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
