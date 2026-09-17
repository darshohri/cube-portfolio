import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Mail, X, Menu, Download, ArrowUp, FileText } from 'lucide-react';

import { personalInfo, projectsList, Project } from './data';
import { playSound } from './utils/audio';

// Custom components & Hooks
import ScrollWire from './components/ScrollWire';
import PullCord from './components/PullCord';
import IntroAnimation from './components/IntroAnimation';
import ResumeViewer from './components/ResumeViewer';

import { useTheme } from './hooks/useTheme';
import { useScrollSpy } from './hooks/useScrollSpy';
import { useTypingCarousel } from './hooks/useTypingCarousel';

// Extracted sections
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Experience from './components/sections/Experience';
import Achievements from './components/sections/Achievements';
import Contact from './components/sections/Contact';
import Footer from './components/sections/Footer';
import ProjectDetailsModal from './components/sections/ProjectDetailsModal';

const sectionRevealVariants = {
  hidden: { 
    opacity: 0, 
    y: 35 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.21, 1.02, 0.43, 1.01],
    }
  }
};

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [isWebsiteLoaded, setIsWebsiteLoaded] = useState(false);

  // Hook integrations
  const { theme, toggleTheme } = useTheme(showIntro);
  const { activeSection, isNavScrolled, showScrollTop } = useScrollSpy();
  const { typingText } = useTypingCarousel(showIntro, isWebsiteLoaded);

  // Custom Modals
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Filter and mobile navigation state
  const [activeProjCat, setActiveProjCat] = useState<'all' | 'aiml' | 'web'>('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Project categorizer filter
  const filteredProjects = activeProjCat === 'all'
    ? projectsList
    : projectsList.filter(p => p.category === activeProjCat);

  // Parallax scroll velocity effects
  const { scrollY } = useScroll();
  const gridY = useTransform(scrollY, [0, 4000], [0, 350]);

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro ? (
          <IntroAnimation key="intro" onComplete={() => setShowIntro(false)} />
        ) : (
          <motion.div
            key="main-web"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={() => setIsWebsiteLoaded(true)}
            className={`min-h-screen ${theme === 'light' ? 'light text-slate-900 bg-slate-50' : 'bg-[#000000] text-zinc-100'} font-sans tracking-tight antialiased relative overflow-x-hidden transition-colors duration-500`}
          >
            {/* High-contrast physical digital film grain overlay */}
            <div className="noise-overlay" />
            
            {/* Dynamic ambient grid background styling with slow transform parallax */}
            <motion.div 
              style={{ y: gridY }}
              className="fixed inset-0 ambient-grid-bg bg-[size:6rem_6rem] pointer-events-none z-0"
            />

            {/* Kinetic scroll timeline wire */}
            <ScrollWire activeSection={activeSection} />

            {/* Modern responsive glassmorphic sticky navbar */}
            <header 
              id="navbar-portal"
              className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
                isNavScrolled 
                  ? 'bg-[#000000]/95 backdrop-blur-md border-b border-neutral-900 shadow-2xl py-3' 
                  : 'bg-transparent py-5'
              }`}
            >
              <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between relative">
                {/* Brand spacer */}
                <div className="w-10 h-9 hidden md:block" />

                {/* Desktop navigation channels */}
                <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5 backdrop-blur-sm">
                  {['home', 'about', 'skills', 'projects', 'experience', 'achievements', 'contact'].map((sect) => (
                    <a
                      key={sect}
                      href={`#${sect}`}
                      onClick={() => playSound.playClick()}
                      className={`px-4 py-1.5 rounded-full text-xs font-mono font-medium tracking-wide uppercase transition-all duration-200 ${
                        activeSection === sect 
                          ? 'bg-amber-500 text-black font-extrabold shadow-md shadow-amber-500/20' 
                          : 'text-zinc-500 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {sect === 'achievements' ? 'certifications' : sect}
                    </a>
                  ))}
                </nav>

                {/* Header CTA Action handles */}
                <div className="hidden md:flex items-center gap-3 relative mr-12 pr-4">
                  <button
                    onClick={() => {
                      setIsResumeOpen(true);
                      playSound.playOpen();
                    }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border transition-all text-xs font-mono font-bold cursor-pointer hover:scale-[1.03] ${
                      theme === 'light'
                        ? 'bg-slate-900/10 hover:bg-slate-900/15 border-slate-900/20 text-slate-800'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-white hover:border-white'
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Interactive CV</span>
                  </button>
                  
                  <a
                    href="mailto:darshohri@gmail.com"
                    onClick={() => playSound.playClick()}
                    className={`p-2 rounded-xl border transition-all hover:scale-[1.04] inline-flex items-center justify-center cursor-pointer shadow-md ${
                      theme === 'light'
                        ? 'bg-slate-900/10 hover:bg-slate-900/15 border-slate-900/20 text-slate-800 shadow-slate-900/5'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-white hover:border-white shadow-white/5'
                    }`}
                    title="Message Darsh directly"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </div>

                {/* Dedicated layout-aligned slot for Pull Cord to resolve overlap */}
                <div className="hidden md:block absolute right-1 md:right-2 top-1/2 -translate-y-1/2 w-16 h-10 select-none pointer-events-auto">
                  <PullCord theme={theme} toggleTheme={toggleTheme} />
                </div>

                {/* Mobile hamburger menu toggle */}
                <div className="md:hidden flex items-center gap-2 relative mr-12">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(!isMobileMenuOpen);
                      playSound.playClick();
                    }}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white cursor-pointer"
                  >
                    {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-4" />}
                  </button>
                </div>

                {/* Mobile-aligned slot for Pull Cord to resolve mobile overlap */}
                <div className="md:hidden absolute right-1 top-1/2 -translate-y-1/2 w-12 h-10 select-none pointer-events-auto">
                  <PullCord theme={theme} toggleTheme={toggleTheme} />
                </div>
              </div>

              {/* Mobile menu sheet overlay block */}
              <AnimatePresence>
                {isMobileMenuOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="md:hidden w-full bg-[#000000]/95 border-b border-neutral-900 px-4 py-6 text-left absolute left-0 top-full overflow-hidden shadow-2xl backdrop-blur-xl"
                  >
                    <div className="flex flex-col gap-3">
                      {['home', 'about', 'skills', 'projects', 'experience', 'achievements', 'contact'].map((sect) => (
                        <a
                          key={sect}
                          href={`#${sect}`}
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            playSound.playClick();
                          }}
                          className={`px-4 py-2.5 rounded-xl text-sm font-mono uppercase tracking-wider block border transition-all ${
                            activeSection === sect 
                              ? 'bg-amber-500 border-amber-500 text-black font-extrabold shadow-lg shadow-amber-500/20' 
                              : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {sect === 'achievements' ? 'certifications' : sect}
                        </a>
                      ))}
                      
                      <div className="grid grid-cols-2 gap-3 mt-4 border-t border-white/5 pt-4">
                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setIsResumeOpen(true);
                          }}
                          className={`flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border text-xs font-mono font-bold shadow-md transition-all cursor-pointer ${
                            theme === 'light'
                              ? 'bg-slate-900/10 border-slate-900/15 text-slate-800 shadow-slate-900/5'
                              : 'bg-white/5 border-white/10 text-white shadow-white/5'
                          }`}
                        >
                          <Download className="h-4 w-4" />
                          <span>Download CV</span>
                        </button>
                        <a
                          href="mailto:darshohri@gmail.com"
                          className={`flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border text-xs font-mono font-bold shadow-md transition-all cursor-pointer ${
                            theme === 'light'
                              ? 'bg-slate-900/10 border-slate-900/15 text-slate-800 shadow-slate-900/15'
                              : 'bg-white/5 border-white/10 text-white hover:border-white shadow-white/5'
                          }`}
                        >
                          <Mail className="h-4 w-4" />
                          <span>Email Me</span>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </header>

            {/* Main Container Core */}
            <main className="relative z-10 pt-24 px-4 md:px-8 max-w-7xl mx-auto flex flex-col gap-24 md:gap-32 pb-24">
              
              <Hero 
                theme={theme} 
                typingText={typingText} 
                setIsResumeOpen={setIsResumeOpen} 
              />
              
              <About sectionRevealVariants={sectionRevealVariants} />
              
              <Skills sectionRevealVariants={sectionRevealVariants} />
              
              <Projects 
                sectionRevealVariants={sectionRevealVariants}
                activeProjCat={activeProjCat}
                setActiveProjCat={setActiveProjCat}
                filteredProjects={filteredProjects}
                setSelectedProject={setSelectedProject}
              />
              
              <Experience sectionRevealVariants={sectionRevealVariants} />
              
              <Achievements 
                sectionRevealVariants={sectionRevealVariants} 
                theme={theme} 
              />
              
              <Contact sectionRevealVariants={sectionRevealVariants} />

            </main>

            <Footer />

            <ProjectDetailsModal 
              project={selectedProject} 
              onClose={() => setSelectedProject(null)} 
              theme={theme} 
            />

            {/* Floating Go to Top Button */}
            <AnimatePresence>
              {showScrollTop && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 h-10 w-10 md:h-12 md:w-12 rounded-full bg-black/85 border border-amber-500/25 hover:border-amber-500 text-amber-500 hover:text-white flex items-center justify-center shadow-[0_4px_20px_rgba(245,158,11,0.15)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.35)] backdrop-blur-md cursor-pointer transition-all hover:scale-110 active:scale-95"
                  aria-label="Go to top"
                >
                  <ArrowUp className="h-5 w-5 animate-pulse" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Resume viewer modal sheet */}
            <ResumeViewer isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} theme={theme} />

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
