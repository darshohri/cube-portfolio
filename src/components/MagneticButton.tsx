import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring } from 'motion/react';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  href?: string;
}

export default function MagneticButton({ children, onClick, className = "", href }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
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
  
  // Spring settings customized for intense snap visual weight
  const x = useSpring(0, { stiffness: 180, damping: 13 });
  const y = useSpring(0, { stiffness: 180, damping: 13 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const rect = ref.current.getBoundingClientRect();
    
    // Dist from mid point
    const relX = clientX - (rect.left + rect.width / 2);
    const relY = clientY - (rect.top + rect.height / 2);
    
    // Magnetic pull constant (0.45 of cursor offset)
    x.set(relX * 0.45);
    y.set(relY * 0.45);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const shadowColor = isLight ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.18)";
  
  const isPrimary = className.includes('bg-white');
  const bgDefault = isPrimary 
    ? (isLight ? "#0f172a" : "#ffffff") 
    : "rgba(0, 0, 0, 0)";
  const bgHover = isPrimary
    ? (isLight ? "rgba(15, 23, 42, 0.85)" : "rgba(255, 255, 255, 0.85)")
    : (isLight ? "#0f172a" : "#ffffff");
  const textDefault = isPrimary
    ? (isLight ? "#ffffff" : "#000000")
    : (isLight ? "#1e293b" : "#ffffff");
  const textHover = isPrimary
    ? (isLight ? "#ffffff" : "#000000")
    : (isLight ? "#ffffff" : "#000000");

  const borderColorDefault = isPrimary
    ? "transparent"
    : (isLight ? "rgba(15, 23, 42, 0.15)" : "rgba(255, 255, 255, 0.1)");
  const borderColorHover = isPrimary
    ? "transparent"
    : (isLight ? "#0f172a" : "#ffffff");

  const innerContent = (
    <motion.div
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      animate={{
        boxShadow: isHovered 
          ? `0 0 25px ${shadowColor}` 
          : "0 0 0px rgba(0, 0, 0, 0)",
        borderColor: isHovered ? borderColorHover : borderColorDefault,
        backgroundColor: isHovered ? bgHover : bgDefault,
        color: isHovered ? textHover : textDefault,
      }}
      className={`inline-flex items-center justify-center border font-mono font-bold tracking-wider text-xs px-6 py-3 rounded-xl transition-all duration-300 select-none cursor-pointer ${className}`}
    >
      <motion.span 
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="flex items-center gap-2"
      >
        {children}
      </motion.span>
    </motion.div>
  );

  if (href) {
    return (
      <a ref={ref} href={href} className="inline-block">
        {innerContent}
      </a>
    );
  }

  return (
    <div ref={ref} className="inline-block" onClick={onClick}>
      {innerContent}
    </div>
  );
}
