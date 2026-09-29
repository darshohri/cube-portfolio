import React, { useEffect, useState } from 'react';
import './CustomCursor.css';

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile to disable custom cursor on touch devices
    const checkMobile = () => {
      const match = window.matchMedia('(pointer: coarse)');
      setIsMobile(match.matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const checkHoverState = (target: HTMLElement) => {
      const docCursor = document.body.style.cursor;
      if (
        (target && window.getComputedStyle(target).cursor === 'pointer') ||
        (target && target.tagName.toLowerCase() === 'a') ||
        (target && target.tagName.toLowerCase() === 'button') ||
        docCursor === 'pointer' || 
        docCursor === 'grab' || 
        docCursor === 'grabbing'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      checkHoverState(e.target as HTMLElement);
    };

    const handleMouseOver = (e: MouseEvent) => {
      checkHoverState(e.target as HTMLElement);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  if (isMobile) return null;

  return (
    <>
      <div 
        className={`cursor-dot ${isHovering ? 'hover' : ''} ${isClicking ? 'clicking' : ''}`}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
      <div 
        className={`cursor-ring ${isHovering ? 'hover' : ''} ${isClicking ? 'clicking' : ''}`}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
    </>
  );
}
