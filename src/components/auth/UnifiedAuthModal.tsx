import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, User, Mail, Lock, Eye, EyeOff, Building, Calendar, Loader2, AlertCircle, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/NewAuthContext';

interface UnifiedAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  defaultRole?: 'user' | 'admin';
  redirectTo?: string;
}

type AuthMode = 'signin' | 'signup';
type UserType = 'user' | 'admin';

const UnifiedAuthModal: React.FC<UnifiedAuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onLoginSuccess, 
  defaultRole = 'user',
  redirectTo 
}) => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [userType, setUserType] = useState<UserType>(defaultRole);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (authMode === 'signup') {
      if (!formData.name) {
        newErrors.name = 'Name is required';
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
    
    try {
      // Determine role based on user type
      const role = userType === 'admin' ? 'admin' : 'organizer';
      
      if (authMode === 'signin') {
        await login(formData.email, formData.password, role);
      } else {
        await register(formData.email, formData.password, formData.name, role, formData.company);
      }
      
      // Handle redirection
      setTimeout(() => {
        if (redirectTo) {
          navigate(redirectTo);
        } else {
          // Default redirection based on role
          switch (role) {
            case 'admin':
              navigate('/admin/dashboard');
              break;
            default:
              navigate('/dashboard');
          }
        }
        
        onLoginSuccess();
        onClose();
      }, 1000);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed. Please try again.';
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
    setErrors({});
    setFormData({ name: '', email: '', password: '', confirmPassword: '', company: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all duration-300 scale-100 max-h-screen overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="p-8 pb-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              {userType === 'admin' ? <Shield className="w-8 h-8 text-white" /> : <User className="w-8 h-8 text-white" />}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {authMode === 'signin' ? 'Welcome Back' : 'Join EventEase'}
            </h2>
            <p className="text-gray-600 mt-2">
              {authMode === 'signin' ? 'Sign in to access your account' : 'Create your account to get started'}
            </p>
          </div>

          {/* User Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {authMode === 'signin' ? 'Login as:' : 'Account type:'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType('user')}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  userType === 'user'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <User className="w-5 h-5 mx-auto mb-1" />
                <div className="text-xs font-medium">User</div>
                <div className="text-xs text-gray-500">Events & Organize</div>
              </button>
              <button
                type="button"
                onClick={() => setUserType('admin')}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  userType === 'admin'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Shield className="w-5 h-5 mx-auto mb-1" />
                <div className="text-xs font-medium">Admin</div>
                <div className="text-xs text-gray-500">Platform Admin</div>
              </button>
            </div>
          </div>

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
            {authMode === 'signup' && (
              <>
                <div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      autoComplete="name"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="company"
                      placeholder="Company (Optional)"
                      value={formData.company}
                      onChange={handleInputChange}
                      autoComplete="organization"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  autoComplete="email"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete={authMode === 'signin' ? "current-password" : "new-password"}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
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

            {authMode === 'signup' && (
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    autoComplete="new-password"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{authMode === 'signin' ? 'Signing In...' : 'Creating Account...'}</span>
                </div>
              ) : (
                authMode === 'signin' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              {authMode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={toggleMode}
                className="ml-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
              >
                {authMode === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
            {authMode === 'signin' && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/password-reset');
                  }}
                  className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                >
                  Forgot your password?
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedAuthModal;