import { useState, useEffect, useRef } from 'react';
import { 
  X, Printer, Copy, Check, FileText, Download, 
  Mail, Github, Linkedin, Calendar, Award, BookOpen, Briefcase
} from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { personalInfo, skillsList, educationList, projectsList, experienceList, certificationsList, achievementsList } from '../data';
import { playSound } from '../utils/audio';

interface ResumeViewerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

export default function ResumeViewer({ isOpen, onClose, theme }: ResumeViewerProps) {
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Prevent background scroll of the main website when CV reader is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Focus trapping and Esc key listener
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          playSound.playClose();
          onClose();
          return;
        }

        if (e.key === 'Tab' && modalRef.current) {
          const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
          const focusables = modalRef.current.querySelectorAll<HTMLElement>(focusableSelector);
          if (focusables.length === 0) return;

          const firstEl = focusables[0];
          const lastEl = focusables[focusables.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstEl) {
              lastEl.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastEl) {
              firstEl.focus();
              e.preventDefault();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      // Focus the close button or first focusable
      setTimeout(() => {
        if (modalRef.current) {
          const closeBtn = modalRef.current.querySelector<HTMLButtonElement>('button[aria-label="Close resume viewer"]');
          if (closeBtn) {
            closeBtn.focus();
          } else {
            const firstFocusable = modalRef.current.querySelector<HTMLElement>('button, [href]');
            firstFocusable?.focus();
          }
        }
      }, 50);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        if (triggerRef.current) {
          triggerRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Function to generate and download a pristine PDF with html2pdf
  const handleDownloadPDF = () => {
    try {
      const element = document.getElementById('resume-download-root');
      if (!element) return;

      // Resolve the actual html2pdf function to handle ESM/CJS bundler differences
      const html2pdfFn = typeof html2pdf === 'function' ? html2pdf : (html2pdf as any).default;

      if (!html2pdfFn) {
        console.error("html2pdf library could not be resolved.");
        window.print();
        return;
      }

      const opt = {
        margin:       [10, 10, 10, 10] as [number, number, number, number],
        filename:     'Darsh_Ohri_Resume.pdf',
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { 
          scale: 2, 
          useCORS: true, 
          letterRendering: true,
          logging: false
        },
        jsPDF:        { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };

      html2pdfFn().set(opt).from(element).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
      window.print();
    }
  };

  // Generate ATS compatible Markdown text
  const getMarkdownResume = () => {
    return `# ${personalInfo.name}
${personalInfo.title} | ${personalInfo.university} (Class of ${personalInfo.duration})
Email: ${personalInfo.email} | GitHub: ${personalInfo.github} | LinkedIn: ${personalInfo.linkedin}

## ABOUT ME
${personalInfo.aboutShort}

## EDUCATION
* ${educationList[0].institution}
  * ${educationList[0].degree} (${educationList[0].specialization})
  * Duration: ${educationList[0].duration}
  * Details: ${educationList[0].gpa}

## TECHNICAL SKILLS
* Programming Languages: ${skillsList.filter(s => s.category === 'languages').map(s => s.name).join(', ')}
* Web Development: ${skillsList.filter(s => s.category === 'web').map(s => s.name).join(', ')}
* Tools & Software: ${skillsList.filter(s => s.category === 'tools').map(s => s.name).join(', ')}
* AI Tools: ${skillsList.filter(s => s.category === 'ai').map(s => s.name).join(', ')}
* Other Skills: ${skillsList.filter(s => s.category === 'other').map(s => s.name).join(', ')}

## PROJECTS
${projectsList.map(p => `
### ${p.title} - ${p.subtitle}
*Period: ${p.period} | Role: ${p.role}*
*Tech Stack: ${p.tech.join(', ')}*
${p.details.map(d => `* ${d}`).join('\n')}
`).join('')}

## EXPERIENCE
${experienceList.map(e => `
### ${e.company} - ${e.role}
*Duration: ${e.duration}*
${e.bullets.map(b => `* ${b}`).join('\n')}
`).join('')}

## CERTIFICATIONS
${certificationsList.map(c => `* **${c.title}** - ${c.provider} (${c.date})`).join('\n')}

## ACHIEVEMENTS
${achievementsList.map(a => `* **${a.award}** | ${a.title} - ${a.event} (${a.year})`).join('\n')}
`;
  };

  // Copy Markdown to Clipboard
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(getMarkdownResume());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in print:bg-white print:p-0">
      
      {/* Modal Card wrapper with strict viewport bounds and overflow-hidden clipping */}
      <div 
        ref={modalRef}
        className={`relative w-full max-w-5xl h-[85vh] max-h-[85vh] ${theme === 'light' ? 'bg-white border-zinc-200' : 'bg-black border-neutral-900'} border rounded-2xl shadow-2xl flex flex-col overflow-hidden print:h-auto print:max-h-none print:border-none print:shadow-none print:bg-white print:rounded-none`}
      >
        
        {/* Header Options Bar - Hidden in print */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${theme === 'light' ? 'border-zinc-200/80 bg-zinc-100/95' : 'border-neutral-900 bg-black/90'} sticky top-0 z-10 backdrop-blur-md rounded-t-2xl shrink-0 print:hidden`}>
          <div className="flex items-center gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${theme === 'light' ? 'bg-amber-500' : 'bg-white'} animate-pulse`}></div>
            <span className={`text-xs font-mono ${theme === 'light' ? 'text-zinc-700 font-extrabold' : 'text-zinc-400 font-bold'} uppercase tracking-wider`}>
              ATS-Optimized Interactive Resume
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Copy Markdown button */}
            <button
              onClick={handleCopyToClipboard}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all hover:scale-[1.01] cursor-pointer ${
                theme === 'light'
                  ? 'bg-zinc-200/60 hover:bg-zinc-200 text-zinc-950 border-zinc-300 font-extrabold'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-350 border-neutral-800 font-bold'
              } font-mono text-xs`}
              title="Copy markdown content for recruiting ATS systems"
            >
              {copied ? (
                <>
                  <Check className={`h-3.5 w-3.5 ${theme === 'light' ? 'text-zinc-950 font-black' : 'text-white font-bold'}`} />
                  <span className={`${theme === 'light' ? 'text-zinc-950 font-black' : 'text-white font-bold'}`}>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className={`h-3.5 w-3.5 ${theme === 'light' ? 'text-zinc-750' : 'text-zinc-400'}`} />
                  <span>Copy ATS Markdown</span>
                </>
              )}
            </button>

            {/* Save as PDF button */}
            <button
              onClick={handleDownloadPDF}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-mono text-xs font-black transition-all shadow-md cursor-pointer hover:scale-[1.02] active:scale-95 ${
                theme === 'light'
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/15'
                  : 'bg-white hover:bg-neutral-200 text-black shadow-white/5'
              }`}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Save as PDF</span>
            </button>

            {/* Close button with high-contrast indicator and clear hitbox */}
            <button 
              onClick={() => {
                onClose();
                playSound.playClose();
              }}
              className={`p-1.5 rounded-lg h-8 w-8 flex items-center justify-center border transition-all cursor-pointer hover:scale-105 active:scale-90 ml-2 ${
                theme === 'light'
                  ? 'bg-zinc-200/60 hover:bg-zinc-200 text-zinc-950 border-zinc-300'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border-neutral-800'
              }`}
              aria-label="Close resume viewer"
            >
              <X className="h-4.5 w-4.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Internal Scroll Frame - Shields parent layout, isolates scroll events, and protects top menu alignment */}
        <div className="overflow-y-auto flex-1 min-h-0 select-text rounded-b-2xl print:overflow-visible print:h-auto">
          {/* Printable/ATS-optimized Professional Resume Container */}
          <div id="resume-download-root" className="p-8 md:p-16 text-slate-800 bg-white print:p-0 print:text-black">
          
          {/* Resume Heading */}
          <div className="border-b-2 border-slate-900 pb-8 mb-8 select-text">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <h1 className="text-4xl font-display font-black text-slate-900 tracking-tight print:text-black">
                  {personalInfo.name}
                </h1>
                <p className="text-sm md:text-base font-bold text-slate-850 font-mono mt-2 uppercase tracking-wider print:text-slate-800">
                  {personalInfo.title}
                </p>
                <p className="text-xs md:text-sm text-slate-500 font-medium mt-1.5">
                  {personalInfo.university} &mdash; Specialization in Data Science
                </p>
              </div>
              <div className="flex flex-col gap-2 text-xs md:text-sm text-slate-650 md:text-right font-mono print:text-slate-700 select-all">
                <div className="flex items-center md:justify-end gap-2">
                  <Mail className="h-4 w-4 text-slate-400 print:text-slate-750" />
                  <span>{personalInfo.email}</span>
                </div>
                <div className="flex items-center md:justify-end gap-2">
                  <Github className="h-4 w-4 text-slate-400 print:text-slate-755" />
                  <span>{personalInfo.github}</span>
                </div>
                <div className="flex items-center md:justify-end gap-2">
                  <Linkedin className="h-4 w-4 text-slate-400 print:text-slate-755" />
                  <span>{personalInfo.linkedin}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 select-text">
            {/* Left Column (Main Focus, Projects, Experience) */}
            <div className="md:col-span-8 flex flex-col gap-8 md:gap-10">
              
              {/* Profile Block */}
              <div>
                <h3 className="text-xs md:text-sm font-mono font-bold text-slate-900 uppercase tracking-widest border-b-2 border-slate-200 pb-2 mb-4 print:text-slate-950 print:border-slate-350">
                  Professional Profile
                </h3>
                <p className="text-sm leading-relaxed text-slate-750 print:text-black font-sans tracking-wide">
                  {personalInfo.aboutShort}
                </p>
              </div>

              {/* Projects Block */}
              <div>
                <h3 className="text-xs md:text-sm font-mono font-bold text-slate-900 uppercase tracking-widest border-b-2 border-slate-200 pb-2 mb-6 print:text-slate-950 print:border-slate-350">
                  Technical Projects
                </h3>
                <div className="flex flex-col gap-10">
                  {projectsList.map((project) => (
                    <div key={project.id} className="text-xs">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-8 pb-3 border-b border-dashed border-slate-200 mb-4">
                        <h4 className="font-extrabold text-slate-950 text-sm md:text-base tracking-tight print:text-black pr-4 md:pr-8 flex-1">
                          {project.title} &ndash; <span className="font-semibold text-slate-600 text-xs md:text-sm">{project.subtitle}</span>
                        </h4>
                        <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded tracking-wide shrink-0 print:border print:border-slate-300 print:bg-white print:text-black">
                          {project.period}
                        </span>
                      </div>
                      <p className="text-[11px] md:text-xs font-mono font-bold text-slate-800 mt-2 uppercase tracking-wider print:text-slate-800">
                        Role: {project.role} | Tech: {project.tech.join(', ')}
                      </p>
                      <ul className="list-disc list-outside mt-3 text-slate-650 print:text-black leading-relaxed flex flex-col gap-2 pl-4">
                        {project.details.slice(0, 4).map((bullet, k) => (
                          <li key={k} className="text-xs md:text-[13px] tracking-wide">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience Block */}
              <div>
                <h3 className="text-xs md:text-sm font-mono font-bold text-slate-900 uppercase tracking-widest border-b-2 border-slate-200 pb-2 mb-6 print:text-slate-950 print:border-slate-350">
                  Professional & Chapters Experience
                </h3>
                <div className="flex flex-col gap-10">
                  {experienceList.map((exp, index) => (
                    <div key={index} className="text-xs">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-dashed border-slate-200 mb-3">
                        <h4 className="font-extrabold text-slate-950 text-sm md:text-base tracking-tight print:text-black">
                          {exp.role} &ndash; <span className="font-bold text-slate-700 text-xs md:text-sm">{exp.company}</span>
                        </h4>
                        <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded tracking-wide shrink-0 print:border print:border-slate-300 print:bg-white print:text-black">
                          {exp.duration}
                        </span>
                      </div>
                      <ul className="list-disc list-outside mt-3 text-slate-650 print:text-black leading-relaxed flex flex-col gap-2 pl-4">
                        {exp.bullets.map((bullet, k) => (
                          <li key={k} className="text-xs md:text-[13px] tracking-wide">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column (Education, Skills, Certifications, Achievements) */}
            <div className="md:col-span-4 flex flex-col gap-10 md:gap-12">

              {/* Education Block */}
              <div>
                <h3 className="text-xs md:text-sm font-mono font-bold text-slate-900 uppercase tracking-widest border-b-2 border-slate-200 pb-2 mb-5 print:text-slate-950 print:border-slate-350">
                  Education
                </h3>
                <div className="flex flex-col gap-6">
                  {educationList.map((edu, index) => (
                    <div key={index} className="text-xs">
                      <h4 className="font-bold text-slate-950 text-sm md:text-base tracking-tight print:text-black">{edu.institution}</h4>
                      <p className="text-[11px] md:text-xs font-mono text-slate-800 font-bold uppercase mt-1.5">{edu.degree}</p>
                      <p className="text-xs text-slate-600 mt-1">{edu.specialization}</p>
                      <p className="text-[11px] text-slate-500 font-bold font-mono mt-1.5">{edu.duration} | {edu.gpa}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Summarized Block */}
              <div>
                <h3 className="text-xs md:text-sm font-mono font-bold text-slate-900 uppercase tracking-widest border-b-2 border-slate-200 pb-2 mb-5 print:text-slate-950 print:border-slate-350">
                  Primary Skillset
                </h3>
                <div className="flex flex-col gap-5 text-xs">
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs md:text-xs uppercase tracking-wide">Programming:</h5>
                    <p className="text-slate-655 pl-1 text-xs md:text-xs mt-1.5 leading-relaxed">{skillsList.filter(s => s.category === 'languages').map(s => s.name).join(', ')}</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs md:text-xs uppercase tracking-wide">Web Architecture:</h5>
                    <p className="text-slate-655 pl-1 text-xs md:text-xs mt-1.5 leading-relaxed">{skillsList.filter(s => s.category === 'web').map(s => s.name).join(', ')}</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs md:text-xs uppercase tracking-wide">AI & LLM Tools:</h5>
                    <p className="text-slate-655 pl-1 text-xs md:text-xs mt-1.5 leading-relaxed">{skillsList.filter(s => s.category === 'ai').map(s => s.name).join(', ')}</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs md:text-xs uppercase tracking-wide">Software & DevOps:</h5>
                    <p className="text-slate-655 pl-1 text-xs md:text-xs mt-1.5 leading-relaxed">{skillsList.filter(s => s.category === 'tools').map(s => s.name).join(', ')}</p>
                  </div>
                </div>
              </div>

              {/* Certifications Block */}
              <div>
                <h3 className="text-xs md:text-sm font-mono font-bold text-slate-900 uppercase tracking-widest border-b-2 border-slate-200 pb-2 mb-5 print:text-slate-950 print:border-slate-350">
                  Global Certs
                </h3>
                <ul className="flex flex-col gap-6 pl-1">
                  {certificationsList.map((cert, index) => (
                    <li key={index} className="text-xs">
                      <div className="font-bold text-slate-950 text-xs md:text-sm tracking-tight print:text-black leading-snug">
                        {cert.title}
                      </div>
                      <div className="text-[10px] md:text-xs font-mono text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                        {cert.provider} &bull; {cert.date}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Achievements Block */}
              <div>
                <h3 className="text-xs md:text-sm font-mono font-bold text-slate-900 uppercase tracking-widest border-b-2 border-slate-200 pb-2 mb-5 print:text-slate-950 print:border-slate-350">
                  Key Accomplishments
                </h3>
                <ul className="flex flex-col gap-6 pl-1">
                  {achievementsList.map((ach, index) => (
                    <li key={index} className="text-xs">
                      <div className="font-bold text-slate-950 text-xs md:text-sm tracking-tight print:text-black leading-snug">
                        {ach.award} &ndash; {ach.title}
                      </div>
                      <div className="text-[10px] md:text-xs text-slate-500 mt-1.5 leading-snug font-mono">
                        {ach.event} ({ach.year})
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

          {/* Footer declaration */}
          <div className="mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-400 print:text-black font-mono tracking-wide">
            Signed by student: Darsh Ohri &bull; SVKM's NMIMS CSE Data Science &bull; 2026 Compilation
          </div>
          
        </div>

        {/* Modal Print Instructions Footer - Hidden during Print */}
        <div className={`px-6 py-4 ${theme === 'light' ? 'bg-zinc-100/95 border-zinc-200/80 text-zinc-600' : 'bg-black border-neutral-900 text-zinc-400'} border-t text-center text-xs font-mono flex items-center justify-between print:hidden`}>
          <span>Tip: Save as PDF to store locally as a perfect one-page ATS document.</span>
          <button 
            onClick={() => {
              onClose();
              playSound.playClose();
            }}
            className={`${theme === 'light' ? 'text-slate-900' : 'text-white hover:text-zinc-300'} font-bold underline cursor-pointer`}
          >
            Back to Interactive Canvas
          </button>
        </div>

        </div>

      </div>

      {/* Embedded print media helper - applies print override ONLY when modal is active */}
      <style>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          /* Hide absolutely everything else besides the modal CV sheet */
          #root, nav, footer, section, header, button, .print\\:hidden, #canvas, div[class*="backdrop-blur"] {
            display: none !important;
          }
          /* Ensure modal occupies whole printable context */
          div.fixed {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
            z-index: 99999 !important;
          }
          /* Ensure child scroll containers and flex boxes expand fully in physical prints */
          .relative, .overflow-y-auto {
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
          }
          .print\\:border-none {
            border: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
