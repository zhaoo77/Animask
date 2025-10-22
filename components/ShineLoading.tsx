import React from 'react';

const ShineLoading: React.FC = () => {
  return (
    <div className="text-center py-4">
      <div className="relative inline-block text-5xl font-bold tracking-[0.2em] text-black/25 dark:text-white/25 uppercase overflow-hidden select-none">
        ANIMASK
        <div className="shine-effect absolute top-0 -left-full w-full h-full"></div>
      </div>
      <style>{`
        .shine-effect {
          background: linear-gradient(
            100deg,
            transparent,
            rgba(255, 255, 255, 0.5),
            transparent 80%
          );
          transform: skewX(-25deg);
          animation: shine 3s ease-in-out infinite;
        }

        @keyframes shine {
          0% {
            left: -150%;
          }
          100% {
            left: 150%;
          }
        }
      `}</style>
    </div>
  );
};

export default ShineLoading;