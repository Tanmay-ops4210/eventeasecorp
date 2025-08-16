import React from 'react';

interface BottomSectionProps {
  onBookNow: () => void;
}

const topics = [
  { text: 'Design', color: 'text-indigo-600' },
  { text: 'Strategy', color: 'text-purple-600' },
  { text: 'Marketing', color: 'text-blue-600' },
  { text: 'Culture', color: 'text-indigo-800' },
  { text: 'Engagement', color: 'text-purple-800' }
];

const images = [
  'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=200'
];

const BottomSection: React.FC<BottomSectionProps> = ({ onBookNow }) => {
  return (
    <section className="relative py-12 sm:py-16 lg:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Side - Topics and Images */}
          <div className="relative">
            <div className="space-y-6 sm:space-y-8">
              {topics.map((topic, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 sm:space-x-6 group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Topic Text */}
                  <h3 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold ${topic.color} group-hover:scale-105 transition-transform duration-300`}>
                    {topic.text}
                  </h3>
                  
                  {/* Associated Image */}
                  <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-lg sm:rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                    <img
                      src={images[index]}
                      alt={topic.text}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Scattered decorative elements */}
            <div className="absolute -top-4 -right-4 w-2 h-2 bg-indigo-400 rounded-full animate-pulse mobile-hidden" />
            <div className="absolute top-1/3 -left-2 w-3 h-3 bg-purple-400 rounded-full animate-bounce mobile-hidden" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse mobile-hidden" style={{ animationDelay: '2s' }} />
          </div>

          {/* Right Side - CTA Section */}
          <div className="relative">
            {/* Background card with 3D effect */}
            <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl transform hover:scale-105 transition-all duration-300">
              {/* Floating decorative spheres */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl opacity-70 animate-pulse transform rotate-12 mobile-hidden" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-60 animate-bounce mobile-hidden" style={{ animationDuration: '3s' }} />
              
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                  SAVE
                  <br />
                  YOUR
                  <br />
                  SPOT
                </h2>
                
                <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                  A unique event filled with networking, workshops, seminars, and engaging conversations with the industry's leading experts.
                </p>
                
                <button
                  onClick={onBookNow}
                  className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium text-indigo-600 bg-white rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl touch-manipulation"
                >
                  <span className="relative z-10">BOOK NOW</span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BottomSection;