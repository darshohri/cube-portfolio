import { motion, AnimatePresence } from 'motion/react';
import { FeaturedProofsHeading } from '../AnimatedHeadings';
import WireframeProjectCard from '../WireframeProjectCard';
import { Project } from '../../data';
import { playSound } from '../../utils/audio';

interface ProjectsProps {
  sectionRevealVariants: any;
  activeProjCat: 'all' | 'aiml' | 'web';
  setActiveProjCat: (cat: 'all' | 'aiml' | 'web') => void;
  filteredProjects: Project[];
  setSelectedProject: (proj: Project) => void;
}

export default function Projects({ 
  sectionRevealVariants, 
  activeProjCat, 
  setActiveProjCat, 
  filteredProjects, 
  setSelectedProject 
}: ProjectsProps) {
  return (
    <motion.section 
      id="projects" 
      variants={sectionRevealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      className="scroll-mt-24"
    >
      <FeaturedProofsHeading 
        subtitle="03 • Projects"
        title="Featured Work"
        rightContent={
          <div className="flex items-center gap-1.5 bg-black p-1 border border-white/5 rounded-xl">
            <button
              onClick={() => setActiveProjCat('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-all duration-200 cursor-pointer ${
                activeProjCat === 'all' ? 'bg-amber-500 font-extrabold text-black shadow shadow-amber-500/10' : 'text-zinc-500 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveProjCat('aiml')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-all duration-200 cursor-pointer ${
                activeProjCat === 'aiml' ? 'bg-amber-500 font-extrabold text-black shadow shadow-amber-500/10' : 'text-zinc-500 hover:text-white'
              }`}
            >
              AI/ML & Data
            </button>
            <button
              onClick={() => setActiveProjCat('web')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-all duration-200 cursor-pointer ${
                activeProjCat === 'web' ? 'bg-amber-500 font-extrabold text-black shadow shadow-amber-500/10' : 'text-zinc-500 hover:text-white'
              }`}
            >
              Web Apps
            </button>
          </div>
        }
      />

      {/* Grid layout cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              key={project.id}
            >
              <WireframeProjectCard 
                project={project}
                onAnalyze={() => {
                  setSelectedProject(project);
                  playSound.playOpen();
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
