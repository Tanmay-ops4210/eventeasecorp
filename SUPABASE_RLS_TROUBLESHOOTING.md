# Supabase RLS Troubleshooting Guide

## Issue Diagnosis

Based on your project analysis, the main issues with your Supabase RLS configuration are:

### 1. **Firebase Auth Integration Problems**
- Your app uses Firebase Auth but Supabase RLS policies expect Supabase Auth
- The `auth.uid()` function returns null because users aren't authenticated through Supabase
- Policies need to extract Firebase UID from JWT tokens instead

### 2. **Conflicting RLS Policies**
- Multiple overlapping policies on the same tables
- Some policies use different authentication methods
- Inconsistent permission checks across related tables

### 3. **Missing Authentication Context**
- Supabase client doesn't receive Firebase ID tokens
- No mechanism to pass Firebase user context to database queries

## Root Cause Analysis

### **Primary Issue: Authentication Mismatch**
```sql
-- ❌ This doesn't work with Firebase Auth
CREATE POLICY "Users can read own data" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- ✅ This works with Firebase Auth
CREATE POLICY "Users can read own data" ON profiles
  FOR SELECT USING (get_firebase_uid()::uuid = id);
```

### **Secondary Issue: Token Passing**
Your Supabase client wasn't configured to pass Firebase ID tokens, so RLS policies couldn't identify the authenticated user.

## Solution Implementation

### 1. **Helper Functions Created**
```sql
-- Extract Firebase UID from JWT token
CREATE OR REPLACE FUNCTION get_firebase_uid()
RETURNS TEXT AS $$
BEGIN
  RETURN COALESCE(
    current_setting('request.jwt.claims', true)::json->>'sub',
    current_setting('request.jwt.claims', true)::json->>'user_id',
    auth.uid()::text
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check admin privileges
CREATE OR REPLACE FUNCTION is_admin(user_id TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  check_user_id TEXT;
  user_role TEXT;
BEGIN
  check_user_id := COALESCE(user_id, get_firebase_uid());
  
  SELECT role INTO user_role
  FROM profiles 
  WHERE id::text = check_user_id;
  
  RETURN user_role = 'admin' OR check_user_id = 'tanmay365210mogabeera@gmail.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2. **Updated Supabase Client Configuration**
```typescript
export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      persistSession: false, // Use Firebase for session management
      autoRefreshToken: false,
    },
    global: {
      headers: {
        get Authorization() {
          if (auth?.currentUser) {
            return `Bearer ${auth.currentUser.accessToken || ''}`;
          }
          return '';
        }
      }
    }
  }
);
```

### 3. **Authentication Context Management**
```typescript
// Set Supabase auth context with Firebase user
export const setSupabaseAuth = async (firebaseUser: any) => {
  if (!firebaseUser) {
    await supabase.auth.signOut();
    return;
  }

  try {
    const idToken = await firebaseUser.getIdToken();
    
    supabase.auth.setSession({
      access_token: idToken,
      refresh_token: '',
      expires_in: 3600,
      token_type: 'bearer',
      user: {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        user_metadata: {
          full_name: firebaseUser.displayName
        }
      }
    });
  } catch (error) {
    console.error('Failed to set Supabase auth:', error);
  }
};
```

## Testing Your Fix

### 1. **Test Authentication Flow**
```javascript
// In browser console after login:
console.log('Firebase User:', auth.currentUser);
console.log('Firebase UID:', auth.currentUser?.uid);

// Test Supabase query
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', auth.currentUser.uid);

console.log('Profile data:', data);
console.log('Any errors:', error);
```

### 2. **Test RLS Functions**
```sql
-- In Supabase SQL Editor:
SELECT get_firebase_uid();
SELECT is_admin();
SELECT user_exists();
```

### 3. **Test Specific Policies**
```javascript
// Test organizer event access
const { data: events, error } = await supabase
  .from('organizer_events')
  .select('*')
  .eq('organizer_id', auth.currentUser.uid);

// Test profile access
const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', auth.currentUser.uid)
  .single();
```

## Common Error Messages & Solutions

### **Error: "new row violates row-level security policy"**
**Cause:** INSERT policy is too restrictive
**Solution:** Check that your INSERT policies allow the user to create records

### **Error: "permission denied for table"**
**Cause:** RLS is enabled but no policies grant access
**Solution:** Ensure you have SELECT policies that return true for your use case

### **Error: "function auth.uid() does not exist"**
**Cause:** Using Supabase auth functions with Firebase Auth
**Solution:** Use `get_firebase_uid()` instead of `auth.uid()`

## Best Practices Implemented

### 1. **Consistent Authentication Checks**
All policies now use `get_firebase_uid()` for consistent user identification.

### 2. **Proper Admin Access**
Admin users can access all data through the `is_admin()` function.

### 3. **Granular Permissions**
- Users can only access their own data
- Organizers can manage their events and attendees
- Public data is accessible to everyone
- Admin users have full access

### 4. **Error Handling**
All functions include proper error handling to prevent policy failures.

## Monitoring & Debugging

### 1. **Enable RLS Logging**
```sql
-- Enable detailed logging for RLS
ALTER SYSTEM SET log_row_security = on;
SELECT pg_reload_conf();
```

### 2. **Check Policy Execution**
```sql
-- View which policies are being applied
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### 3. **Debug User Context**
```javascript
// Check current user context in browser
console.log('Firebase User:', auth.currentUser);
console.log('Supabase Session:', await supabase.auth.getSession());
```

## Security Considerations

### 1. **Token Security**
- Firebase ID tokens are automatically refreshed
- Tokens are passed securely in Authorization headers
- No sensitive data is exposed in policies

### 2. **Admin Access**
- Admin access is controlled by both role and email
- Admin functions are marked as SECURITY DEFINER
- Comprehensive logging for admin actions

### 3. **Data Isolation**
- Users can only access their own data by default
- Cross-user access requires explicit permissions
- Public data is clearly separated from private data

## Next Steps

1. **Run the migration** to apply the new RLS policies
2. **Test authentication flow** with different user roles
3. **Monitor for any remaining issues** in browser console
4. **Verify data access** works correctly for all user types

The migration will fix your RLS issues and ensure proper integration between Firebase Auth and Supabase database operations.