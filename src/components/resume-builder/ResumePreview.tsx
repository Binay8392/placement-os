import { forwardRef } from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import type { ResumeData } from '@/hooks/useResumeData';

export type ResumeTemplate = 'modern' | 'classic' | 'minimal';

interface ResumePreviewProps {
  data: ResumeData;
  template?: ResumeTemplate;
}

/* ── Template style configs ── */
const templateStyles = {
  modern: {
    accent: '#2563eb',
    headerBg: '#2563eb',
    headerText: '#ffffff',
    sectionColor: '#2563eb',
    borderStyle: '2px solid #2563eb',
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    nameSize: '26px',
    contactBg: '#eff6ff',
  },
  classic: {
    accent: '#1a1a1a',
    headerBg: 'transparent',
    headerText: '#1a1a1a',
    sectionColor: '#1a1a1a',
    borderStyle: '1px solid #333333',
    fontFamily: "'Georgia', 'Times New Roman', serif",
    nameSize: '24px',
    contactBg: 'transparent',
  },
  minimal: {
    accent: '#6b7280',
    headerBg: 'transparent',
    headerText: '#111827',
    sectionColor: '#9ca3af',
    borderStyle: '1px solid #e5e7eb',
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    nameSize: '22px',
    contactBg: 'transparent',
  },
};

function SectionHeading({ title, template }: { title: string; template: ResumeTemplate }) {
  const s = templateStyles[template];
  if (template === 'modern') {
    return (
      <div className="mb-1.5 mt-4 first:mt-0">
        <h2
          style={{ color: s.sectionColor, borderBottom: s.borderStyle, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', paddingBottom: '3px' }}
        >
          {title}
        </h2>
      </div>
    );
  }
  if (template === 'classic') {
    return (
      <div className="mb-1.5 mt-4 first:mt-0" style={{ textAlign: 'center' }}>
        <h2
          style={{ color: s.sectionColor, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', borderBottom: s.borderStyle, paddingBottom: '2px', display: 'inline-block' }}
        >
          {title}
        </h2>
      </div>
    );
  }
  // minimal
  return (
    <div className="mb-1.5 mt-4 first:mt-0">
      <h2
        style={{ color: s.sectionColor, borderBottom: s.borderStyle, fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', paddingBottom: '3px' }}
      >
        {title}
      </h2>
    </div>
  );
}

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(({ data, template = 'modern' }, ref) => {
  const { personal, summary, education, skills, projects, experience, certifications } = data;
  const hasContent = personal.fullName || summary || education.length || skills.length || projects.length || experience.length || certifications.length;
  const s = templateStyles[template];

  return (
    <div
      ref={ref}
      className="bg-white text-gray-900 shadow-xl mx-auto"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: template === 'modern' ? '0' : '14mm 16mm',
        fontFamily: s.fontFamily,
        fontSize: '10px',
        lineHeight: '1.45',
        transform: 'scale(0.55)',
        transformOrigin: 'top center',
      }}
    >
      {!hasContent ? (
        <div className="flex items-center justify-center h-full text-gray-400 text-sm" style={{ padding: '14mm 16mm' }}>
          Start filling the form to see your resume preview
        </div>
      ) : (
        <>
          {/* Header */}
          {template === 'modern' ? (
            <div style={{ background: s.headerBg, color: s.headerText, padding: '14mm 16mm 10mm 16mm' }}>
              {personal.fullName && (
                <h1 style={{ fontSize: s.nameSize, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  {personal.fullName}
                </h1>
              )}
              <div className="flex items-center flex-wrap gap-x-3 gap-y-0.5 mt-2" style={{ fontSize: '9px', opacity: 0.9 }}>
                {personal.email && <span className="flex items-center gap-0.5"><Mail className="w-2.5 h-2.5" /> {personal.email}</span>}
                {personal.phone && <span className="flex items-center gap-0.5"><Phone className="w-2.5 h-2.5" /> {personal.phone}</span>}
                {personal.location && <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" /> {personal.location}</span>}
                {personal.linkedin && <span className="flex items-center gap-0.5"><Linkedin className="w-2.5 h-2.5" /> {personal.linkedin}</span>}
                {personal.github && <span className="flex items-center gap-0.5"><Github className="w-2.5 h-2.5" /> {personal.github}</span>}
                {personal.portfolio && <span className="flex items-center gap-0.5"><Globe className="w-2.5 h-2.5" /> {personal.portfolio}</span>}
              </div>
            </div>
          ) : (
            <div className="text-center mb-3">
              {personal.fullName && (
                <h1 style={{ fontSize: s.nameSize, fontWeight: template === 'classic' ? 400 : 700, color: s.headerText, letterSpacing: template === 'classic' ? '0.05em' : '-0.01em', textTransform: template === 'classic' ? 'uppercase' as const : 'none' as const }}>
                  {personal.fullName}
                </h1>
              )}
              <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-0.5 mt-1.5" style={{ fontSize: '9px', color: '#6b7280' }}>
                {personal.email && <span className="flex items-center gap-0.5"><Mail className="w-2.5 h-2.5" /> {personal.email}</span>}
                {personal.phone && <span className="flex items-center gap-0.5"><Phone className="w-2.5 h-2.5" /> {personal.phone}</span>}
                {personal.location && <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" /> {personal.location}</span>}
                {personal.linkedin && <span className="flex items-center gap-0.5"><Linkedin className="w-2.5 h-2.5" /> {personal.linkedin}</span>}
                {personal.github && <span className="flex items-center gap-0.5"><Github className="w-2.5 h-2.5" /> {personal.github}</span>}
                {personal.portfolio && <span className="flex items-center gap-0.5"><Globe className="w-2.5 h-2.5" /> {personal.portfolio}</span>}
              </div>
            </div>
          )}

          {/* Body */}
          <div style={{ padding: template === 'modern' ? '4mm 16mm 14mm 16mm' : '0' }}>
            {/* Summary */}
            {summary && (
              <>
                <SectionHeading title="Summary" template={template} />
                <p style={{ color: '#374151', fontSize: '10px' }}>{summary}</p>
              </>
            )}

            {/* Education */}
            {education.length > 0 && (
              <>
                <SectionHeading title="Education" template={template} />
                {education.map(edu => (
                  <div key={edu.id} className="mb-1.5">
                    <div className="flex justify-between items-baseline">
                      <span style={{ fontWeight: 600, color: '#1f2937', fontSize: '10.5px' }}>{edu.degree || 'Degree'}</span>
                      <span style={{ fontSize: '9px', color: '#6b7280' }}>{edu.duration}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span style={{ color: '#4b5563', fontSize: '9.5px' }}>{edu.college}</span>
                      {edu.cgpa && <span style={{ fontSize: '9px', color: '#6b7280' }}>CGPA: {edu.cgpa}</span>}
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <>
                <SectionHeading title="Skills" template={template} />
                <p style={{ color: '#374151', fontSize: '10px' }}>
                  {skills.join(template === 'modern' ? '  •  ' : template === 'classic' ? ',  ' : '  ·  ')}
                </p>
              </>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <>
                <SectionHeading title="Projects" template={template} />
                {projects.map(proj => (
                  <div key={proj.id} className="mb-2">
                    <div className="flex justify-between items-baseline">
                      <span style={{ fontWeight: 600, color: template === 'modern' ? s.accent : '#1f2937', fontSize: '10.5px' }}>{proj.title || 'Project'}</span>
                      {proj.githubLink && <span style={{ fontSize: '8.5px', color: '#6b7280' }}>{proj.githubLink}</span>}
                    </div>
                    {proj.techStack && <p style={{ fontSize: '9px', color: '#6b7280', fontStyle: 'italic' }}>{proj.techStack}</p>}
                    {proj.description && <p style={{ color: '#374151', fontSize: '10px', marginTop: '2px' }}>{proj.description}</p>}
                  </div>
                ))}
              </>
            )}

            {/* Experience */}
            {experience.length > 0 && (
              <>
                <SectionHeading title="Experience" template={template} />
                {experience.map(exp => (
                  <div key={exp.id} className="mb-2">
                    <div className="flex justify-between items-baseline">
                      <span style={{ fontWeight: 600, color: '#1f2937', fontSize: '10.5px' }}>{exp.role || 'Role'}</span>
                      <span style={{ fontSize: '9px', color: '#6b7280' }}>{exp.duration}</span>
                    </div>
                    <p style={{ color: '#4b5563', fontSize: '9.5px' }}>{exp.company}</p>
                    {exp.description && <p style={{ color: '#374151', fontSize: '10px', marginTop: '2px' }}>{exp.description}</p>}
                  </div>
                ))}
              </>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <>
                <SectionHeading title="Certifications" template={template} />
                {certifications.map(cert => (
                  <div key={cert.id} className="flex justify-between items-baseline mb-1">
                    <span style={{ color: '#1f2937', fontSize: '10px' }}>
                      <span style={{ fontWeight: 600 }}>{cert.name || 'Certificate'}</span>
                      {cert.issuer && <span style={{ color: '#6b7280' }}> — {cert.issuer}</span>}
                    </span>
                    {cert.date && <span style={{ fontSize: '9px', color: '#6b7280' }}>{cert.date}</span>}
                  </div>
                ))}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
