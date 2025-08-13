import React from 'react';
import { X, Star } from 'lucide-react';

interface UpgradeModalProps {
  onClose: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
        <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Upgrade Your Plan</h2>
        <p className="text-gray-600 mb-6">
          This feature is not available on the FREE plan. Please upgrade to a PAID or PRO plan to unlock more features.
        </p>
        <button onClick={onClose} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Got it
        </button>
      </div>
    </div>
  );
};

export default UpgradeModal;
