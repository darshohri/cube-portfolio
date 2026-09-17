import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Award, 
  Sparkles,
  Briefcase,
  GraduationCap,
  Film
} from 'lucide-react';
import { MilestonesHeading } from '../AnimatedHeadings';
import { playSound } from '../../utils/audio';

interface Metric {
  label: string;
  value: number;
  suffix: string;
}

interface MilestoneCard {
  role: string;
  company: string;
  location: string;
  duration: string;
  icon: any;
  bullets: string[];
  techUsed: string[];
  metrics: Metric[];
}

interface Milestone {
  year: string;
  labelText: string;
  bgAccent: string;
  borderAccent: string;
  textAccent: string;
  glowColor: string;
  cards: MilestoneCard[];
}

interface ExperienceProps {
  sectionRevealVariants: any;
}

// Sub-component for smooth fluid roll-up integer count animation
function CountUp({ value, suffix = "", duration = 1200 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = 0;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // easeOutQuad curve
      const easeProgress = progress * (2 - progress);
      
      setCount(Math.floor(startValue + easeProgress * (value - startValue)));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

const MILESTONES: Milestone[] = [
  {
    year: "2023",
    labelText: "Union Bank",
    bgAccent: "from-blue-500/10 to-indigo-500/10",
    borderAccent: "border-blue-500/30",
    textAccent: "text-blue-500",
    glowColor: "rgba(59, 130, 246, 0.15)",
    cards: [
      {
        role: "National Finalist (U-Genius 2.0)",
        company: "Union Bank of India Quiz Competition",
        location: "Chandigarh / Mumbai (National Finals)",
        duration: "Academic Year 2023",
        icon: Award,
        bullets: [
          "Won the highly competitive Chandigarh regional round, qualifying as the division representative for general intellect and strategic analytics.",
          "Traveled to Mumbai for the national finals round, competing against top minds from across India and solidifying a love for core analytical trivia.",
          "Recognized by Union Bank of India executives for high general knowledge, quantitative prowess, and cognitive consistency under high pressure."
        ],
        techUsed: ["Quantitative Analytics", "General Science", "Trivia Coordination", "Strategic Logic"],
        metrics: [
          { label: "Competitors Faced", value: 1000, suffix: "+" },
          { label: "Chandigarh Region", value: 1, suffix: "st" },
          { label: "National Finals", value: 16, suffix: "th" }
        ]
      }
    ]
  },
  {
    year: "2024",
    labelText: "Dubai Local",
    bgAccent: "from-purple-500/10 to-pink-500/10",
    borderAccent: "border-purple-500/30",
    textAccent: "text-purple-500",
    glowColor: "rgba(168, 85, 247, 0.15)",
    cards: [
      {
        role: "Lead Video Creator & Editor",
        company: "Dubai Local Project",
        location: "Remote Collaboration",
        duration: "Mid 2024",
        icon: Film,
        bullets: [
          "Mastered professional video editing workflow, transition designs, and narrative cuts using professional post-production software.",
          "Produced and dynamically structured a high-impact video advertisement for 'Dubai local', creating a highly engaging visual commercial.",
          "Assembled digital motion assets, custom audio-track structures, and voiceovers to increase viewer hook retention and metrics."
        ],
        techUsed: ["Adobe Premiere Pro", "Narrative cuts", "Sound design", "Motion design", "Dubai Local project"],
        metrics: [
          { label: "Retention Rate", value: 85, suffix: "%" },
          { label: "Ad Campaigns", value: 1, suffix: "" },
          { label: "Creative Cuts", value: 50, suffix: "+" }
        ]
      }
    ]
  },
  {
    year: "2025",
    labelText: "SVKM'S NMIMS",
    bgAccent: "from-amber-500/10 to-orange-500/10",
    borderAccent: "border-amber-500/30",
    textAccent: "text-amber-500",
    glowColor: "rgba(245, 158, 11, 0.15)",
    cards: [
      {
        role: "Cultural Coordinator",
        company: "SVKM's NMIMS Chandigarh",
        location: "Chandigarh, India",
        duration: "September 2025 – Present",
        icon: GraduationCap,
        bullets: [
          "Lead cross-departmental teams to manage, orchestrate, and host community events, fostering strong technical and interpersonal bonds among 300+ members.",
          "Liaise directly with SVKM directors, ACM chairs, and international advisors to coordinate speaker logistics and execute weekly code circles.",
          "Appointed as key Organizing Committee representative for the IICTDS International Conference on Technological Data Systems."
        ],
        techUsed: ["Event Operations", "Public Speaking", "Community Hubs", "Team Collaboration"],
        metrics: [
          { label: "Student Outreach", value: 300, suffix: "+" },
          { label: "ANVIKSHA 2.0 Standing", value: 1, suffix: "st" },
          { label: "SVKM Organizing", value: 2, suffix: "x" }
        ]
      },
      {
        role: "Anviksha 2.0 Winner",
        company: "Array Pata Hai? Quiz Competition",
        location: "NMIMS Chandigarh",
        duration: "September 2025",
        icon: Award,
        bullets: [
          "Won 1st place in a multi-round, fast-paced general knowledge and trivia-driven quiz competition featuring various categories and questions.",
          "Demonstrated rapid problem-solving, cognitive agility, and deep analytical domain coverage under intense time pressure.",
          "Collaborated with peers to dissect core technical questions and resolve challenging academic logic puzzles."
        ],
        techUsed: ["General Knowledge", "Rapid Trivia", "Strategic Mindset"],
        metrics: [
          { label: "Standing", value: 1, suffix: "st" },
          { label: "Participants", value: 80, suffix: "+" },
          { label: "Accuracy Rate", value: 92, suffix: "%" }
        ]
      },
      {
        role: "IICTDS Representative",
        company: "International Conference on Technological Data Systems",
        location: "NMIMS Chandigarh",
        duration: "September 2025",
        icon: GraduationCap,
        bullets: [
          "Managed coordinate logistics, speaker portfolios, technology audio-visual setups, and guest director reception.",
          "Structured administrative frameworks and scheduling grids for high-level international speakers and technical panel presenters.",
          "Co-managed backstage speaker operations to guarantee seamless audiovisual execution across multiple tracks."
        ],
        techUsed: ["Event logistics", "AV Systems", "Director reception", "Hospitality"],
        metrics: [
          { label: "Speakers Managed", value: 15, suffix: "+" },
          { label: "Logistics Score", value: 100, suffix: "%" },
          { label: "Event Duration", value: 3, suffix: " Days" }
        ]
      }
    ]
  },
  {
    year: "2026",
    labelText: "Internships",
    bgAccent: "from-emerald-500/10 to-teal-500/10",
    borderAccent: "border-emerald-500/30",
    textAccent: "text-emerald-500",
    glowColor: "rgba(16, 185, 129, 0.15)",
    cards: [
      {
        role: "Social Media Marketing Intern",
        company: "Management Analytics Gateway (MAG)",
        location: "Remote / Corporate Office",
        duration: "January 2026 – March 2026",
        icon: Briefcase,
        bullets: [
          "Produced and dynamically directed high-impact short-form video commercials, elevating visual storytelling frameworks and narrative cuts.",
          "Co-managed social media content pipelines, resulting in organic community interaction gains via target-audience analytics.",
          "Acquired professional simulation credentials from Tata (GenAI Powered Data Analytics), J.P. Morgan (Quantitative Research), and Deloitte (Tech security)."
        ],
        techUsed: ["Adobe Premiere Pro", "Canva", "Video Narratives", "Audience Targeting", "GenAI Analytics"],
        metrics: [
          { label: "Global Certifications", value: 3, suffix: "" },
          { label: "Narrative Videos", value: 12, suffix: "+" },
          { label: "Community Growth", value: 15, suffix: "%" }
        ]
      }
    ]
  }
];

export default function Experience({ sectionRevealVariants }: ExperienceProps) {
  const [activeIndex, setActiveIndex] = useState(2); // Default to "2025" (ACM Undergrad) which is index 2 now
  const [activeStackIndex, setActiveStackIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isLight, setIsLight] = useState(() => {
    if (typeof document !== 'undefined') {
      return !!document.querySelector('.light') || 
             document.documentElement.classList.contains('light') || 
             document.body.classList.contains('light');
    }
    return false;
  });

  // Theme observer to support real-time light/dark styles
  useEffect(() => {
    const checkTheme = () => {
      if (typeof document !== 'undefined') {
        const hasLightClass = !!document.querySelector('.light') || 
                            document.documentElement.classList.contains('light') || 
                            document.body.classList.contains('light');
        setIsLight(hasLightClass);
      }
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    const interval = setInterval(checkTheme, 200);
    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  const navigateTo = (newIndex: number) => {
    if (newIndex === activeIndex || newIndex < 0 || newIndex >= MILESTONES.length) return;
    setDirection(newIndex > activeIndex ? 1 : -1);
    setActiveIndex(newIndex);
    setActiveStackIndex(0); // Reset stack on year change
    playSound.playClick();
  };

  const currentMilestone = MILESTONES[activeIndex];
  const cards = currentMilestone.cards;
  const stackLength = cards.length;

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 35 : -35,
      opacity: 0,
      filter: "blur(4px)"
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        x: { type: "spring", stiffness: 280, damping: 28 },
        opacity: { duration: 0.22 },
        filter: { duration: 0.22 }
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 35 : -35,
      opacity: 0,
      filter: "blur(4px)",
      transition: {
        x: { type: "spring", stiffness: 280, damping: 28 },
        opacity: { duration: 0.15 },
        filter: { duration: 0.15 }
      }
    })
  };

  return (
    <motion.section 
      id="experience" 
      variants={sectionRevealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      className="scroll-mt-24 text-left w-full relative"
    >
      <MilestonesHeading 
        subtitle="04 • Experience"
        title="Experiences & Achievements"
        paragraph="Explore my technical progression, leadership roles, and academic achievements through the interactive tabs and milestone years below."
      />

      {/* Overhauled Timeline Navigation Row with absolutely zero overlapping visual elements */}
      <div className="mt-10 mb-14 max-w-3xl mx-auto px-4">
        <div className={`relative border rounded-2xl p-2.5 backdrop-blur-md select-none transition-all duration-300 ${
          isLight 
            ? 'bg-white border-slate-200/85 shadow-[0_4px_20px_rgba(0,0,0,0.03)]' 
            : 'bg-zinc-900/40 border-zinc-800/80'
        }`}>
          <div className="relative flex justify-between items-center gap-1.5 w-full z-10">
            {MILESTONES.map((ms, idx) => {
              const isSelected = activeIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => navigateTo(idx)}
                  className="relative flex-1 min-w-0 py-2 sm:py-3 px-1 sm:px-2 rounded-xl transition-all duration-300 outline-none text-center cursor-pointer group"
                >
                  {/* Sliding Year Highlight under active node */}
                  {isSelected && (
                    <motion.div 
                      layoutId="activeTimelinePill"
                      className="absolute inset-0 bg-amber-500 rounded-xl shadow-[0_4px_12px_rgba(245,158,11,0.3)] z-0"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}

                  {/* Year Text - Glows/illuminates when active or hovered */}
                  <span className={`relative z-10 text-[10px] sm:text-xs font-mono tracking-wider block transition-all duration-300 uppercase ${
                    isSelected 
                      ? 'text-black font-extrabold scale-105' 
                      : isLight 
                        ? 'text-slate-800 font-bold group-hover:text-amber-600 group-hover:scale-105' 
                        : 'text-zinc-300 font-medium group-hover:text-white group-hover:scale-105'
                  }`}
                  style={{
                    textShadow: isSelected && !isLight ? "0 0 8px rgba(255, 255, 255, 0.4)" : undefined
                  }}>
                    {ms.year}
                  </span>

                  {/* Small Institution detail label */}
                  <span className={`relative z-10 text-[8px] sm:text-[9.5px] font-mono mt-0.5 sm:mt-1 tracking-tighter sm:tracking-tight block max-w-full truncate transition-all duration-300 ${
                    isSelected
                      ? 'text-black/95 font-black'
                      : isLight
                        ? 'text-slate-600 font-bold group-hover:text-slate-900'
                        : 'text-zinc-500 group-hover:text-zinc-300'
                  }`}>
                    {ms.labelText}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Experience Showcase Content Box */}
      <div className="max-w-5xl mx-auto relative pb-44">
        
        {/* Navigation Guidance and Status Indicators */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-zinc-500 text-xs sm:text-sm font-mono tracking-wider uppercase mb-6 px-4 select-none">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500 animate-pulse shrink-0" />
            <span>Select a tab below to explore achievements • Select years above</span>
          </div>
          {stackLength > 1 && (
            <div className="text-zinc-400 font-bold shrink-0 text-xs sm:text-sm">
              Achievement {activeStackIndex + 1} of {stackLength}
            </div>
          )}
        </div>

        {/* Premium Tabbed Navigation Header Bar */}
        {stackLength > 1 && (
          <div className="flex flex-col sm:flex-row gap-3 pb-4 mb-8 px-4 sm:px-0">
            {cards.map((c, idx) => {
              const isSelected = activeStackIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveStackIndex(idx);
                    playSound.playClick();
                  }}
                  className={`px-5 py-3 rounded-2xl sm:rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 outline-none cursor-pointer border w-full sm:w-auto text-left sm:text-center ${
                    isSelected
                      ? 'bg-amber-500 text-black border-amber-500 shadow-lg shadow-amber-500/20 font-black'
                      : isLight
                        ? 'border-slate-200/80 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-850 hover:border-slate-300'
                        : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                  }`}
                >
                  {`0${idx + 1}. ${c.role}`}
                </button>
              );
            })}
          </div>
        )}

        {/* Display Card Stack (Tabbed swapper layout) */}
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="relative w-full min-h-[460px] md:min-h-[400px] pointer-events-auto"
          >
            {/* Render cards back to front (reverse order of depth) */}
            {Array.from({ length: stackLength })
              .map((_, i) => {
                const depth = stackLength - 1 - i;
                const cardIndex = (activeStackIndex + depth) % stackLength;
                const card = cards[cardIndex];
                return { card, cardIndex, depth };
              })
              .map(({ card, cardIndex, depth }) => {
                const isTop = depth === 0;
                const isUnder1 = depth === 1;
                const isUnder2 = depth === 2;

                // Step 0 (Top): scale-100, translate-y-0, z-30, opacity-100
                // Step 1 (Under 1): scale-95, translate-y-7, z-20, opacity-90
                // Step 2 (Under 2): scale-90, translate-y-14, z-10, opacity-75
                const yVal = depth * 28;
                const scale = Math.max(0.7, 1 - depth * 0.05);
                const zIndex = Math.max(0, 30 - depth * 10);
                const opacity = depth === 0 ? 1 : depth === 1 ? 0.90 : depth === 2 ? 0.75 : 0;

                const CardIcon = card.icon;

                return (
                  <motion.div
                    key={cardIndex}
                    style={{
                      y: yVal,
                      scale: scale,
                      zIndex: zIndex,
                      originY: 1,
                      transformOrigin: "bottom center",
                      boxShadow: !isLight ? `0 10px 30px -10px ${currentMilestone.glowColor}` : undefined
                    }}
                    animate={{
                      y: yVal,
                      scale: scale,
                      zIndex: zIndex,
                      opacity: opacity
                    }}
                    transition={{ type: "spring", stiffness: 280, damping: 28, mass: 0.6 }}
                    className={`${
                      isTop ? 'relative pointer-events-auto' : 'absolute inset-0 pointer-events-none'
                    } rounded-3xl p-6 md:p-8 lg:p-10 border transition-all duration-300 select-none transform-gpu will-change-transform ${
                      isLight
                        ? (isTop
                            ? 'bg-white border-slate-200/60 shadow-xl'
                            : isUnder1
                              ? 'bg-slate-50/95 border-slate-200/90 shadow-lg'
                              : 'bg-slate-100/90 border-slate-300/80 shadow-md')
                        : (isTop
                            ? 'bg-neutral-950 border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                            : isUnder1
                              ? 'bg-neutral-900 border-neutral-800 dark:border-amber-500/30 shadow-[0_15px_45px_rgba(245,158,11,0.08)] dark:shadow-[0_-4px_20px_rgba(249,115,22,0.15)]'
                              : 'bg-neutral-950 border-neutral-900 dark:border-amber-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.6)] dark:shadow-[0_-4px_20px_rgba(249,115,22,0.10)]')
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {isTop ? (
                        <motion.div
                          key={cardIndex}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="w-full h-full transform-gpu"
                        >
                          {/* Split layout: details on left, metrics rollup on right */}
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            
                            {/* Left Column: Chronological Content detail */}
                            <div className="lg:col-span-8 space-y-6 text-left">
                              
                              {/* Header Section */}
                              <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="space-y-1.5 pr-20">
                                  {/* Role Title */}
                                  <h3 className={`text-2xl md:text-3xl font-display font-black tracking-tight leading-tight uppercase transition-colors duration-300 ${
                                    isLight ? 'text-slate-900' : 'text-white'
                                  }`}>
                                    {card.role}
                                  </h3>

                                  {/* Company and Location Details */}
                                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono font-medium tracking-wide">
                                    <span className="text-amber-500 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                                      <CardIcon className="h-4 w-4" />
                                      {card.company}
                                    </span>
                                    
                                    <span className={`flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                                      <MapPin className="h-3.5 w-3.5" />
                                      {card.location}
                                    </span>
                                  </div>
                                </div>

                                {/* Duration Tag */}
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs font-semibold ${
                                  isLight 
                                    ? 'bg-slate-100/80 border-slate-200 text-slate-700' 
                                    : 'bg-white/[0.02] border-white/5 text-zinc-300'
                                }`}>
                                  <Calendar className="h-3.5 w-3.5 text-amber-500" />
                                  <span>{card.duration}</span>
                                </div>
                              </div>

                              {/* Bullets List */}
                              <ul className="space-y-3.5 text-sm md:text-base leading-relaxed font-sans pt-2">
                                {card.bullets.map((bullet, k) => (
                                  <li key={k} className="flex items-start gap-3.5">
                                    <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                                    <span className={isLight ? 'text-slate-600' : 'text-zinc-300'}>
                                      {bullet}
                                    </span>
                                  </li>
                                ))}
                              </ul>

                              {/* Tech Badges Row */}
                              <div className="pt-6 border-t border-black/5 dark:border-white/5">
                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2 font-bold">Skills Acquired</span>
                                <div className="flex flex-wrap gap-2">
                                  {card.techUsed.map((tech, idx) => (
                                    <span 
                                      key={idx}
                                      className={`text-[10px] font-mono px-3 py-1 rounded-lg border uppercase tracking-wider font-bold transition-all ${
                                        isLight
                                          ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                                          : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:border-white/15 hover:text-white'
                                      }`}
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>

                            </div>

                            {/* Right Column: Count-up Metric Rollup cards */}
                            <div className="lg:col-span-4 h-full flex flex-col justify-center space-y-4 lg:pl-6 lg:border-l border-black/5 dark:border-white/5 overflow-hidden">
                              <div className="text-left select-none">
                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-4 font-black">Performance Metrics</span>
                              </div>

                              <div className="grid grid-cols-3 lg:grid-cols-1 gap-4 w-full">
                                {card.metrics.map((metric, mIdx) => (
                                  <div 
                                    key={mIdx}
                                    className={`p-4 rounded-2xl border text-center lg:text-left flex flex-col justify-between transition-all ${
                                      isLight
                                        ? 'bg-slate-50/50 border-slate-100 shadow-inner'
                                        : 'bg-black/30 border-white/5'
                                    }`}
                                  >
                                    {/* Metric description label */}
                                    <span className={`text-[9px] font-mono uppercase tracking-widest block mb-1 font-bold ${
                                      isLight ? 'text-slate-400' : 'text-zinc-500'
                                    }`}>
                                      {metric.label}
                                    </span>

                                    {/* Rolling Count number */}
                                    <div className="text-2xl md:text-3xl font-display font-black text-amber-500 tracking-tight flex items-center justify-center lg:justify-start">
                                      <CountUp value={metric.value} suffix={metric.suffix} />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                          </div>
                        </motion.div>
                      ) : (
                        /* Background cards only show title/header and hide descriptions & metrics */
                        <div className="flex flex-wrap items-center justify-between gap-4 opacity-30 select-none">
                          <div className="space-y-1.5 pr-20">
                            {/* Role Title */}
                            <h3 className={`text-2xl md:text-3xl font-display font-black tracking-tight leading-tight uppercase transition-colors duration-300 ${
                              isLight ? 'text-slate-900' : 'text-white'
                            }`}>
                              {card.role}
                            </h3>

                            {/* Company and Location Details */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono font-medium tracking-wide">
                              <span className="text-amber-500 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                                <CardIcon className="h-4 w-4" />
                                {card.company}
                              </span>
                              
                              <span className={`flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                                <MapPin className="h-3.5 w-3.5" />
                                {card.location}
                              </span>
                            </div>
                          </div>

                          {/* Duration Tag */}
                          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs font-semibold ${
                            isLight 
                              ? 'bg-slate-100/80 border-slate-200 text-slate-700' 
                              : 'bg-white/[0.02] border-white/5 text-zinc-300'
                          }`}>
                            <Calendar className="h-3.5 w-3.5 text-amber-500" />
                            <span>{card.duration}</span>
                          </div>
                        </div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
          </motion.div>
        </AnimatePresence>

      </div>
    </motion.section>
  );
}
