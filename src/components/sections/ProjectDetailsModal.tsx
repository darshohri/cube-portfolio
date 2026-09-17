import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Project } from '../../data';
import { playSound } from '../../utils/audio';

interface ProjectDetailsModalProps {
  project: Project | null;
  onClose: () => void;
  theme: 'dark' | 'light';
}

export default function ProjectDetailsModal({ project, onClose, theme }: ProjectDetailsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Focus Trapping and Restoration
  useEffect(() => {
    if (project) {
      // Store currently focused element to restore it later
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
            // Shift + Tab
            if (document.activeElement === firstEl) {
              lastEl.focus();
              e.preventDefault();
            }
          } else {
            // Tab
            if (document.activeElement === lastEl) {
              firstEl.focus();
              e.preventDefault();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      // Focus the modal close button or first element inside
      setTimeout(() => {
        if (modalRef.current) {
          const closeBtn = modalRef.current.querySelector<HTMLButtonElement>('button[aria-label="Close details"]');
          if (closeBtn) {
            closeBtn.focus();
          } else {
            const firstFocusable = modalRef.current.querySelector<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])');
            firstFocusable?.focus();
          }
        }
      }, 50);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        // Restore focus
        if (triggerRef.current) {
          triggerRef.current.focus();
        }
      };
    }
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
        >
          <motion.div 
            ref={modalRef}
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-project-title"
            className="w-full max-w-2xl bg-[#030303] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col gap-6 text-left shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-bold">
                  Project Architecture Review
                </span>
                <h3 id="modal-project-title" className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight">
                  {project.title}
                </h3>
                <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest mt-0.5">
                  {project.subtitle}
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  playSound.playClose();
                }}
                aria-label="Close details"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/15 cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 bg-black border border-white/5 rounded-xl flex flex-wrap gap-x-6 gap-y-2 text-xs text-zinc-400 font-mono">
              <div>
                <strong>Session:</strong> <span className="text-zinc-200">{project.period}</span>
              </div>
              {project.role && (
                <div>
                  <strong>My Role:</strong> <span className="text-zinc-200">{project.role}</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-mono tracking-widest font-bold uppercase text-zinc-300">
                Core Implementation Details
              </h4>
              
              <ul className="space-y-3.5 text-xs text-zinc-400 leading-relaxed font-sans pl-1">
                {project.details.map((detail, idx) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <div className="h-1.5 w-1.5 rounded-full bg-white mt-2 shrink-0"></div>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5">
              <h5 className="text-[10px] font-mono uppercase text-zinc-500 mb-2 font-bold tracking-wider">Technical Stack</h5>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((term, i) => (
                  <span key={i} className="text-xs font-mono px-3 py-1 rounded-xl bg-black border border-white/5 text-white font-semibold">
                    {term}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                playSound.playClose();
              }}
              className="w-full mt-2 py-3 rounded-xl bg-white hover:bg-neutral-200 font-mono text-xs font-bold text-black transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              Close Details
            </button>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
