import React, { useState } from 'react';
import Navigation from '../Navigation';
import SpeakerDirectory from './SpeakerDirectory';
import SpeakerProfile from './SpeakerProfile';

type SpeakerView = 'directory' | 'profile';

interface SpeakerContainerProps {
  isAuthenticated?: boolean;
  user?: any;
  onLogin?: () => void;
  onLogout?: () => void;
  onShowBlog?: () => void;
  onShowEvents?: () => void;
  onShowSponsors?: () => void;
  onShowDashboard?: () => void;
}

const SpeakerContainer: React.FC<SpeakerContainerProps> = ({
  isAuthenticated = false,
  user = null,
  onLogin = () => {},
  onLogout = () => {},
  onShowBlog = () => {},
  onShowEvents = () => {},
  onShowSponsors = () => {},
  onShowDashboard = () => {}
}) => {
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
      <Navigation 
        isAuthenticated={isAuthenticated}
        user={user}
        onLogin={onLogin}
        onLogout={onLogout}
        onShowBlog={onShowBlog}
        onShowEvents={onShowEvents}
        onShowSponsors={onShowSponsors}
        onShowDashboard={onShowDashboard}
        currentPage="other"
      />
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