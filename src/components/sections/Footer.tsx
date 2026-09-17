import { personalInfo } from '../../data';

export default function Footer() {
  return (
    <footer id="footer-portal" className="border-t border-white/5 bg-[#030303]/80 py-12 px-4 relative z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        <div className="text-left font-sans">
          <h4 className="text-white font-display font-black text-base uppercase">Darsh Ohri</h4>
          <p className="text-sm text-zinc-400 leading-relaxed mt-1.5">
            B.Tech Computer Science &amp; Engineering Student (Data Science Specialization)<br />
            SVKM's NMIMS University, Chandigarh (2025–2029)
          </p>
        </div>

        <div className="flex flex-col md:text-right md:items-end gap-2 text-xs text-zinc-500 font-mono">
          <div className="flex gap-4 md:justify-end flex-wrap">
            <a href={`https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Visit my GitHub profile">GitHub</a>
            <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Visit my LinkedIn profile">LinkedIn</a>
            <a href={`https://${personalInfo.leetcode}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Visit my LeetCode profile">LeetCode</a>
            <a href="mailto:darshohri@gmail.com" className="hover:text-white transition-colors" aria-label="Email me directly">{personalInfo.email}</a>
          </div>
          <p className="text-[10px] text-zinc-600 mt-2">
            Designed in India &bull; React 19 + Tailwind v4 + Framer Motion Engine &bull; Compile ID: v4.11
          </p>
        </div>

      </div>
    </footer>
  );
}
