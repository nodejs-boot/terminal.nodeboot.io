import React, { useEffect, useRef } from 'react';

export const MatrixRain = ({ density = 0.05 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ$&@#';
    const columns = Math.floor(window.innerWidth / 20);
    const drops = [];

    // Create matrix characters
    for (let i = 0; i < columns * density; i++) {
      const span = document.createElement('span');
      span.className = 'matrix-char';
      span.textContent = chars[Math.floor(Math.random() * chars.length)];
      span.style.left = Math.random() * 100 + '%';
      span.style.animationDuration = (Math.random() * 3 + 2) + 's';
      span.style.animationDelay = Math.random() * 2 + 's';
      container.appendChild(span);
      drops.push(span);
    }

    // Update characters periodically
    const interval = setInterval(() => {
      drops.forEach(drop => {
        if (Math.random() > 0.95) {
          drop.textContent = chars[Math.floor(Math.random() * chars.length)];
        }
      });
    }, 100);

    return () => {
      clearInterval(interval);
      drops.forEach(drop => drop.remove());
    };
  }, [density]);

  return <div ref={containerRef} className="matrix-rain" aria-hidden="true" />;
};
