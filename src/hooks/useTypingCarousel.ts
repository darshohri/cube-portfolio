import { useState, useEffect } from 'react';

export function useTypingCarousel(showIntro: boolean, isWebsiteLoaded: boolean) {
  const [typingText, setTypingText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const roles = [
    "B.Tech CSE student specializing in Data Science",
    "Aspiring Software Developer",
    "Hack-O-Mania 2.0 Finalist Developer",
    "ACM Chapter Cultural Coordinator",
    "Creative Video & Narrative Creator"
  ];

  useEffect(() => {
    if (showIntro || !isWebsiteLoaded) {
      setTypingText('');
      setCharIndex(0);
      setRoleIndex(0);
      setIsDeleting(false);
      return;
    }

    const currentFullRole = roles[roleIndex];
    let timer: any;

    const handleType = () => {
      if (!isDeleting) {
        setTypingText(currentFullRole.substring(0, charIndex + 1));
        setCharIndex(prev => prev + 1);

        if (charIndex + 1 === currentFullRole.length) {
          timer = setTimeout(() => setIsDeleting(true), 1500);
          return;
        }
      } else {
        setTypingText(currentFullRole.substring(0, charIndex - 1));
        setCharIndex(prev => prev - 1);

        if (charIndex - 1 === 0) {
          setIsDeleting(false);
          setRoleIndex(prev => (prev + 1) % roles.length);
        }
      }

      const delay = isDeleting ? 40 : 80;
      timer = setTimeout(handleType, delay);
    };

    timer = setTimeout(handleType, 100);
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, roleIndex, showIntro, isWebsiteLoaded]);

  return { typingText };
}
