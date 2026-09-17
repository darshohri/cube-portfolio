import React, { useRef, useState, useEffect } from 'react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function SpotlightCard({ children, className = "" }: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [plasmaFlicker, setPlasmaFlicker] = useState(1);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Unstable high-frequency plasma micro-vibrations
  useEffect(() => {
    if (!isHovered) return;
    const interval = setInterval(() => {
      setPlasmaFlicker(0.92 + Math.random() * 0.16);
    }, 80);
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

    // Maximum 8 degrees of rotation for subtle, elegant physical tracking
    setTilt({
      x: -normY * 8,
      y: normX * 8,
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
      className={`relative overflow-hidden rounded-xl border border-neutral-900 bg-black/80 transition-all duration-300 hover:border-white hover:shadow-[0_0_50px_rgba(255,255,255,0.12)] ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: isHovered 
          ? 'box-shadow 0.3s, border-color 0.3s, transform 0.05s ease-out' 
          : 'box-shadow 0.3s, border-color 0.3s, transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
      }}
    >
      {/* Dynamic outward diffuse spotlight radial gradient */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(${260 * plasmaFlicker}px circle at ${coords.x}px ${coords.y}px, rgba(255, 255, 255, 0.08), transparent 80%)`,
        }}
      />
      
      {/* Inner high-intensity charged plasma core following the cursor */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.95 : 0,
          background: `radial-gradient(${110 * plasmaFlicker}px circle at ${coords.x}px ${coords.y}px, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.04) 60%, transparent 100%)`,
          mixBlendMode: 'plus-lighter'
        }}
      />

      <div className="relative z-10" style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </div>
  );
}
