import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, Environment, Float, Edges, ContactShadows } from '@react-three/drei';
import { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';

function LikeCounter() {
  const [likes, setLikes] = useState<number | null>(null);
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 4000);
    // Check if user has already liked
    if (localStorage.getItem('portfolio_has_liked_v3') === 'true') {
      setHasLiked(true);
    }

    fetch('/api/like')
      .then(res => res.json())
      .then(data => {
        if (data.likes !== undefined) setLikes(data.likes);
        // Server confirms this IP has liked
        if (data.hasLiked) {
          setHasLiked(true);
          localStorage.setItem('portfolio_has_liked_v3', 'true');
        }
      })
      .catch(err => console.error("Failed to fetch likes", err));

    return () => clearTimeout(t);
  }, []);

  const handleLike = async () => {
    if (isLiking || hasLiked) return;
    setIsLiking(true);
    setHasLiked(true);
    localStorage.setItem('portfolio_has_liked_v3', 'true');
    setLikes(prev => (prev || 0) + 1); // Optimistic UI update
    
    try {
      const res = await fetch('/api/like', { method: 'POST' });
      const data = await res.json();
      
      if (data.error === "Already liked") {
        setHasLiked(true);
        localStorage.setItem('portfolio_has_liked_v3', 'true');
        setLikes(data.likes);
      } else if (data.likes !== undefined) {
        setLikes(data.likes);
      }
    } catch (err) {
      console.error("Failed to post like", err);
      setHasLiked(false);
      localStorage.removeItem('portfolio_has_liked_v3');
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
        transition: 'opacity 1s ease-in-out, transform 0.2s, background 0.2s',
        boxShadow: hasLiked ? '0 0 15px rgba(255,255,255,0.2)' : '0 4px 12px rgba(0,0,0,0.5)',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? (hasLiked ? 'auto' : 'auto') : 'none',
      }}
      onClick={handleLike}
      onPointerDown={(e) => {
        // Prevent touch from firing hover/click emulation that swallows events on mobile
        handleLike();
      }}
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
          const basePos = new THREE.Vector3((x - offset) * SPACING, (y - offset) * SPACING, (z - offset) * SPACING);
          // Start position: completely scattered in a sphere
          const startDirection = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
          const startPos = startDirection.multiplyScalar(Math.random() * 15 + 5); 
          
          temp.push({
            basePos,
            startPos,
            randomAxis: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(),
            randomRotationSpeed: Math.random() * 2 + 1,
            randomScale: Math.random() * 0.5 + 0.5,
            spinPhase: Math.random() * Math.PI * 2,
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
    
    // Intro animation progress (0 to 1 over 4 seconds)
    const rawProgress = state.clock.elapsedTime / 4.0;
    const isIntro = rawProgress < 1;
    const easedProgress = 1 - Math.pow(1 - Math.min(rawProgress, 1), 3); // Cubic ease out
    
    // offset goes from 0 to 1 as user scrolls down
    const offset = scroll.offset;
    
    // 1. Group Rotation
    // The base rotation that we want it to seamlessly land on
    const baseRotY = offset * Math.PI * 2 + state.clock.elapsedTime * 0.1;
    const baseRotX = offset * Math.PI + Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    
    // Add extra spins that smoothly fade out to 0 as intro finishes
    const extraSpinY = (1 - easedProgress) * Math.PI * 4;
    const extraSpinX = (1 - easedProgress) * Math.PI * 2;
    
    groupRef.current.rotation.y = baseRotY + extraSpinY;
    groupRef.current.rotation.x = baseRotX + extraSpinX;
    
    // 2. Fragment & Explode
    const explosionFactor = Math.pow(offset, 1.5) * 15;
    
    groupRef.current.children.forEach((child, i) => {
      const cubeData = cubes[i];
      if (!cubeData) return;
      
      const pushDirection = cubeData.basePos.clone().normalize();
      cubeData.spinPhase += 0.009 * cubeData.randomRotationSpeed;
      
      if (isIntro) {
        // Assemble from scattered positions
        child.position.lerpVectors(cubeData.startPos, cubeData.basePos, easedProgress);
        
        // Randomly spin while assembling, then settle to identity quaternion
        spinningQuat.setFromAxisAngle(cubeData.randomAxis, cubeData.spinPhase * (1 - easedProgress) * 5);
        child.quaternion.slerpQuaternions(spinningQuat, identityQuat, easedProgress);
      } else {
        const slerpFactor = Math.min(Math.max((offset - 0.25) / 0.1, 0), 1);
        spinningQuat.setFromAxisAngle(cubeData.randomAxis, cubeData.spinPhase);
        child.quaternion.slerpQuaternions(identityQuat, spinningQuat, slerpFactor);
        
        if (offset < 0.3) {
          const localExplosion = offset * 2;
          child.position.copy(cubeData.basePos).add(pushDirection.multiplyScalar(localExplosion));
        } else {
          const fragmentProgress = (offset - 0.3) / 0.7;
          const currentExplosion = 0.6 + fragmentProgress * explosionFactor;
          const noiseX = Math.sin(state.clock.elapsedTime * cubeData.randomRotationSpeed) * fragmentProgress;
          const noiseY = Math.cos(state.clock.elapsedTime * cubeData.randomRotationSpeed * 1.2) * fragmentProgress;
          child.position.copy(cubeData.basePos)
            .add(pushDirection.multiplyScalar(currentExplosion))
            .add(new THREE.Vector3(noiseX, noiseY, 0));
        }
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
            opacity={0.7}
            transmission={0.9}
            thickness={1.5}
            envMapIntensity={2.3}
          />
          <Edges 
            linewidth={2} 
            threshold={15} 
            color="#d4d4d4" 
          />
        </mesh>
      ))}
    </group>
  );
}

export default function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: '#000000', zIndex: 9999 }}>
      {/* Scroll Blocker Overlay: prevents desync by intercepting wheel/touch events before they hit ScrollControls during the 4-second intro */}
      <div className="scroll-blocker" />
      
      <LikeCounter />
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
        <color attach="background" args={['#000000']} />
        
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={5} color="#ffffff" />
        <spotLight position={[0, 10, 0]} intensity={2} color="#888888" penumbra={1} />
        <Environment files="/potsdamer_platz_1k.hdr" />
        
        <ScrollControls pages={isMobile ? 9.5 : 8.2} damping={0.15}>
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <group scale={isMobile ? 0.45 : 1}>
              <CyberCube />
            </group>
          </Float>
          
          <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={2} far={10} color="#ffffff" />

          <Scroll html style={{ width: '100vw' }}>
            <div className="html-fade-in">
              {/* 1. HERO SECTION */}
            <div className="scroll-section hero-section">
              <h1 className="hero-title">
                Darsh<br/><span style={{ color: '#ffffff' }}>Ohri</span>
              </h1>
              <p className="hero-subtitle" style={{ color: '#94a3b8', fontWeight: 300, marginBottom: '0.5rem' }}>
                Full-Stack & AI Software Developer
              </p>
              <p style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: 300 }}>
                B.Tech CSE (Data Science) @ NMIMS Chandigarh
              </p>
            </div>

            {/* 2. SKILLS SECTION */}
            <div className="scroll-section skills-section">
              <h2 className="section-title">Full-Stack <br/>& AI Integration</h2>
              <p style={{ fontSize: '1.2rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                Bridging the gap between complex data and intuitive user experiences.
                Specialized in LLM integrations (Gemini, Groq) and modern web architectures.
              </p>
              <div className="flex-container" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                {['React', 'Next.js', 'TypeScript', 'FastAPI', 'Python', 'Tailwind CSS', 'Three.js', 'Firebase', 'PostgreSQL', 'Gemini API'].map(skill => (
                  <span key={skill} style={{ padding: '0.5rem 1.5rem', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: '2rem', fontSize: '0.9rem' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* 3. EXPERIENCE SECTION */}
            <div className="scroll-section experience-section">
              <h2 className="section-title">Professional<br/>Experience</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
                <div style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', borderLeft: '4px solid #ffffff', borderRadius: '0 1rem 1rem 0' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>LaunchED Global</h3>
                  <p style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1rem' }}>Web Development Intern | May - Jul 2026</p>
                  <p style={{ color: '#94a3b8', lineHeight: 1.5 }}>Architected responsive, mobile-first web pages, reducing cross-device rendering inconsistencies by 25%. Refactored legacy components into modular UI patterns following clean-code practices.</p>
                </div>
                <div style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', borderLeft: '4px solid #ffffff', borderRadius: '0 1rem 1rem 0' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>MAG Insights</h3>
                  <p style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1rem' }}>Social Media & Marketing Intern | Jan - Mar 2026</p>
                  <p style={{ color: '#94a3b8', lineHeight: 1.5 }}>Directed short-form video commercials, accelerating content pipeline throughput by 40% and increasing organic audience engagement by 35%.</p>
                </div>
              </div>
            </div>

            {/* 4. PROJECTS SECTION 1 */}
            <div className="scroll-section projects-1-section">
              <h2 className="section-title">Top<br/>Projects</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
                <div style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', borderRight: '4px solid #ffffff', borderRadius: '1rem 0 0 1rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    <a href="https://getfinwise.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                      FinWise AI ↗
                    </a>
                  </h3>
                  <p style={{ color: '#ffffff', marginBottom: '1rem', fontWeight: 'bold' }}>AI-powered personal finance platform combining an AI financial mentor, scam & fraud detection, financial goal tracking, interactive market simulations, and gamified financial education.</p>
                  <p style={{ color: '#ffffff', fontSize: '0.85rem' }}>Next.js • React • FastAPI • Python • Tailwind CSS • Three.js • Framer Motion • Firebase • Groq • Gemini</p>
                </div>
                <div style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', borderRight: '4px solid #ffffff', borderRadius: '1rem 0 0 1rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    <a href="https://zir0.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                      Ziro ↗
                    </a>
                  </h3>
                  <p style={{ color: '#ffffff', marginBottom: '1rem', fontWeight: 'bold' }}>Intelligent blockchain payment layer built to make money movement smarter, safer, and more resilient. Combines zero-gas Layer 2 micro-remittances, pre-flight AI scam and address poisoning protection, an offline-first SMS/QR vault engine, and privacy-preserving Zero-Knowledge credit scoring.</p>
                  <p style={{ color: '#ffffff', fontSize: '0.85rem' }}>Next.js • React • TypeScript • FastAPI • Python • Tailwind CSS • Framer Motion • Polygon Amoy</p>
                </div>
              </div>
            </div>

            {/* 5. PROJECTS SECTION 2 */}
            <div className="scroll-section projects-2-section">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
                <div style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', borderLeft: '4px solid #ffffff', borderRadius: '0 1rem 1rem 0' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    <a href="https://uselumiere.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                      Lumiere ↗
                    </a>
                  </h3>
                  <p style={{ color: '#ffffff', marginBottom: '1rem', fontWeight: 'bold' }}>AI-powered patient identity resolution platform designed to reconcile duplicate and fragmented healthcare records using intelligent matching and confidence-based resolution.</p>
                  <p style={{ color: '#ffffff', fontSize: '0.85rem' }}>Next.js • React • Tailwind CSS • FastAPI • Python • PostgreSQL</p>
                </div>
                <div style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', borderLeft: '4px solid #ffffff', borderRadius: '0 1rem 1rem 0' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    <a href="https://byok-ai.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                      BYOK (Bring Your Own Key) ↗
                    </a>
                  </h3>
                  <p style={{ color: '#ffffff', marginBottom: '1rem', fontWeight: 'bold' }}>Bring Your Own Key AI chatbot that allows users to securely use their own API keys for personalized AI conversations.</p>
                  <p style={{ color: '#ffffff', fontSize: '0.85rem' }}>JavaScript • HTML • CSS • API</p>
                </div>
              </div>
            </div>

            {/* 6. ACHIEVEMENTS SECTION */}
            <div className="scroll-section achievements-section">
              <h2 className="section-title">Awards &<br/>Recognitions</h2>
              <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', color: '#cbd5e1', fontSize: '1.1rem' }}>
                <li><strong style={{ color: 'white' }}>1st Place</strong> — Plaksha Prayas Tech Hackathon (Future Finance)</li>
                <li><strong style={{ color: 'white' }}>Winner</strong> — ACM-SIH Ideathon</li>
                <li><strong style={{ color: 'white' }}>1st Place</strong> — Byte Battle, Code2Career Club</li>
                <li><strong style={{ color: 'white' }}>Top 6</strong> — StoxraHack 2026</li>
                <li><strong style={{ color: 'white' }}>Top 67 Nationwide</strong> — Confluence 2.0 Hackathon</li>
              </ul>
            </div>

            {/* 7. CERTIFICATIONS SECTION */}
            <div className="scroll-section certifications-section">
              <h2 className="section-title">Certifications &<br/>Virtual Experiences</h2>
              <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', color: '#cbd5e1', fontSize: '1.1rem', marginTop: '2rem' }}>
                <li><strong style={{ color: 'white' }}>Tata</strong> — GenAI Powered Data Analytics Virtual Experience</li>
                <li><strong style={{ color: 'white' }}>JPMorgan Chase</strong> — Quantitative Research Virtual Experience</li>
                <li><strong style={{ color: 'white' }}>Deloitte</strong> — Technology Consulting Virtual Experience</li>
                <li><strong style={{ color: 'white' }}>BCG</strong> — GenAI Virtual Experience</li>
                <li><strong style={{ color: 'white' }}>Google</strong> — Solution Challenge 2026</li>
                <li><strong style={{ color: 'white' }}>StoxraHack 2026</strong> — Finalist Certificate</li>
                <li><strong style={{ color: 'white' }}>Vanderbilt University</strong> — Prompt Engineering for ChatGPT</li>
              </ul>
            </div>

            {/* 8. CONTACT SECTION */}
            <div className="scroll-section contact-section">
              <h2 className="contact-title">Let's Connect</h2>
              <p style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '2rem' }}>Ready to build something extraordinary?</p>
              
              <div className="contact-links">
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
            </div>
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
}
