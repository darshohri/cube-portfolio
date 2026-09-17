import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal as TerminalIcon, 
  FileText, 
  History, 
  Code, 
  ChevronRight, 
  BookOpen, 
  Briefcase, 
  Layers, 
  Cpu, 
  Sparkles,
  Command
} from 'lucide-react';
import { personalInfo, educationList, experienceList } from '../../data';
import { AboutBentoHeading } from '../AnimatedHeadings';
import { playSound } from '../../utils/audio';

interface AboutProps {
  sectionRevealVariants: any;
}

type TabType = 'whoami.sh' | 'education.json' | 'extracurricular.log' | 'philosophy.md';
type StoryLength = 'minimal' | 'detailed';

export default function About({ sectionRevealVariants }: AboutProps) {
  const [activeTab, setActiveTab] = useState<TabType>('whoami.sh');
  const [storyLength, setStoryLength] = useState<StoryLength>('minimal');

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    playSound.playClick();
  };

  const handleToggleStoryLength = (length: StoryLength) => {
    setStoryLength(length);
    playSound.playOpen();
  };

  // Helper to generate dynamic lines for the terminal window border
  const getLineNumbersCount = () => {
    if (activeTab === 'whoami.sh') return storyLength === 'minimal' ? 12 : 22;
    if (activeTab === 'education.json') return storyLength === 'minimal' ? 14 : 26;
    if (activeTab === 'extracurricular.log') return storyLength === 'minimal' ? 12 : 24;
    return storyLength === 'minimal' ? 10 : 20;
  };

  return (
    <motion.section 
      id="about" 
      variants={sectionRevealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      className="scroll-mt-24 text-left"
    >
      <AboutBentoHeading 
        subtitle="01 • About Me" 
        title="MY BACKGROUND" 
      />

      <p className="text-zinc-400 text-sm md:text-base max-w-3xl mb-8 leading-relaxed">
        Toggle between files, run commands, and swap between a high-level minimal view and comprehensive detailed profiles to explore my background as a developer and creator.
      </p>

      {/* Main Dossier Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Dossier Workspace Navigation Map */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 backdrop-blur-md">
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-bold mb-4 flex items-center gap-2">
              <Command className="h-3.5 w-3.5 text-amber-500" />
              SYSTEM NAVIGATOR
            </h3>
            
            {/* Folder buffers */}
            <div className="flex flex-col gap-2.5">
              {[
                { id: 'whoami.sh' as TabType, label: 'whoami.sh', desc: 'Personal script & focus', icon: TerminalIcon },
                { id: 'education.json' as TabType, label: 'education.json', desc: 'Institution & records', icon: Code },
                { id: 'extracurricular.log' as TabType, label: 'extracurricular.log', desc: 'Leadership & events log', icon: History },
                { id: 'philosophy.md' as TabType, label: 'philosophy.md', desc: 'Core engineering ethos', icon: FileText },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all duration-300 flex items-start gap-3 group relative cursor-pointer ${
                      isSelected 
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-[inset_0_1px_20px_rgba(245,158,11,0.05)]' 
                        : 'bg-transparent border-white/5 text-zinc-400 hover:border-white/15 hover:bg-white/[0.01]'
                    }`}
                  >
                    {isSelected && (
                      <motion.div 
                        layoutId="activeNavIndicator" 
                        className="absolute left-0 top-1/3 bottom-1/3 w-1 bg-amber-500 rounded-r-full" 
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <div className={`p-2 rounded-lg transition-colors ${
                      isSelected ? 'bg-amber-500/20 text-amber-500' : 'bg-white/5 text-zinc-500 group-hover:text-white'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-mono font-bold tracking-tight uppercase ${
                          isSelected ? 'text-amber-500' : 'text-zinc-200 group-hover:text-white'
                        }`}>
                          {tab.label}
                        </span>
                        <ChevronRight className={`h-3 w-3 transition-transform duration-200 ${
                          isSelected ? 'text-amber-500 translate-x-0.5' : 'text-zinc-600 group-hover:text-zinc-400'
                        }`} />
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-0.5 font-mono truncate">{tab.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>


        </div>

        {/* Right Column: Dynamic Dossier Terminal */}
        <div className="lg:col-span-8 flex flex-col h-full">
          
          {/* Terminal Window Header Control Panel */}
          <div className="bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col flex-1">
            <div className="bg-neutral-900 px-4 py-3 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 select-none">
              <div className="flex items-center gap-6">
                {/* Simulated window circles */}
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                {/* Active command window path */}
                <span className="text-sm sm:text-base font-mono text-zinc-400 tracking-wide flex items-center gap-1.5">
                  <TerminalIcon className="h-4 w-4 text-zinc-500" />
                  darsh's-Terminal: ~/{activeTab}
                </span>
              </div>

              {/* Story Length Controller ([MINIMAL] / [DETAILED]) */}
              <div className="flex items-center gap-1 bg-black/40 p-1 border border-white/5 rounded-xl">
                <button
                  onClick={() => handleToggleStoryLength('minimal')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-widest uppercase transition-all duration-200 cursor-pointer ${
                    storyLength === 'minimal'
                      ? 'bg-amber-500 text-black font-extrabold shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  [Minimal]
                </button>
                <button
                  onClick={() => handleToggleStoryLength('detailed')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-widest uppercase transition-all duration-200 cursor-pointer ${
                    storyLength === 'detailed'
                      ? 'bg-amber-500 text-black font-extrabold shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  [Detailed]
                </button>
              </div>
            </div>

            {/* Terminal Body Interface */}
            <div className="p-5 md:p-8 font-mono text-sm sm:text-base text-zinc-300 flex-1 flex bg-black/95 relative min-h-[420px] md:min-h-[480px]">
              
              {/* Virtual Line Numbers Column */}
              <div className="hidden sm:flex flex-col select-none text-right pr-4 border-r border-white/5 text-zinc-600 font-mono text-sm sm:text-base text-right mr-4 leading-relaxed">
                {Array.from({ length: getLineNumbersCount() }).map((_, i) => (
                  <span key={i} className="block">{String(i + 1).padStart(2, '0')}</span>
                ))}
              </div>

              {/* Console Output Area with motion transitions */}
              <div className="flex-1 overflow-x-auto text-left leading-relaxed min-w-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeTab}-${storyLength}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-5"
                  >
                    {/* Active Command Run Label */}
                    <div className="text-zinc-500 flex items-center gap-1.5 text-sm sm:text-base">
                      <span className="text-emerald-500 font-bold">$</span>
                      {activeTab === 'whoami.sh' && <span>./whoami.sh --story={storyLength}</span>}
                      {activeTab === 'education.json' && <span>cat education.json | jq '.spec' --depth={storyLength === 'minimal' ? 1 : 2}</span>}
                      {activeTab === 'extracurricular.log' && <span>tail -n {storyLength === 'minimal' ? 4 : 10} extracurricular.log</span>}
                      {activeTab === 'philosophy.md' && <span>glow philosophy.md --theme=dracula</span>}
                    </div>

                    {/* Buffer outputs mapping */}

                    {/* Buffer 1: whoami.sh */}
                    {activeTab === 'whoami.sh' && (
                      <div className="space-y-5">
                        <div className="text-amber-500 font-bold text-base sm:text-lg tracking-tight flex items-center gap-1.5">
                          <Cpu className="h-5 w-5 shrink-0 text-amber-500" />
                          DARSH OHRI • SOFTWARE DEVELOPER & DATA ENGINEER
                        </div>

                        {storyLength === 'minimal' ? (
                          // MINIMAL SHORT-FORM
                          <div className="space-y-4 font-mono">
                            <p className="text-zinc-300">
                              B.Tech Computer Science student at <strong className="text-white">NMIMS Chandigarh (2025–2029)</strong> specializing in Data Science. Passionate about algorithms, robust visual web applications, and local AI workflows.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                              <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                                <span className="text-amber-500 text-xs uppercase font-bold block mb-1">CORE EXPERTISE</span>
                                <span className="text-zinc-200">Algorithmic Engineering & Interactive Frontend Structures</span>
                              </div>
                              <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                                <span className="text-amber-500 text-xs uppercase font-bold block mb-1">SPECIAL FOCUS</span>
                                <span className="text-zinc-200">Python Systems, Java Architecture, AI Integrations</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2.5 pt-2 items-center">
                              <span className="text-xs text-zinc-500 uppercase font-bold mr-1">ACTIVE MODES:</span>
                              {["Data-Science", "React", "Next.js", "FastAPI"].map((tg) => (
                                <span key={tg} className="text-xs px-2.5 py-1 bg-zinc-900 border border-neutral-800 text-zinc-400 rounded-md">
                                  {tg}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          // DETAILED NARRATIVE
                          <div className="space-y-5 text-zinc-300 font-sans text-base sm:text-lg leading-relaxed">
                            {personalInfo.aboutLong.map((paragraph, index) => (
                              <p key={index} className="text-zinc-300">
                                {paragraph}
                              </p>
                            ))}
                            <div className="border-t border-white/5 pt-5 mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs sm:text-sm">
                              <div>
                                <span className="text-amber-500 uppercase font-bold block mb-1">PROGRAMS:</span>
                                <span className="text-zinc-300">Python, Java, JavaScript, C, HTML/CSS</span>
                              </div>
                              <div>
                                <span className="text-amber-500 uppercase font-bold block mb-1">TECH STACK:</span>
                                <span className="text-zinc-300">FastAPI, Next.js, Git, Premiere Pro, Canva</span>
                              </div>
                              <div>
                                <span className="text-amber-500 uppercase font-bold block mb-1">SOFT SKILLS:</span>
                                <span className="text-zinc-300">Public Speaking, Event Organizing</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Buffer 2: education.json */}
                    {activeTab === 'education.json' && (
                      <div className="space-y-5">
                        {/* JSON Syntax Highlight Print */}
                        <div className="p-4 bg-neutral-900/60 rounded-xl border border-white/5 font-mono text-sm sm:text-base leading-relaxed max-w-full overflow-x-auto text-left">
                          <span className="text-purple-400">{"{"}</span>
                          <div className="pl-4">
                            <span className="text-zinc-500">"institution":</span> <span className="text-emerald-400">"SVKM's NMIMS Chandigarh"</span>,
                            <br />
                            <span className="text-zinc-500">"degree":</span> <span className="text-emerald-400">"B.tech Computer Science & Engineering"</span>,
                            <br />
                            <span className="text-zinc-500">"specialization":</span> <span className="text-emerald-400">"Data Science"</span>,
                            <br />
                            <span className="text-zinc-500">"duration":</span> <span className="text-emerald-400">"2025 – 2029"</span>,
                            <br />
                            <span className="text-zinc-500">"location":</span> <span className="text-emerald-400">"Chandigarh, IN"</span>,
                            <br />
                            <span className="text-zinc-500">"status":</span> <span className="text-blue-400">"active undergrad"</span>
                            {storyLength === 'detailed' && (
                              <>
                                ,<br />
                                <span className="text-zinc-500">"curriculum_focus":</span> <span className="text-amber-400">{"["}</span>
                                <div className="pl-4">
                                  <span className="text-emerald-400">"Python Engines"</span>,
                                  <br />
                                  <span className="text-emerald-400">"Analytical Data Modeling"</span>,
                                  <br />
                                  <span className="text-emerald-400">"Statistical Logic"</span>,
                                  <br />
                                  <span className="text-emerald-400">"Database Architectures (SQL/FastAPI)"</span>
                                </div>
                                <span className="text-amber-400">{"]"}</span>
                              </>
                            )}
                          </div>
                          <span className="text-purple-400">{"}"}</span>
                        </div>

                        {storyLength === 'detailed' && (
                          <div className="space-y-4 font-sans text-base sm:text-lg">
                            <div className="flex gap-3 items-center bg-white/5 border border-white/5 rounded-xl p-4 text-zinc-300">
                              <BookOpen className="h-5 w-5 shrink-0 text-amber-500" />
                              <span>
                                Rigorous coursework in computing fundamentals, Object-Oriented paradigms (Java), structural design algorithms, and responsive client development.
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Buffer 3: extracurricular.log */}
                    {activeTab === 'extracurricular.log' && (
                      <div className="space-y-5">
                        <div className="space-y-3 text-zinc-400 font-mono text-xs sm:text-sm leading-relaxed">
                          <div>
                            <span className="text-zinc-600">[2025-09-12 10:00:00]</span> <span className="text-blue-400">[INFO]</span> <span className="text-zinc-200">Voted Cultural Coordinator of ACM Student Chapter at NMIMS.</span>
                          </div>
                          <div>
                            <span className="text-zinc-600">[2025-10-05 14:32:10]</span> <span className="text-amber-500">[LEAD]</span> <span className="text-zinc-200">Directed logistics for IICTDS 2025 Conference operations.</span>
                          </div>
                          <div>
                            <span className="text-zinc-600">[2026-01-08 09:15:00]</span> <span className="text-emerald-400">[CORP]</span> <span className="text-zinc-200">Began Social Media Internship at Management Analytics Gateway (MAG).</span>
                          </div>
                          {storyLength === 'detailed' && (
                            <>
                              <div>
                                <span className="text-zinc-600">[2026-02-14 16:40:00]</span> <span className="text-blue-400">[INFO]</span> <span className="text-zinc-200">Produced high-impact video commercials leveraging Adobe Premiere.</span>
                              </div>
                              <div>
                                <span className="text-zinc-600">[2026-03-01 11:05:22]</span> <span className="text-purple-400">[AUD]</span> <span className="text-zinc-200">Managed cross-chapter conference operations reaching 300+ students.</span>
                              </div>
                            </>
                          )}
                        </div>

                        {storyLength === 'detailed' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 font-sans text-sm">
                            <div className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-2">
                              <span className="font-mono text-amber-500 uppercase tracking-wider font-bold block text-xs">ACM chapter leader</span>
                              <p className="text-zinc-300">
                                Facilitate technical symposiums, host guest speakers, coordinate with directors, and manage volunteer channels for inclusive college ecosystems.
                              </p>
                            </div>
                            <div className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-2">
                              <span className="font-mono text-amber-500 uppercase tracking-wider font-bold block text-xs">MAG multimedia intern</span>
                              <p className="text-zinc-300">
                                Scripted and assembled digital campaigns, co-tracked analytics dashboard statistics, and helped increase organic interaction milestones.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Buffer 4: philosophy.md */}
                    {activeTab === 'philosophy.md' && (
                      <div className="space-y-5">
                        <div className="space-y-4 font-sans text-base sm:text-lg">
                          <h4 className="text-xs sm:text-sm font-mono uppercase tracking-widest text-amber-500 font-bold">
                            ## MISSION STATEMENT
                          </h4>
                          <p className="text-zinc-300 italic leading-relaxed border-l-2 border-amber-500 pl-4 my-2 text-base sm:text-lg">
                            "Connecting predictive mathematical formulas and robust data architectures with visually seamless front-end states to simplify complicated daily challenges."
                          </p>

                          {storyLength === 'detailed' ? (
                            <div className="space-y-4 pt-2">
                              <h4 className="text-xs sm:text-sm font-mono uppercase tracking-widest text-zinc-400 font-bold">
                                ## PRINCIPLES OF ENGINEERING
                              </h4>
                              <ul className="space-y-3 text-zinc-300 text-sm sm:text-base">
                                <li className="flex items-start gap-2.5">
                                  <span className="text-amber-500 font-bold shrink-0 mt-0.5 font-mono">1.</span>
                                  <span>
                                    <strong>Architectural Integrity:</strong> Keep systems modular, type-safe, and cleanly layered. Let APIs fail-safe rather than passing stale datasets.
                                  </span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                  <span className="text-amber-500 font-bold shrink-0 mt-0.5 font-mono">2.</span>
                                  <span>
                                    <strong>Interactive Accessibility:</strong> Reduce layout complexity and cognitive load. Empower reviewers with responsive, satisfying interactive panels.
                                  </span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                  <span className="text-amber-500 font-bold shrink-0 mt-0.5 font-mono">3.</span>
                                  <span>
                                    <strong>Human Synergy:</strong> Leverage advanced prompt engineering workflows to bypass boilerplate setups and shift focus directly onto refining custom core business logic.
                                  </span>
                                </li>
                              </ul>
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2 pt-2">
                              <span className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-500 font-mono px-3 py-1 rounded">#DataAccuracy</span>
                              <span className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-500 font-mono px-3 py-1 rounded">#StateEfficiency</span>
                              <span className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-500 font-mono px-3 py-1 rounded">#CleanCodeFlow</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Animated Cursor */}
                    <div className="pt-2 flex items-center gap-1 text-zinc-500 text-xs font-mono">
                      <motion.span 
                        animate={{ opacity: [1, 0, 1] }} 
                        transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut" }}
                        className="inline-block w-2 h-4.5 bg-amber-500"
                      />
                    </div>

                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>

        </div>

      </div>
    </motion.section>
  );
}
