import React from 'react';

interface BroLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const BroLogo: React.FC<BroLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true
}) => {
  // Height and scale profiles
  const dimensions = {
    sm: { width: 90, height: 42, textTrack: 'tracking-[0.28em]', textSize: 'text-[7px]' },
    md: { width: 130, height: 60, textTrack: 'tracking-[0.34em]', textSize: 'text-[9px]' },
    lg: { width: 180, height: 84, textTrack: 'tracking-[0.38em]', textSize: 'text-[12px]' },
    xl: { width: 240, height: 110, textTrack: 'tracking-[0.42em]', textSize: 'text-[15px]' }
  }[size];

  return (
    <div className={`inline-flex flex-col items-center justify-center select-none ${className}`}>
      {/* SVG Reproducing the exact BRO interlocking outline typography from the image */}
      <svg
        viewBox="0 0 320 145"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: `${dimensions.width}px`, height: 'auto' }}
        className="text-white shrink-0 drop-shadow-sm"
      >
        {/* === B === */}
        {/* Outer outline of B */}
        <path
          d="M10 10 H75 C95 10 110 22 110 40 C110 50 104 58 95 63 C107 68 114 78 114 92 C114 112 96 125 75 125 H10 V10 Z"
          stroke="white"
          strokeWidth="10"
          strokeLinejoin="miter"
          fill="black"
        />
        {/* Upper inner counter of B */}
        <path
          d="M32 30 H68 C78 30 86 34 86 42 C86 50 78 54 68 54 H32 V30 Z"
          stroke="white"
          strokeWidth="8"
          fill="black"
        />
        {/* Lower inner counter of B */}
        <path
          d="M32 74 H70 C80 74 89 79 89 88 C89 97 80 102 70 102 H32 V74 Z"
          stroke="white"
          strokeWidth="8"
          fill="black"
        />

        {/* === R === */}
        {/* Outer outline of R interlocking with B and O */}
        <path
          d="M110 10 H180 C202 10 216 23 216 43 C216 57 207 68 193 73 L225 125 H182 L154 78 H134 V125 H110 V10 Z"
          stroke="white"
          strokeWidth="10"
          strokeLinejoin="miter"
          fill="black"
        />
        {/* Inner loop of R */}
        <path
          d="M134 30 H174 C184 30 192 34 192 43 C192 52 184 56 174 56 H134 V30 Z"
          stroke="white"
          strokeWidth="8"
          fill="black"
        />

        {/* === O === */}
        {/* Outer circle of O */}
        <circle
          cx="255"
          cy="58"
          r="48"
          stroke="white"
          strokeWidth="10"
          fill="black"
        />
        {/* Inner circle of O */}
        <circle
          cx="255"
          cy="58"
          r="26"
          stroke="white"
          strokeWidth="8"
          fill="black"
        />

        {/* Underline block/bar beneath O */}
        <rect
          x="212"
          y="112"
          width="86"
          height="14"
          fill="black"
          stroke="white"
          strokeWidth="9"
        />
      </svg>

      {/* Subtitle: "B a r b e a r i a" */}
      {showSubtitle && (
        <span
          className={`font-sans font-light text-white uppercase ${dimensions.textTrack} ${dimensions.textSize} mt-1 pl-[0.2em] leading-none select-none`}
          style={{ letterSpacing: '0.42em' }}
        >
          Barbearia
        </span>
      )}
    </div>
  );
};
