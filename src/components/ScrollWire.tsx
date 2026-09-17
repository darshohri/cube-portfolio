import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, AnimatePresence } from 'motion/react';

interface ScrollWireProps {
  activeSection: string;
}

const SECTIONS = [
  { id: 'home' },
  { id: 'about' },
  { id: 'skills' },
  { id: 'projects' },
  { id: 'experience' },
  { id: 'achievements' },
  { id: 'contact' }
];

export default function ScrollWire({ activeSection }: ScrollWireProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMouseNear, setIsMouseNear] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isLight, setIsLight] = useState(false);

  // High performance mouse tracking ref (eliminates 100% of mousemove React renders)
  const mousePosRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const checkLight = () => {
      setIsLight(document.documentElement.classList.contains('light'));
    };
    checkLight();

    const observer = new MutationObserver(checkLight);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Springs for kinetic positioning
  const springProgress = useSpring(0, { stiffness: 120, damping: 20 });
  
  // Highly reactive springs for quantum node offsets
  const ionOffsetX = useSpring(0, { stiffness: 300, damping: 14 });
  const ionOffsetY = useSpring(0, { stiffness: 300, damping: 14 });

  useEffect(() => {
    const handleScroll = () => {
      // Set active scroll locking status
      setIsScrolling(true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 180);

      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      setScrollProgress(currentProgress);
      springProgress.set(currentProgress);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    handleScroll(); // Initial calculate

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [springProgress]);

  // Particle path and repulsion mechanics tick (zero React render overhead)
  useEffect(() => {
    let animationFrameId: number;
    
    const calculatePositions = () => {
      const totalH = window.innerHeight * 0.5;
      const topStart = window.innerHeight * 0.25;
      const wireX = 48; // Left margin wire align
      const progressVal = springProgress.get();
      const wireY = topStart + progressVal * totalH;

      const currentMouse = mousePosRef.current;

      // Proximity check
      const dist = Math.hypot(currentMouse.x - wireX, currentMouse.y - wireY);
      const threshold = 180;

      // If scrolling, prioritize lock-on and suppress mouse push back to wire
      if (isScrolling) {
        setIsMouseNear(false);
        ionOffsetX.set(0);
        ionOffsetY.set(0);
      } else if (dist < threshold) {
        setIsMouseNear(true);
        
        // Repulse from the mouse coordinates
        const dx = wireX - currentMouse.x;
        const dy = wireY - currentMouse.y;
        const angle = Math.atan2(dy, dx);
        
        // Dynamic exponential repulsion factor for realistic organic evasion
        const repulsionStrength = Math.pow((threshold - dist) / threshold, 1.4) * 110;
        
        // Ionic jitter calculation (high-frequency unstable vibration)
        const jitterX = (Math.random() - 0.5) * 6;
        const jitterY = (Math.random() - 0.5) * 6;

        ionOffsetX.set(Math.cos(angle) * repulsionStrength + jitterX);
        ionOffsetY.set(Math.sin(angle) * repulsionStrength + jitterY);
      } else {
        setIsMouseNear(false);
        // Slowly relax to baseline coordinates
        ionOffsetX.set(0);
        ionOffsetY.set(0);
      }
    };

    const tick = () => {
      calculatePositions();
      animationFrameId = requestAnimationFrame(tick);
    };
    animationFrameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrameId);
  }, [springProgress, isScrolling, ionOffsetX, ionOffsetY]);

  return (
    <div 
      className="fixed left-12 top-1/4 h-1/2 w-[2px] z-50 hidden xl:flex flex-col justify-between items-center pointer-events-none select-none"
    >
      {/* Background physical wire track */}
      <div className={`absolute inset-y-0 w-[1px] ${isLight ? 'bg-slate-300 border-l border-slate-200' : 'bg-neutral-900/60 border-l border-neutral-900/20'}`} />

      {/* Dynamic scrolling progress sub-wire path */}
      <div 
        className={`absolute top-0 w-[1px] transition-all duration-300 ${
          isLight 
            ? 'bg-amber-600/60 shadow-[0_0_8px_rgba(217,119,6,0.4)]' 
            : 'bg-white/30 shadow-[0_0_8px_rgba(255,255,255,0.2)]'
        }`}
        style={{ height: `${scrollProgress * 100}%` }}
      />

      {/* Unstable Quantum Dot Node (The Brilliant White data particle) */}
      <motion.div
        className="absolute z-30 cursor-crosshair"
        style={{
          left: -6, // Center on wire
          top: `calc(${scrollProgress * 100}% - 6px)`,
          x: ionOffsetX,
          y: ionOffsetY
        }}
      >
        {/* Particle Core */}
        <motion.div
          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${
            isLight 
              ? 'bg-amber-600 shadow-[0_0_20px_rgba(217,119,6,0.6)]' 
              : 'bg-white shadow-[0_0_30px_#ffffff]'
          }`}
          animate={isMouseNear ? {
            scale: [1, 1.7, 0.7, 1.4, 0.9, 1.2, 1],
            opacity: [1, 0.6, 1, 0.7, 1],
          } : {
            scale: [1, 1.15, 1],
            opacity: 1
          }}
          transition={{
            duration: isMouseNear ? 0.4 : 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-white' : 'bg-black'}`} />
        </motion.div>

        {/* Ephemeral splits/sub-nodes generated on cursor repulsion */}
        <AnimatePresence>
          {isMouseNear && (
            <>
              {/* Ephemeral Node Alpha */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 0.9, 0.5, 0],
                  x: [0, 22, -16, 8, 0],
                  y: [0, -18, 14, -6, 0],
                  scale: [0.6, 1.1, 0.5]
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.0, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute top-0 left-0 w-2.5 h-2.5 rounded-full ${
                  isLight 
                    ? 'bg-amber-600 shadow-[0_0_15px_rgba(217,119,6,0.5)]' 
                    : 'bg-white shadow-[0_0_15px_#ffffff]'
                }`}
              />

              {/* Ephemeral Node Beta */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 0.85, 0.4, 0],
                  x: [0, -24, 18, -10, 0],
                  y: [0, 16, -20, 12, 0],
                  scale: [0.5, 0.9, 0.4]
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute top-0 left-0 w-2 h-2 rounded-full ${
                  isLight 
                    ? 'bg-amber-500/90 shadow-[0_0_12px_rgba(217,119,6,0.4)]' 
                    : 'bg-white/90 shadow-[0_0_12px_#ffffff]'
                }`}
              />

              {/* Ephemeral Node Gamma */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 0.7, 0.3, 0],
                  x: [0, 12, -26, 14, 0],
                  y: [0, 22, -10, -15, 0],
                  scale: [0.4, 0.8, 0.3]
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute top-0 left-0 w-1.5 h-1.5 rounded-full ${
                  isLight 
                    ? 'bg-amber-500/70 shadow-[0_0_8px_rgba(217,119,6,0.3)]' 
                    : 'bg-white/70 shadow-[0_0_8px_#ffffff]'
                }`}
              />

              {/* Ephemeral Node Delta */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 0.95, 0.2, 0],
                  x: [0, -18, -10, 24, 0],
                  y: [0, -22, 16, 10, 0],
                  scale: [0.3, 0.75, 0.2]
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute top-0 left-0 w-1.5 h-1.5 rounded-full ${
                  isLight 
                    ? 'bg-amber-600/80 shadow-[0_0_10px_rgba(217,119,6,0.4)]' 
                    : 'bg-white/80 shadow-[0_0_10px_#ffffff]'
                }`}
              />
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Anonymous aesthetic minimal anchor nodes */}
      {SECTIONS.map((sec, idx) => {
        const isActive = activeSection === sec.id;
        
        return (
          <div 
            key={sec.id} 
            className="absolute flex items-center justify-center"
            style={{ 
              top: `${(idx / (SECTIONS.length - 1)) * 100}%`,
              transform: 'translateY(-50%)'
            }}
          >
            {/* Extremely minimal anchor slot dot */}
            <div 
              className={`w-1 h-1 rounded-full transition-all duration-500 ${
                isActive 
                  ? (isLight ? 'bg-amber-600 scale-125 shadow-[0_0_6px_rgba(217,119,6,0.5)]' : 'bg-white scale-125 shadow-[0_0_6px_#ffffff]')
                  : (isLight ? 'bg-slate-300' : 'bg-neutral-900/80 border border-neutral-900/60')
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}
