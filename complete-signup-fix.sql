-- ============================================
-- COMPLETE SIGNUP FIX - Clean Everything and Restart
-- This will fix the signup issue completely
-- ============================================

-- Step 1: Drop the trigger entirely
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 2: Create the most basic version of handle_new_user function
-- This version only uses columns that DEFINITELY exist
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only insert the absolute minimum required fields
  INSERT INTO public.users (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Create user balance
  INSERT INTO public.user_balances (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Done! Now try signing up again
-- ============================================

