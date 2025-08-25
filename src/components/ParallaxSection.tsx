import React, { useEffect, useState, useRef } from 'react';

const ParallaxSection: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  // Indian event images for rotation
  const images = [
    'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1920', // Indian wedding
    'https://images.pexels.com/photos/1729931/pexels-photo-1729931.jpeg?auto=compress&cs=tinysrgb&w=1920', // Birthday party
    'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=1920', // Travel/tour
    'https://images.pexels.com/photos/159844/cellular-education-classroom-159844.jpeg?auto=compress&cs=tinysrgb&w=1920' // School function
  ];

  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Calculate parallax offset
  const parallaxOffset = scrollY * 0.3;

  return (
    <div
      ref={parallaxRef}
      className="relative h-96 overflow-hidden parallax-container"
    >
      <div
        className="parallax-background"
        style={{
          transform: `translateY(${parallaxOffset}px)`,
          backgroundImage: `url(${images[currentImageIndex]})`,
        }}
      />

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      {/* Content overlay */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 opacity-90">
            Experience Amazing Events
          </h2>
          <p className="text-xl md:text-2xl opacity-80">
            From weddings to corporate functions, we make every moment special
          </p>
        </div>
      </div>

      {/* Image indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`View image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ParallaxSection;
