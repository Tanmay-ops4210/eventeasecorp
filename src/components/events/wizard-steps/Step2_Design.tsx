import React from 'react';
import { Event } from '../../../types/event';

interface Props {
  eventData: Partial<Event>;
  setEventData: React.Dispatch<React.SetStateAction<Partial<Event>>>;
  onNext: () => void;
  onBack: () => void;
}

const Step2Design: React.FC<Props> = ({ eventData, setEventData, onNext, onBack }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Step 2: Design</h2>
      {/* Form fields for Design step */}
      <div className="flex justify-between mt-4">
        <button onClick={onBack} className="px-4 py-2 bg-gray-300 rounded">Back</button>
        <button onClick={onNext} className="px-4 py-2 bg-indigo-600 text-white rounded">Next</button>
      </div>
    </div>
  );
};

export default Step2Design;