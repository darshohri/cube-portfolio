import { useEffect, useRef, useState, useLayoutEffect, MouseEvent } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  label: string;
  darkColor: string;
  lightColor: string;
}

const CONSTANT_LABELS = [
  "Python", "Java", "Data Science", "Lumiere", "ACM Chapter",
  "GenAI", "Git", "Next.js", "Antigravity", "C", "Frontend",
  "Video Editing", "Nutridish"
];

const COLORS = [
  "#ffffff", // Crisp White
  "#e4e4e7", // Zinc 200 / Mercury
  "#a1a1aa", // Zinc 450 / Silver
  "#71717a", // Zinc 500 / Mid Gray
  "#d4d4d8"  // Zinc 300 / Platinum
];

function hexToRgb(hex: string) {
  const cleanHex = hex.replace('#', '');
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

// Cubic-bezier solver for cubic-bezier(0.16, 1, 0.3, 1) ease-out curve
function cubicBezier(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  
  // Quick Newton-Raphson to solve x(u) = t
  let u = t;
  for (let i = 0; i < 4; i++) {
    const x = 3.0 * (1.0 - u) * (1.0 - u) * u * 0.16 + 3.0 * (1.0 - u) * u * u * 0.3 + u * u * u;
    const dx = 3.0 * (1.0 - u) * (1.0 - u) * 0.16 + 6.0 * (1.0 - u) * u * (0.3 - 0.16) + 3.0 * u * u * (1.0 - 0.3);
    if (Math.abs(dx) < 1e-6) break;
    u -= (x - t) / dx;
  }
  return 3.0 * (1.0 - u) * (1.0 - u) * u + 3.0 * (1.0 - u) * u * u + u * u * u;
}

function interpolateColor(color1: string, color2: string, factor: number): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor);
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor);
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor);
  return `rgb(${r}, ${g}, ${b})`;
}

interface InteractiveDataGridProps {
  theme: 'dark' | 'light';
}

export default function InteractiveDataGrid({ theme }: InteractiveDataGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 });

  const lastThemeRef = useRef(theme);
  const transitionStartRef = useRef<number | null>(null);
  const startProgressRef = useRef(theme === 'light' ? 1 : 0);
  const themeProgressRef = useRef(theme === 'light' ? 1 : 0);
  const currentThemeRef = useRef(theme);

  useLayoutEffect(() => {
    if (theme !== lastThemeRef.current) {
      transitionStartRef.current = performance.now();
      startProgressRef.current = themeProgressRef.current;
      lastThemeRef.current = theme;
    }
    currentThemeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use ResizeObserver to handle fluid container dimension changes
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      const w = Math.max(width, 300);
      const h = Math.max(height, 350);
      setDimensions({ width: w, height: h });

      // Generate particles inside the new canvas viewport
      const particles: Particle[] = [];
      for (let i = 0; i < CONSTANT_LABELS.length; i++) {
        const darkColor = COLORS[i % COLORS.length];
        let lightColor = "#475569"; // Slate default
        if (darkColor === "#ffffff") lightColor = "#d97706";      // Warm Amber
        else if (darkColor === "#e4e4e7") lightColor = "#0f172a"; // Sleek Slate 900
        else if (darkColor === "#a1a1aa") lightColor = "#1e293b"; // Charcoal Slate 800
        else if (darkColor === "#71717a") lightColor = "#4f46e5"; // Indigo Blue
        else if (darkColor === "#d4d4d8") lightColor = "#2563eb"; // Royal Blue

        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          radius: Math.random() * 2 + 3,
          label: CONSTANT_LABELS[i],
          darkColor: darkColor,
          lightColor: lightColor
        });
      }
      particlesRef.current = particles;
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    let lastTime = performance.now();

    const draw = () => {
      const now = performance.now();
      // Cap delta time to prevent physics clipping during layout freeze
      const dt = Math.min(50, now - lastTime) / 16.67;
      lastTime = now;

      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      const particles = particlesRef.current;
      const currentMouse = mouseRef.current;
      
      // Update theme progress utilizing 500ms temporal cubic interpolation (perfectly synced to CSS transition timing)
      const targetProgress = currentThemeRef.current === 'light' ? 1 : 0;
      let progress = themeProgressRef.current;

      if (transitionStartRef.current !== null) {
        const elapsed = now - transitionStartRef.current;
        if (elapsed < 500) {
          const t = elapsed / 500;
          const easeVal = cubicBezier(t);
          const startVal = startProgressRef.current;
          progress = startVal + (targetProgress - startVal) * easeVal;
          themeProgressRef.current = progress;
        } else {
          progress = targetProgress;
          themeProgressRef.current = targetProgress;
          transitionStartRef.current = null;
        }
      } else {
        progress = targetProgress;
        themeProgressRef.current = targetProgress;
      }

      // Draw subtle grid lines with custom smoothly interpolated colors
      const gridR = Math.round(255 + (15 - 255) * progress);
      const gridG = Math.round(255 + (23 - 255) * progress);
      const gridB = Math.round(255 + (42 - 255) * progress);
      const gridA = 0.012 + (0.05 - 0.012) * progress;
      ctx.strokeStyle = `rgba(${gridR}, ${gridG}, ${gridB}, ${gridA})`;
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < dimensions.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, dimensions.height);
        ctx.stroke();
      }
      for (let y = 0; y < dimensions.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(dimensions.width, y);
        ctx.stroke();
      }

      // Update positions and draw connections (refresh-rate-independent step)
      particles.forEach((p, idx) => {
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Bounce on boundaries
        if (p.x < 0 || p.x > dimensions.width) p.vx *= -1;
        if (p.y < 0 || p.y > dimensions.height) p.vy *= -1;

        // Clip constraints
        p.x = Math.max(0, Math.min(p.x, dimensions.width));
        p.y = Math.max(0, Math.min(p.y, dimensions.height));

        // Dynamically interpolate particle nodes
        const drawColor = interpolateColor(p.darkColor, p.lightColor, progress);

        // Connect particles to each other
        for (let j = idx + 1; j < particles.length; j++) {
          const companion = particles[j];
          const dist = Math.hypot(p.x - companion.x, p.y - companion.y);
          if (dist < 120) {
            const opacity = (1 - dist / 120) * 0.15;
            const connR = Math.round(255 + (15 - 255) * progress);
            const connG = Math.round(255 + (23 - 255) * progress);
            const connB = Math.round(255 + (42 - 255) * progress);
            const connA = (opacity * 0.65) * (1 - progress) + (opacity * 0.45) * progress;
            ctx.strokeStyle = `rgba(${connR}, ${connG}, ${connB}, ${connA})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(companion.x, companion.y);
            ctx.stroke();
          }
        }

        // Connect near particles to mouse pointer
        if (currentMouse.x !== null && currentMouse.y !== null) {
          const mouseDist = Math.hypot(p.x - currentMouse.x, p.y - currentMouse.y);
          if (mouseDist < 160) {
            const opacity = (1 - mouseDist / 160) * 0.3;
            const grad = ctx.createLinearGradient(p.x, p.y, currentMouse.x, currentMouse.y);
            grad.addColorStop(0, drawColor);
            
            const targetColorR = Math.round(255 + (15 - 255) * progress);
            const targetColorG = Math.round(255 + (23 - 255) * progress);
            const targetColorB = Math.round(255 + (42 - 255) * progress);
            grad.addColorStop(1, `rgba(${targetColorR}, ${targetColorG}, ${targetColorB}, ${opacity})`);
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(currentMouse.x, currentMouse.y);
            ctx.stroke();
          }
        }

        // Draw particle node point
        ctx.fillStyle = drawColor;
        ctx.shadowColor = drawColor;
        ctx.shadowBlur = 8 + (4 - 8) * progress;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow

        // Label tag card background behind text for readability
        ctx.font = '10px JetBrains Mono, monospace';
        const labelWidth = ctx.measureText(p.label).width;
        
        const bgR = Math.round(0 + (255 - 0) * progress);
        const bgG = Math.round(0 + (255 - 0) * progress);
        const bgB = Math.round(0 + (255 - 0) * progress);
        const bgA = 0.85 + (0.95 - 0.85) * progress;
        ctx.fillStyle = `rgba(${bgR}, ${bgG}, ${bgB}, ${bgA})`;
        ctx.fillRect(p.x + 8, p.y - 14, labelWidth + 8, 16);

        const borderR = Math.round(255 + (15 - 255) * progress);
        const borderG = Math.round(255 + (23 - 255) * progress);
        const borderB = Math.round(255 + (42 - 255) * progress);
        const borderA = 0.15 + (0.12 - 0.15) * progress;
        ctx.strokeStyle = `rgba(${borderR}, ${borderG}, ${borderB}, ${borderA})`;
        ctx.strokeRect(p.x + 8, p.y - 14, labelWidth + 8, 16);

        // Draw node label
        const textR = Math.round(148 + (51 - 148) * progress);
        const textG = Math.round(163 + (65 - 163) * progress);
        const textB = Math.round(184 + (85 - 184) * progress);
        ctx.fillStyle = `rgb(${textR}, ${textG}, ${textB})`;
        ctx.fillText(p.label, p.x + 12, p.y - 2);
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [dimensions]);

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: null, y: null };
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[380px] transition-colors duration-500 ${theme === 'light' ? 'bg-white/75 border-zinc-400/20 shadow-slate-100/40' : 'bg-black/60 border-neutral-900'} rounded-xl border overflow-hidden cursor-crosshair group flex items-center justify-center p-4 shadow-2xl`}
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="absolute inset-0 block w-full h-full"
      />
    </div>
  );
}
