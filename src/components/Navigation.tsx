import React, { useState, useEffect } from 'react';
import { Menu, X, User, Home, Phone, Calendar } from 'lucide-react';

interface NavigationProps {
  isAuthenticated: boolean;
  user: any;
  onLogin: () => void;
  onLogout: () => void;
  onShowBlog?: () => void;
  onShowEvents?: () => void;
  onShowSpeakers?: () => void;
  onShowDashboard?: () => void;
  currentPage?: 'home' | 'other';
}

const Navigation: React.FC<NavigationProps> = ({ 
  isAuthenticated, 
  user, 
  onLogin, 
  onLogout, 
  onShowBlog, 
  onShowEvents,
  onShowSpeakers,
  onShowDashboard,
  currentPage = 'home'
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsibleMenuOpen, setIsCollapsibleMenuOpen] = useState(false);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.navigation-container')) {
        setIsMobileMenuOpen(false);
        setIsCollapsibleMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
    setIsCollapsibleMenuOpen(false);
  };

  const handleNavigation = (action: () => void) => {
    action();
    setIsMobileMenuOpen(false);
    setIsCollapsibleMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Navigation items that appear in collapsible menu on non-home pages
  const collapsibleMenuItems = [
    { label: 'SPEAKERS', action: () => scrollToSection('speakers'), icon: User },
    { label: 'SPEAKER DIRECTORY', action: () => onShowSpeakers?.(), icon: User },
    { label: 'SCHEDULE', action: () => scrollToSection('schedule'), icon: Calendar },
    { label: 'ANALYTICS', action: () => scrollToSection('analytics'), icon: Calendar },
    { label: 'PLAN EVENT', action: () => scrollToSection('plan-event'), icon: Calendar },
    { label: 'BLOG', action: () => onShowBlog?.(), icon: Calendar },
  ];

  const isHomePage = currentPage === 'home';

  return (
    <nav className="navigation-container fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 backdrop-blur-md bg-opacity-90 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 relative">
          {/* Logo */}
          <div className="flex-shrink-0 md:order-1">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-200 touch-manipulation">
              <div className="w-4 h-4 bg-indigo-600 rounded-full"></div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {isHomePage ? (
                // Full navigation for home page
                <>
                  <button
                    onClick={() => scrollToSection('home')}
                    className="nav-item flex items-center space-x-2 text-white hover:text-indigo-200 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/10 rounded-lg touch-manipulation"
                  >
                    <Home className="w-4 h-4" />
                    <span>HOME</span>
                  </button>
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="nav-item flex items-center space-x-2 text-white hover:text-indigo-200 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/10 rounded-lg touch-manipulation"
                  >
                    <Phone className="w-4 h-4" />
                    <span>CONTACTS</span>
                  </button>
                  <button
                    onClick={() => handleNavigation(() => onShowEvents?.())}
                    className="nav-item flex items-center space-x-2 text-white hover:text-indigo-200 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/10 rounded-lg touch-manipulation"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>EVENTS</span>
                  </button>
                  <button
                    onClick={() => scrollToSection('speakers')}
                    className="nav-item text-white hover:text-indigo-200 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/10 rounded-lg touch-manipulation"
                  >
                    SPEAKERS
                  </button>
                  <button
                    onClick={() => handleNavigation(() => onShowSpeakers?.())}
                    className="nav-item text-white hover:text-indigo-200 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/10 rounded-lg touch-manipulation"
                  >
                    SPEAKER DIRECTORY
                  </button>
                  <button
                    onClick={() => scrollToSection('schedule')}
                    className="nav-item text-white hover:text-indigo-200 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/10 rounded-lg touch-manipulation"
                  >
                    SCHEDULE
                  </button>
                  <button
                    onClick={() => scrollToSection('analytics')}
                    className="nav-item text-white hover:text-indigo-200 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/10 rounded-lg touch-manipulation"
                  >
                    ANALYTICS
                  </button>
                  <button
                    onClick={() => scrollToSection('plan-event')}
                    className="nav-item text-white hover:text-indigo-200 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/10 rounded-lg touch-manipulation"
                  >
                    PLAN EVENT
                  </button>
                  <button
                    onClick={() => handleNavigation(() => onShowBlog?.())}
                    className="nav-item text-white hover:text-indigo-200 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/10 rounded-lg touch-manipulation"
                  >
                    BLOG
                  </button>
                </>
              ) : (
                // Collapsible menu for other pages
                <div className="relative">
                  <button
                    onClick={() => setIsCollapsibleMenuOpen(!isCollapsibleMenuOpen)}
                    className="flex items-center space-x-2 text-white hover:text-indigo-200 px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/10 rounded-lg border border-white/20 touch-manipulation"
                    aria-expanded={isCollapsibleMenuOpen}
                    aria-haspopup="true"
                  >
                    <Menu className="w-4 h-4" />
                    <span>MENU</span>
                  </button>

                  {/* Collapsible Menu Dropdown */}
                  <div className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 transform transition-all duration-300 origin-top-left z-50 ${
                    isCollapsibleMenuOpen 
                      ? 'opacity-100 scale-100 translate-y-0' 
                      : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  }`}>
                    <div className="py-2">
                      {collapsibleMenuItems.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                          <button
                            key={index}
                            onClick={() => handleNavigation(item.action)}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 touch-manipulation"
                          >
                            <IconComponent className="w-4 h-4" />
                            <span className="font-medium">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Auth Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-white">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user?.name}</span>
                </div>
                <button
                  onClick={() => handleNavigation(() => onShowDashboard?.())}
                  className="text-white hover:text-indigo-200 text-sm font-medium transition-colors duration-200 px-3 py-2 hover:bg-white/10 rounded-lg touch-manipulation"
                >
                  Dashboard
                </button>
                <button
                  onClick={onLogout}
                  className="text-white hover:text-indigo-200 text-sm font-medium transition-colors duration-200 px-3 py-2 hover:bg-white/10 rounded-lg touch-manipulation"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="text-white hover:text-indigo-200 text-sm font-medium transition-colors duration-200 px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10 touch-manipulation"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden md:order-3">
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-indigo-200 p-3 rounded-lg hover:bg-white/10 transition-colors duration-200 touch-manipulation"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle mobile menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-screen opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-indigo-700 bg-opacity-50 backdrop-blur-md rounded-lg mt-2 max-h-96 overflow-y-auto">
            {isHomePage ? (
              // Full mobile navigation for home page
              <>
                <button
                  onClick={() => scrollToSection('home')}
                  className="mobile-nav-item flex items-center space-x-3 text-white hover:text-indigo-200 block px-4 py-3 text-base font-medium w-full text-left rounded-lg hover:bg-white/10 transition-colors duration-200 touch-manipulation"
                >
                  <Home className="w-5 h-5" />
                  <span>HOME</span>
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="mobile-nav-item flex items-center space-x-3 text-white hover:text-indigo-200 block px-4 py-3 text-base font-medium w-full text-left rounded-lg hover:bg-white/10 transition-colors duration-200 touch-manipulation"
                >
                  <Phone className="w-5 h-5" />
                  <span>CONTACTS</span>
                </button>
                <button
                  onClick={() => handleNavigation(() => onShowEvents?.())}
                  className="mobile-nav-item flex items-center space-x-3 text-white hover:text-indigo-200 block px-4 py-3 text-base font-medium w-full text-left rounded-lg hover:bg-white/10 transition-colors duration-200 touch-manipulation"
                >
                  <Calendar className="w-5 h-5" />
                  <span>EVENTS</span>
                </button>
                <button
                  onClick={() => scrollToSection('speakers')}
                  className="mobile-nav-item text-white hover:text-indigo-200 block px-4 py-3 text-base font-medium w-full text-left rounded-lg hover:bg-white/10 transition-colors duration-200 touch-manipulation"
                >
                  SPEAKERS
                </button>
                <button
                  onClick={() => handleNavigation(() => onShowSpeakers?.())}
                  className="mobile-nav-item text-white hover:text-indigo-200 block px-4 py-3 text-base font-medium w-full text-left rounded-lg hover:bg-white/10 transition-colors duration-200 touch-manipulation"
                >
                  SPEAKER DIRECTORY
                </button>
                <button
                  onClick={() => scrollToSection('schedule')}
                  className="mobile-nav-item text-white hover:text-indigo-200 block px-4 py-3 text-base font-medium w-full text-left rounded-lg hover:bg-white/10 transition-colors duration-200 touch-manipulation"
                >
                  SCHEDULE
                </button>
                <button
                  onClick={() => scrollToSection('analytics')}
                  className="mobile-nav-item text-white hover:text-indigo-200 block px-4 py-3 text-base font-medium w-full text-left rounded-lg hover:bg-white/10 transition-colors duration-200 touch-manipulation"
                >
                  ANALYTICS
                </button>
                <button
                  onClick={() => scrollToSection('plan-event')}
                  className="mobile-nav-item text-white hover:text-indigo-200 block px-4 py-3 text-base font-medium w-full text-left rounded-lg hover:bg-white/10 transition-colors duration-200 touch-manipulation"
                >
                  PLAN EVENT
                </button>
                <button
                  onClick={() => handleNavigation(() => onShowBlog?.())}
                  className="mobile-nav-item text-white hover:text-indigo-200 block px-4 py-3 text-base font-medium w-full text-left rounded-lg hover:bg-white/10 transition-colors duration-200 touch-manipulation"
                >
                  BLOG
                </button>
              </>
            ) : (
              // Collapsible mobile navigation for other pages
              collapsibleMenuItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleNavigation(item.action)}
                    className="mobile-nav-item flex items-center space-x-3 text-white hover:text-indigo-200 block px-4 py-3 text-base font-medium w-full text-left rounded-lg hover:bg-white/10 transition-colors duration-200 touch-manipulation"
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })
            )}
            
            {/* Mobile Auth Section */}
            {isAuthenticated ? (
              <div className="border-t border-indigo-500 pt-3 mt-3">
                <div className="flex items-center space-x-2 text-white px-4 py-3">
                  <User className="w-4 h-4" />
                  <span>{user?.name}</span>
                </div>
                <button
                  onClick={() => handleNavigation(() => onShowDashboard?.())}
                  className="mobile-nav-item text-white hover:text-indigo-200 block px-4 py-3 text-base font-medium w-full text-left rounded-lg hover:bg-white/10 transition-colors duration-200 touch-manipulation"
                >
                  Dashboard
                </button>
                <button
                  onClick={onLogout}
                  className="mobile-nav-item text-white hover:text-indigo-200 block px-4 py-3 text-base font-medium w-full text-left rounded-lg hover:bg-white/10 transition-colors duration-200 touch-manipulation"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="border-t border-indigo-500 pt-3 mt-3">
                <button
                  onClick={onLogin}
                  className="mobile-nav-item text-white hover:text-indigo-200 block px-4 py-3 text-base font-medium w-full text-left rounded-lg hover:bg-white/10 transition-colors duration-200 touch-manipulation"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;