/*
  # Fix is_admin function conflict

  1. Database Functions
    - Drop all existing is_admin functions to resolve conflicts
    - Create a single, properly defined is_admin function
    - Ensure function works with Firebase Auth integration

  2. Security
    - Maintain admin access for bypass email
    - Support both Firebase UID and email-based admin checks
    - Ensure function is marked as SECURITY DEFINER for proper permissions

  3. Compatibility
    - Works with existing RLS policies
    - Supports both authenticated and unauthenticated contexts
    - Handles edge cases gracefully
*/

-- Drop all existing is_admin functions to resolve conflicts
DROP FUNCTION IF EXISTS is_admin();
DROP FUNCTION IF EXISTS is_admin(TEXT);
DROP FUNCTION IF EXISTS is_admin(UUID);

-- Create a single, comprehensive is_admin function
CREATE OR REPLACE FUNCTION is_admin(user_id TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  check_user_id TEXT;
  user_role TEXT;
  user_email TEXT;
BEGIN
  -- Get the user ID to check (either provided or from current context)
  check_user_id := COALESCE(
    user_id,
    get_firebase_uid(),
    auth.uid()::text
  );
  
  -- If no user ID available, return false
  IF check_user_id IS NULL OR check_user_id = '' THEN
    RETURN FALSE;
  END IF;
  
  -- Check if the user ID matches the admin bypass email directly
  IF check_user_id = 'tanmay365210mogabeera@gmail.com' THEN
    RETURN TRUE;
  END IF;
  
  -- Try to get user role and email from profiles table
  BEGIN
    SELECT role INTO user_role
    FROM profiles 
    WHERE id::text = check_user_id;
    
    -- If user found and has admin role, return true
    IF user_role = 'admin' THEN
      RETURN TRUE;
    END IF;
    
    -- Also check if the profile email matches admin email
    SELECT p.role INTO user_role
    FROM profiles p
    JOIN auth.users u ON u.id::text = p.id::text
    WHERE u.email = 'tanmay365210mogabeera@gmail.com'
    AND p.id::text = check_user_id;
    
    IF FOUND THEN
      RETURN TRUE;
    END IF;
    
  EXCEPTION WHEN OTHERS THEN
    -- If there's an error accessing profiles, continue to other checks
    NULL;
  END;
  
  -- Fallback: check if user_id is the admin email directly
  IF check_user_id = 'tanmay365210mogabeera@gmail.com' THEN
    RETURN TRUE;
  END IF;
  
  -- Default to false if no admin privileges found
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION is_admin(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin(TEXT) TO anon;

-- Create a convenience function without parameters
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN is_admin(NULL);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Grant execute permission for the parameterless version
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin() TO anon;

-- Test the function to ensure it works
DO $$
BEGIN
  -- Test with admin email
  IF NOT is_admin('tanmay365210mogabeera@gmail.com') THEN
    RAISE EXCEPTION 'Admin function test failed for admin email';
  END IF;
  
  -- Test with random user ID (should return false)
  IF is_admin('random-user-id-123') THEN
    RAISE EXCEPTION 'Admin function test failed for non-admin user';
  END IF;
  
  RAISE NOTICE 'is_admin function tests passed successfully';
END;
$$;