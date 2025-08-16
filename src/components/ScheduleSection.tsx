import React from 'react';
import { Clock } from 'lucide-react';

const scheduleData = [
  {
    day: 'MONDAY',
    date: 'Sep 6',
    events: [
      { time: '12:00 pm', title: 'Registration and Welcome' },
      { time: '2:00 pm', title: 'Zawadi Thandwe' },
      { time: '6:00 pm', title: 'Dinner' }
    ]
  },
  {
    day: 'TUESDAY',
    date: 'Sep 7',
    events: [
      { time: '7:00 am', title: 'Breakfast' },
      { time: '9:00 am', title: 'Ejiro Rudo' },
      { time: '12:30 pm', title: 'Lunch' }
    ]
  },
  {
    day: 'WEDNESDAY',
    date: 'Sep 9',
    events: [
      { time: '7:00 am', title: 'Breakfast' },
      { time: '9:00 am', title: 'Daniel Saoirse' },
      { time: '1:00 pm', title: 'Closing Brunch' }
    ]
  }
];

const ScheduleSection: React.FC = () => {
  return (
    <section id="schedule" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            SCHEDULE
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {scheduleData.map((dayData, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Day Header */}
              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-medium text-white/80 mb-2">
                  {dayData.day}
                </h3>
                <h4 className="text-2xl sm:text-3xl font-bold text-white">
                  {dayData.date}
                </h4>
              </div>

              {/* Events */}
              <div className="space-y-4 sm:space-y-6">
                {dayData.events.map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className="group flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg sm:rounded-xl hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-white rounded-full mt-2 group-hover:scale-150 transition-transform duration-200" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-white/80 mb-1 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {event.time}
                      </p>
                      <p className="text-sm sm:text-base font-semibold text-white group-hover:text-white/90 transition-colors duration-200 break-words">
                        {event.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScheduleSection;