import React from 'react';
import { Event } from '../../../types/event';

interface Props {
  eventData: Partial<Event>;
  setEventData: React.Dispatch<React.SetStateAction<Partial<Event>>>;
  onNext: () => void;
  onBack: () => void;
}

const Step3Implementation: React.FC<Props> = ({ eventData, setEventData, onNext, onBack }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Step 3: Implementation</h2>
      {/* Form fields for Implementation step */}
       <div>
          <label className="block text-sm font-medium">Capacity*</label>
          <input type="number" name="capacity" className="w-full p-2 border rounded" required />
        </div>
      <div className="flex justify-between mt-4">
        <button onClick={onBack} className="px-4 py-2 bg-gray-300 rounded">Back</button>
        <button onClick={onNext} className="px-4 py-2 bg-indigo-600 text-white rounded">Next</button>
      </div>
    </div>
  );
};

export default Step3Implementation;