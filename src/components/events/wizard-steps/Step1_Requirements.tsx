import React from 'react';
import { Event } from '../../../types/event';

interface Props {
  eventData: Partial<Event>;
  setEventData: React.Dispatch<React.SetStateAction<Partial<Event>>>;
  onNext: () => void;
}

const Step1Requirements: React.FC<Props> = ({ eventData, setEventData, onNext }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEventData(prev => ({
            ...prev,
            waterfall: { ...prev.waterfall, requirements: { ...prev.waterfall?.requirements, [e.target.name]: e.target.value } },
            summary: { ...prev.summary, name: e.target.name === 'title' ? e.target.value : prev.summary?.name }
        }));
    };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Step 1: Requirements</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title*</label>
          <input type="text" name="title" onChange={handleChange} className="w-full p-2 border rounded" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Goals</label>
          <textarea name="goals" onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
         <div>
          <label className="block text-sm font-medium">Audience</label>
          <textarea name="audience" onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
         <div>
          <label className="block text-sm font-medium">Scope</label>
          <textarea name="scope" onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
         <div>
          <label className="block text-sm font-medium">Success Criteria</label>
          <textarea name="successCriteria" onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <button onClick={onNext} className="px-4 py-2 bg-indigo-600 text-white rounded">Next</button>
      </div>
    </div>
  );
};

export default Step1Requirements;