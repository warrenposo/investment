-- ============================================
-- REFERRAL SYSTEM SETUP - CLEAN VERSION
-- Copy everything below and paste into Supabase SQL Editor
-- ============================================

-- Step 1: Add referral columns to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES public.users(id);

-- Step 2: Create referrals table
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  referred_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed')),
  reward_amount DECIMAL(10,2) DEFAULT 0,
  reward_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(referrer_id, referred_id)
);

-- Step 3: Create indexes
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON public.referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON public.users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON public.users(referred_by);

-- Step 4: Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Step 5: Drop existing policies (if any)
DROP POLICY IF EXISTS "Users can view own referrals" ON public.referrals;
DROP POLICY IF EXISTS "Users can insert own referrals" ON public.referrals;
DROP POLICY IF EXISTS "Admins can view all referrals" ON public.referrals;

-- Step 6: Create RLS policies
CREATE POLICY "Users can view own referrals" ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_id);

CREATE POLICY "Users can insert own referrals" ON public.referrals
  FOR INSERT WITH CHECK (auth.uid() = referrer_id);

CREATE POLICY "Admins can view all referrals" ON public.referrals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Step 7: Create function to generate referral codes
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));
    SELECT EXISTS(SELECT 1 FROM public.users WHERE referral_code = code) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Step 8: Create function to set referral codes for existing users
CREATE OR REPLACE FUNCTION set_referral_codes()
RETURNS void AS $$
BEGIN
  UPDATE public.users
  SET referral_code = generate_referral_code()
  WHERE referral_code IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Step 9: Update handle_new_user trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  ref_code TEXT;
BEGIN
  ref_code := generate_referral_code();
  
  INSERT INTO public.users (id, email, first_name, last_name, phone, country, referral_code, referred_by)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'country', ''),
    ref_code,
    CASE 
      WHEN NEW.raw_user_meta_data->>'referred_by' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'referred_by')::UUID
      ELSE NULL
    END
  );
  
  INSERT INTO public.user_balances (user_id)
  VALUES (NEW.id);
  
  IF NEW.raw_user_meta_data->>'referred_by' IS NOT NULL THEN
    INSERT INTO public.referrals (referrer_id, referred_id, status)
    VALUES (
      (NEW.raw_user_meta_data->>'referred_by')::UUID,
      NEW.id,
      'active'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 10: Create trigger for updating referrals timestamp
DROP TRIGGER IF EXISTS update_referrals_updated_at ON public.referrals;
CREATE TRIGGER update_referrals_updated_at BEFORE UPDATE ON public.referrals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 11: Generate referral codes for existing users
SELECT set_referral_codes();

-- Step 12: Grant permissions
GRANT ALL ON public.referrals TO anon, authenticated;

-- ============================================
-- SETUP COMPLETE! 
-- All users now have referral codes.
-- ============================================

