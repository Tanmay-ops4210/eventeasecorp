-- Creates a trigger function that inserts a new row into public.profiles
-- whenever a new user is created in the auth.users table.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a new profile record for the new user.
  -- The 'id' in 'profiles' should match the 'id' of the new user in 'auth.users'.
  -- The 'email' is also copied over. You can add default values for other fields.
  INSERT INTO public.profiles (id, email, username, role, plan)
  VALUES (
    new.id,
    new.email,
    -- Extracts the username from the email (e.g., 'john.doe' from 'john.doe@example.com')
    -- You can customize this logic as needed.
    split_part(new.email, '@', 1),
    'attendee', -- Default role for new users
    'free'      -- Default plan for new users
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Creates a trigger that fires the handle_new_user() function
-- AFTER a new user is inserted into the auth.users table.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
