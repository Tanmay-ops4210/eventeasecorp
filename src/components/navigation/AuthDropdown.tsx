import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

interface AuthDropdownProps {
  onClose: () => void;
  onSuccess: () => void;
  isMobile?: boolean;
  defaultRole?: UserRole;
  redirectTo?: string;
}

type AuthMode = 'signin' | 'signup';
type UserRole = 'attendee' | 'organizer';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  company: string;
  role: UserRole;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  fullName?: string;
  general?: string;
}

const AuthDropdown: React.FC<AuthDropdownProps> = ({ 
  onClose, 
  onSuccess, 
  isMobile = false, 
  defaultRole = 'attendee',
  redirectTo 
}) => {
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    company: '',
    role: defaultRole
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  const { login, register } = useAuth();
  const { setCurrentView } = useApp();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Sign up specific validations
    if (authMode === 'signup') {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      if (authMode === 'signin') {
        await login(formData.email, formData.password, formData.role);
        
        // Handle redirection after successful login
        if (redirectTo) {
          setCurrentView(redirectTo as any);
        } else {
          // Default redirection based on role
          switch (formData.role) {
            case 'organizer':
              setCurrentView('organizer-dashboard');
              break;
            case 'admin':
              setCurrentView('admin-dashboard');
              break;
            default:
              setCurrentView('attendee-dashboard');
          }
        }
        
        setSuccessMessage('Successfully signed in!');
        setTimeout(() => {
          onSuccess();
        }, 1000);
      } else {
        await register(
          formData.email, 
          formData.password, 
          formData.fullName, 
          formData.role,
          formData.company || undefined
        );
        
        // After registration, redirect to appropriate dashboard
        if (redirectTo) {
          setCurrentView(redirectTo as any);
        } else {
          switch (formData.role) {
            case 'organizer':
              setCurrentView('organizer-dashboard');
              break;
            case 'admin':
              setCurrentView('admin-dashboard');
              break;
            default:
              setCurrentView('attendee-dashboard');
          }
        }
        
        setSuccessMessage('Account created successfully! Please check your email to verify your account.');
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
    setErrors({});
    setSuccessMessage('');
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      company: '',
      role: 'attendee'
    });
  };

  const handleForgotPassword = () => {
    onClose();
    setCurrentView('password-reset');
  };

  const dropdownClasses = isMobile 
    ? "w-full bg-white rounded-lg border border-gray-200 p-4"
    : "absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl py-4 px-6 z-50 border border-gray-200 animate-fade-in";

  return (
    <div className={dropdownClasses}>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <User className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">
          {authMode === 'signin' ? 'Welcome Back' : 'Create Account'}
        </h3>
        <p className="text-sm text-gray-600">
          {authMode === 'signin' 
            ? 'Sign in to access your account' 
            : 'Join EventEase to get started'
          }
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-700 text-sm">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700 text-sm">{errors.general}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Selection for Sign Up */}
        {authMode === 'signup' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I want to join as:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center space-x-3 p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50">
                <input
                  type="radio"
                  name="role"
                  value="attendee"
                  checked={formData.role === 'attendee'}
                  onChange={handleInputChange}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <p className="font-medium text-gray-900">Attendee</p>
                  <p className="text-xs text-gray-500">Join events</p>
                </div>
              </label>
              <label className="flex items-center space-x-3 p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50">
                <input
                  type="radio"
                  name="role"
                  value="organizer"
                  checked={formData.role === 'organizer'}
                  onChange={handleInputChange}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <p className="font-medium text-gray-900">Organizer</p>
                  <p className="text-xs text-gray-500">Create events</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Full Name (Sign Up Only) */}
        {authMode === 'signup' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                autoComplete="name"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
            </div>
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          </div>
        )}

        {/* Company (Sign Up Only) */}
        {authMode === 'signup' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company (Optional)</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              autoComplete="organization"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              placeholder="Your company name"
            />
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              autoComplete="email"
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              autoComplete={authMode === 'signin' ? "current-password" : "new-password"}
              className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        {/* Confirm Password (Sign Up Only) */}
        {authMode === 'signup' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                autoComplete="new-password"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Confirm your password"
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{authMode === 'signin' ? 'Signing In...' : 'Creating Account...'}</span>
            </>
          ) : (
            <span>{authMode === 'signin' ? 'Sign In' : 'Create Account'}</span>
          )}
        </button>
      </form>

      {/* Toggle Mode */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          {authMode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={toggleAuthMode}
            className="ml-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
          >
            {authMode === 'signin' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
        
        {/* Forgot Password Link (Sign In Only) */}
        {authMode === 'signin' && (
          <div className="mt-2">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
            >
              Forgot your password?
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthDropdown;