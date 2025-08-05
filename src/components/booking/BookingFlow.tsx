import React, { useState } from 'react';
import CalendarSelection from './CalendarSelection';
import PaymentPage from '../PaymentPage';
import PaymentSuccess from '../PaymentSuccess';

type BookingStep = 'calendar' | 'payment' | 'success';

interface BookingFlowProps {
  eventData?: any;
  onBack: () => void;
}

interface BookingData {
  selectedDate: string;
  selectedTime: string;
  eventData?: any;
}

const BookingFlow: React.FC<BookingFlowProps> = ({ eventData, onBack }) => {
  const [currentStep, setCurrentStep] = useState<BookingStep>('calendar');
  const [bookingData, setBookingData] = useState<BookingData>({
    selectedDate: '',
    selectedTime: '',
    eventData
  });

  const handleDateSelect = (date: string, timeSlot: string) => {
    setBookingData(prev => ({
      ...prev,
      selectedDate: date,
      selectedTime: timeSlot
    }));
    setCurrentStep('payment');
  };

  const handleBackToCalendar = () => {
    setCurrentStep('calendar');
  };

  const handlePaymentComplete = () => {
    setCurrentStep('success');
  };

  const handleBackToHome = () => {
    onBack();
  };

  // Create event data for payment components
  const paymentEventData = {
    eventName: eventData?.title || 'Tech Conference 2024',
    eventType: 'conference',
    expectedAttendees: 1,
    eventDate: bookingData.selectedDate,
    eventTime: bookingData.selectedTime,
    ...eventData
  };

  // Create location data for payment components
  const locationData = {
    lat: 40.7128,
    lng: -74.0060,
    address: 'Convention Center, Downtown, City Center'
  };

  switch (currentStep) {
    case 'calendar':
      return (
        <CalendarSelection
          eventData={eventData}
          onDateSelect={handleDateSelect}
          onBack={onBack}
        />
      );
    
    case 'payment':
      return (
        <PaymentPage
          eventData={paymentEventData}
          locationData={locationData}
          onBack={handleBackToCalendar}
          onPaymentComplete={handlePaymentComplete}
        />
      );
    
    case 'success':
      return (
        <PaymentSuccess
          eventData={paymentEventData}
          locationData={locationData}
          onBackToHome={handleBackToHome}
        />
      );
    
    default:
      return null;
  }
};

export default BookingFlow;