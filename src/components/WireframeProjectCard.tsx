import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Cpu, Code } from 'lucide-react';
import { Project } from '../data';

interface WireframeProjectCardProps {
  project: Project;
  onAnalyze: () => void;
}

const STREAM_TEMPLATES = [
  "BUFFER_FILL_0xEF", "CORE_CLOCK_100HZ", "LINK_STABLE: OK", "MEM_ALLOC_SECTOR_4",
  "GRID_X_OFFSET_099", "METRIC_LOGGING_UP", "PIPELINE_FLOW: SOLID", "COMPILER_TRACE: READY"
];

export default function WireframeProjectCard({ project, onAnalyze }: WireframeProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [plasmaFlicker, setPlasmaFlicker] = useState(1);
  const [flickers, setFlickers] = useState<string[]>([]);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const checkLight = () => {
      setIsLight(document.documentElement.classList.contains('light'));
    };
    checkLight();

    const observer = new MutationObserver(checkLight);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Unstable high-frequency plasma micro-vibrations
  useEffect(() => {
    if (!isHovered) return;
    const interval = setInterval(() => {
      setPlasmaFlicker(0.92 + Math.random() * 0.16);
    }, 80);
    return () => clearInterval(interval);
  }, [isHovered]);

  // Update flickering metadata stream when hovered
  useEffect(() => {
    if (!isHovered) return;

    const interval = setInterval(() => {
      // Pick 2-3 random templates and suffix them with random hex codes
      const picked = Array.from({ length: 2 }).map(() => {
        const base = STREAM_TEMPLATES[Math.floor(Math.random() * STREAM_TEMPLATES.length)];
        const hex = Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0');
        return `[${base}_0x${hex}]`;
      });
      setFlickers(picked);
    }, 120);

    return () => clearInterval(interval);
  }, [isHovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });

    // Calculate interactive 3D perspective tilt
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const normX = (x - centerX) / centerX; // -1 to 1
    const normY = (y - centerY) / centerY; // -1 to 1

    setTilt({
      x: -normY * 6,
      y: normX * 6,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-lg border border-neutral-900 bg-black p-6 flex flex-col justify-between group transition-all duration-500 hover:border-white shadow-2xl hover:shadow-[0_0_50px_rgba(255,255,255,0.15)] text-left overflow-hidden project-proof-card"
      style={{
        transformStyle: 'preserve-3d',
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: isHovered 
          ? 'box-shadow 0.3s, border-color 0.3s, transform 0.05s ease-out' 
          : 'box-shadow 0.3s, border-color 0.3s, transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
      }}
    >
      {/* Blueprint corner crosshairs '+' */}
      <span className="absolute -top-[5px] -left-[5px] text-[10px] font-mono text-neutral-800 group-hover:text-white select-none transition-colors z-10">+</span>
      <span className="absolute -top-[5px] -right-[5px] text-[10px] font-mono text-neutral-800 group-hover:text-white select-none transition-colors z-10">+</span>
      <span className="absolute -bottom-[5px] -left-[5px] text-[10px] font-mono text-neutral-800 group-hover:text-white select-none transition-colors z-10">+</span>
      <span className="absolute -bottom-[5px] -right-[5px] text-[10px] font-mono text-neutral-800 group-hover:text-white select-none transition-colors z-10">+</span>

      {/* Localized blooming telemetry streams on top and bottom border tracks */}
      <AnimatePresence>
        {isHovered && (
          <>
            {/* Top flickering tape stream */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              className="absolute top-2 right-4 text-[8px] font-mono text-zinc-400 select-none pointer-events-none tracking-widest z-10"
            >
              {flickers[0] || "[TRACE_STREAMING]"}
            </motion.div>

            {/* Bottom flickering tape stream */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-16 left-6 text-[8px] font-mono text-zinc-500 select-none pointer-events-none tracking-widest z-10"
            >
              {flickers[1] || "[LINK_STABLE]"}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col gap-3 h-full justify-between" style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <div className="h-9 w-9 bg-neutral-950 border border-neutral-900 rounded-md flex items-center justify-center transition-colors duration-300 group-hover:border-white group-hover:bg-neutral-900 icon-holder">
              {project.category === 'aiml' ? (
                <Cpu className="h-4 w-4 text-zinc-400 group-hover:text-white transition-colors" />
              ) : (
                <Code className="h-4 w-4 text-zinc-400 group-hover:text-white transition-colors" />
              )}
            </div>
            
            <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-500 group-hover:text-white transition-colors project-period">
              {(project.period || 'PRESENT').split('|')[0].trim()}
            </span>
          </div>

          <div className="mt-2 text-left">
            <h3 className="text-md font-display font-black text-zinc-300 group-hover:text-white tracking-tight uppercase transition-colors project-title">
              {project.title}
            </h3>
            <p className="text-[10px] font-mono text-neutral-500 group-hover:text-zinc-200 uppercase mt-0.5 tracking-wider font-extrabold transition-colors project-subtitle">
              {project.subtitle}
            </p>
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3 my-2 font-sans project-description">
            {project.description}
          </p>
        </div>

        <div className="mt-4">
          {/* Tech stack items formatted beautifully */}
          <div className="flex flex-wrap gap-1.5">
            {project.tech.map((term, i) => (
              <span
                key={i}
                className="text-[9px] font-mono px-2 py-0.5 rounded bg-neutral-950 border border-neutral-900 text-neutral-400 group-hover:border-neutral-800 transition-colors project-tag"
              >
                {term}
              </span>
            ))}
          </div>

          {/* Action Button mapped with magnetic spring-bloom trigger qualities */}
          <button
            onClick={onAnalyze}
            className="w-full flex items-center justify-center gap-1 mt-5 pt-3 border-t border-neutral-900 text-[11px] font-mono font-bold tracking-wider text-zinc-400 group-hover:text-white hover:text-white transition-all duration-300 hover:gap-2 cursor-pointer project-action-btn"
          >
            <span>ANALYZE REPOSITORY</span>
            <motion.span
              animate={{ x: isHovered ? [0, 4, 0] : 0 }}
              transition={{ repeat: isHovered ? Infinity : 0, duration: 1 }}
            >
              &rarr;
            </motion.span>
          </button>
        </div>
      </div>
    </div>
  );
}
