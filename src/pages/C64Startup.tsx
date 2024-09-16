import React, { useState, useEffect } from 'react';
import TypeWriter from '../components/TypeWriter';

interface C64StartupProps {
  setBooted: React.Dispatch<React.SetStateAction<boolean>>;
}

const C64Startup: React.FC<C64StartupProps> = ({ setBooted }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const bootSequence = [
    '**** COMMODORE 64 BASIC V2 ****',
    '64K RAM SYSTEM  38911 BASIC BYTES FREE',
    'READY.',
    { type: 'typewriter', text: 'LOAD "MENU",8,1' },
    'SEARCHING FOR MENU',
    'LOADING',
    'READY.',
    { type: 'cursor' },
  ];

  useEffect(() => {
    const executeBootSequence = async () => {
      // Initial lines appear instantly
      setCurrentStep(3);

      // Typewriter effect with leading cursor
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setCurrentStep(4);

      // Subsequent lines with delay
      for (let i = 4; i < bootSequence.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setCurrentStep(i);
      }

      // Navigate after the sequence
      await new Promise((resolve) => setTimeout(resolve, 10000));
      setBooted(true); // Set booted to true after the boot sequence
    };

    executeBootSequence();
  }, [setBooted]); // Include setBooted in the dependency array

  return (
    <div className="c64-startup">
      {bootSequence.slice(0, currentStep + 1).map((item, index) => (
        <div key={index} className="boot-line">
          {typeof item === 'string' ? (
            item
          ) : item.type === 'typewriter' ? (
            <TypeWriter text={item.text ?? ''} delay={50} />
          ) : item.type === 'cursor' ? (
            <span className="cursor">_</span>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default C64Startup;

