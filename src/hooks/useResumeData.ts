import { useState, useEffect, useCallback } from 'react';

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  location: string;
}

export interface Education {
  id: string;
  degree: string;
  college: string;
  duration: string;
  cgpa: string;
}

export interface Project {
  id: string;
  title: string;
  techStack: string;
  description: string;
  githubLink: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface ResumeData {
  personal: PersonalInfo;
  summary: string;
  education: Education[];
  skills: string[];
  projects: Project[];
  experience: Experience[];
  certifications: Certification[];
}

const STORAGE_KEY = 'preptrack-resume';

const defaultData: ResumeData = {
  personal: { fullName: '', email: '', phone: '', linkedin: '', github: '', portfolio: '', location: '' },
  summary: '',
  education: [],
  skills: [],
  projects: [],
  experience: [],
  certifications: [],
};

function load(): ResumeData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultData, ...JSON.parse(raw) } : defaultData;
  } catch { return defaultData; }
}

export function useResumeData() {
  const [data, setData] = useState<ResumeData>(load);

  useEffect(() => {
    const t = setTimeout(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(data)), 300);
    return () => clearTimeout(t);
  }, [data]);

  const updatePersonal = useCallback((field: keyof PersonalInfo, value: string) => {
    setData(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
  }, []);

  const setSummary = useCallback((summary: string) => {
    setData(prev => ({ ...prev, summary }));
  }, []);

  const addEducation = useCallback(() => {
    setData(prev => ({
      ...prev,
      education: [...prev.education, { id: crypto.randomUUID(), degree: '', college: '', duration: '', cgpa: '' }],
    }));
  }, []);

  const updateEducation = useCallback((id: string, updates: Partial<Education>) => {
    setData(prev => ({
      ...prev,
      education: prev.education.map(e => e.id === id ? { ...e, ...updates } : e),
    }));
  }, []);

  const removeEducation = useCallback((id: string) => {
    setData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));
  }, []);

  const setSkills = useCallback((skills: string[]) => {
    setData(prev => ({ ...prev, skills }));
  }, []);

  const addProject = useCallback(() => {
    setData(prev => ({
      ...prev,
      projects: [...prev.projects, { id: crypto.randomUUID(), title: '', techStack: '', description: '', githubLink: '' }],
    }));
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, ...updates } : p),
    }));
  }, []);

  const removeProject = useCallback((id: string) => {
    setData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
  }, []);

  const addExperience = useCallback(() => {
    setData(prev => ({
      ...prev,
      experience: [...prev.experience, { id: crypto.randomUUID(), role: '', company: '', duration: '', description: '' }],
    }));
  }, []);

  const updateExperience = useCallback((id: string, updates: Partial<Experience>) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === id ? { ...e, ...updates } : e),
    }));
  }, []);

  const removeExperience = useCallback((id: string) => {
    setData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) }));
  }, []);

  const addCertification = useCallback(() => {
    setData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { id: crypto.randomUUID(), name: '', issuer: '', date: '' }],
    }));
  }, []);

  const updateCertification = useCallback((id: string, updates: Partial<Certification>) => {
    setData(prev => ({
      ...prev,
      certifications: prev.certifications.map(c => c.id === id ? { ...c, ...updates } : c),
    }));
  }, []);

  const removeCertification = useCallback((id: string) => {
    setData(prev => ({ ...prev, certifications: prev.certifications.filter(c => c.id !== id) }));
  }, []);

  const resetResume = useCallback(() => {
    setData(defaultData);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    data,
    updatePersonal,
    setSummary,
    addEducation, updateEducation, removeEducation,
    setSkills,
    addProject, updateProject, removeProject,
    addExperience, updateExperience, removeExperience,
    addCertification, updateCertification, removeCertification,
    resetResume,
  };
}
