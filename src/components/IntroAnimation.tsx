import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface IntroAnimationProps {
  onComplete: () => void;
  key?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  originalSize: number;
  
  // Rotating 3D target coordinates
  assignedEdge: [number, number]; 
  edgeLerp: number; 
  pX: number; // calculated continuous position
  pY: number;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Master timing of the timeline (Total: 3.5 seconds for snappier and dynamic feel)
  useEffect(() => {
    // We defer completion exactly to 3.5 seconds to allow the camera plunge to complete smoothly
    const timer = setTimeout(() => {
      onCompleteRef.current();
    }, 3500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 3D Cube vertices (normalized coordinate box)
    const vertices3D = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], // Front face
      [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1]   // Back face
    ];

    // 12 edges linking the vertices
    const edges: [number, number][] = [
      [0, 1], [1, 2], [2, 3], [3, 0], // Front face
      [4, 5], [5, 6], [6, 7], [7, 4], // Back face
      [0, 4], [1, 5], [2, 6], [3, 7]  // Connector depth bars
    ];

    // Generate 220 high-fidelity energy particles
    const particleCount = 220;
    const particles: Particle[] = [];
    const centerX = width / 2;
    const centerY = height / 2;

    for (let i = 0; i < particleCount; i++) {
      // Powerful, chaotic radial dispersion angles
      const angle = (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.15;
      const speed = 7 + Math.random() * 10;
      const size = 3 + Math.random() * 4.5; // Larger, more visual stardust dots

      // Distribute evenly along the 12 edges
      const edgeIndex = i % edges.length;
      const assignedEdge = edges[edgeIndex];
      const edgeLerp = Math.random();

      particles.push({
        id: i,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        originalSize: size,
        assignedEdge,
        edgeLerp,
        pX: centerX,
        pY: centerY
      });
    }

    // 3D Matrix transform values
    let rotX = 0.55;
    let rotY = 0.75;
    let rotZ = 0.35;
    let currentScale = 150; // Majestic spatial scale

    const startTime = Date.now();

    const draw = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      ctx.clearRect(0, 0, width, height);

      const currCenterX = width / 2;
      const currCenterY = height / 2;

      // Slowly rotate target paths in 3D perspective space
      if (elapsed < 2.8) {
        // Slow majestic floating rotation
        rotX += 0.009;
        rotY += 0.013;
        rotZ += 0.004;
      } else {
        // Drastically accelerate 3D spin as we fly inside
        rotX += 0.024;
        rotY += 0.035;
        rotZ += 0.012;

        // Exponential zoom camera plunge factor
        const zoomProgress = (elapsed - 2.8) / 0.7; // 0.7 second duration
        currentScale = 150 + Math.pow(zoomProgress, 3.8) * 9000;
      }

      // Calculate the screen projections of the 3D vertices
      const projected2D: { x: number; y: number }[] = [];
      vertices3D.forEach((v) => {
        let x1 = v[0];
        let y1 = v[1] * Math.cos(rotX) - v[2] * Math.sin(rotX);
        let z1 = v[1] * Math.sin(rotX) + v[2] * Math.cos(rotX);

        let x2 = x1 * Math.cos(rotY) + z1 * Math.sin(rotY);
        let y2 = y1;
        let z2 = -x1 * Math.sin(rotY) + z1 * Math.cos(rotY);

        let x3 = x2 * Math.cos(rotZ) - y2 * Math.sin(rotZ);
        let y3 = x2 * Math.sin(rotZ) + y2 * Math.cos(rotZ);
        let z3 = z2;

        const fov = 350;
        const scale = fov / (fov + z3 * currentScale * 0.05);
        const px = currCenterX + x3 * currentScale * scale;
        const py = currCenterY + y3 * currentScale * scale;
        projected2D.push({ x: px, y: py });
      });

      // --- RENDER TIMELINES ---
      if (elapsed < 0.7) {
        // PHASE 1: SINGULAR ATMOSPHERIC PULSING CORE
        const pulse = 1 + Math.sin(elapsed * 22) * 0.28;
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 40;
        ctx.shadowColor = '#ffffff';
        ctx.beginPath();
        ctx.arc(currCenterX, currCenterY, 15 * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      } 
      else if (elapsed >= 0.7 && elapsed < 1.4) {
        // PHASE 2: POWERFUL RADIAL COSMIC NEBULA EXPLOSION
        const explodeProgress = (elapsed - 0.7) / 0.7;
        particles.forEach((p) => {
          // Move outward using physical energy velocities
          p.pX += p.vx;
          p.pY += p.vy;
          p.vx *= 0.94; // air friction decay
          p.vy *= 0.94;

          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${0.9 - explodeProgress * 0.1})`;
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#ffffff';
          ctx.arc(p.pX, p.pY, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      } 
      else if (elapsed >= 1.4 && elapsed < 2.8) {
        // PHASE 3: MAGNETIC VACUUM CONVERGENCE & CUBE KNITTING (Full 1.4s of beautiful resolution)
        const convergeProgress = (elapsed - 1.4) / 1.4;
        
        // Eased spring factor pulling elements home
        const targetWeight = Math.pow(convergeProgress, 2.4);

        // Map particle destinations on rotating 3D paths dynamically
        particles.forEach((p) => {
          const edge = p.assignedEdge;
          const ptA = projected2D[edge[0]];
          const ptB = projected2D[edge[1]];
          
          if (ptA && ptB) {
            // Precise target point along the rotating edge
            const targetX = ptA.x + (ptB.x - ptA.x) * p.edgeLerp;
            const targetY = ptA.y + (ptB.y - ptA.y) * p.edgeLerp;
            
            // Seamless magnetic glide from floating space coordinates to moving target coordinate
            p.pX = p.pX + (targetX - p.pX) * (0.02 + targetWeight * 0.25);
            p.pY = p.pY + (targetY - p.pY) * (0.02 + targetWeight * 0.25);
          }
        });

        // 1. Draw connecting web threads (laser webbing) between particles getting closer
        // As they come together, they generate high-voltage visual webs
        ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - targetWeight) * 0.24 * Math.sin(convergeProgress * Math.PI)})`;
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i += 6) {
          const p1 = particles[i];
          const p2 = particles[(i + 3) % particles.length];
          const dist = Math.hypot(p1.pX - p2.pX, p1.pY - p2.pY);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.pX, p1.pY);
            ctx.lineTo(p2.pX, p2.pY);
            ctx.stroke();
          }
        }

        // 2. Materialize the plain, polished, master 3D Cube edges
        // Glow and border opacity swell exponentially
        ctx.strokeStyle = `rgba(255, 255, 255, ${targetWeight * 0.85})`;
        ctx.lineWidth = 2.0;
        ctx.shadowBlur = targetWeight * 20;
        ctx.shadowColor = '#ffffff';
        edges.forEach((edge) => {
          const ptA = projected2D[edge[0]];
          const ptB = projected2D[edge[1]];
          if (ptA && ptB) {
            ctx.beginPath();
            ctx.moveTo(ptA.x, ptA.y);
            ctx.lineTo(ptB.x, ptB.y);
            ctx.stroke();
          }
        });
        ctx.shadowBlur = 0;

        // 3. Render stardust particles fading completely as they lock in, so the cube lines are plain/solid
        particles.forEach((p) => {
          // Dots fade out entirely as they near coordinate lock, so the cube is completely crisp and plain
          const currentAlpha = Math.max(0, 1 - convergeProgress / 0.82) * 0.9;
          const currentSize = p.originalSize * currentAlpha;

          if (currentAlpha > 0.01) {
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
            ctx.shadowBlur = currentAlpha * 12;
            ctx.shadowColor = '#ffffff';
            ctx.arc(p.pX, p.pY, currentSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
      } 
      else if (elapsed >= 2.8) {
        // PHASE 4: CAMERA JET PLUNGE (Zooming deep inside the plain cube)
        // No dots are rendered during this stage so it is perfectly smooth and sleek!
        const zoomProgress = Math.min((elapsed - 2.8) / 0.7, 1.0);
        
        // Let the lines fade as they rush past our peripheral vision boundaries
        const finalAlpha = Math.max(0, 0.85 * (1 - zoomProgress));

        ctx.strokeStyle = `rgba(255, 255, 255, ${finalAlpha})`;
        ctx.lineWidth = 2.0 + zoomProgress * 15.0; // expand edge sizes dynamically
        ctx.shadowBlur = finalAlpha * 35;
        ctx.shadowColor = '#ffffff';

        // Render expanding clean plain 3D Cube cages
        edges.forEach((edge) => {
          const ptA = projected2D[edge[0]];
          const ptB = projected2D[edge[1]];
          if (ptA && ptB) {
            ctx.beginPath();
            ctx.moveTo(ptA.x, ptA.y);
            ctx.lineTo(ptB.x, ptB.y);
            ctx.stroke();
          }
        });
        ctx.shadowBlur = 0;

        // Ambient radial tunnel glow expanding outward into pure premium space blackness (no white flash!)
        const gradient = ctx.createRadialGradient(
          currCenterX, currCenterY, 5,
          currCenterX, currCenterY, Math.max(300, width * 0.5)
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${0.12 * (1 - zoomProgress)})`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <motion.div
      id="intro-container"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden select-none"
      style={{ backgroundColor: '#000000' }}
    >
      <div className="absolute inset-0" style={{ backgroundColor: '#000000' }} />
      
      {/* High-performance canvas container */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block pointer-events-none" />

      {/* Cinematic analog film grain overlay */}
      <div className="noise-overlay opacity-25 pointer-events-none" />
    </motion.div>
  );
}
