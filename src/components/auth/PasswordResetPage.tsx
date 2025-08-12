import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Mail, ArrowLeft, CheckCircle, Lock, Eye, EyeOff } from 'lucide-react';

type ResetStep = 'request' | 'sent' | 'reset' | 'success';

const PasswordResetPage: React.FC = () => {
  const { setBreadcrumbs, setCurrentView } = useApp();
  const [currentStep, setCurrentStep] = useState<ResetStep>('request');
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  React.useEffect(() => {
    setBreadcrumbs(['Password Reset']);
  }, [setBreadcrumbs]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    if (!email) {
      setErrors({ email: 'Email is required' });
      setIsLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      setIsLoading(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setCurrentStep('sent');
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    if (!resetCode) {
      setErrors({ code: 'Reset code is required' });
      setIsLoading(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setCurrentStep('reset');
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    if (!newPassword) {
      setErrors({ password: 'New password is required' });
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setErrors({ password: 'Password must be at least 6 characters' });
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      setIsLoading(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setCurrentStep('success');
  };

  const renderRequestStep = () => (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Your Password</h1>
        <p className="text-gray-600">
          Enter your email address and we'll send you a reset code
        </p>
      </div>

      <form onSubmit={handleRequestReset} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email address"
            />
          </div>
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Sending Reset Code...</span>
            </div>
          ) : (
            'Send Reset Code'
          )}
        </button>
      </form>

      <div className="text-center mt-6">
        <button
          onClick={() => setCurrentView('home')}
          className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </button>
      </div>
    </div>
  );

  const renderSentStep = () => (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email</h1>
        <p className="text-gray-600">
          We've sent a reset code to <strong>{email}</strong>
        </p>
      </div>

      <form onSubmit={handleVerifyCode} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Reset Code</label>
          <input
            type="text"
            value={resetCode}
            onChange={(e) => setResetCode(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-center text-lg font-mono ${
              errors.code ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter 6-digit code"
            maxLength={6}
          />
          {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Verifying...</span>
            </div>
          ) : (
            'Verify Code'
          )}
        </button>
      </form>

      <div className="text-center mt-6 space-y-2">
        <button
          onClick={() => setCurrentStep('request')}
          className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
        >
          Didn't receive the code? Try again
        </button>
      </div>
    </div>
  );

  const renderResetStep = () => (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Set New Password</h1>
        <p className="text-gray-600">
          Choose a strong password for your account
        </p>
      </div>

      <form onSubmit={handlePasswordReset} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Confirm new password"
            />
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Updating Password...</span>
            </div>
          ) : (
            'Update Password'
          )}
        </button>
      </form>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="max-w-md mx-auto text-center">
      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Password Updated!</h1>
      <p className="text-gray-600 mb-8">
        Your password has been successfully updated. You can now sign in with your new password.
      </p>
      <button
        onClick={() => setCurrentView('home')}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        Back to Sign In
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {currentStep === 'request' && renderRequestStep()}
          {currentStep === 'sent' && renderSentStep()}
          {currentStep === 'reset' && renderResetStep()}
          {currentStep === 'success' && renderSuccessStep()}
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;