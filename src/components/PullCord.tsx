import React, { useEffect, useRef } from 'react';
import { playSound } from '../utils/audio';

interface PullCordProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export default function PullCord({ theme, toggleTheme }: PullCordProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Keep toggleTheme stable using a mutable ref pattern so changes in the
  // parent function's reference do not tear down the physics simulation.
  const toggleThemeRef = useRef(toggleTheme);
  useEffect(() => {
    toggleThemeRef.current = toggleTheme;
  }, [toggleTheme]);

  // Keep theme option stable using a mutable ref pattern to prevent layout thrashing and canvas tear down
  const themeRef = useRef(theme);
  const wakeUpRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    themeRef.current = theme;
    if (wakeUpRef.current) {
      wakeUpRef.current();
    }
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Generous coordinate resolution
    const width = 220;
    const height = 160; // Shrunk height from 240 to 160 to prevent covering underlying graphics
    canvas.width = width;
    canvas.height = height;

    const anchorX = width / 2;
    const anchorY = 6;
    const naturalLength = 80; // Shorter resting length (from 120) to clear CSE layout graphic
    
    // Spring physics coordinates
    let handleX = anchorX;
    let handleY = anchorY + naturalLength;
    let vx = 0;
    let vy = 0;

    // High damping prevents endless wiggling completely, keeps still when resting
    const springStiffness = 0.15; // Snappier spring
    const damping = 0.72; // Snappier return to rest

    let isDragging = false;
    let dragOffsetY = 0;
    let dragOffsetX = 0;
    let hasTriggered = false;
    let flashAnimationTimer = 0;
    
    // Fast local hover state tracker avoids triggering heavy React renders
    let isHoveredLocal = false;

    // Coordinate translation helper
    const getMousePos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      const scaleX = width / rect.width;
      const scaleY = height / rect.height;

      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      };
    };

    const handleStart = (pos: { x: number; y: number }) => {
      // Extremely generous grab hitbox: clicking anywhere within 50px of the handle,
      // OR within 38px horizontally of the cord line starts dragging immediately.
      const distToBell = Math.hypot(pos.x - handleX, pos.y - handleY);
      const distToCordX = Math.abs(pos.x - handleX);
      const isOverCordY = pos.y > 0 && pos.y <= handleY + 20;

      if (distToBell < 52 || (distToCordX < 38 && isOverCordY)) {
        isDragging = true;
        dragOffsetX = pos.x - handleX;
        dragOffsetY = pos.y - handleY;
        hasTriggered = false;
        canvas.style.cursor = 'grabbing';
        wakeUp();
      }
    };

    const handleMove = (pos: { x: number; y: number }) => {
      const isInsideCanvas = pos.x >= 0 && pos.x <= width && pos.y >= 0 && pos.y <= height;

      if (!isDragging) {
        // Visual hover state feedback over the active grab region only when actually inside bounds
        if (isInsideCanvas) {
          const distToBell = Math.hypot(pos.x - handleX, pos.y - handleY);
          const distToCordX = Math.abs(pos.x - handleX);
          const isOverCordY = pos.y > 0 && pos.y <= handleY + 20;

          if (distToBell < 52 || (distToCordX < 38 && isOverCordY)) {
            isHoveredLocal = true;
            canvas.style.cursor = 'grab';
          } else {
            isHoveredLocal = false;
            canvas.style.cursor = 'default';
          }
        } else {
          isHoveredLocal = false;
          canvas.style.cursor = 'default';
        }
      } else {
        // Coordinate tracking
        const desiredX = pos.x - dragOffsetX;
        const desiredY = pos.y - dragOffsetY;

        // Apply clamping so dragging can NEVER move the handle outside the safe boundaries of the canvas
        // This guarantees that the cord and handle never disappear or get clipped horizontally/vertically.
        const sideMargin = 18;
        const bottomMargin = 18;
        
        const clampedX = Math.max(sideMargin, Math.min(width - sideMargin, desiredX));
        const clampedY = Math.max(anchorY + 20, Math.min(height - bottomMargin, desiredY));

        const dx = clampedX - anchorX;
        const dy = clampedY - anchorY;
        const currentLen = Math.hypot(dx, dy);
        
        // Elastic constraint limit
        const maxLen = 130;  // Shrunk pull limit to fit smaller canvas height
        if (currentLen > maxLen) {
          handleX = anchorX + (dx / currentLen) * maxLen;
          handleY = anchorY + (dy / currentLen) * maxLen;
        } else {
          handleX = clampedX;
          handleY = clampedY;
        }

        // Snap theme transition trigger (responsive 20px threshold)
        const pullDelta = handleY - (anchorY + naturalLength);
        if (pullDelta > 20 && !hasTriggered) {
          playSound.playClick();
          toggleThemeRef.current();
          hasTriggered = true;
          flashAnimationTimer = 15;
          
          // snappy rebound kinetic energy feedback
          vx += (Math.random() - 0.5) * 6;
          vy = -14;
        }
      }
    };

    const handleEnd = () => {
      if (isDragging) {
        isDragging = false;
        canvas.style.cursor = 'default';
        isHoveredLocal = false;
        wakeUp();
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      handleStart(getMousePos(e));
    };

    const onMouseMove = (e: MouseEvent) => {
      handleMove(getMousePos(e));
    };

    const onTouchStart = (e: TouchEvent) => {
      const pos = getMousePos(e);
      // Determine if touch is near the bell or cord to start dragging
      const distToBell = Math.hypot(pos.x - handleX, pos.y - handleY);
      const distToCordX = Math.abs(pos.x - handleX);
      const isOverCordY = pos.y > 0 && pos.y <= handleY + 20;
      if (distToBell < 52 || (distToCordX < 38 && isOverCordY)) {
        if (e.cancelable) e.preventDefault();
        handleStart(pos);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        if (e.cancelable) e.preventDefault();
        handleMove(getMousePos(e));
      }
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    let animationFrameId: number;
    let isSleeping = false;

    let lastTime = performance.now();

    const render = () => {
      const now = performance.now();
      // Safe maximum clamp ensures spring doesn't explode when client tab changes focus
      const dt = Math.min(50, now - lastTime) / 16.67;
      lastTime = now;

      if (!isDragging) {
        // Balanced spring damping with no offset forces (keeps completely still at rest)
        const fx = (anchorX - handleX) * springStiffness;
        const fy = (anchorY + naturalLength - handleY) * springStiffness;

        // Delta-time-adjusted spring solver prevents heavy damping on high-refresh screens (144Hz+)
        vx = (vx + fx * dt) * Math.pow(damping, dt);
        vy = (vy + fy * dt) * Math.pow(damping, dt);

        handleX += vx * dt;
        handleY += vy * dt;

        // Apply clamping coordinates to spring motion as well to be absolutely immune to clipping
        const sideMargin = 18;
        const bottomMargin = 18;
        handleX = Math.max(sideMargin, Math.min(width - sideMargin, handleX));
        handleY = Math.max(anchorY + 20, Math.min(height - bottomMargin, handleY));

        const speed = Math.hypot(vx, vy);
        const distFromRest = Math.hypot(handleX - anchorX, handleY - (anchorY + naturalLength));

        // Sleep check to completely freeze rendering loop at rest (0% idle CPU utilization, stay still)
        if (speed < 0.005 && distFromRest < 0.05 && flashAnimationTimer === 0) {
          handleX = anchorX;
          handleY = anchorY + naturalLength;
          vx = 0;
          vy = 0;
          isSleeping = true;
        }
      } else {
        isSleeping = false;
      }

      // Draw inside canvas
      ctx.clearRect(0, 0, width, height);

      const isLight = themeRef.current === 'light';

      // 1. Sleek metallic wall mount base
      ctx.save();
      ctx.strokeStyle = isLight ? '#0f172a' : '#4b5563';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(anchorX - 12, anchorY - 2);
      ctx.lineTo(anchorX + 12, anchorY - 2);
      ctx.stroke();

      // Brass accent ring
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(anchorX, anchorY, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 2. Beaded chain connector curve calculation
      const segmentsCount = 9; // slightly fewer segments for shorter cord
      const points: { x: number; y: number }[] = [];

      for (let i = 0; i <= segmentsCount; i++) {
        const t = i / segmentsCount;
        const flex = Math.pow(t, 1.4);
        const bx = anchorX + (handleX - anchorX) * flex;
        const by = anchorY + (handleY - anchorY) * t;
        points.push({ x: bx, y: by });
      }

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i <= segmentsCount; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.strokeStyle = isLight ? '#475569' : '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Joint beads
      ctx.fillStyle = isLight ? '#64748b' : '#94a3b8';
      for (let i = 1; i < segmentsCount; i++) {
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 3. Dynamic Teardrop Handle (The Glow Bulb)
      ctx.save();
      ctx.translate(handleX, handleY);

      if (flashAnimationTimer > 0) {
        flashAnimationTimer--;
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = flashAnimationTimer * 4;
      } else if (isLight) {
        // Persistent vibrant bulb outer glow in light theme
        ctx.shadowColor = 'rgba(245, 158, 11, 0.85)';
        ctx.shadowBlur = isHoveredLocal ? 22 : 12;
      } else if (isHoveredLocal) {
        // High-contrast soft hover highlight in dark theme
        ctx.shadowColor = 'rgba(251, 191, 36, 0.65)';
        ctx.shadowBlur = 14;
      }

      ctx.strokeStyle = isLight ? '#b45309' : '#f8fafc';
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(-4, -13);
      ctx.lineTo(4, -13);
      ctx.lineTo(5, -8);
      ctx.bezierCurveTo(12, -5, 14, 6, 8, 12);
      ctx.bezierCurveTo(4, 16, -4, 16, -8, 12);
      ctx.bezierCurveTo(-14, 6, -12, -5, -5, -8);
      ctx.closePath();

      if (isLight) {
        // Radial filament gradient simulating a turned-on glowing physical bulb
        const bulbGrad = ctx.createRadialGradient(0, 3, 2, 0, 3, 14);
        bulbGrad.addColorStop(0, '#fef08a'); // Bright incandescent filament white-yellow core
        bulbGrad.addColorStop(0.4, '#fbbf24'); // Rich glowing warm amber mid-body
        bulbGrad.addColorStop(1, '#d97706'); // Solid copper/orange outer rim
        ctx.fillStyle = bulbGrad;
      } else {
        // Sleek matte obsidian colorway in dark theme
        ctx.fillStyle = '#1e1e24';
      }

      ctx.fill();
      ctx.stroke();

      // Mirror reflection highlights
      ctx.strokeStyle = isLight ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.moveTo(-4, -4);
      ctx.quadraticCurveTo(-9, 2, -4, 8);
      ctx.stroke();

      // Golden spacer cap
      ctx.fillStyle = '#b45309';
      ctx.fillRect(-2.5, -12.5, 5, 2);

      ctx.restore();

      // Only loop rendering if physics is awake, dragged, or glowing
      if (!isSleeping || isDragging || flashAnimationTimer > 0) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const wakeUp = () => {
      if (isSleeping) {
        isSleeping = false;
        lastTime = performance.now(); // reset delta timer to current baseline on wake
        cancelAnimationFrame(animationFrameId);
        render();
      }
    };
    wakeUpRef.current = wakeUp;

    // User interaction wakes the physics thread
    canvas.addEventListener('mousedown', wakeUp);
    canvas.addEventListener('touchstart', wakeUp);
    canvas.addEventListener('mouseenter', wakeUp);

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', handleEnd);
      canvas.removeEventListener('mousedown', wakeUp);
      canvas.removeEventListener('touchstart', wakeUp);
      canvas.removeEventListener('mouseenter', wakeUp);
    };
  }, []); // completely stable across theme toggles

  return (
    <div 
      className="absolute top-0 left-1/2 -translate-x-1/2 w-[220px] h-[160px] select-none z-[9999] flex justify-center touch-none pointer-events-auto rounded-xl"
      title="Pull physical cord to toggle theme"
    >
      <canvas 
        ref={canvasRef} 
        role="button"
        tabIndex={0}
        aria-label={`Toggle theme (currently ${theme === 'light' ? 'light' : 'dark'} mode)`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            playSound.playClick();
            toggleTheme();
          }
        }}
        className="w-full h-full block focus:outline-none touch-none pointer-events-auto rounded-xl" 
      />
    </div>
  );
}
