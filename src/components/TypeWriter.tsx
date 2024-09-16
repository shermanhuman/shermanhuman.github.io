// src/components/TypeWriter.tsx
import React, { useState, useEffect } from 'react';

interface TypeWriterProps {
  text: string;
  delay?: number;
}

const TypeWriter: React.FC<TypeWriterProps> = ({ text, delay = 50 }) => {
  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex <= text.length) {
        setCurrentText(text.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, delay);

    return () => clearInterval(intervalId);
  }, [text, delay]);

  return <span>{currentText}</span>;
};

export default TypeWriter;