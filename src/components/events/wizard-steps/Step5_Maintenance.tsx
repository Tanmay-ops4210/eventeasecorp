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
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Step 5: Maintenance</h2>
      {/* Form fields for Maintenance step */}
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