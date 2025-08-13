import React from 'react';
import { Event } from '../../../types/event';

interface Props {
  eventData: Partial<Event>;
  setEventData: React.Dispatch<React.SetStateAction<Partial<Event>>>;
  onNext: () => void;
  onBack: () => void;
}

const Step3Implementation: React.FC<Props> = ({ eventData, setEventData, onNext, onBack }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEventData(prev => ({
            ...prev,
            waterfall: { ...prev.waterfall, implementation: { ...prev.waterfall?.implementation, [e.target.name]: e.target.value } }
        }));
    };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Step 3: Implementation</h2>
       <div className="space-y-4">
           <div>
              <label className="block text-sm font-medium">Capacity*</label>
              <input type="number" name="capacity" onChange={handleChange} className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Staff Notes</label>
              <textarea name="staffNotes" onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            {/* Simple ticket types for now, can be expanded later */}
            <div>
                 <label className="block text-sm font-medium">Ticket Types (Name, Price, Qty)</label>
                 <p className="text-xs text-gray-500">Full ticket management coming soon.</p>
            </div>
       </div>
      <div className="flex justify-between mt-4">
        <button onClick={onBack} className="px-4 py-2 bg-gray-300 rounded">Back</button>
        <button onClick={onNext} className="px-4 py-2 bg-indigo-600 text-white rounded">Next</button>
      </div>
    </div>
  );
};

export default Step3Implementation;
