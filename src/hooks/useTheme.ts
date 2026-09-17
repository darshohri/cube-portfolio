import { useState, useLayoutEffect, useCallback } from 'react';

export function useTheme(showIntro: boolean) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Sync theme classes before paint
  useLayoutEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light');
      document.documentElement.classList.add('light');
    } else {
      document.body.classList.remove('light');
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    if (showIntro) return; // Prevent switching theme during intro or before load
    
    document.documentElement.classList.add('theme-transitioning');
    
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 650);
  }, [showIntro]);

  return { theme, toggleTheme };
}
