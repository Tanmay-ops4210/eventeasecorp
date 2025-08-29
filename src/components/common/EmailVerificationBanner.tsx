import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, X, RefreshCw } from 'lucide-react';

const EmailVerificationBanner: React.FC = () => {
  const { isAuthenticated, isEmailVerified, resendVerification } = useAuth();
  const [isResending, setIsResending] = React.useState(false);
  const [isDismissed, setIsDismissed] = React.useState(false);

  // Don't show banner if user is authenticated and email is verified, or if dismissed
  if (!isAuthenticated || isEmailVerified || isDismissed) {
    return null;
  }

  const handleResendVerification = async () => {
    try {
      setIsResending(true);
      await resendVerification();
      alert('Verification email sent! Please check your inbox.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send verification email';
      alert(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Mail className="w-5 h-5 text-yellow-600" />
          <div>
            <p className="text-sm font-medium text-yellow-800">
              Please verify your email address to access all features
            </p>
            <p className="text-xs text-yellow-700">
              Check your inbox for a verification link
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleResendVerification}
            disabled={isResending}
            className="inline-flex items-center space-x-1 px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 text-sm font-medium transition-colors duration-200"
          >
            {isResending ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Mail className="w-4 h-4" />
            )}
            <span>{isResending ? 'Sending...' : 'Resend'}</span>
          </button>
          
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 text-yellow-600 hover:text-yellow-700 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;