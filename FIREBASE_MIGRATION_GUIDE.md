# Firebase Authentication Migration Guide

## Overview
This guide provides step-by-step instructions for migrating from Supabase Auth to Firebase Auth while maintaining Supabase for database operations.

## What Changed

### 1. Authentication Provider
- **Before**: Old Firebase configuration
- **After**: Firebase Auth (`firebase/auth`)

### 2. Database Operations
- **Unchanged**: Supabase database operations remain the same
- **Enhanced**: Updated Firebase project configuration

## Implementation Details

### New Files Created

1. **`src/lib/firebaseConfig.ts`** - Firebase initialization and configuration
2. **`src/lib/firebaseAuth.ts`** - Firebase authentication service
3. **`src/lib/firebaseAuthHelpers.ts`** - Helper functions for auth + database integration

### Modified Files

1. **`src/contexts/AuthContext.tsx`** - Updated to use Firebase Auth
2. **Database schema remains unchanged** - All Supabase database operations continue to work

## Migration Steps

### Step 1: Update Authentication Calls

Firebase auth calls remain the same, but now use the new project configuration:

#### Firebase Auth Usage:
```typescript
// Login
const result = await firebaseAuthService.signIn(email, password);

// Register
const result = await firebaseAuthService.register({
  email,
  password,
  name,
  role
});

// Logout
await firebaseAuthService.signOut();

// Password Reset
await firebaseAuthService.resetPassword(email);
```

### Step 2: Update Auth State Listening

#### Firebase Auth State:
```typescript
const unsubscribe = firebaseAuthService.onAuthStateChanged(async (firebaseUser) => {
  // Handle auth state changes
});
```

### Step 3: Update User Profile Management

User profiles are now stored in Supabase `profiles` table with Firebase UID as the primary key:

```typescript
// Get current user with profile
const { firebaseUser, profile } = await firebaseAuthService.getCurrentUserWithProfile();

// Update user profile
await firebaseAuthService.updateUserProfile({
  full_name: 'New Name',
  role: 'organizer'
});
```

## Database Schema Changes

### Profiles Table
The `profiles` table now uses Firebase UID as the primary key:

```sql
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY, -- This will be the Firebase UID
  username TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'attendee',
  plan TEXT DEFAULT 'free',
  -- ... other fields
);
```

### Foreign Key Relationships
All foreign key relationships to user profiles now reference the Firebase UID:

```sql
-- Events table
organizer_id UUID NOT NULL REFERENCES public.profiles(id)

-- Attendees table  
user_id UUID NOT NULL REFERENCES public.profiles(id)
```

## Environment Variables

### Firebase Configuration
Add these to your `.env` file:

```env
# Firebase Configuration (updated)
VITE_FIREBASE_API_KEY=AIzaSyDCScMcAMwBFXHKei_RRZ7M6SG9YA2oQqE
VITE_FIREBASE_AUTH_DOMAIN=eventeasecorp.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=eventeasecorp
VITE_FIREBASE_STORAGE_BUCKET=eventeasecorp.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=796329798902
VITE_FIREBASE_APP_ID=1:796329798902:web:cd5a163b12fc2fdb6750d7
VITE_FIREBASE_MEASUREMENT_ID=G-WB4KBXM17F

# Supabase Configuration (keep for database operations)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Key Benefits

### 1. Better Separation of Concerns
- **Authentication**: Firebase Auth (specialized auth service)
- **Database**: Supabase (powerful PostgreSQL with RLS)

### 2. Enhanced Security
- Firebase Auth provides robust security features
- Supabase RLS policies still protect your data
- No vendor lock-in for either service

### 3. Improved Developer Experience
- Firebase Auth has excellent documentation and tooling
- Supabase database operations remain unchanged
- Better error handling and user feedback

## Usage Examples

### Basic Authentication Flow

```typescript
import { firebaseAuthService } from '../lib/firebaseAuth';

// Register new user
try {
  const result = await firebaseAuthService.register({
    email: 'user@example.com',
    password: 'securePassword',
    name: 'John Doe',
    role: 'attendee'
  });
  
  if (result.success) {
    console.log('User registered successfully');
    // User profile automatically created in Supabase
  } else {
    console.error('Registration failed:', result.error);
  }
} catch (error) {
  console.error('Registration error:', error);
}

// Sign in user
try {
  const result = await firebaseAuthService.signIn(email, password);
  
  if (result.success) {
    console.log('User signed in successfully');
    // User profile loaded from Supabase automatically
  } else {
    console.error('Sign in failed:', result.error);
  }
} catch (error) {
  console.error('Sign in error:', error);
}
```

### Working with User Profiles

```typescript
import { getUserProfile, updateUserProfile } from '../lib/firebaseAuthHelpers';

// Get current user's profile
const profile = await getUserProfile();
console.log('User role:', profile?.role);

// Update user profile
const result = await updateUserProfile({
  full_name: 'Updated Name',
  company: 'New Company',
  title: 'Senior Developer'
});

if (result.success) {
  console.log('Profile updated successfully');
}
```

### Permission Checking

```typescript
import { hasPermission, canAccessResource } from '../lib/firebaseAuthHelpers';

// Check if user has specific permission
const canCreateEvents = await hasPermission('events.create');

// Check if user can access specific resource
const canEditEvent = await canAccessResource('event', eventId, 'write');
```

## Error Handling

The Firebase auth service provides user-friendly error messages:

```typescript
try {
  await firebaseAuthService.signIn(email, password);
} catch (error) {
  // Error messages are already user-friendly:
  // "No account found with this email address."
  // "Incorrect password. Please try again."
  // "Please verify your email address before signing in."
  console.error(error.message);
}
```

## Testing the Migration

### 1. Test Authentication Flow
1. Register a new user
2. Check email verification
3. Sign in with verified account
4. Test password reset
5. Test logout

### 2. Test Database Integration
1. Verify user profile creation in Supabase
2. Test role-based access control
3. Verify foreign key relationships work
4. Test data operations with Firebase UID

### 3. Test Existing Features
1. Event creation and management
2. Attendee registration
3. Speaker and sponsor management
4. Admin panel functionality

## Rollback Plan

If you need to rollback to Supabase Auth:

1. Revert the `AuthContext.tsx` changes
2. Remove Firebase auth service files
3. Update environment variables
4. Test all authentication flows

## Security Considerations

### 1. Firebase Auth Security
- Email verification is enforced
- Strong password requirements
- Rate limiting on auth attempts
- Secure token management

### 2. Supabase Database Security
- Row Level Security (RLS) policies remain active
- Firebase UID used for user identification
- Proper foreign key constraints
- Data validation at database level

### 3. Integration Security
- No sensitive data passed between services
- Proper error handling prevents data leaks
- Audit trail maintained in both systems

## Performance Considerations

### 1. Authentication Performance
- Firebase Auth is optimized for speed
- Automatic token refresh
- Offline capability

### 2. Database Performance
- Supabase queries remain optimized
- No additional latency from auth provider
- Efficient user profile lookups

## Monitoring and Debugging

### 1. Firebase Console
- Monitor authentication metrics
- View user activity
- Debug authentication issues

### 2. Supabase Dashboard
- Monitor database operations
- View RLS policy effectiveness
- Debug data access issues

### 3. Application Logs
- Comprehensive error logging
- User action tracking
- Performance monitoring

## Next Steps

1. **Test thoroughly** in development environment
2. **Update documentation** for your team
3. **Train team members** on new auth flow
4. **Monitor metrics** after deployment
5. **Gather user feedback** on auth experience

## Support

If you encounter issues during migration:

1. Check Firebase Auth documentation
2. Review Supabase database logs
3. Test individual components in isolation
4. Verify environment variables are correct
5. Check network connectivity and CORS settings

This migration provides a robust, scalable authentication solution while maintaining all your existing database functionality.