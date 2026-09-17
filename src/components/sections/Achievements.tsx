import { motion } from 'motion/react';
import { Bookmark, ExternalLink, Award } from 'lucide-react';
import { CredentialsHeading } from '../AnimatedHeadings';
import { certificationsList, achievementsList } from '../../data';

interface AchievementsProps {
  sectionRevealVariants: any;
  theme: 'dark' | 'light';
}

export default function Achievements({ sectionRevealVariants, theme }: AchievementsProps) {
  return (
    <motion.section 
      id="achievements" 
      variants={sectionRevealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      className="scroll-mt-24"
    >
      <div className="flex flex-col gap-6 w-full text-left">
        <CredentialsHeading 
          subtitle="06 • Certifications"
          title="Technical Certifications"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certificationsList.map((cert, index) => (
            <div 
              key={index} 
              className="flex flex-col justify-between p-6 rounded-2xl glass-card text-left gap-6 hover:border-white/45 transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex flex-col gap-4">
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                  theme === 'light'
                    ? 'bg-slate-900/5 border-slate-200 text-slate-900'
                    : 'bg-white/5 border-white/10 text-white'
                }`}>
                  <Bookmark className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-display font-bold uppercase tracking-tight text-white leading-snug">
                    {cert.title}
                  </h3>
                  <span className="text-xs font-mono text-zinc-400 mt-2 block">
                    Authorized by: <strong className="text-zinc-200 uppercase">{cert.provider}</strong>
                  </span>
                  
                  {cert.skillsAcquired && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {cert.skillsAcquired.map((skill, sIdx) => (
                        <span 
                          key={sIdx}
                          className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/5 text-zinc-400 uppercase tracking-wider"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                  {cert.date}
                </span>
                
                {cert.link && (
                  <a 
                    href={cert.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1 text-xs font-mono text-zinc-300 hover:text-white transition-all"
                  >
                    <span>Verify</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
