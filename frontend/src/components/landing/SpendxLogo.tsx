import React from 'react';

interface SpendxLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  iconOnly?: boolean;
}

export const SpendxLogo: React.FC<SpendxLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
  iconOnly = false,
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
      {/* Geometric Symbol: Minimal Dark Slate with Neon Lime Accent Vector */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Outer Rounded Dark Icon Tile */}
          <rect
            x="3"
            y="3"
            width="30"
            height="30"
            rx="10"
            className="fill-[#111711] dark:fill-[#202420]"
          />
          {/* Delicate Border */}
          <rect
            x="3"
            y="3"
            width="30"
            height="30"
            rx="10"
            stroke="#A5F12B"
            strokeOpacity="0.3"
            strokeWidth="1"
          />

          {/* Intersecting Neon Lime Growth Vector & Spark */}
          <path
            d="M10 24L16 17.5L20 21L26 12"
            stroke="#A5F12B"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21.5 12H26V16.5"
            stroke="#A5F12B"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Intelligence Node */}
          <circle cx="16" cy="17.5" r="1.5" fill="#A5F12B" />
          <circle cx="20" cy="21" r="1.5" fill="#A5F12B" />
        </svg>
      </div>

      {!iconOnly && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-display font-extrabold tracking-tight text-foreground ${textSizes[size]}`}>
              SPENDX
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          </div>
          {showTagline && (
            <span className="text-[10px] tracking-wider text-secondary-text uppercase font-medium">
              AI Financial Platform
            </span>
          )}
        </div>
      )}
    </div>
  );
};
