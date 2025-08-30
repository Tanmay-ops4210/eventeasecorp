import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, X, RefreshCw } from 'lucide-react';

const EmailVerificationBanner: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isResending, setIsResending] = React.useState(false);
  const [isDismissed, setIsDismissed] = React.useState(false);

  // Don't show banner since email verification is no longer required
  if (!isAuthenticated || isDismissed) {
    return null;
  }

  // Email verification is no longer required, so don't show the banner
  return null;
};

export default EmailVerificationBanner;