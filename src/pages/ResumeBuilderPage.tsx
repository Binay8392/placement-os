import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Download, RotateCcw, FileText, Eye, PenLine } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Button } from '@/components/ui/button';
import { useResumeData } from '@/hooks/useResumeData';
import { ResumeForm } from '@/components/resume-builder/ResumeForm';
import { ResumePreview } from '@/components/resume-builder/ResumePreview';
import { cn } from '@/lib/utils';

export default function ResumeBuilderPage() {
  const resumeRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form');

  const {
    data, updatePersonal, setSummary,
    addEducation, updateEducation, removeEducation,
    setSkills,
    addProject, updateProject, removeProject,
    addExperience, updateExperience, removeExperience,
    addCertification, updateCertification, removeCertification,
    resetResume,
  } = useResumeData();

  const handleDownload = useCallback(async () => {
    if (!resumeRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: resumeRef.current.scrollWidth,
        height: resumeRef.current.scrollHeight,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const fileName = data.personal.fullName
        ? `${data.personal.fullName.replace(/\s+/g, '_')}_Resume.pdf`
        : 'Resume.pdf';
      pdf.save(fileName);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setDownloading(false);
    }
  }, [data.personal.fullName]);

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="flex items-center justify-between px-4 md:px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Resume Builder</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Build & download your professional resume</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Mobile view toggle */}
            <div className="flex md:hidden bg-muted/50 rounded-lg p-0.5">
              <button
                onClick={() => setMobileView('form')}
                className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-all", mobileView === 'form' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground")}
              >
                <PenLine className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setMobileView('preview')}
                className={cn("px-3 py-1.5 text-xs font-medium rounded-md transition-all", mobileView === 'preview' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground")}
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
            <Button variant="outline" size="sm" onClick={resetResume} className="gap-1.5 text-xs">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </Button>
            <Button size="sm" onClick={handleDownload} disabled={downloading} className="gap-1.5 text-xs gradient-primary text-primary-foreground">
              <Download className="w-3.5 h-3.5" /> {downloading ? 'Generating...' : 'Download PDF'}
            </Button>
          </div>
        </div>
      </header>

      {/* Split layout */}
      <div className="flex flex-col md:flex-row gap-0 md:gap-0" style={{ height: 'calc(100vh - 3.5rem)' }}>
        {/* Form Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            "w-full md:w-1/2 p-4 md:p-6 overflow-hidden",
            mobileView === 'preview' && 'hidden md:block'
          )}
        >
          <ResumeForm
            data={data}
            updatePersonal={updatePersonal}
            setSummary={setSummary}
            addEducation={addEducation}
            updateEducation={updateEducation}
            removeEducation={removeEducation}
            setSkills={setSkills}
            addProject={addProject}
            updateProject={updateProject}
            removeProject={removeProject}
            addExperience={addExperience}
            updateExperience={updateExperience}
            removeExperience={removeExperience}
            addCertification={addCertification}
            updateCertification={updateCertification}
            removeCertification={removeCertification}
          />
        </motion.div>

        {/* Preview Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            "w-full md:w-1/2 bg-muted/20 border-l border-border/30 overflow-y-auto",
            mobileView === 'form' && 'hidden md:block'
          )}
        >
          <div className="p-4 md:p-6">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 text-center">Live Preview</p>
            <div className="overflow-hidden rounded-lg border border-border/30 shadow-lg">
              <ResumePreview ref={resumeRef} data={data} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
