import React from 'react';
import { Event } from '../../../types/event';

interface Props {
  eventData: Partial<Event>;
  setEventData: React.Dispatch<React.SetStateAction<Partial<Event>>>;
  onNext: () => void;
  onBack: () => void;
}

const Step4Verification: React.FC<Props> = ({ eventData, setEventData, onNext, onBack }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Step 4: Verification</h2>
       <div className="space-y-2">
            <label className="flex items-center">
                <input type="checkbox" className="mr-2"/>
                <span>Venue Confirmed</span>
            </label>
            <label className="flex items-center">
                <input type="checkbox" className="mr-2"/>
                <span>Speakers Booked</span>
            </label>
            <label className="flex items-center">
                <input type="checkbox" className="mr-2"/>
                <span>Catering Finalized</span>
            </label>
       </div>
      <div className="flex justify-between mt-4">
        <button onClick={onBack} className="px-4 py-2 bg-gray-300 rounded">Back</button>
        <button onClick={onNext} className="px-4 py-2 bg-indigo-600 text-white rounded">Next</button>
      </div>
    </div>
  );
};

export default Step4Verification;
