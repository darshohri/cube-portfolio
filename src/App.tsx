import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, Environment, Float, Edges, ContactShadows } from '@react-three/drei';
import { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';

function LikeCounter() {
  const [likes, setLikes] = useState<number | null>(null);
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    // Check if user has already liked
    if (localStorage.getItem('portfolio_has_liked') === 'true') {
      setHasLiked(true);
    }

    fetch('/api/like')
      .then(res => res.json())
      .then(data => {
        if (data.likes !== undefined) setLikes(data.likes);
        // Server confirms this IP has liked
        if (data.hasLiked) {
          setHasLiked(true);
          localStorage.setItem('portfolio_has_liked', 'true');
        }
      })
      .catch(err => console.error("Failed to fetch likes", err));
  }, []);

  const handleLike = async () => {
    if (isLiking || hasLiked) return;
    setIsLiking(true);
    setHasLiked(true);
    localStorage.setItem('portfolio_has_liked', 'true');
    setLikes(prev => (prev || 0) + 1); // Optimistic UI update
    
    try {
      const res = await fetch('/api/like', { method: 'POST' });
      const data = await res.json();
      
      if (data.error === "Already liked") {
        setHasLiked(true);
        localStorage.setItem('portfolio_has_liked', 'true');
        setLikes(data.likes);
      } else if (data.likes !== undefined) {
        setLikes(data.likes);
      }
    } catch (err) {
      console.error("Failed to post like", err);
      setHasLiked(false);
      localStorage.removeItem('portfolio_has_liked');
      setLikes(prev => Math.max(0, (prev || 0) - 1)); // Revert if failed
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        background: hasLiked ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        padding: '0.8rem 1.5rem',
        borderRadius: '2rem',
        border: hasLiked ? '1px solid rgba(255, 255, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)',
        color: 'white',
        cursor: hasLiked ? 'default' : 'pointer',
        transition: 'transform 0.2s, background 0.2s',
        boxShadow: hasLiked ? '0 0 15px rgba(255,255,255,0.2)' : '0 4px 12px rgba(0,0,0,0.5)',
      }}
      onClick={handleLike}
      onMouseEnter={(e) => {
        if (hasLiked) return;
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
      }}
      onMouseLeave={(e) => {
        if (hasLiked) return;
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
      }}
      title={hasLiked ? "You already liked this!" : "Like this portfolio!"}
    >
      <span style={{ fontSize: '1.2rem', opacity: hasLiked ? 1 : 0.8 }}>👍</span>
      <span style={{ fontWeight: '600', fontSize: '1rem', minWidth: '1rem', textAlign: 'center' }}>
        {likes === null ? '...' : likes.toLocaleString()}
      </span>
    </div>
  );
}

const GRID_SIZE = 4;
const SPACING = 0.6;
const CUBE_SIZE = 0.55;

function CyberCube() {
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();
  
  // Pre-calculate positions
  const cubes = useMemo(() => {
    const temp = [];
    const offset = (GRID_SIZE - 1) / 2;
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let z = 0; z < GRID_SIZE; z++) {
          temp.push({
            basePos: new THREE.Vector3((x - offset) * SPACING, (y - offset) * SPACING, (z - offset) * SPACING),
            randomAxis: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(),
            randomRotationSpeed: Math.random() * 2 + 1,
            randomScale: Math.random() * 0.5 + 0.5,
            spinPhase: Math.random() * Math.PI * 2, // Initialize with random phase
          });
        }
      }
    }
    return temp;
  }, []);

  // Pre-allocate quaternions to avoid garbage collection overhead in useFrame
  const identityQuat = useMemo(() => new THREE.Quaternion(), []);
  const spinningQuat = useMemo(() => new THREE.Quaternion(), []);

  useFrame((state) => {
    if (!groupRef.current || !scroll) return;
    
    // offset goes from 0 to 1 as user scrolls down
    const offset = scroll.offset;
    
    // 1. Group Rotation
    // Spin the whole formation smoothly based on scroll, with a constant idle spin
    groupRef.current.rotation.y = offset * Math.PI * 2 + state.clock.elapsedTime * 0.1;
    groupRef.current.rotation.x = offset * Math.PI + Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    
    // 2. Fragment & Explode
    // Ease the explosion curve so it starts slow then accelerates
    const explosionFactor = Math.pow(offset, 1.5) * 15;
    
    groupRef.current.children.forEach((child, i) => {
      const cubeData = cubes[i];
      if (!cubeData) return;
      
      // Calculate target position: base position pushed outward from center
      const pushDirection = cubeData.basePos.clone().normalize();
      
      // Update spin phase continuously
      cubeData.spinPhase += 0.015 * cubeData.randomRotationSpeed;
      
      // Determine how much the cube should be freely spinning based on scroll
      // slerpFactor goes from 0 (grid aligned) at offset 0.25 to 1 (freely spinning) at offset 0.35
      const slerpFactor = Math.min(Math.max((offset - 0.25) / 0.1, 0), 1);
      
      spinningQuat.setFromAxisAngle(cubeData.randomAxis, cubeData.spinPhase);
      child.quaternion.slerpQuaternions(identityQuat, spinningQuat, slerpFactor);
      
      // Different phases of explosion for position
      if (offset < 0.3) {
        // Phase 1: Tight cube, minimal separation
        const localExplosion = offset * 2; // 0 to 0.6
        child.position.copy(cubeData.basePos).add(pushDirection.multiplyScalar(localExplosion));
      } else {
        // Phase 2: Fragmentation into data nodes
        const fragmentProgress = (offset - 0.3) / 0.7; // 0 to 1
        
        // Push outward
        const currentExplosion = 0.6 + fragmentProgress * explosionFactor;
        
        // Add some noise/floating to positions
        const noiseX = Math.sin(state.clock.elapsedTime * cubeData.randomRotationSpeed) * fragmentProgress;
        const noiseY = Math.cos(state.clock.elapsedTime * cubeData.randomRotationSpeed * 1.2) * fragmentProgress;
        
        child.position.copy(cubeData.basePos)
          .add(pushDirection.multiplyScalar(currentExplosion))
          .add(new THREE.Vector3(noiseX, noiseY, 0));
      }
    });
  });

  return (
    <group ref={groupRef}>
      {cubes.map((cube, i) => (
        <mesh key={i}>
          <boxGeometry args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} />
          <meshPhysicalMaterial 
            color="#444444" 
            metalness={0.9} 
            roughness={0.2} 
            transparent 
            opacity={0.8}
            transmission={0.9}
            thickness={1.5}
            envMapIntensity={3}
          />
          <Edges 
            linewidth={2} 
            threshold={15} 
            color="#ffffff" 
          />
        </mesh>
      ))}
    </group>
  );
}

export default function App() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: '#000000', zIndex: 9999 }}>
      <LikeCounter />
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
        <color attach="background" args={['#000000']} />
        
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={5} color="#ffffff" />
        <spotLight position={[0, 10, 0]} intensity={2} color="#888888" penumbra={1} />
        
        <Environment preset="city" />
        
        <ScrollControls pages={7} damping={0.15}>
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <CyberCube />
          </Float>
          
          <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={2} far={10} color="#ffffff" />

          <Scroll html style={{ width: '100vw' }}>
            {/* 1. HERO SECTION */}
            <div style={{ position: 'absolute', top: '35vh', left: '10vw', color: 'white', maxWidth: '50vw' }}>
              <h1 style={{ fontSize: '5rem', fontWeight: '800', lineHeight: 1, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
                Darsh<br/><span style={{ color: '#ffffff' }}>Ohri</span>
              </h1>
              <p style={{ fontSize: '1.5rem', color: '#94a3b8', fontWeight: 300, marginBottom: '0.5rem' }}>
                Full-Stack & AI Software Developer
              </p>
              <p style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: 300 }}>
                B.Tech CSE (Data Science) @ NMIMS Chandigarh
              </p>
            </div>

            {/* 2. SKILLS SECTION */}
            <div style={{ position: 'absolute', top: '130vh', right: '10vw', color: 'white', maxWidth: '45vw', textAlign: 'right' }}>
              <h2 style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Full-Stack <br/>& AI Integration.</h2>
              <p style={{ fontSize: '1.2rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                Bridging the gap between complex data and intuitive user experiences.
                Specialized in LLM integrations (Gemini, Groq) and modern web architectures.
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                {['React', 'Next.js', 'TypeScript', 'FastAPI', 'Python', 'Tailwind CSS', 'Three.js', 'Firebase', 'PostgreSQL', 'Gemini API'].map(skill => (
                  <span key={skill} style={{ padding: '0.5rem 1.5rem', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: '2rem', fontSize: '0.9rem' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* 3. EXPERIENCE SECTION */}
            <div style={{ position: 'absolute', top: '230vh', left: '10vw', color: 'white', maxWidth: '45vw' }}>
              <h2 style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Professional<br/>Experience.</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
                <div style={{ paddingLeft: '1.5rem', borderLeft: '2px solid #ffffff' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '600' }}>LaunchED Global</h3>
                  <p style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '0.5rem' }}>Web Development Intern | May - Jul 2026</p>
                  <p style={{ color: '#94a3b8', lineHeight: 1.5 }}>Architected responsive, mobile-first web pages, reducing cross-device rendering inconsistencies by 25%. Refactored legacy components into modular UI patterns following clean-code practices.</p>
                </div>
                <div style={{ paddingLeft: '1.5rem', borderLeft: '2px solid rgba(255,255,255,0.2)' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '600' }}>MAG Insights</h3>
                  <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '0.5rem' }}>Social Media & Marketing Intern | Jan - Mar 2026</p>
                  <p style={{ color: '#94a3b8', lineHeight: 1.5 }}>Directed short-form video commercials, accelerating content pipeline throughput by 40% and increasing organic audience engagement by 35%.</p>
                </div>
              </div>
            </div>

            {/* 4. PROJECTS SECTION 1 */}
            <div style={{ position: 'absolute', top: '330vh', right: '10vw', color: 'white', maxWidth: '45vw', textAlign: 'right' }}>
              <h2 style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Selected<br/>Projects.</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
                <div style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', borderRight: '4px solid #ffffff', borderRadius: '1rem 0 0 1rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    <a href="https://getfinwise.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                      FinWise AI ↗
                    </a>
                  </h3>
                  <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>AI-powered personal-finance platform with scam detection, goal tracking, and market simulations using Gemini and Groq LLMs.</p>
                  <p style={{ color: '#ffffff', fontSize: '0.85rem' }}>Next.js • FastAPI • Firebase • Gemini • Tailwind</p>
                </div>
                <div style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', borderRight: '4px solid rgba(255, 255, 255, 0.4)', borderRadius: '1rem 0 0 1rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    <a href="https://zir0.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                      Ziro ↗
                    </a>
                  </h3>
                  <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>Intelligent blockchain payment layer reducing transaction friction by 30% with zero-gas L2 micro-remittances and AI scam detection.</p>
                  <p style={{ color: '#ffffff', fontSize: '0.85rem' }}>Next.js • TypeScript • FastAPI • Polygon Amoy</p>
                </div>
              </div>
            </div>

            {/* 5. PROJECTS SECTION 2 */}
            <div style={{ position: 'absolute', top: '430vh', left: '10vw', color: 'white', maxWidth: '45vw' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
                <div style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', borderLeft: '4px solid #ffffff', borderRadius: '0 1rem 1rem 0' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    <a href="https://uselumiere.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                      Lumiere ↗
                    </a>
                  </h3>
                  <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>Healthcare system cutting patient-record audit time by 18s/record via FastAPI-backed identity resolution and visual diffs.</p>
                  <p style={{ color: '#ffffff', fontSize: '0.85rem' }}>Next.js • React • PostgreSQL • FastAPI</p>
                </div>
                <div style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', borderLeft: '4px solid rgba(255, 255, 255, 0.4)', borderRadius: '0 1rem 1rem 0' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    <a href="https://byok-ai.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                      BYOK (Bring Your Own Key) ↗
                    </a>
                  </h3>
                  <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>Offline-first AI chat interface with 100% on-device data privacy via IndexedDB and the official @google/genai SDK.</p>
                  <p style={{ color: '#ffffff', fontSize: '0.85rem' }}>React • TypeScript • IndexedDB • API</p>
                </div>
              </div>
            </div>

            {/* 6. ACHIEVEMENTS SECTION */}
            <div style={{ position: 'absolute', top: '530vh', right: '10vw', color: 'white', maxWidth: '45vw', textAlign: 'right' }}>
              <h2 style={{ fontSize: '3.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Awards &<br/>Recognitions.</h2>
              <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', color: '#cbd5e1', fontSize: '1.1rem' }}>
                <li><strong style={{ color: 'white' }}>1st Place</strong> — Plaksha Prayas Tech Hackathon (Future Finance)</li>
                <li><strong style={{ color: 'white' }}>Winner</strong> — ACM-SIH Ideathon</li>
                <li><strong style={{ color: 'white' }}>1st Place</strong> — Byte Battle, Code2Career Club</li>
                <li><strong style={{ color: 'white' }}>Top 6</strong> — StoxraHack 2026</li>
                <li><strong style={{ color: 'white' }}>Top 67 Nationwide</strong> — Confluence 2.0 Hackathon</li>
              </ul>
            </div>

            {/* 7. CONTACT SECTION */}
            <div style={{ position: 'absolute', top: '630vh', left: '0', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <h2 style={{ fontSize: '4rem', fontWeight: '800', marginBottom: '1rem' }}>Let's Connect.</h2>
              <p style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '2rem' }}>Ready to build something extraordinary?</p>
              
              <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem' }}>
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=darshohri@gmail.com" target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '1.1rem' }}>darshohri@gmail.com</a>
                <span style={{ color: '#475569' }}>|</span>
                <a href="https://www.linkedin.com/in/darsh-ohri" target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '1.1rem' }}>LinkedIn</a>
                <span style={{ color: '#475569' }}>|</span>
                <a href="https://github.com/darshohri" target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '1.1rem' }}>GitHub</a>
                <span style={{ color: '#475569' }}>|</span>
                <a href="https://leetcode.com/u/darshohri" target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '1.1rem' }}>LeetCode</a>
              </div>

              <a href="/Darsh_Ohri_Resume.pdf" download="Darsh_Ohri_Resume.pdf" style={{ display: 'inline-block', padding: '1rem 3rem', fontSize: '1.1rem', fontWeight: '600', background: 'white', color: '#000000', textDecoration: 'none', borderRadius: '3rem', cursor: 'pointer', transition: 'transform 0.2s' }}>
                Download Resume
              </a>
            </div>
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
}
