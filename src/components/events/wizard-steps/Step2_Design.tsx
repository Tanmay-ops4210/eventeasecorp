import React from 'react';
import { Event } from '../../../types/event';

interface Props {
  eventData: Partial<Event>;
  setEventData: React.Dispatch<React.SetStateAction<Partial<Event>>>;
  onNext: () => void;
  onBack: () => void;
}

const Step2Design: React.FC<Props> = ({ eventData, setEventData, onNext, onBack }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setEventData(prev => ({
            ...prev,
            waterfall: { ...prev.waterfall, design: { ...prev.waterfall?.design, [e.target.name]: e.target.value } }
        }));
    };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Step 2: Design</h2>
       <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Venue Type</label>
          <select name="venueType" onChange={handleChange} className="w-full p-2 border rounded">
            <option value="on-site">On-site</option>
            <option value="online">Online</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Location</label>
          <input type="text" name="location" onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Schedule</label>
          <textarea name="schedule" onChange={handleChange} className="w-full p-2 border rounded" placeholder="e.g., 9 AM - Registration, 10 AM - Keynote..."/>
        </div>
        <div>
          <label className="block text-sm font-medium">Branding Notes</label>
          <textarea name="brandingNotes" onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <button onClick={onBack} className="px-4 py-2 bg-gray-300 rounded">Back</button>
        <button onClick={onNext} className="px-4 py-2 bg-indigo-600 text-white rounded">Next</button>
      </div>
    </div>
  );
};

export default Step2Design;
