import { ReactNode } from 'react';
import { motion } from 'motion/react';

// Common viewport configuration so it triggers early and reliably as soon as 10% is visible
const defaultViewport = { once: true, amount: 0.1 };

// Global reusable tracer line animation preset
const lineVariants = {
  traceInit: { scaleX: 0, opacity: 0 },
  tracePlay: { 
    scaleX: 1, 
    opacity: 0.8,
    transition: { duration: 1.2, ease: [0.25, 1, 0.5, 1] } 
  }
};

// Unique Animation Preset for Milestones & Work Histories
const kineticClipVariants = {
  hidden: { 
    opacity: 0, 
    y: 20
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.65, 
      ease: [0.16, 1, 0.3, 1]
    } 
  }
};

// Unique Animation Preset for Technology Credentials & Selected Achievements
const pivotSwingVariants = {
  hidden: { 
    opacity: 0,
    rotateX: -30,
    transformOrigin: "top center",
    y: -8
  },
  visible: { 
    opacity: 1,
    rotateX: 0,
    y: 0,
    transition: { 
      type: "spring",
      stiffness: 85,
      damping: 14,
      duration: 0.8
    }
  }
};

// Unique Animation Preset for Submit Inquiries Pipeline
const cyberDecryptionVariants = {
  hidden: { 
    opacity: 0,
    letterSpacing: "0.15em",
    y: 8
  },
  visible: { 
    opacity: 1,
    letterSpacing: "-0.05em",
    y: 0,
    transition: { 
      duration: 0.9, 
      ease: [0.19, 1, 0.22, 1]
    } 
  }
};

// 1. About & Academics Bento: Cybernetic Split Horizontal Trace Line & Word Slate Reveal
export function AboutBentoHeading({ subtitle, title }: { subtitle: string; title: string }) {
  const words = title.split(" ");

  const wordContainerVariants = {
    traceInit: {},
    tracePlay: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const wordVariants = {
    traceInit: { y: 30, opacity: 0 },
    tracePlay: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-10 text-left overflow-visible relative">
      <div className="flex items-center gap-3">
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={defaultViewport}
          transition={{ duration: 0.6 }}
          className="text-xs font-mono text-zinc-400 tracking-widest uppercase flex items-center gap-1.5 font-bold"
        >
          <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_6px_#f59e0b]" />
          {subtitle}
        </motion.span>
      </div>

      <div className="relative overflow-visible py-2">
        {/* Title container stagger */}
        <motion.h2
          variants={wordContainerVariants}
          initial="traceInit"
          whileInView="tracePlay"
          viewport={defaultViewport}
          className="text-3xl sm:text-4xl font-display font-black text-white tracking-tighter uppercase flex flex-wrap gap-x-2"
        >
          {words.map((word, wordIdx) => (
            <span key={wordIdx} className="overflow-hidden inline-block h-auto">
              <motion.span
                variants={wordVariants}
                className="inline-block origin-bottom"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        {/* Dynamic horizontal neon tracer glow line under the bento title */}
        <div className="relative mt-3 h-[1.5px] w-full">
          <motion.div
            variants={lineVariants}
            initial="traceInit"
            whileInView="tracePlay"
            viewport={defaultViewport}
            className="absolute inset-0 bg-gradient-to-r from-amber-500/30 via-amber-500 to-transparent origin-left"
          />
        </div>
      </div>
    </div>
  );
}

// 2. Proficiencies & Technologies: Y-Axis 3D Letter Flip with Tracer Line
export function ProficienciesHeading({ subtitle, title }: { subtitle: string; title: string }) {
  const letters = title.split("");
  
  const subtitleVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.1,
      }
    }
  };

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      rotateY: 90, 
      z: -100,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      rotateY: 0, 
      z: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 80
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 mb-10 text-left overflow-visible">
      <motion.span
        variants={subtitleVariants}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        className="text-xs font-mono text-amber-500/90 font-black uppercase tracking-widest flex items-center gap-1.5"
      >
        <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_6px_#f59e0b]" />
        {subtitle}
      </motion.span>
      <div className="relative overflow-visible py-2">
        <motion.h2
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="text-3xl sm:text-4xl font-display font-black text-white tracking-tighter uppercase flex flex-wrap"
          style={{ perspective: '800px' }}
        >
          {letters.map((char, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              className="inline-block origin-center"
              style={{ display: "inline-block", whiteSpace: "pre" }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h2>

        {/* Tracer Line */}
        <div className="relative mt-3 h-[1.5px] w-full">
          <motion.div
            variants={lineVariants}
            initial="traceInit"
            whileInView="tracePlay"
            viewport={defaultViewport}
            className="absolute inset-0 bg-gradient-to-r from-amber-500/30 via-amber-500 to-transparent origin-left"
          />
        </div>
      </div>
    </div>
  );
}

// 3. Featured Product Proofs: Elegant Tracking-In Expansion with Tracer Line
export function FeaturedProofsHeading({ subtitle, title, rightContent }: { subtitle: string; title: string; rightContent?: ReactNode }) {
  const subtitleVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, letterSpacing: '0.25em', filter: 'blur(3px)', y: 15 },
    visible: {
      opacity: 1,
      letterSpacing: '-0.05em',
      filter: 'blur(0px)',
      y: 0,
      transition: { duration: 0.9, ease: [0.25, 1, 0.5, 1] }
    }
  };

  const rightVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, delay: 0.2 }
    }
  };

  return (
    <div className="flex flex-col gap-2 mb-6 text-left w-full h-auto overflow-visible">
      <motion.span
        variants={subtitleVariants}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        className="text-xs font-mono text-amber-500/90 font-black uppercase tracking-widest flex items-center gap-1.5"
      >
        <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_6px_#f59e0b]" />
        {subtitle}
      </motion.span>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 w-full h-auto relative overflow-visible py-1">
        <div className="overflow-visible py-1">
          <motion.h2
            variants={titleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="text-3xl sm:text-4xl font-display font-black text-white tracking-tighter uppercase origin-left"
          >
            {title}
          </motion.h2>
        </div>
        {rightContent && (
          <motion.div
            variants={rightVariants}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="shrink-0 mb-1"
          >
            {rightContent}
          </motion.div>
        )}
      </div>

      {/* Tracer Line */}
      <div className="relative mt-2 h-[1.5px] w-full">
        <motion.div
          variants={lineVariants}
          initial="traceInit"
          whileInView="tracePlay"
          viewport={defaultViewport}
          className="absolute inset-0 bg-gradient-to-r from-amber-500/30 via-amber-500 to-transparent origin-left"
        />
      </div>
    </div>
  );
}

// 4. Milestones & Work Histories: Kinetic Diagonal Clip Reveal with Tracer Line
export function MilestonesHeading({ subtitle, title, paragraph }: { subtitle: string; title: string; paragraph: string }) {
  const subtitleVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  const paragraphVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.7, delay: 0.35 }
    }
  };

  const wordContainerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1,
      }
    }
  };

  const wordVariants = {
    hidden: { 
      opacity: 0, 
      y: "100%", 
      skewY: 6,
      rotate: 2
    },
    visible: { 
      opacity: 1, 
      y: 0,
      skewY: 0,
      rotate: 0,
      transition: { 
         duration: 0.8, 
         ease: [0.16, 1, 0.3, 1] 
       } 
    }
  };

  return (
    <div className="flex flex-col text-left gap-2 overflow-visible">
      <motion.span
        variants={subtitleVariants}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        className="text-xs font-mono text-amber-500 font-bold uppercase tracking-widest ring-1 ring-amber-500/20 px-3.5 py-1.5 rounded-full w-fit bg-amber-500/[0.03] flex items-center gap-1.5"
      >
        <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_6px_#f59e0b]" />
        {subtitle}
      </motion.span>
      <div className="overflow-visible relative pb-1">
        <motion.h2
          variants={wordContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="text-3xl sm:text-4xl font-display font-black text-white tracking-tighter uppercase flex flex-wrap gap-x-2"
        >
          {title.split(" ").map((word, wordIdx) => (
            <span key={wordIdx} className="overflow-hidden inline-block py-0.5">
              <motion.span
                variants={wordVariants}
                className="inline-block"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        {/* Tracer Line directly below the Milestones main heading */}
        <div className="relative mt-3 h-[1.5px] w-full">
          <motion.div
            variants={lineVariants}
            initial="traceInit"
            whileInView="tracePlay"
            viewport={defaultViewport}
            className="absolute inset-0 bg-gradient-to-r from-amber-500/30 via-amber-500 to-transparent origin-left"
          />
        </div>
      </div>
      <motion.p
        variants={paragraphVariants}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        className="text-base sm:text-lg text-zinc-300/95 leading-relaxed max-w-xl mt-4 font-sans"
      >
        {paragraph}
      </motion.p>
    </div>
  );
}

// 5. Work History Sub-Heading: Kinetic Diagonal Clip Reveal (same level as Educational & Career Milestones)
export function WorkHistorySubHeading({ subtitle, title }: { subtitle: string; title: string }) {
  const subtitleVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  const wordContainerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1,
      }
    }
  };

  const wordVariants = {
    hidden: { 
      opacity: 0, 
      y: "100%", 
      skewY: 6,
      rotate: 2
    },
    visible: { 
      opacity: 1, 
      y: 0,
      skewY: 0,
      rotate: 0,
      transition: { 
         duration: 0.8, 
         ease: [0.16, 1, 0.3, 1] 
       } 
    }
  };

  return (
    <div className="flex flex-col text-left gap-2 overflow-visible">
      <motion.span
        variants={subtitleVariants}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        className="text-xs font-mono text-amber-500 font-bold uppercase tracking-widest ring-1 ring-amber-500/20 px-3.5 py-1.5 rounded-full w-fit bg-amber-500/[0.03] flex items-center gap-1.5"
      >
        <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_6px_#f59e0b]" />
        {subtitle}
      </motion.span>
      <div className="relative overflow-visible pb-1">
        <motion.h2
          variants={wordContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="text-3xl sm:text-4xl font-display font-black text-white tracking-tighter uppercase flex flex-wrap gap-x-2"
        >
          {title.split(" ").map((word, wordIdx) => (
            <span key={wordIdx} className="overflow-hidden inline-block py-0.5">
              <motion.span
                variants={wordVariants}
                className="inline-block"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        {/* Tracer Line */}
        <div className="relative mt-3 lg:mt-[52px] h-[1.5px] w-full">
          <motion.div
            variants={lineVariants}
            initial="traceInit"
            whileInView="tracePlay"
            viewport={defaultViewport}
            className="absolute inset-0 bg-gradient-to-r from-amber-500/30 via-amber-500 to-transparent origin-left"
          />
        </div>
      </div>
    </div>
  );
}

// 6. Technology Credentials & Achievements: 3D Pivot Swing-Down & Flare with active Tracer Line
export function CredentialsHeading({ subtitle, title }: { subtitle: string; title: string }) {
  const subtitleVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 0.9,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const letterContainerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.015,
        delayChildren: 0.1,
      }
    }
  };

  const letterVariants2 = {
    hidden: { 
      opacity: 0, 
      y: 12,
      scale: 0.8,
      filter: "blur(3px)",
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { 
        type: "spring",
        stiffness: 140,
        damping: 15
      } 
    }
  };

  return (
    <div className="text-left pb-4 overflow-visible relative flex flex-col gap-2">
      <motion.span
        variants={subtitleVariants}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        className="text-xs font-mono text-amber-500/90 font-black uppercase tracking-widest flex items-center gap-1.5"
      >
        <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_6px_#f59e0b]" />
        {subtitle}
      </motion.span>
      <div className="relative overflow-visible pb-1">
        <motion.h2
          variants={letterContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="text-3xl sm:text-4xl font-display font-black text-white tracking-tighter uppercase flex flex-wrap"
        >
          {title.split("").map((char, index) => (
            <motion.span
              key={index}
              variants={letterVariants2}
              className="inline-block origin-center"
              style={{ display: "inline-block", whiteSpace: "pre" }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h2>

        {/* Tracer Line replacing static border */}
        <div className="relative mt-3 h-[1.5px] w-full">
          <motion.div
            variants={lineVariants}
            initial="traceInit"
            whileInView="tracePlay"
            viewport={defaultViewport}
            className="absolute inset-0 bg-gradient-to-r from-amber-500/30 via-amber-500 to-transparent origin-left"
          />
        </div>
      </div>
    </div>
  );
}

// 7. Secure Transmission Portal: Decryption Glitch with Tracer Line
export function ContactHeading({ subtitle, title }: { subtitle: string; title: string }) {
  const subtitleVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="flex flex-col gap-2 mb-2 text-left overflow-visible">
      <motion.span
        variants={subtitleVariants}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        className="text-xs font-mono text-amber-500/90 font-black uppercase tracking-widest flex items-center gap-1.5"
      >
        <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_6px_#f59e0b]" />
        {subtitle}
      </motion.span>
      <div className="relative overflow-visible py-2">
        <motion.h2
          variants={cyberDecryptionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="text-3xl sm:text-4xl font-display font-black text-white tracking-tighter uppercase"
          style={{ transformOrigin: 'top center' }}
        >
          {title}
        </motion.h2>

        {/* Tracer Line */}
        <div className="relative mt-3 h-[1.5px] w-full">
          <motion.div
            variants={lineVariants}
            initial="traceInit"
            whileInView="tracePlay"
            viewport={defaultViewport}
            className="absolute inset-0 bg-gradient-to-r from-amber-500/30 via-amber-500 to-transparent origin-left"
          />
        </div>
      </div>
    </div>
  );
}
