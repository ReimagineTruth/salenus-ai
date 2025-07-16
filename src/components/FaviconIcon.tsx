import React from 'react';

interface FaviconIconProps {
  size?: number;
  className?: string;
}

export const FaviconIcon: React.FC<FaviconIconProps> = ({ size = 32, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      <circle cx="16" cy="16" r="16" fill="black" />
      
      {/* Outer ring with gradient */}
      <defs>
        <linearGradient id="outerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff00ff" /> {/* Magenta */}
          <stop offset="50%" stopColor="#8b00ff" /> {/* Purple */}
          <stop offset="100%" stopColor="#0066ff" /> {/* Blue */}
        </linearGradient>
        <linearGradient id="innerGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ffff" /> {/* Cyan */}
          <stop offset="100%" stopColor="#0088ff" /> {/* Light blue */}
        </linearGradient>
      </defs>
      
      {/* Outer ring */}
      <circle cx="16" cy="16" r="14" fill="url(#outerGradient)" />
      
      {/* Inner glow ring */}
      <circle cx="16" cy="16" r="10" fill="url(#innerGlow)" />
      
      {/* Central pupil */}
      <circle cx="16" cy="16" r="6" fill="#000000" />
      
      {/* Highlight/reflection */}
      <circle cx="18" cy="14" r="2" fill="#00ffff" />
    </svg>
  );
};

export default FaviconIcon; 