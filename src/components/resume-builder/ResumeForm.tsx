import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, User, FileText, GraduationCap, Wrench, FolderGit2, Briefcase, Award } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ResumeData, PersonalInfo, Education, Project, Experience, Certification } from '@/hooks/useResumeData';

interface ResumeFormProps {
  data: ResumeData;
  updatePersonal: (field: keyof PersonalInfo, value: string) => void;
  setSummary: (s: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, u: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  setSkills: (s: string[]) => void;
  addProject: () => void;
  updateProject: (id: string, u: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addExperience: () => void;
  updateExperience: (id: string, u: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addCertification: () => void;
  updateCertification: (id: string, u: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
}

const sectionClass = "rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-5 space-y-4";
const labelClass = "text-xs font-medium text-muted-foreground uppercase tracking-wider";

function SectionTitle({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="p-1.5 rounded-lg bg-primary/10">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <h3 className="font-semibold text-foreground">{title}</h3>
    </div>
  );
}

export function ResumeForm(props: ResumeFormProps) {
  const { data, updatePersonal, setSummary, setSkills } = props;
  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      const val = skillInput.trim();
      if (val.length > 100) return;
      if (!data.skills.includes(val)) {
        setSkills([...data.skills, val]);
      }
      setSkillInput('');
    }
  }, [skillInput, data.skills, setSkills]);

  const removeSkill = useCallback((skill: string) => {
    setSkills(data.skills.filter(s => s !== skill));
  }, [data.skills, setSkills]);

  const personalFields: { key: keyof PersonalInfo; label: string; placeholder: string; type?: string }[] = [
    { key: 'fullName', label: 'Full Name', placeholder: 'John Doe' },
    { key: 'email', label: 'Email', placeholder: 'john@example.com', type: 'email' },
    { key: 'phone', label: 'Phone', placeholder: '+91 98765 43210', type: 'tel' },
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/johndoe' },
    { key: 'github', label: 'GitHub', placeholder: 'github.com/johndoe' },
    { key: 'portfolio', label: 'Portfolio', placeholder: 'johndoe.dev' },
    { key: 'location', label: 'Location', placeholder: 'Mumbai, India' },
  ];

  return (
    <div className="space-y-5 overflow-y-auto max-h-[calc(100vh-8rem)] pr-1 no-scrollbar">
      {/* Personal Info */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={sectionClass}>
        <SectionTitle icon={User} title="Personal Details" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {personalFields.map(f => (
            <div key={f.key} className={f.key === 'fullName' ? 'sm:col-span-2' : ''}>
              <label className={labelClass}>{f.label}</label>
              <Input
                type={f.type || 'text'}
                placeholder={f.placeholder}
                value={data.personal[f.key]}
                onChange={e => updatePersonal(f.key, e.target.value)}
                maxLength={200}
                className="mt-1"
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className={sectionClass}>
        <SectionTitle icon={FileText} title="Professional Summary" />
        <Textarea
          placeholder="A brief summary about yourself..."
          value={data.summary}
          onChange={e => setSummary(e.target.value)}
          maxLength={1000}
          rows={3}
        />
      </motion.div>

      {/* Education */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={sectionClass}>
        <div className="flex items-center justify-between">
          <SectionTitle icon={GraduationCap} title="Education" />
          <Button size="sm" variant="outline" onClick={props.addEducation} className="gap-1 text-xs">
            <Plus className="w-3.5 h-3.5" /> Add
          </Button>
        </div>
        <AnimatePresence mode="popLayout">
          {data.education.map(edu => (
            <motion.div key={edu.id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-muted/20 border border-border/30 relative group"
            >
              <button onClick={() => props.removeEducation(edu.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <Input placeholder="Degree" value={edu.degree} onChange={e => props.updateEducation(edu.id, { degree: e.target.value })} maxLength={200} />
              <Input placeholder="College" value={edu.college} onChange={e => props.updateEducation(edu.id, { college: e.target.value })} maxLength={200} />
              <Input placeholder="Duration (2020 - 2024)" value={edu.duration} onChange={e => props.updateEducation(edu.id, { duration: e.target.value })} maxLength={100} />
              <Input placeholder="CGPA / %" value={edu.cgpa} onChange={e => props.updateEducation(edu.id, { cgpa: e.target.value })} maxLength={20} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Skills */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className={sectionClass}>
        <SectionTitle icon={Wrench} title="Skills" />
        <Input
          placeholder="Type a skill and press Enter..."
          value={skillInput}
          onChange={e => setSkillInput(e.target.value)}
          onKeyDown={handleAddSkill}
          maxLength={50}
        />
        <div className="flex flex-wrap gap-2">
          {data.skills.map(skill => (
            <Badge key={skill} variant="secondary" className="gap-1 pr-1">
              {skill}
              <button onClick={() => removeSkill(skill)} className="ml-1 hover:text-destructive transition-colors">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </motion.div>

      {/* Projects */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={sectionClass}>
        <div className="flex items-center justify-between">
          <SectionTitle icon={FolderGit2} title="Projects" />
          <Button size="sm" variant="outline" onClick={props.addProject} className="gap-1 text-xs">
            <Plus className="w-3.5 h-3.5" /> Add
          </Button>
        </div>
        <AnimatePresence mode="popLayout">
          {data.projects.map(proj => (
            <motion.div key={proj.id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="space-y-2 p-3 rounded-xl bg-muted/20 border border-border/30 relative group"
            >
              <button onClick={() => props.removeProject(proj.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input placeholder="Project Title" value={proj.title} onChange={e => props.updateProject(proj.id, { title: e.target.value })} maxLength={200} />
                <Input placeholder="Tech Stack" value={proj.techStack} onChange={e => props.updateProject(proj.id, { techStack: e.target.value })} maxLength={200} />
              </div>
              <Textarea placeholder="Description" value={proj.description} onChange={e => props.updateProject(proj.id, { description: e.target.value })} maxLength={500} rows={2} />
              <Input placeholder="GitHub Link" value={proj.githubLink} onChange={e => props.updateProject(proj.id, { githubLink: e.target.value })} maxLength={300} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Experience */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className={sectionClass}>
        <div className="flex items-center justify-between">
          <SectionTitle icon={Briefcase} title="Experience (Optional)" />
          <Button size="sm" variant="outline" onClick={props.addExperience} className="gap-1 text-xs">
            <Plus className="w-3.5 h-3.5" /> Add
          </Button>
        </div>
        <AnimatePresence mode="popLayout">
          {data.experience.map(exp => (
            <motion.div key={exp.id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="space-y-2 p-3 rounded-xl bg-muted/20 border border-border/30 relative group"
            >
              <button onClick={() => props.removeExperience(exp.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input placeholder="Role" value={exp.role} onChange={e => props.updateExperience(exp.id, { role: e.target.value })} maxLength={200} />
                <Input placeholder="Company" value={exp.company} onChange={e => props.updateExperience(exp.id, { company: e.target.value })} maxLength={200} />
              </div>
              <Input placeholder="Duration" value={exp.duration} onChange={e => props.updateExperience(exp.id, { duration: e.target.value })} maxLength={100} />
              <Textarea placeholder="Description" value={exp.description} onChange={e => props.updateExperience(exp.id, { description: e.target.value })} maxLength={500} rows={2} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Certifications */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={sectionClass}>
        <div className="flex items-center justify-between">
          <SectionTitle icon={Award} title="Certifications (Optional)" />
          <Button size="sm" variant="outline" onClick={props.addCertification} className="gap-1 text-xs">
            <Plus className="w-3.5 h-3.5" /> Add
          </Button>
        </div>
        <AnimatePresence mode="popLayout">
          {data.certifications.map(cert => (
            <motion.div key={cert.id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 rounded-xl bg-muted/20 border border-border/30 relative group"
            >
              <button onClick={() => props.removeCertification(cert.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <Input placeholder="Certificate Name" value={cert.name} onChange={e => props.updateCertification(cert.id, { name: e.target.value })} maxLength={200} />
              <Input placeholder="Issuer" value={cert.issuer} onChange={e => props.updateCertification(cert.id, { issuer: e.target.value })} maxLength={200} />
              <Input placeholder="Date" value={cert.date} onChange={e => props.updateCertification(cert.id, { date: e.target.value })} maxLength={50} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
