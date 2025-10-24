import React, { useState, useEffect } from 'react';

export const TerminalPrompt = ({ text, delay = 50 }) => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.substring(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, delay);

    return () => clearInterval(timer);
  }, [text, delay]);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <div className="font-mono text-primary">
      <span className="text-glow">{displayText}</span>
      {showCursor && (
        <span className="inline-block w-2 h-5 bg-primary ml-1 animate-blink" />
      )}
    </div>
  );
};