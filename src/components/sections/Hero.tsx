import { Github, Linkedin, Terminal, FileText } from 'lucide-react';
import { personalInfo } from '../../data';
import InteractiveDataGrid from '../InteractiveDataGrid';
import MagneticButton from '../MagneticButton';
import { playSound } from '../../utils/audio';

interface HeroProps {
  theme: 'dark' | 'light';
  typingText: string;
  setIsResumeOpen: (open: boolean) => void;
}

export default function Hero({ theme, typingText, setIsResumeOpen }: HeroProps) {
  return (
    <section 
      id="home" 
      className="min-h-[80vh] flex flex-col justify-center py-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Hero Left Content block */}
        <div className="lg:col-span-7 flex flex-col text-left gap-6">

          {/* Sub-headline greeting */}
          <div className="flex flex-col gap-2">
            <span className="text-sm md:text-base font-mono text-zinc-400 font-bold tracking-widest uppercase">
               HI THERE, I AM
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-black text-white tracking-tighter leading-none uppercase">
              {personalInfo.name}
            </h1>
            <div className="h-8 md:h-10 flex items-center mt-2.5">
              <span className="text-md sm:text-lg md:text-xl font-mono text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.25)] font-black">
                {typingText}
              </span>
              <span className="h-5 w-1 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse ml-1 inline-block"></span>
            </div>
          </div>

          {/* Brief introductory bio */}
          <p className="text-zinc-200 text-base sm:text-lg leading-relaxed max-w-xl font-sans">
            {personalInfo.aboutShort}
          </p>

          {/* Links dashboard shortcut */}
          <div className="flex flex-wrap gap-2.5 items-center mt-2">
            <a
              href={`https://${personalInfo.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white hover:scale-[1.05] text-zinc-400 hover:text-white transition-all flex items-center justify-center"
              aria-label="Visit my GitHub profile"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href={`https://${personalInfo.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white hover:scale-[1.05] text-zinc-400 hover:text-white transition-all flex items-center justify-center"
              aria-label="Visit my LinkedIn profile"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href={`https://${personalInfo.leetcode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white hover:scale-[1.05] text-zinc-400 hover:text-white transition-all flex items-center justify-center"
              aria-label="Visit my LeetCode profile"
            >
              <Terminal className="h-5 w-5 text-white" />
            </a>
            <span className="text-xs font-mono text-zinc-500 select-none mr-2 pl-1 hidden sm:inline">
              CONNECTS_OK:
            </span>
            <span className="text-sm font-mono text-zinc-100 font-bold select-all">{personalInfo.email}</span>
          </div>

          {/* Primary Call to Action buttons */}
          <div className="flex flex-wrap gap-4 mt-4">
            <MagneticButton href="#projects">
              EXPLORE PROJECTS
            </MagneticButton>
            <MagneticButton onClick={() => {
              setIsResumeOpen(true);
              playSound.playOpen();
            }}>
              <FileText className="h-4 w-4" />
              <span>VIEW RESUME</span>
            </MagneticButton>
          </div>

        </div>

        {/* Hero Right: Multi-node dynamic interactive simulation */}
        <div className="lg:col-span-5 h-[380px] lg:h-[450px]">
          <InteractiveDataGrid theme={theme} />
        </div>

      </div>
    </section>
  );
}
