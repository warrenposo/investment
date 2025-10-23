-- ============================================
-- EMERGENCY FIX: Restore Basic Signup Function
-- This will make signup work again
-- Run this in Supabase SQL Editor NOW
-- ============================================

-- Restore the original handle_new_user function (without referral fields)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert basic user data (works even without referral columns)
  INSERT INTO public.users (id, email, first_name, last_name, phone, country)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'country', '')
  );
  
  -- Create user balance
  INSERT INTO public.user_balances (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- DONE! Try signing up now - it should work!
-- ============================================

