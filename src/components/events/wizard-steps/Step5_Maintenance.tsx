import React from 'react';
import { Event } from '../../../types/event';

interface Props {
  eventData: Partial<Event>;
  setEventData: React.Dispatch<React.SetStateAction<Partial<Event>>>;
  onBack: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}

const Step5Maintenance: React.FC<Props> = ({ eventData, setEventData, onBack, onSaveDraft, onPublish }) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEventData(prev => ({
            ...prev,
            waterfall: { ...prev.waterfall, maintenance: { ...prev.waterfall?.maintenance, [e.target.name]: e.target.value } }
        }));
    };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Step 5: Maintenance</h2>
      <div className="space-y-4">
        <div>
            <label className="block text-sm font-medium">Communications Plan</label>
            <textarea name="commsPlan" onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
            <label className="block text-sm font-medium">Post-Event Actions</label>
            <textarea name="postEventActions" onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <button onClick={onBack} className="px-4 py-2 bg-gray-300 rounded">Back</button>
        <div>
            <button onClick={onSaveDraft} className="px-4 py-2 bg-gray-500 text-white rounded mr-2">Save Draft</button>
            <button onClick={onPublish} className="px-4 py-2 bg-green-600 text-white rounded">Publish</button>
        </div>
      </div>
    </div>
  );
};

export default Step5Maintenance;
