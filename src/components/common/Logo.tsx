import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark' | 'orange' | 'receipt';
  size?: 'sm' | 'md' | 'lg';
  showMerchant?: boolean;
}

export const WasibuLogo: React.FC<LogoProps> = ({
  variant = 'dark',
  size = 'md',
  showMerchant = false,
}) => {
  const isLightText = variant === 'dark'; // on dark background

  const badgeSizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const titleSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
  };

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Orange circle badge */}
      <div
        className={`${badgeSizes[size]} rounded-full bg-gradient-to-br from-[#FF7A00] to-[#E64A19] flex items-center justify-center text-white shadow-sm flex-shrink-0 font-bold border border-white/20`}
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <span className="italic font-extrabold tracking-tighter text-[11px] leading-none">
          Si Bungsu
        </span>
      </div>

      {/* Brand text */}
      <div className="flex flex-col leading-tight">
        <span
          className={`font-semibold tracking-wider uppercase text-[9px] ${
            isLightText ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          WARUNG
        </span>
        <div className="flex items-baseline gap-1">
          <span
            className={`font-extrabold ${titleSizes[size]} tracking-tight ${
              isLightText ? 'text-white' : 'text-gray-900'
            }`}
            style={{ fontFamily: "'Plus Jakarta Sans', cursive, sans-serif" }}
          >
            Si Bungsu
          </span>
          {showMerchant && (
            <span
              className={`text-xs font-normal ${
                isLightText ? 'text-orange-300' : 'text-orange-600'
              }`}
            >
              Merchant
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
