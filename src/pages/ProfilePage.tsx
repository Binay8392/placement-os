import { useStore, Resource } from '@/lib/store';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { User, Target, Building2, Moon, Sun, FileText, Plus, ExternalLink, Trash2, Edit, Link2, Video, BookOpen, File, Github, Linkedin, Globe, Mail, Phone, Code2, FileDown, Camera, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const { user } = useFirebaseAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [resourceDialogOpen, setResourceDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | undefined>();
  const [resourceFilter, setResourceFilter] = useState<'all' | Resource['category']>('all');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync profile name with Firebase auth if profile name is empty
  useEffect(() => {
    if (user?.displayName && !profile.name) {
      updateProfile({ 
        name: user.displayName,
        email: user.email || profile.email 
      });
    }
  }, [user, profile.name, updateProfile]);

  // Update formData when profile changes
  useEffect(() => {
    setFormData(profile);
  }, [profile]);

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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({ title: "Please upload an image file", variant: "destructive" });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Image must be less than 2MB", variant: "destructive" });
      return;
    }

    setIsUploadingAvatar(true);
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      // Use Firebase user ID to scope uploads to user's own folder
      const userFolder = user?.uid || 'anonymous';
      const fileName = `${userFolder}/avatar-${Date.now()}.${fileExt}`;

      // Delete old avatar if exists
      if (profile.avatarUrl) {
        try {
          const url = new URL(profile.avatarUrl);
          const pathParts = url.pathname.split('/avatars/');
          if (pathParts[1]) {
            const oldPath = decodeURIComponent(pathParts[1]);
            await supabase.storage.from('avatars').remove([oldPath]);
          }
        } catch {
          // Ignore deletion errors for old avatars
        }
      }

      // Upload new avatar
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile
      updateProfile({ avatarUrl: publicUrl });
      setFormData(prev => ({ ...prev, avatarUrl: publicUrl }));
      
      toast({ title: "Profile photo updated!" });
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({ 
        title: "Failed to upload photo", 
        description: error.message || "Please try again",
        variant: "destructive" 
      });
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAvatar = async () => {
    if (!profile.avatarUrl) return;

    try {
      const oldPath = profile.avatarUrl.split('/').pop();
      if (oldPath) {
        await supabase.storage.from('avatars').remove([oldPath]);
      }
      updateProfile({ avatarUrl: '' });
      setFormData(prev => ({ ...prev, avatarUrl: '' }));
      toast({ title: "Profile photo removed" });
    } catch (error: any) {
      console.error('Error removing avatar:', error);
      toast({ title: "Failed to remove photo", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gradient">Profile</h1>
          <p className="text-muted-foreground text-sm">Your career journey & resources</p>
        </header>

        <main className="space-y-6">
          {/* Avatar & Name */}
          <section className="flex flex-col items-center py-6">
            {/* Avatar with upload */}
            <div className="relative group mb-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                id="avatar-upload"
              />
              {profile.avatarUrl || user?.photoURL ? (
                <img
                  src={profile.avatarUrl || user?.photoURL || ''}
                  alt={profile.name || user?.displayName || 'Profile'}
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                />
              ) : (
                <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-3xl font-bold">
                  {(profile.name || user?.displayName || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              
              {/* Upload overlay */}
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                {isUploadingAvatar ? (
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : (
                  <Camera className="w-6 h-6 text-white" />
                )}
              </label>
            </div>
            
            {/* Remove photo button */}
            {profile.avatarUrl && !isEditing && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-destructive mb-2"
                onClick={handleRemoveAvatar}
              >
                Remove photo
              </Button>
            )}
            
            {!isEditing ? (
              <>
                <h2 className="text-xl font-bold">{profile.name || user?.displayName || 'Your Name'}</h2>
                <p className="text-muted-foreground text-sm">{profile.degree || 'Add your degree'}</p>
                {profile.semester > 0 && <p className="text-muted-foreground text-sm">Semester {profile.semester}</p>}
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

            {/* Skills */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-purple-500/10">
                  <Code2 className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="font-semibold">Skills</h3>
              </div>
              {!isEditing ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills?.length > 0 ? profile.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  )) : (
                    <p className="text-muted-foreground text-sm">No skills added</p>
                  )}
                </div>
              ) : (
                <Input
                  value={formData.skills?.join(', ') || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                  })}
                  placeholder="JavaScript, React, Python..."
                />
              )}
            </div>

            {/* Contact Info */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-blue-500/10">
                  <Mail className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="font-semibold">Contact</h3>
              </div>
              {!isEditing ? (
                <div className="space-y-2 text-sm">
                  {profile.email ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span>{profile.email}</span>
                    </div>
                  ) : null}
                  {profile.phone ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{profile.phone}</span>
                    </div>
                  ) : null}
                  {!profile.email && !profile.phone && (
                    <p className="text-muted-foreground">No contact info added</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email address"
                    type="email"
                  />
                  <Input
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Phone number"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Social Links & Resume */}
          <section className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-orange-500/10">
                <Link2 className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="font-semibold">Links & Resume</h3>
            </div>
            {!isEditing ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {profile.linkedinUrl && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-start"
                    onClick={() => window.open(profile.linkedinUrl, '_blank')}
                  >
                    <Linkedin className="w-4 h-4 mr-2 text-blue-600" />
                    LinkedIn
                  </Button>
                )}
                {profile.githubUrl && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-start"
                    onClick={() => window.open(profile.githubUrl, '_blank')}
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </Button>
                )}
                {profile.portfolioUrl && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-start"
                    onClick={() => window.open(profile.portfolioUrl, '_blank')}
                  >
                    <Globe className="w-4 h-4 mr-2 text-green-500" />
                    Portfolio
                  </Button>
                )}
                {profile.resumeUrl && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-start"
                    onClick={() => window.open(profile.resumeUrl, '_blank')}
                  >
                    <FileDown className="w-4 h-4 mr-2 text-red-500" />
                    Resume
                  </Button>
                )}
                {!profile.linkedinUrl && !profile.githubUrl && !profile.portfolioUrl && !profile.resumeUrl && (
                  <p className="text-muted-foreground text-sm col-span-full">No links added yet</p>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Linkedin className="w-3 h-3" /> LinkedIn URL
                  </Label>
                  <Input
                    value={formData.linkedinUrl || ''}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Github className="w-3 h-3" /> GitHub URL
                  </Label>
                  <Input
                    value={formData.githubUrl || ''}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Portfolio URL
                  </Label>
                  <Input
                    value={formData.portfolioUrl || ''}
                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    placeholder="https://yourportfolio.com"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <FileDown className="w-3 h-3" /> Resume URL (Drive/PDF)
                  </Label>
                  <Input
                    value={formData.resumeUrl || ''}
                    onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                    placeholder="https://drive.google.com/..."
                  />
                </div>
              </div>
            )}
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
