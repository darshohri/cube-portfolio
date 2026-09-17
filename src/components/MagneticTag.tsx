import React, { useRef } from 'react';
import { motion, useSpring } from 'motion/react';

interface MagneticTagProps {
  children: React.ReactNode;
  className?: string;
  key?: React.Key;
}

export default function MagneticTag({ children, className = "" }: MagneticTagProps) {
  const ref = useRef<HTMLSpanElement>(null);
  
  // Spring configurations for butter-smooth snap back
  const x = useSpring(0, { stiffness: 220, damping: 14 });
  const y = useSpring(0, { stiffness: 220, damping: 14 });

  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const rect = ref.current.getBoundingClientRect();
    
    // Relative coordinates from mid-point of the tag
    const relX = clientX - (rect.left + rect.width / 2);
    const relY = clientY - (rect.top + rect.height / 2);
    
    // Pull intensity of 30% for extremely refined elastic experience
    x.set(relX * 0.35);
    y.set(relY * 0.35);
  };

  const handleMouseLeave = () => {
    // Return smoothly to rest state
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={`inline-block select-none ${className}`}
      whileHover={{ scale: 1.04 }}
      transition={{ type: "spring", stiffness: 220, damping: 12 }}
    >
      {children}
    </motion.span>
  );
}
