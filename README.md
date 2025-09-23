# EventEase Corp - Enhanced Event Management Website

A modern, fully-featured event management website with interactive data visualization, smooth animations, and comprehensive functionality.

## 🔐 Authentication System

### Supabase Authentication Integration
- **Secure Authentication**: Email/password authentication with Supabase Auth
- **Role-Based Access Control**: Three distinct user roles (Attendee, Organizer, Sponsor)
- **Email Verification**: Required email verification for all new accounts
- **Password Reset**: Secure password reset flow with email links
- **Session Management**: Persistent sessions with Supabase Auth

### User Roles & Permissions
- **Attendee**: Can view and register for events, manage registrations, network with others
- **Organizer**: Can create and manage events, view analytics, manage attendees and speakers
- **Sponsor**: Can customize virtual booths, capture leads, view sponsorship analytics
- **Admin**: Full system access for user and content management

### Security Features
- Supabase Auth security features
- Supabase Row Level Security (RLS) policies for data protection
- Email verification required before login
- Secure password requirements (minimum 6 characters)
- Role-based route protection
- Supabase session management

## Features

### 🎯 Core Functionality
- **Event Management**: Complete event planning and booking system
- **User Authentication**: Secure Firebase-powered authentication with role-based access
- **Responsive Design**: Optimized for all device sizes
- **Interactive Navigation**: Smooth scrolling between sections

### 📊 Enhanced Chart Component
- **Multiple Chart Types**: Bar charts, line charts, flow charts, and pie charts
- **Pagination System**: Navigate through different data sets with smooth transitions
- **Advanced Animations**: 
  - Smooth entry animations for all chart elements
  - Hover effects with proper timing
  - Loading animations during data fetching
  - Page transition effects with easing functions
- **Modern Styling**:
  - Responsive design with CSS Grid and Flexbox
  - Dark/light theme support
  - Accessibility compliance (ARIA labels, focus states)
  - High contrast mode support
  - Reduced motion support for accessibility

### 🎨 Design Features
- **Apple-level Aesthetics**: Meticulous attention to detail and sophisticated visual presentation
- **Micro-interactions**: Thoughtful hover states and transitions
- **Color System**: Comprehensive color ramps with proper contrast ratios
- **Typography**: Consistent hierarchy with optimal line spacing
- **8px Spacing System**: Consistent alignment and visual balance

## Chart Component Documentation

### Usage

The `EnhancedChart` component provides interactive data visualization with the following features:

```tsx
import EnhancedChart from './components/EnhancedChart';
import './components/chart-styles.css';

// Use in your component
<EnhancedChart />
```

### Chart Types

1. **Bar Chart**: Horizontal bars with animated fills and shine effects
2. **Line Chart**: Smooth line with area fill and animated points
3. **Flow Chart**: Node-based visualization with progress indicators
4. **Pie Chart**: Animated slices with interactive legend

### Pagination Features

- **Navigation Controls**: Previous/Next buttons with disabled states
- **Page Indicators**: Dot navigation with active state highlighting
- **Page Information**: Current page display (e.g., "Page 2 of 5")
- **Smooth Transitions**: Animated page changes with loading states
- **Edge Case Handling**: Proper first/last page state management

### Animation Details

- **Entry Animations**: Staggered animations for chart elements
- **Hover Effects**: Scale and color transitions on interactive elements
- **Loading States**: Spinner animation during data fetching
- **Page Transitions**: Fade and slide effects between chart pages
- **Easing Functions**: Natural movement with cubic-bezier timing
- **Performance**: 60fps animations with GPU acceleration

### Accessibility Features

- **ARIA Labels**: Proper labeling for screen readers
- **Focus States**: Visible focus indicators for keyboard navigation
- **High Contrast**: Support for high contrast mode
- **Reduced Motion**: Respects user's motion preferences
- **Semantic HTML**: Proper heading hierarchy and structure
- **Color Contrast**: WCAG compliant contrast ratios

### Responsive Breakpoints

- **Mobile**: < 480px - Stacked layout with simplified navigation
- **Tablet**: 480px - 768px - Adjusted spacing and font sizes
- **Desktop**: > 768px - Full feature set with optimal spacing

### CSS Custom Properties

The component uses CSS custom properties for theming:

```css
:root {
  --chart-primary: #3b82f6;
  --chart-secondary: #6366f1;
  --chart-bg: #ffffff;
  --chart-surface: #f8fafc;
  --chart-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **CSS Features**: CSS Grid, Flexbox, Custom Properties, CSS Animations
- **JavaScript**: ES2020+ features with TypeScript support

## Development

### Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
# Create a .env file with your Firebase and Supabase credentials:
# VITE_FIREBASE_API_KEY=your-firebase-api-key
# VITE_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
# VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
# (... other Firebase config)
# VITE_SUPABASE_URL=your-supabase-url
# VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Start development server
npm run dev

# Build for production
npm run build
```

### Firebase & Supabase Setup

1. **Create a Firebase Project**: Visit [console.firebase.google.com](https://console.firebase.google.com) and create a new project

2. **Enable Firebase Authentication**: Enable Email/Password authentication in your Firebase console

3. **Create a Supabase Project**: Visit [supabase.com](https://supabase.com) and create a new project for database operations

4. **Run Database Migrations**: Run the migration file located at `supabase/migrations/20250829135458_floral_sky.sql`

5. **Configure Environment Variables**: Add your Firebase and Supabase credentials to your `.env` file

6. **Email Templates**: Configure email templates in your Firebase console for:
   - Email confirmation
   - Password reset
   - Email change confirmation

7. **Auth Settings**: In your Firebase console, configure:
   - Enable email confirmations
   - Set redirect URLs for your domain
   - Configure password requirements

### Database Schema

The system uses Firebase for authentication and Supabase for database operations:

- **Firebase Auth**: Handles user authentication, email verification, password reset
- **Supabase Database**: Stores user profiles, events, and all application data
- **profiles**: User information linked to Firebase UID
- **events**: Event data linked to user profiles

### Authentication Flow

1. **Signup**: User registers with Supabase Auth (email, password, name, role)
2. **Profile Creation**: User profile automatically created in Supabase database
3. **Email Verification**: User receives Supabase verification email
4. **Login**: User can only login after email verification is complete
4. **Role-Based Routing**: Users are redirected to appropriate dashboard based on role
5. **Session Management**: Supabase handles session persistence

### Project Structure

```
src/
├── lib/
│   ├── supabase.ts               # Supabase configuration and services
│   └── supabaseClient.ts         # Legacy compatibility layer
├── contexts/
│   ├── AuthContext.tsx           # Authentication state management
│   └── AppContext.tsx            # Application state management
├── components/
│   ├── auth/
│   │   ├── AuthModal.tsx         # Login/signup modal with role selection
│   │   ├── PasswordResetPage.tsx # Password reset request page
│   │   ├── EmailVerificationCallback.tsx # Email verification handler
│   │   └── PasswordResetCallback.tsx     # Password reset handler
│   ├── common/
│   │   └── EmailVerificationBanner.tsx   # Verification reminder banner
├── components/
│   ├── EnhancedChart.tsx      # Main chart component
│   ├── chart-styles.css       # Chart-specific styles
│   ├── Navigation.tsx         # Updated navigation
│   └── ...                    # Other components
├── types/
│   └── user.ts                   # User and authentication types
├── App.tsx                    # Main application
└── main.tsx                   # Entry point
```

### Performance Considerations

- **CSS Animations**: Preferred over JavaScript for better performance
- **GPU Acceleration**: Transform and opacity animations for 60fps
- **Lazy Loading**: Components load only when needed
- **Optimized Images**: Compressed images from Pexels
- **Bundle Size**: Minimal dependencies for fast loading

## Technologies Used

- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development
- **Supabase**: Authentication and database services
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful, customizable icons
- **Vite**: Fast build tool and development server
- **CSS3**: Modern CSS features for animations and layouts

## Environment Variables

Required environment variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Security Considerations

- **Supabase Email Verification**: All users must verify their email before accessing the platform
- **Role-Based Access**: Users can only access features appropriate to their role
- **Supabase Password Reset**: Secure password reset flow with Supabase
- **Session Security**: Supabase handles secure session management
- **Data Protection**: Supabase Row Level Security policies protect user data

## License

This project is built for demonstration purposes and showcases modern web development practices with a focus on user experience, accessibility, and performance.
