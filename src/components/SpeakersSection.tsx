import React from 'react';

const speakers = [
  {
    id: 1,
    name: 'ZAWADI THANDWE',
    description: 'Professional with 20 years of experience helping brands reach their goals.',
    image: 'https://images.pexels.com/photos/3211476/pexels-photo-3211476.jpeg?auto=compress&cs=tinysrgb&w=400',
    bgColor: 'bg-teal-200'
  },
  {
    id: 2,
    name: 'EJIRO RUDO',
    description: 'Skilled in problem solving, communication, and strategic thinking.',
    image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
    bgColor: 'bg-orange-200'
  },
  {
    id: 3,
    name: 'DANIEL SAOIRSE',
    description: 'Dedicated to crafting innovative solutions throughout the year with change.',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    bgColor: 'bg-red-200'
  }
];

const SpeakersSection: React.FC = () => {
  return (
    <section id="speakers" className="py-12 sm:py-16 lg:py-20 bg-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-indigo-900 mb-4">
            SPEAKERS
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {speakers.map((speaker, index) => (
            <div
              key={speaker.id}
              className="group cursor-pointer"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-center">
                {/* Speaker Image */}
                <div className={`relative mx-auto mb-4 sm:mb-6 w-32 sm:w-40 h-32 sm:h-40 ${speaker.bgColor} rounded-2xl sm:rounded-3xl overflow-hidden transform group-hover:scale-105 transition-all duration-300 group-hover:shadow-2xl`}>
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Speaker Info */}
                <div className="space-y-3">
                  <h3 className="text-lg sm:text-xl font-bold text-indigo-900 group-hover:text-indigo-700 transition-colors duration-200">
                    {speaker.name}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto group-hover:text-gray-800 transition-colors duration-200 px-2">
                    {speaker.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpeakersSection;