import { forwardRef } from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import type { ResumeData } from '@/hooks/useResumeData';

interface ResumePreviewProps {
  data: ResumeData;
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-1.5 mt-4 first:mt-0">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-800 border-b border-gray-300 pb-0.5">
        {title}
      </h2>
    </div>
  );
}

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(({ data }, ref) => {
  const { personal, summary, education, skills, projects, experience, certifications } = data;
  const hasContent = personal.fullName || summary || education.length || skills.length || projects.length || experience.length || certifications.length;

  return (
    <div
      ref={ref}
      className="bg-white text-gray-900 shadow-xl mx-auto"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '14mm 16mm',
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        fontSize: '10px',
        lineHeight: '1.45',
        transform: 'scale(0.55)',
        transformOrigin: 'top center',
      }}
    >
      {!hasContent ? (
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
          Start filling the form to see your resume preview
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="text-center mb-3">
            {personal.fullName && (
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">
                {personal.fullName}
              </h1>
            )}
            <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-0.5 mt-1.5 text-[9px] text-gray-600">
              {personal.email && (
                <span className="flex items-center gap-0.5">
                  <Mail className="w-2.5 h-2.5" /> {personal.email}
                </span>
              )}
              {personal.phone && (
                <span className="flex items-center gap-0.5">
                  <Phone className="w-2.5 h-2.5" /> {personal.phone}
                </span>
              )}
              {personal.location && (
                <span className="flex items-center gap-0.5">
                  <MapPin className="w-2.5 h-2.5" /> {personal.location}
                </span>
              )}
              {personal.linkedin && (
                <span className="flex items-center gap-0.5">
                  <Linkedin className="w-2.5 h-2.5" /> {personal.linkedin}
                </span>
              )}
              {personal.github && (
                <span className="flex items-center gap-0.5">
                  <Github className="w-2.5 h-2.5" /> {personal.github}
                </span>
              )}
              {personal.portfolio && (
                <span className="flex items-center gap-0.5">
                  <Globe className="w-2.5 h-2.5" /> {personal.portfolio}
                </span>
              )}
            </div>
          </div>

          {/* Summary */}
          {summary && (
            <>
              <SectionHeading title="Summary" />
              <p className="text-gray-700 text-[10px]">{summary}</p>
            </>
          )}

          {/* Education */}
          {education.length > 0 && (
            <>
              <SectionHeading title="Education" />
              {education.map(edu => (
                <div key={edu.id} className="mb-1.5">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-gray-800 text-[10.5px]">{edu.degree || 'Degree'}</span>
                    <span className="text-[9px] text-gray-500">{edu.duration}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-gray-600 text-[9.5px]">{edu.college}</span>
                    {edu.cgpa && <span className="text-[9px] text-gray-500">CGPA: {edu.cgpa}</span>}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <>
              <SectionHeading title="Skills" />
              <p className="text-gray-700 text-[10px]">{skills.join(' • ')}</p>
            </>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <>
              <SectionHeading title="Projects" />
              {projects.map(proj => (
                <div key={proj.id} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-gray-800 text-[10.5px]">{proj.title || 'Project'}</span>
                    {proj.githubLink && <span className="text-[8.5px] text-gray-500">{proj.githubLink}</span>}
                  </div>
                  {proj.techStack && <p className="text-[9px] text-gray-500 italic">{proj.techStack}</p>}
                  {proj.description && <p className="text-gray-700 text-[10px] mt-0.5">{proj.description}</p>}
                </div>
              ))}
            </>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <>
              <SectionHeading title="Experience" />
              {experience.map(exp => (
                <div key={exp.id} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-gray-800 text-[10.5px]">{exp.role || 'Role'}</span>
                    <span className="text-[9px] text-gray-500">{exp.duration}</span>
                  </div>
                  <p className="text-gray-600 text-[9.5px]">{exp.company}</p>
                  {exp.description && <p className="text-gray-700 text-[10px] mt-0.5">{exp.description}</p>}
                </div>
              ))}
            </>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <>
              <SectionHeading title="Certifications" />
              {certifications.map(cert => (
                <div key={cert.id} className="flex justify-between items-baseline mb-1">
                  <span className="text-gray-800 text-[10px]">
                    <span className="font-semibold">{cert.name || 'Certificate'}</span>
                    {cert.issuer && <span className="text-gray-500"> — {cert.issuer}</span>}
                  </span>
                  {cert.date && <span className="text-[9px] text-gray-500">{cert.date}</span>}
                </div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
