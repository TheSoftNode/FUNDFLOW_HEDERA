"use client";

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: { container: 'w-6 h-6', text: 'text-lg' },
    md: { container: 'w-8 h-8', text: 'text-xl' },
    lg: { container: 'w-12 h-12', text: 'text-2xl' }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Sophisticated Logo Icon */}
      <div className={`${sizeClasses[size].container} relative`}>
        {/* Main logo container - using your exact colors */}
        <div className="relative w-full h-full rounded-lg bg-[#0A1F44] dark:bg-[#1A2A4F] border border-[#2F80ED]/20 flex items-center justify-center shadow-sm">
          {/* Flow symbol - sophisticated F design */}
          <div className="relative">
            {/* Main F shape */}
            <div className="w-3 h-4 relative">
              {/* Vertical line */}
              <div className="absolute left-0 top-0 w-0.5 h-4 bg-[#2F80ED]"></div>
              {/* Top horizontal line */}
              <div className="absolute left-0 top-0 w-2 h-0.5 bg-[#2F80ED]"></div>
              {/* Middle horizontal line */}
              <div className="absolute left-0 top-1.5 w-1.5 h-0.5 bg-[#00C9A7]"></div>
              {/* Flow dot */}
              <div className="absolute right-0 top-0.5 w-1 h-1 bg-[#00C9A7] rounded-full opacity-80"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Text */}
      {showText && (
        <span className={`${sizeClasses[size].text} font-bold text-gray-900 dark:text-white tracking-tight`}>
          Fund<span className="text-[#2F80ED]">Flow</span>
        </span>
      )}
    </div>
  );
};

export default Logo;