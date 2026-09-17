import { useState, useEffect } from 'react';

export function useScrollSpy() {
  const [activeSection, setActiveSection] = useState('home');
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsNavScrolled(window.scrollY > 20);
      setShowScrollTop(window.scrollY > 400);

      const sections = ['home', 'about', 'skills', 'projects', 'experience', 'achievements', 'contact'];
      const scrollPos = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Run once initially to set values
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { activeSection, isNavScrolled, showScrollTop, setActiveSection };
}
