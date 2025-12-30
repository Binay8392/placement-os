import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { User, Target, Building2, GraduationCap, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export default function ProfilePage() {
  const { profile, updateProfile, theme, toggleTheme } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <header className="px-4 pt-6 pb-4 safe-top">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground text-sm">Your career journey</p>
      </header>

      <main className="px-4 space-y-6">
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
            <div className="w-full space-y-3 mt-2">
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
        <section className="space-y-3">
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
              <div className="p-2 rounded-xl bg-success/10">
                <Building2 className="w-5 h-5 text-success" />
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
                <Sun className="w-5 h-5 text-warning" />
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

        {/* Edit Button */}
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
      </main>
    </div>
  );
}
