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
    sm: { container: 'w-6 h-6', text: 'text-lg', icon: 'w-3 h-3' },
    md: { container: 'w-8 h-8', text: 'text-xl', icon: 'w-4 h-4' },
    lg: { container: 'w-12 h-12', text: 'text-2xl', icon: 'w-6 h-6' }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Sophisticated Logo Icon */}
      <div className={`${sizeClasses[size].container} relative`}>
        {/* Main logo container - gradient background */}
        <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-500 shadow-lg flex items-center justify-center overflow-hidden">
          {/* Static background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <pattern id="logo-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#logo-grid)" />
              </svg>
            </div>
          </div>

          {/* Central logo symbol */}
          <div className="relative z-10 flex items-center justify-center">
            {/* FundFlow "FF" symbol */}
            <div className={`${sizeClasses[size].icon} relative`}>
              {/* Main F shape with modern styling */}
              <div className="relative w-full h-full">
                {/* Vertical line */}
                <div className="absolute left-0 top-0 w-0.5 h-full bg-white rounded-full shadow-sm"></div>

                {/* Top horizontal line */}
                <div className="absolute left-0 top-0 w-2 h-0.5 bg-white rounded-full shadow-sm"></div>

                {/* Middle horizontal line */}
                <div className="absolute left-0 top-1.5 w-1.5 h-0.5 bg-emerald-300 rounded-full shadow-sm"></div>

                {/* Flow indicator dots */}
                <div className="absolute right-0 top-0.5 w-1 h-1 bg-emerald-300 rounded-full"></div>
                <div className="absolute right-0 top-2 w-0.5 h-0.5 bg-emerald-300 rounded-full"></div>

                {/* Blockchain connection lines */}
                <div className="absolute -right-1 top-1 w-0.5 h-0.5 bg-purple-300 rounded-full opacity-60"></div>
                <div className="absolute -right-1 bottom-1 w-0.5 h-0.5 bg-blue-300 rounded-full opacity-60"></div>
              </div>
            </div>
          </div>

          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-emerald-400/20 blur-sm"></div>
        </div>

        {/* Floating elements for sophistication */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-80"></div>
        <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-60"></div>
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`${sizeClasses[size].text} font-bold text-gray-900 dark:text-white tracking-tight leading-none`}>
            Fund<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-500">Flow</span>
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">
            Blockchain Capital
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;