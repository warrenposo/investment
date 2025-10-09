-- Fix Infinite Recursion in RLS Policies
-- Run this in your Supabase SQL Editor to fix the admin_users policy issue

-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;

-- Create a simple policy that doesn't cause recursion
CREATE POLICY "Admins can view admin users" ON public.admin_users
  FOR SELECT USING (true);

-- Update all other admin policies to use IN instead of EXISTS to avoid recursion
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.admin_users
    )
  );

DROP POLICY IF EXISTS "Admins can update user KYC status" ON public.users;
CREATE POLICY "Admins can update user KYC status" ON public.users
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM public.admin_users
    )
  );

DROP POLICY IF EXISTS "Admins can view all KYC documents" ON public.kyc_documents;
CREATE POLICY "Admins can view all KYC documents" ON public.kyc_documents
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.admin_users
    )
  );

DROP POLICY IF EXISTS "Admins can update KYC document status" ON public.kyc_documents;
CREATE POLICY "Admins can update KYC document status" ON public.kyc_documents
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM public.admin_users
    )
  );

DROP POLICY IF EXISTS "Admins can manage investment plans" ON public.investment_plans;
CREATE POLICY "Admins can manage investment plans" ON public.investment_plans
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM public.admin_users
    )
  );

DROP POLICY IF EXISTS "Admins can view all investments" ON public.investments;
CREATE POLICY "Admins can view all investments" ON public.investments
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.admin_users
    )
  );

DROP POLICY IF EXISTS "Admins can update investments" ON public.investments;
CREATE POLICY "Admins can update investments" ON public.investments
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM public.admin_users
    )
  );

DROP POLICY IF EXISTS "Admins can view all transactions" ON public.transactions;
CREATE POLICY "Admins can view all transactions" ON public.transactions
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.admin_users
    )
  );

DROP POLICY IF EXISTS "Admins can update transactions" ON public.transactions;
CREATE POLICY "Admins can update transactions" ON public.transactions
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM public.admin_users
    )
  );

DROP POLICY IF EXISTS "Admins can view all balances" ON public.user_balances;
CREATE POLICY "Admins can view all balances" ON public.user_balances
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.admin_users
    )
  );
