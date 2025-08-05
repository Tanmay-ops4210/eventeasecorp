import React, { useState } from 'react';
import { Menu, X, User } from 'lucide-react';

interface NavigationProps {
  isAuthenticated: boolean;
  user: any;
  onLogin: () => void;
  onLogout: () => void;
  onShowBlog?: () => void;
  onShowEvents?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  isAuthenticated, 
  user, 
  onLogin, 
  onLogout, 
  onShowBlog, 
  onShowEvents 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-indigo-600 rounded-full"></div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button
                onClick={() => scrollToSection('speakers')}
                className="text-white hover:text-indigo-200 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                SPEAKERS
              </button>
              <button
                onClick={() => scrollToSection('schedule')}
                className="text-white hover:text-indigo-200 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                SCHEDULE
              </button>
              <button
                onClick={() => scrollToSection('analytics')}
                className="text-white hover:text-indigo-200 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                ANALYTICS
              </button>
              <button
                onClick={onShowEvents}
                className="text-white hover:text-indigo-200 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                EVENTS
              </button>
              <button
                onClick={() => scrollToSection('plan-event')}
                className="text-white hover:text-indigo-200 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                PLAN EVENT
              </button>
              <button
                onClick={onShowBlog}
                className="text-white hover:text-indigo-200 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                BLOG
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-white hover:text-indigo-200 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                CONTACT
              </button>
            </div>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-white">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user?.name}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="text-white hover:text-indigo-200 text-sm font-medium transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="text-white hover:text-indigo-200 text-sm font-medium transition-colors duration-200"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-indigo-200 p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-indigo-700 bg-opacity-50 backdrop-blur-md">
              <button
                onClick={() => scrollToSection('speakers')}
                className="text-white hover:text-indigo-200 block px-3 py-2 text-base font-medium w-full text-left"
              >
                SPEAKERS
              </button>
              <button
                onClick={() => scrollToSection('schedule')}
                className="text-white hover:text-indigo-200 block px-3 py-2 text-base font-medium w-full text-left"
              >
                SCHEDULE
              </button>
              <button
                onClick={() => scrollToSection('analytics')}
                className="text-white hover:text-indigo-200 block px-3 py-2 text-base font-medium w-full text-left"
              >
                ANALYTICS
              </button>
              <button
                onClick={onShowEvents}
                className="text-white hover:text-indigo-200 block px-3 py-2 text-base font-medium w-full text-left"
              >
                EVENTS
              </button>
              <button
                onClick={() => scrollToSection('plan-event')}
                className="text-white hover:text-indigo-200 block px-3 py-2 text-base font-medium w-full text-left"
              >
                PLAN EVENT
              </button>
              <button
                onClick={onShowBlog}
                className="text-white hover:text-indigo-200 block px-3 py-2 text-base font-medium w-full text-left"
              >
                BLOG
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-white hover:text-indigo-200 block px-3 py-2 text-base font-medium w-full text-left"
              >
                CONTACT
              </button>
              
              {isAuthenticated ? (
                <div className="border-t border-indigo-500 pt-3">
                  <div className="flex items-center space-x-2 text-white px-3 py-2">
                    <User className="w-4 h-4" />
                    <span>{user?.name}</span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="text-white hover:text-indigo-200 block px-3 py-2 text-base font-medium w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-indigo-500 pt-3">
                  <button
                    onClick={onLogin}
                    className="text-white hover:text-indigo-200 block px-3 py-2 text-base font-medium w-full text-left"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;