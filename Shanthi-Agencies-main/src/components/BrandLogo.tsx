import React from 'react';
import logoImg from '../assets/images/prema_fireworks_logo.jpeg';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: 'dark' | 'light';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  textColor = 'dark',
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12 sm:w-14 sm:h-14',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`} id="brand-logo-container">
      {/* Official Prema Fireworks Logo Emblem */}
      <div
        id="brand-logo-crest"
        className={`relative ${sizeMap[size]} shrink-0 rounded-full bg-slate-950 shadow-md border-2 border-amber-300 flex items-center justify-center overflow-hidden`}
      >
        <img
          src={logoImg}
          alt="Prema Fireworks Logo"
          className="w-full h-full object-cover rounded-full"
          referrerPolicy="no-referrer"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-['Cinzel',serif] tracking-wider text-lg sm:text-xl font-black leading-none ${
                textColor === 'light' ? 'text-white' : 'text-slate-900'
              }`}
            >
              PREMA FIREWORKS
            </span>
            <span className="bg-red-700 text-white text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded shadow-2xs">
              Exclusive
            </span>
          </div>
          <span
            className={`text-[11px] sm:text-xs font-semibold tracking-wider uppercase flex items-center gap-1 mt-0.5 ${
              textColor === 'light' ? 'text-amber-200' : 'text-slate-600'
            }`}
          >
            <span className="text-red-500">★</span> Light Up Your Celebrations <span className="text-red-500">★</span>
          </span>
        </div>
      )}
    </div>
  );
};

