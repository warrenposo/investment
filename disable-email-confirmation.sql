-- ============================================
-- DISABLE EMAIL CONFIRMATION (Optional)
-- This makes signup instant without email verification
-- Only run this if you want to disable email confirmation
-- ============================================

-- Check current setting
-- Go to Supabase Dashboard > Authentication > Settings > Email Auth
-- Look for "Enable email confirmations"
-- If it's enabled, turn it OFF for testing

-- Alternative: You can also confirm users manually with this SQL:
-- UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = 'your-test-email@gmail.com';

-- ============================================
-- IMPORTANT: For production, keep email confirmation ON
-- For development/testing, you can turn it OFF
-- ============================================

