# Firebase Authentication Setup Instructions

## Prerequisites

1. **Firebase Project**: Ensure you have a Firebase project created at [Firebase Console](https://console.firebase.google.com/)
2. **Firebase Configuration**: Your new Firebase config is set up in `src/lib/firebaseConfig.ts`

## Firebase Console Configuration

### 1. Enable Authentication Methods

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`eventeasecorp`)
3. Navigate to **Authentication** > **Sign-in method**
4. Enable the following providers:
   - **Email/Password**: Enable this provider
   - **Email link (passwordless sign-in)**: Optional, for magic links

### 2. Configure Email Templates

1. In Authentication > Templates tab
2. Customize email templates for:
   - **Email address verification**
   - **Password reset**
   - **Email address change**

### 3. Configure Authorized Domains

1. In Authentication > Settings tab
2. Add your domains to **Authorized domains**:
   - `localhost` (for development)
   - Your production domain
   - `eventeasecorp.firebaseapp.com` (Firebase hosting domain)

### 4. Set Up Email Action Handler

Configure the action handler URL for email verification and password reset:

1. In Authentication > Settings tab
2. Set **Action URL** to: `https://your-domain.com/auth/action`
3. For development: `http://localhost:5173/auth/action`

## Environment Variables

Add these to your `.env` file (if not already present):

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

## Testing the Implementation

### 1. Test User Registration

```typescript
import { firebaseAuthService } from './lib/firebaseAuth';

// Test registration
try {
  const result = await firebaseAuthService.register({
    email: 'test@example.com',
    password: 'testPassword123',
    name: 'Test User',
    role: 'attendee'
  });
  
  console.log('Registration result:', result);
} catch (error) {
  console.error('Registration error:', error);
}
```

### 2. Test User Login

```typescript
// Test login
try {
  const result = await firebaseAuthService.signIn('test@example.com', 'testPassword123');
  console.log('Login result:', result);
} catch (error) {
  console.error('Login error:', error);
}
```

### 3. Test Password Reset

```typescript
// Test password reset
try {
  const result = await firebaseAuthService.resetPassword('test@example.com');
  console.log('Password reset result:', result);
} catch (error) {
  console.error('Password reset error:', error);
}
```

## URL Routing for Auth Actions

Update your routing to handle Firebase auth action URLs:

### Email Verification URL
Firebase will redirect to: `https://your-domain.com/auth/action?mode=verifyEmail&oobCode=ABC123`

### Password Reset URL  
Firebase will redirect to: `https://your-domain.com/auth/action?mode=resetPassword&oobCode=XYZ789`

## Security Rules

### Firebase Security Rules

In Firebase Console > Authentication > Settings:

1. **Email enumeration protection**: Enable to prevent email enumeration attacks
2. **SMS quota**: Configure if using phone authentication
3. **Authorized domains**: Only allow your domains

### Supabase RLS Policies

Your existing RLS policies will continue to work with Firebase UIDs:

```sql
-- Example: Users can only access their own profile
CREATE POLICY "Users can access own profile" ON profiles
  FOR ALL USING (auth.uid()::text = id);
```

## Error Handling

The Firebase auth service provides user-friendly error messages:

```typescript
// Common error codes and messages:
// auth/user-not-found -> "No account found with this email address."
// auth/wrong-password -> "Incorrect password. Please try again."
// auth/email-already-in-use -> "An account with this email already exists."
// auth/weak-password -> "Password should be at least 6 characters long."
```

## Migration Checklist

- [x] Install Firebase SDK
- [x] Create Firebase configuration
- [x] Implement Firebase auth service
- [x] Update AuthContext to use Firebase
- [x] Update auth components
- [x] Create migration guide
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test password reset flow
- [ ] Test email verification
- [ ] Update admin authentication
- [ ] Test role-based access control
- [ ] Deploy and test in production

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your domain is added to Firebase authorized domains
2. **Email not sending**: Check Firebase email templates and SMTP configuration
3. **Profile not created**: Check Supabase table permissions and triggers
4. **Auth state not persisting**: Verify Firebase configuration and local storage

### Debug Steps

1. Check browser console for errors
2. Verify Firebase project configuration
3. Test with Firebase Auth emulator in development
4. Check Supabase logs for database errors
5. Verify environment variables are loaded correctly

## Production Deployment

### 1. Update Environment Variables
Ensure all production environment variables are set correctly.

### 2. Configure Firebase for Production
1. Add production domain to authorized domains
2. Update email action handler URLs
3. Configure custom email templates

### 3. Test Production Flow
1. Test complete registration flow
2. Verify email delivery
3. Test password reset flow
4. Verify database integration

## Support

For issues with this migration:

1. Check Firebase Auth documentation
2. Review Supabase database logs  
3. Test components individually
4. Verify all environment variables
5. Check network requests in browser dev tools

The migration maintains all existing functionality while providing better authentication security and user experience through Firebase Auth.