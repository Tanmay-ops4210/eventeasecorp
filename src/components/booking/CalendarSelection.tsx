import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Users, ArrowLeft, ArrowRight } from 'lucide-react';

interface CalendarSelectionProps {
  eventData?: any;
  onDateSelect: (date: string, timeSlot: string) => void;
  onBack: () => void;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  price: number;
}

const CalendarSelection: React.FC<CalendarSelectionProps> = ({ eventData, onDateSelect, onBack }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Generate time slots for a selected date
  const generateTimeSlots = (date: string): TimeSlot[] => {
    const slots: TimeSlot[] = [
      { id: '1', time: '09:00 AM', available: true, price: 299 },
      { id: '2', time: '10:30 AM', available: true, price: 299 },
      { id: '3', time: '12:00 PM', available: false, price: 299 },
      { id: '4', time: '02:00 PM', available: true, price: 349 },
      { id: '5', time: '03:30 PM', available: true, price: 349 },
      { id: '6', time: '05:00 PM', available: true, price: 399 },
      { id: '7', time: '06:30 PM', available: false, price: 399 },
      { id: '8', time: '08:00 PM', available: true, price: 449 }
    ];

    // Simulate some randomness in availability
    return slots.map(slot => ({
      ...slot,
      available: Math.random() > 0.3 // 70% chance of being available
    }));
  };

  useEffect(() => {
    if (selectedDate) {
      setIsLoading(true);
      // Simulate API call to fetch available time slots
      setTimeout(() => {
        setAvailableSlots(generateTimeSlots(selectedDate));
        setIsLoading(false);
      }, 500);
    }
  }, [selectedDate]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateAvailable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateClick = (date: Date) => {
    if (isDateAvailable(date)) {
      const dateString = formatDate(date);
      setSelectedDate(dateString);
      setSelectedTimeSlot(''); // Reset time slot selection
    }
  };

  const handleTimeSlotClick = (timeSlot: TimeSlot) => {
    if (timeSlot.available) {
      setSelectedTimeSlot(timeSlot.id);
    }
  };

  const handleContinue = () => {
    if (selectedDate && selectedTimeSlot) {
      const selectedSlot = availableSlots.find(slot => slot.id === selectedTimeSlot);
      onDateSelect(selectedDate, selectedSlot?.time || '');
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Events</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-indigo-900 mb-4">Select Date & Time</h1>
            <p className="text-xl text-gray-600">Choose your preferred date and time slot for the event</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => (
                  <div key={index} className="aspect-square">
                    {day && (
                      <button
                        onClick={() => handleDateClick(day)}
                        disabled={!isDateAvailable(day)}
                        className={`w-full h-full rounded-lg text-sm font-medium transition-all duration-200 ${
                          !isDateAvailable(day)
                            ? 'text-gray-300 cursor-not-allowed'
                            : selectedDate === formatDate(day)
                            ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                            : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-600'
                        }`}
                      >
                        {day.getDate()}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-indigo-600 rounded"></div>
                  <span className="text-gray-600">Selected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-100 rounded border"></div>
                  <span className="text-gray-600">Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <span className="text-gray-400">Unavailable</span>
                </div>
              </div>
            </div>
          </div>

          {/* Time Slots & Event Info */}
          <div className="space-y-6">
            {/* Event Summary */}
            {eventData && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="font-medium text-gray-900">{eventData.title || 'Tech Conference 2024'}</p>
                      <p className="text-sm text-gray-600">Annual Technology Summit</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="font-medium text-gray-900">Convention Center</p>
                      <p className="text-sm text-gray-600">Downtown, City Center</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="font-medium text-gray-900">500+ Attendees</p>
                      <p className="text-sm text-gray-600">Expected participants</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Time Slots */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Time Slots</h3>
              
              {!selectedDate ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Select a date to view available time slots</p>
                </div>
              ) : isLoading ? (
                <div className="text-center py-8">
                  <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-gray-600">Loading available slots...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4">
                    Available slots for {new Date(selectedDate).toLocaleDateString()}
                  </p>
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => handleTimeSlotClick(slot)}
                      disabled={!slot.available}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                        !slot.available
                          ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                          : selectedTimeSlot === slot.id
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">{slot.time}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold">${slot.price}</span>
                          {!slot.available && (
                            <p className="text-xs text-gray-400">Unavailable</p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={!selectedDate || !selectedTimeSlot}
              className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none"
            >
              <span>Continue to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarSelection;