export interface NavigationItem {
  label: string;
  path: string;
  href: string;
  icon?: React.ComponentType<any>;
  description?: string;
  requiresAuth?: boolean;
  roles?: string[];
}

export interface AuthDropdownProps {
  onClose: () => void;
  onSuccess: () => void;
  isMobile?: boolean;
}

export interface ResponsiveHeaderProps {
  className?: string;
  showLogo?: boolean;
  logoText?: string;
  navigationItems?: NavigationItem[];
  authEnabled?: boolean;
}

export type AuthMode = 'signin' | 'signup';
export type UserRole = 'attendee' | 'organizer' | 'admin';

export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  company: string;
  role: UserRole;
}

export interface AuthFormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  fullName?: string;
  general?: string;
}