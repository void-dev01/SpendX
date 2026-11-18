import React from 'react';

interface SpendxLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const SpendxLogo: React.FC<SpendxLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Geometric Symbol: Finance Vector + Neural Intelligence Hexagon */}
      <div className={`relative flex items-center justify-center ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_4px_12px_rgba(73,107,219,0.30)]"
        >
          <defs>
            <linearGradient id="spendxGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#496BDB" />
              <stop offset="50%" stopColor="#5F42C7" />
              <stop offset="100%" stopColor="#7256D9" />
            </linearGradient>
            <linearGradient id="facetGrad" x1="6" y1="6" x2="30" y2="30" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Outer Rounded Hexagonal Crystal */}
          <rect
            x="3"
            y="3"
            width="30"
            height="30"
            rx="9"
            fill="url(#spendxGrad)"
          />
          {/* Inner Geometric Specular Highlight */}
          <rect
            x="4"
            y="4"
            width="28"
            height="28"
            rx="8"
            stroke="url(#facetGrad)"
            strokeWidth="1.5"
          />

          {/* Intersecting Financial Growth Vector & Intelligence Spark */}
          <path
            d="M10 24L16 17.5L20 21L26 12"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21.5 12H26V16.5"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Small Intelligence Spark Node */}
          <circle cx="16" cy="17.5" r="1.5" fill="#FFFFFF" />
          <circle cx="20" cy="21" r="1.5" fill="#FFFFFF" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className={`font-extrabold tracking-tight text-gradient-brand ${textSizes[size]}`}>
            SPENDX
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
        </div>
        {showTagline && (
          <span className="text-[10px] tracking-wider text-muted-foreground uppercase font-medium">
            AI Financial Platform
          </span>
        )}
      </div>
    </div>
  );
};
