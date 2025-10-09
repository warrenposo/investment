-- Set up Admin User for Valora Capital
-- Run this in your Supabase SQL Editor after running the main schema

-- First, make sure the admin user exists in auth.users
-- (This should happen automatically when they sign up with warrenokumu98@gmail.com)

-- Add the admin user to the admin_users table
-- This will give them admin privileges
INSERT INTO public.admin_users (user_id, role, permissions)
SELECT 
  id, 
  'super_admin',
  '{"kyc_review": true, "user_management": true, "investment_management": true}'
FROM auth.users 
WHERE email = 'warrenokumu98@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET
  role = 'super_admin',
  permissions = '{"kyc_review": true, "user_management": true, "investment_management": true}';

-- Verify the admin user was added
SELECT 
  au.user_id,
  au.role,
  au.permissions,
  u.email,
  p.first_name,
  p.last_name
FROM public.admin_users au
JOIN auth.users u ON au.user_id = u.id
LEFT JOIN public.users p ON au.user_id = p.id
WHERE u.email = 'warrenokumu98@gmail.com';

-- Show all admin users (for verification)
SELECT 
  au.user_id,
  au.role,
  u.email,
  u.created_at
FROM public.admin_users au
JOIN auth.users u ON au.user_id = u.id
ORDER BY au.created_at DESC;
