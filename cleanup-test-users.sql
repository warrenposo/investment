-- ============================================
-- CLEANUP TEST USERS
-- Use this to delete test accounts if signup fails
-- ============================================

-- Check if the email exists
SELECT id, email FROM auth.users WHERE email = 'nycewanjiru6@gmail.com';

-- If you want to delete this test user, uncomment and run:
-- DELETE FROM auth.users WHERE email = 'nycewanjiru6@gmail.com';

-- Or delete ALL test users (BE CAREFUL!):
-- DELETE FROM auth.users WHERE email LIKE '%test%' OR email LIKE '%nyce%';

-- Check what's in the users table
SELECT id, email, first_name, last_name FROM public.users;

-- ============================================
-- After cleanup, try signing up with a fresh email
-- ============================================

