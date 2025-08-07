import React, { useState } from 'react';
import SpeakerDirectory from './SpeakerDirectory';
import SpeakerProfile from './SpeakerProfile';

type SpeakerView = 'directory' | 'profile';

const SpeakerContainer: React.FC = () => {
  const [currentView, setCurrentView] = useState<SpeakerView>('directory');
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string>('');

  const handleSpeakerClick = (speakerId: string) => {
    setSelectedSpeakerId(speakerId);
    setCurrentView('profile');
    // Scroll to top when navigating to profile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDirectory = () => {
    setCurrentView('directory');
    setSelectedSpeakerId('');
    // Scroll to top when going back to directory
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {currentView === 'directory' ? (
        <SpeakerDirectory onSpeakerClick={handleSpeakerClick} />
      ) : (
        <SpeakerProfile
          speakerId={selectedSpeakerId}
          onBack={handleBackToDirectory}
        />
      )}
    </>
  );
};

export default SpeakerContainer;