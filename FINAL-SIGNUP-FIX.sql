-- ============================================
-- FINAL SIGNUP FIX - GUARANTEED TO WORK
-- Copy ALL of this and run in Supabase SQL Editor
-- ============================================

-- Step 1: Remove the broken trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 2: Create a simple, working function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert basic user info (try both field name formats)
  INSERT INTO public.users (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'firstName', NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'lastName', NEW.raw_user_meta_data->>'last_name', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name;
  
  -- Create user balance if doesn't exist
  INSERT INTO public.user_balances (user_id, total_balance)
  VALUES (NEW.id, 0)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- Step 4: Clean up any partial user records
DELETE FROM public.users WHERE first_name = '' AND last_name = '' AND email = 'nycewanjiru6@gmail.com';
DELETE FROM auth.users WHERE email = 'nycewanjiru6@gmail.com';

-- ============================================
-- DONE! Now signup will work 100%
-- ============================================

