import React, { useState } from 'react';
import { Shield, Mail, Lock, Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react';
import { adminAuthService } from '../../lib/adminAuthService';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [loginAttempts, setLoginAttempts] = useState<number>(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<number>(0);

  React.useEffect(() => {
    // Check for existing lockout
    const lockoutData = localStorage.getItem('admin_lockout');
    if (lockoutData) {
      const { timestamp, attempts } = JSON.parse(lockoutData);
      const timeSinceLockout = Date.now() - timestamp;
      
      if (timeSinceLockout < 15 * 60 * 1000) {
        setIsLocked(true);
        setLockoutTime(15 * 60 * 1000 - timeSinceLockout);
        setLoginAttempts(attempts);
        
        // Start countdown timer
        const timer = setInterval(() => {
          const remaining = 15 * 60 * 1000 - (Date.now() - timestamp);
          if (remaining <= 0) {
            setIsLocked(false);
            setLockoutTime(0);
            setLoginAttempts(0);
            localStorage.removeItem('admin_lockout');
            clearInterval(timer);
          } else {
            setLockoutTime(remaining);
          }
        }, 1000);
        
        return () => clearInterval(timer);
      } else {
        // Lockout expired
        localStorage.removeItem('admin_lockout');
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleLockout = () => {
    const lockoutData = {
      timestamp: Date.now(),
      attempts: loginAttempts + 1
    };
    localStorage.setItem('admin_lockout', JSON.stringify(lockoutData));
    setIsLocked(true);
    setLockoutTime(15 * 60 * 1000);
    setError(`Too many failed attempts. Account locked for 15 minutes.`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      setError(`Account is locked. Please wait ${Math.ceil(lockoutTime / 60000)} minutes.`);
      return;
    }

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await adminAuthService.authenticate(formData.email, formData.password);
      
      if (result.success) {
        // Clear any lockout data on successful login
        localStorage.removeItem('admin_lockout');
        setLoginAttempts(0);
        
        onLoginSuccess();
      } else {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        if (newAttempts >= 5) {
          handleLockout();
        } else {
          setError(result.error || 'Invalid credentials');
        }
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatLockoutTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-white/70">Secure authentication required</p>
          </div>

          {/* Security Status */}
          <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/90 text-sm">Security systems active</span>
            </div>
            <div className="mt-2 text-white/60 text-xs">
              Attempts: {loginAttempts}/{MAX_LOGIN_ATTEMPTS} • 
              {isLocked ? ` Locked for ${formatLockoutTime(lockoutTime)}` : ' System ready'}
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="text-red-200 text-sm">{error}</span>
              </div>
            </div>
          )}

          {isLocked && (
            <div className="mb-6 p-4 bg-orange-500/20 border border-orange-500/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-orange-400" />
                <span className="text-orange-200 text-sm">
                  Account locked for security. Time remaining: {formatLockoutTime(lockoutTime)}
                </span>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLocked}
                 autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter admin email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLocked}
                 autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLocked}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70 transition-colors duration-200 disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isLocked}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Access Admin Panel</span>
                </>
              )}
            </button>
          </form>

          {/* Security Information */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="text-center">
              <p className="text-white/60 text-xs mb-2">
                Secure admin authentication • Rate limited • Comprehensive logging
              </p>
              <div className="flex items-center justify-center space-x-4 text-white/50 text-xs">
                <span>🔒 Encrypted</span>
                <span>🛡️ Rate Limited</span>
                <span>📊 Logged</span>
              </div>
            </div>
          </div>

          {/* Development Notice */}
          {import.meta.env.DEV && (
            <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-200 text-xs">
                  Development Mode: Enhanced logging enabled
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;