import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Layers, 
  Terminal, 
  BrainCircuit, 
  Sparkles, 
  Zap, 
  Binary, 
  Activity, 
  CheckCircle2, 
  Play, 
  Settings,
  RefreshCw
} from 'lucide-react';
import { ProficienciesHeading } from '../AnimatedHeadings';
import SpotlightCard from '../SpotlightCard';
import MagneticTag from '../MagneticTag';
import { skillsList } from '../../data';
import { playSound } from '../../utils/audio';

interface Skill {
  name: string;
  category: string;
}

interface SkillsProps {
  sectionRevealVariants: any;
}

const SKILL_DETAILS: Record<string, string[]> = {
  "Python": ["NumPy", "Pandas", "Scikit", "Algorithms"],
  "Java": ["OOPs Design", "Data Structures", "JVM", "Multithread"],
  "JavaScript": ["ES6+ Async", "Client APIs", "Promises", "JSON"],
  "C": ["Pointers", "Memory", "Structures"],
  "HTML5 / CSS3": ["Flexbox/Grid", "Transitions", "Semantics"],
  "Next.js": ["Next-Auth", "App Router", "API Streaming"],
  "VS Code": ["Extensions", "Interactive Debug", "Profiling"],
  "Git & Version Control": ["Branching", "Stashing", "Merge Sync"],
  "GitHub": ["PR Actions", "CI workflows", "Pages Deploy"],
  "Adobe Premiere Pro": ["Timeline cuts", "Keyframing", "Color grading"],
  "Canva": ["Vector assets", "Typography pairing", "Branding"],
  "Prompt Engineering": ["Few-shot CoT", "System Anchoring", "Prompt Tuners"],
  "Antigravity Dev-Flows": ["AI Agent Pipelines", "Refactor Loops", "Automations"],
  "FastAPI integrations": ["Pydantic Models", "Uvicorn Engine", "Swagger Async"],
  "Video Narrative & Editing": ["Narrative design", "Audio Mixes", "Suturing"],
  "Social Media Outreach": ["Campaigning", "Outreach Metrics", "Copywriting"],
  "Leadership Hubs": ["ACM Operations", "Event Hosting", "Public Relations"],
  "Event Organizing": ["IICTDS Coordination", "Academic schedules", "Panels"],
  "Public Speaking": ["Keynoting", "Sponsor Hack pitches", "Technical QA"]
};

// Rich compilation stats database for the simulator
const SKILL_METRICS: Record<string, {
  proficiency: string;
  compiledSize: string;
  compilationTime: string;
  experienceLevel: string;
  primaryUse: string;
  threadSafety: string;
  status: string;
}> = {
  "Python": { proficiency: "92%", compiledSize: "4.8 MB", compilationTime: "120ms", experienceLevel: "Advanced", primaryUse: "Data Science, ML Pipelines, Automations", threadSafety: "GIL Constrained", status: "STABLE" },
  "Java": { proficiency: "85%", compiledSize: "12.4 MB", compilationTime: "310ms", experienceLevel: "Intermediate-Advanced", primaryUse: "OOP Design, Core DS & Algorithms", threadSafety: "Highly Safe", status: "VERIFIED" },
  "JavaScript": { proficiency: "88%", compiledSize: "1.2 MB", compilationTime: "45ms", experienceLevel: "Advanced", primaryUse: "Asynchronous Frontends, Custom DOM States", threadSafety: "Single-Threaded Event Loop", status: "STABLE" },
  "C": { proficiency: "78%", compiledSize: "0.2 MB", compilationTime: "80ms", experienceLevel: "Academic Foundations", primaryUse: "Low-level Pointer & Memory Control", threadSafety: "Manual Coordination", status: "VERIFIED" },
  "HTML5 / CSS3": { proficiency: "95%", compiledSize: "0.8 MB", compilationTime: "25ms", experienceLevel: "Expert", primaryUse: "Semantic Layouts, Responsive Typography", threadSafety: "N/A", status: "OPTIMIZED" },
  "Next.js": { proficiency: "84%", compiledSize: "18.2 MB", compilationTime: "420ms", experienceLevel: "Intermediate-Advanced", primaryUse: "Hybrid Serverless Apps, API Streams", threadSafety: "Thread-Safe Server runtime", status: "STABLE" },
  "VS Code": { proficiency: "90%", compiledSize: "N/A", compilationTime: "N/A", experienceLevel: "Power User", primaryUse: "Interactive Profiling & Rapid Workspace Debugs", threadSafety: "N/A", status: "ACTIVE" },
  "Git & Version Control": { proficiency: "88%", compiledSize: "N/A", compilationTime: "N/A", experienceLevel: "Advanced", primaryUse: "Distributed Branch Trees, Stashing, Merging", threadSafety: "Thread-Safe", status: "ACTIVE" },
  "GitHub": { proficiency: "85%", compiledSize: "N/A", compilationTime: "N/A", experienceLevel: "Advanced", primaryUse: "CI Workflows, Automations, Actions Setup", threadSafety: "N/A", status: "ACTIVE" },
  "Adobe Premiere Pro": { proficiency: "82%", compiledSize: "120.0 MB", compilationTime: "N/A", experienceLevel: "Creative Director", primaryUse: "Timeline Assembly, Video Cuts, Narrative Design", threadSafety: "N/A", status: "ACTIVE" },
  "Canva": { proficiency: "90%", compiledSize: "N/A", compilationTime: "N/A", experienceLevel: "Advanced", primaryUse: "Vector Asset Designs, Typography Pairings", threadSafety: "N/A", status: "ACTIVE" },
  "Prompt Engineering": { proficiency: "94%", compiledSize: "0.4 MB", compilationTime: "150ms", experienceLevel: "Expert", primaryUse: "Few-Shot CoT, System Anchoring, Tool Pipes", threadSafety: "Highly Safe", status: "OPTIMIZED" },
  "Antigravity Dev-Flows": { proficiency: "92%", compiledSize: "2.1 MB", compilationTime: "280ms", experienceLevel: "Advanced", primaryUse: "Autonomous Code Refactors, Agent Integration", threadSafety: "Asynchronous Pipes", status: "STABLE" },
  "FastAPI integrations": { proficiency: "85%", compiledSize: "3.5 MB", compilationTime: "110ms", experienceLevel: "Intermediate-Advanced", primaryUse: "Pydantic Models, Async APIs, Swagger Specs", threadSafety: "Event Loop Safe", status: "STABLE" },
  "Video Narrative & Editing": { proficiency: "80%", compiledSize: "N/A", compilationTime: "N/A", experienceLevel: "Creative Director", primaryUse: "Interactive Narratives, Video Commercial Promos", threadSafety: "N/A", status: "ACTIVE" },
  "Social Media Outreach": { proficiency: "85%", compiledSize: "N/A", compilationTime: "N/A", experienceLevel: "Lead Organizer", primaryUse: "Multi-Channel Campaigns, Outreach Metrics", threadSafety: "N/A", status: "ACTIVE" },
  "Leadership Hubs": { proficiency: "90%", compiledSize: "N/A", compilationTime: "N/A", experienceLevel: "Executive Cultural Lead", primaryUse: "ACM Chapter direction, PR, Host Coordinator", threadSafety: "N/A", status: "ACTIVE" },
  "Event Organizing": { proficiency: "88%", compiledSize: "N/A", compilationTime: "N/A", experienceLevel: "Backstage Management", primaryUse: "IICTDS coordination", threadSafety: "N/A", status: "ACTIVE" },
  "Public Speaking": { proficiency: "92%", compiledSize: "N/A", compilationTime: "N/A", experienceLevel: "Keynoter", primaryUse: "Pitching hackathon projects, Sponsor relations", threadSafety: "N/A", status: "ACTIVE" }
};

export default function Skills({ sectionRevealVariants }: SkillsProps) {
  const [activeSkillCat, setActiveSkillCat] = useState<'all' | 'languages' | 'web' | 'tools' | 'ai' | 'other'>('all');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [compilerProgress, setCompilerProgress] = useState<number>(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll terminal logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  // Initial load log setup
  useEffect(() => {
    setTerminalLogs([
      `[SYS_INIT]: Initializing Skill Matrix Simulator...`,
      `[SYS_READY]: Core compilers loaded. Select any technology above to begin compiling.`
    ]);
  }, []);

  const handleSelectSkill = (skillName: string) => {
    if (selectedSkill === skillName && isCompiling) return;
    
    setSelectedSkill(skillName);
    playSound.playClick();
    
    // Trigger compilation simulator sequence
    setIsCompiling(true);
    setCompilerProgress(0);
    setTerminalLogs(prev => [
      ...prev,
      `\n--------------------------------------`,
      `[RESOLVING]: Connecting repository tree for [${skillName}]...`,
      `[ANALYZING]: Indexing files, tracking primary use cases...`
    ]);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 10;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setIsCompiling(false);
        playSound.playOpen();
        setTerminalLogs(prev => [
          ...prev,
          `[COMPILING]: Object code compiled successfully!`,
          `[STATUS]: ${skillName} runtime state: [${SKILL_METRICS[skillName]?.status || 'STABLE'}]`,
          `[SYMBOLS]: ${JSON.stringify(SKILL_DETAILS[skillName] || [])}`,
          `[SYS_OK]: Compilation completed in ${SKILL_METRICS[skillName]?.compilationTime || '50ms'}. Ready.`
        ]);
      }
      setCompilerProgress(currentProgress);
    }, 80);
  };

  const getIcon = (category: string) => {
    if (category === 'languages') return Cpu;
    if (category === 'web') return Layers;
    if (category === 'tools') return Terminal;
    if (category === 'ai') return BrainCircuit;
    return Sparkles;
  };

  const activeMetrics = selectedSkill ? (SKILL_METRICS[selectedSkill] || {
    proficiency: "85%",
    compiledSize: "1.0 MB",
    compilationTime: "100ms",
    experienceLevel: "Intermediate",
    primaryUse: "General Development",
    threadSafety: "Safe",
    status: "ACTIVE"
  }) : null;

  return (
    <motion.section 
      id="skills" 
      variants={sectionRevealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      className="scroll-mt-24 text-left"
    >
      <ProficienciesHeading 
        subtitle="02 • Skillset" 
        title="SKILLS AND TECHNOLOGIES" 
      />

      <p className="text-zinc-400 text-sm md:text-base max-w-3xl mb-8 leading-relaxed">
        Click on any skill card to draw glowing interactive vectors, compile its symbols, and view metadata in the live terminal simulator.
      </p>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Skill Index Matrix */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Interactive filter tabs */}
          <div className="flex flex-wrap gap-1.5 border-b border-white/5 pb-4">
            {[
              { id: 'all', label: 'All' },
              { id: 'languages', label: 'Core Languages' },
              { id: 'web', label: 'Architecture' },
              { id: 'tools', label: 'Tools' },
              { id: 'ai', label: 'AI Flows' },
              { id: 'other', label: 'Leadership' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveSkillCat(tab.id as any);
                  playSound.playClick();
                }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wider transition-all uppercase duration-200 cursor-pointer ${
                  activeSkillCat === tab.id 
                    ? 'bg-amber-500 text-black font-extrabold shadow-md' 
                    : 'bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skillsList
              .filter(s => activeSkillCat === 'all' ? true : s.category === activeSkillCat)
              .map((skill) => {
                const IconComponent = getIcon(skill.category);
                const isSelected = selectedSkill === skill.name;
                const subTags = SKILL_DETAILS[skill.name] || [skill.category, "engineering"];

                return (
                  <div
                    key={skill.name}
                    onClick={() => handleSelectSkill(skill.name)}
                    className="cursor-pointer group relative h-full"
                  >
                    {/* Glowing Vector Beam background lines on selected skill */}
                    {isSelected && (
                      <span className="absolute -inset-px rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 blur-[2px] opacity-70 animate-pulse z-0" />
                    )}

                    <SpotlightCard className={`p-5 h-full flex flex-col justify-between relative z-10 transition-all duration-300 ${
                      isSelected 
                        ? 'bg-neutral-950 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]' 
                        : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                    }`}>
                      <div>
                        {/* Vector tracer circle and top row */}
                        <div className="flex items-center justify-between mb-3.5">
                          <div className="flex items-center gap-1.5 text-zinc-500 text-[9px] font-mono tracking-widest uppercase select-none">
                            <IconComponent className={`h-3.5 w-3.5 transition-colors ${
                              isSelected ? 'text-amber-500' : 'text-zinc-500 group-hover:text-zinc-300'
                            }`} />
                            <span>{skill.category}</span>
                          </div>
                          
                          {/* Radial glowing core point representing the vector nodes */}
                          <div className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                            isSelected 
                              ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' 
                              : 'bg-white/10 group-hover:bg-zinc-500'
                          }`} />
                        </div>

                        <h4 className={`text-xs font-mono font-black tracking-wide uppercase transition-colors ${
                          isSelected ? 'text-amber-500' : 'text-zinc-200 group-hover:text-white'
                        }`}>
                          {skill.name}
                        </h4>
                      </div>

                      {/* Subtags displaying in minimal horizontal list */}
                      <div className="flex flex-wrap gap-1 mt-4">
                        {subTags.slice(0, 3).map((tag, idx) => (
                          <span 
                            key={idx}
                            className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 border border-white/5 text-zinc-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </SpotlightCard>
                  </div>
                );
              })}
          </div>

        </div>

        {/* Right Side: Live Terminal Simulator */}
        <div className="lg:col-span-6 space-y-6 lg:sticky lg:top-24">
          
          <div className="bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
            {/* Terminal Top Window Controls */}
            <div className="bg-neutral-900 px-4 py-3 border-b border-white/5 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                </div>
                <span className="text-[10px] font-mono text-zinc-400 ml-3 tracking-wide flex items-center gap-1">
                  <Binary className="h-3.5 w-3.5 text-amber-500" />
                  darsh's-Terminal: ~/skills
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[9px] font-mono text-emerald-500 uppercase tracking-widest font-bold">LIVE_LINK</span>
              </div>
            </div>

            {/* Terminal Live Interactive Controls */}
            <div className="px-4 py-3 bg-black/90 border-b border-white/5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Settings className="h-3.5 w-3.5 text-zinc-500" />
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">PARAMETERS</span>
              </div>

              {/* Automatic Compiler Status Indicator */}
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-white/10 bg-white/5 font-mono text-[9px] tracking-wider uppercase text-zinc-400">
                <span className={`h-1.5 w-1.5 rounded-full ${isCompiling ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
                <span>{isCompiling ? "Compiling" : "Idle"}</span>
              </div>
            </div>

            {/* Dynamic visual compiler progress loader */}
            {isCompiling && (
              <div className="h-1 w-full bg-neutral-900 overflow-hidden relative">
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ width: `${compilerProgress}%` }}
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 shadow-[0_0_8px_#f59e0b]"
                />
              </div>
            )}

            {/* Live Terminal Output Frame */}
            <div className="p-4 flex-1 flex flex-col justify-between overflow-hidden bg-black/95">
              
              {/* Scrollable logs */}
              <div 
                ref={logContainerRef}
                className="flex-1 overflow-y-auto font-mono text-[8.5px] text-zinc-400 space-y-1 pr-2 custom-scrollbar text-left"
              >
                {terminalLogs.map((log, index) => (
                  <div key={index} className={`whitespace-pre-wrap leading-relaxed ${
                    log.includes('[SYS_OK]') || log.includes('successfully') ? 'text-emerald-500' :
                    log.includes('[SYS_INIT]') || log.includes('[SYS_READY]') ? 'text-zinc-500' :
                    log.includes('[STATUS]') ? 'text-amber-500 font-bold' :
                    log.includes('[RESOLVING]') ? 'text-blue-400' : 'text-zinc-400'
                  }`}>
                    {log}
                  </div>
                ))}
              </div>

              {/* Compiled JSON Target Object Box */}
              {selectedSkill && activeMetrics ? (
                <div className="mt-4 pt-4 border-t border-white/5 font-mono text-left">
                  <div className="flex items-center gap-1.5 text-zinc-500 text-[9px] uppercase tracking-wider mb-2 font-bold">
                    <Activity className="h-3 w-3 text-amber-500" />
                    <span>Compiled Metadata</span>
                  </div>

                  <div className="bg-neutral-900/50 border border-white/5 rounded-xl p-4 text-[12.5px] sm:text-[13px] md:text-sm space-y-2 leading-relaxed overflow-x-auto">
                    <div className="text-zinc-400">
                      <span className="text-purple-300 font-semibold">"active_node"</span>: <span className="text-emerald-300">"{selectedSkill}"</span>,
                    </div>
                    <div className="text-zinc-400">
                      <span className="text-purple-300 font-semibold">"experience"</span>: <span className="text-emerald-300">"{activeMetrics.experienceLevel}"</span>,
                    </div>
                    <div className="text-zinc-400">
                      <span className="text-purple-300 font-semibold">"primary_use_case"</span>: <span className="text-emerald-300">"{activeMetrics.primaryUse}"</span>,
                    </div>
                    <div className="text-zinc-400">
                      <span className="text-purple-300 font-semibold">"compiler_status"</span>: <span className="text-amber-300">"{isCompiling ? 'LOADING_RESOURCES' : activeMetrics.status}"</span>
                    </div>
                  </div>

                  {/* Simulated connection path */}
                  <div className="mt-3 flex items-center justify-between text-[9px] text-zinc-500 uppercase select-none">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      <span>State: Synced</span>
                    </div>
                    <span>Compiled size: {activeMetrics.compiledSize}</span>
                  </div>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-white/5 font-mono text-center py-10 text-zinc-600 text-[10px] uppercase tracking-wider select-none">
                  <span>No active node selected. Click on a skill to compile.</span>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </motion.section>
  );
}
