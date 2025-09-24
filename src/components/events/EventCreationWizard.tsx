import React, { useState } from 'react';
import { Event } from '../../types/event';
import Step1Requirements from './wizard-steps/Step1_Requirements';
import Step2Design from './wizard-steps/Step2_Design';
import Step3Implementation from './wizard-steps/Step3_Implementation';
import Step4Verification from './wizard-steps/Step4_Verification';
import Step5Maintenance from './wizard-steps/Step5_Maintenance';
import { eventService } from '../../services/eventService';
import UpgradeModal from '../common/UpgradeModal';
import { useAuth } from '../../contexts/NewAuthContext';

interface Props {
  onClose: () => void;
  onSave: () => void;
}

const EventCreationWizard: React.FC<Props> = ({ onClose, onSave }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [eventData, setEventData] = useState<Partial<Event>>({
    status: "DRAFT",
    ownerId: user?._id,
    planSnapshot: {
        tier: user?.plan || 'FREE',
        constraints: {}
    },
    waterfall: {
      requirements: { title: '', goals: '', audience: '', scope: '', successCriteria: '' },
      design: { venueType: 'on-site', location: '', schedule: '', brandingNotes: '' },
      implementation: { ticketTypes: [], capacity: 0, staffNotes: '' },
      verification: { qaChecklist: [], approvals: [] },
      maintenance: { commsPlan: '', postEventActions: '' },
    },
    summary: { name: '', startDate: new Date(), endDate: new Date(), city: '', isPaid: false },
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSaveDraft = async () => {
    const response = await eventService.createEvent(eventData as Event);
    if (response.ok) {
      onSave();
      onClose();
    } else {
      if (response.message === 'Upgrade required') {
        setShowUpgradeModal(true);
      } else {
        alert(response.message);
      }
    }
  };

  const handlePublish = async () => {
    const response = await eventService.publishEvent(eventData._id!);
    if (response.ok) {
        onSave();
        onClose();
    } else {
        if (response.message === 'Upgrade required') {
            setShowUpgradeModal(true);
        } else {
            alert(response.message);
        }
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 1 && <Step1Requirements eventData={eventData} setEventData={setEventData} onNext={handleNext} />}
        {step === 2 && <Step2Design eventData={eventData} setEventData={setEventData} onNext={handleNext} onBack={handleBack} />}
        {step === 3 && <Step3Implementation eventData={eventData} setEventData={setEventData} onNext={handleNext} onBack={handleBack} />}
        {step === 4 && <Step4Verification eventData={eventData} setEventData={setEventData} onNext={handleNext} onBack={handleBack} />}
        {step === 5 && <Step5Maintenance eventData={eventData} setEventData={setEventData} onBack={handleBack} onSaveDraft={handleSaveDraft} onPublish={handlePublish} />}
        {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} />}
      </div>
    </div>
  );
};

export default EventCreationWizard;
