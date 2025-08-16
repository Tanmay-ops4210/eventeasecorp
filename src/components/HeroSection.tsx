import React, { useEffect, useRef } from 'react';

interface HeroSectionProps {
  onBookSpot: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onBookSpot }) => {
  const sphereRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const animateSpheres = () => {
      sphereRefs.current.forEach((sphere, index) => {
        if (sphere) {
          const speed = 0.5 + index * 0.2;
          const radius = 50 + index * 30;
          const time = Date.now() * 0.001 * speed;
          
          const x = Math.cos(time) * radius;
          const y = Math.sin(time) * radius;
          
          sphere.style.transform = `translate(${x}px, ${y}px) scale(${1 + Math.sin(time) * 0.1})`;
        }
      });
    };

    const interval = setInterval(animateSpheres, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 overflow-hidden pt-16">
      {/* Animated Background Spheres */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) sphereRefs.current[index] = el;
            }}
            className={`absolute rounded-full blur-sm opacity-30 animate-pulse mobile-hidden`}
            style={{
              width: `${80 + index * 40}px`,
              height: `${80 + index * 40}px`,
              background: `linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))`,
              left: `${20 + index * 15}%`,
              top: `${10 + index * 10}%`,
              animationDelay: `${index * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Large Floating Spheres */}
      <div className="absolute top-20 right-10 w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 opacity-70 animate-bounce mobile-hidden" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-20 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 opacity-60 animate-pulse mobile-hidden" style={{ animationDuration: '4s' }} />
      <div className="absolute top-1/2 right-1/4 w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 opacity-50 animate-bounce mobile-hidden" style={{ animationDuration: '3s' }} />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white mb-6 sm:mb-8 leading-tight">
            Event
            <br />
            <span className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
              Websites
            </span>
          </h1>
          
          <div className="mb-8 sm:mb-12">
            <button
              onClick={onBookSpot}
              className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium text-white bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-indigo-600 transition-all duration-300 transform hover:scale-105 touch-manipulation"
            >
              <span className="relative z-10">BOOK YOUR SPOT</span>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </button>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 mobile-hidden">
            <div className="w-px h-16 bg-white opacity-50" />
            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;