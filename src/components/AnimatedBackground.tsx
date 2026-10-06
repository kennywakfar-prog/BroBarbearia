import React from 'react';

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* 1. Base deep dark field */}
      <div className="absolute inset-0 bg-[#040404]" />

      {/* 2. Animated Monochromatic Barber Stripes Pattern */}
      <div className="absolute inset-0 barber-pattern-bg opacity-40" />

      {/* 3. Subtle Technical Grid with mask */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff07_1px,transparent_1px),linear-gradient(to_bottom,#ffffff07_1px,transparent_1px)] bg-[size:36px_36px]"
        style={{
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 20%, transparent 80%)'
        }}
      />

      {/* 4. Ambient Glowing Spotlight 1 (Top-Right / Center) */}
      <div 
        className="absolute -top-32 right-[-10%] w-[480px] sm:w-[680px] h-[480px] sm:h-[680px] rounded-full bg-gradient-to-br from-zinc-200/15 via-zinc-400/8 to-transparent blur-[90px] sm:blur-[120px] animate-ambient-1"
      />

      {/* 5. Ambient Glowing Spotlight 2 (Bottom-Left / Mid) */}
      <div 
        className="absolute top-[35%] -left-36 w-[420px] sm:w-[580px] h-[420px] sm:h-[580px] rounded-full bg-gradient-to-tr from-zinc-100/12 via-zinc-300/6 to-transparent blur-[80px] sm:blur-[110px] animate-ambient-2"
      />

      {/* 6. Specular Razor Light Ray Sweep */}
      <div className="absolute inset-0 flex items-center justify-center opacity-40">
        <div className="w-[180%] h-32 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-md transform -rotate-45 animate-razor-beam" />
      </div>

      {/* 7. Vignette Dark Border Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)]" />
    </div>
  );
};
