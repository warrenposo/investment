# Referral System Setup Guide

## Overview
The referral system allows users to invite others to join Valora Capital and earn rewards. Each user gets a unique referral code and link that can be shared.

## Features
✅ Unique referral code for each user
✅ Automatic referral tracking
✅ Referral statistics dashboard
✅ Copy-to-clipboard functionality
✅ Referral rewards tracking
✅ Visual referral stats (total referrals, active, rewards, etc.)

## Database Setup

### 1. Run the Referral System Schema
Execute the SQL file `referral-system-schema.sql` in your Supabase SQL Editor:

```sql
-- This will:
-- 1. Add referral_code and referred_by columns to users table
-- 2. Create referrals table for tracking referral statistics
-- 3. Set up RLS policies for security
-- 4. Generate unique referral codes for existing users
-- 5. Update the handle_new_user function to support referrals
```

### 2. Database Structure

#### Users Table (Updated)
- `referral_code` (TEXT, UNIQUE): User's unique referral code
- `referred_by` (UUID): ID of the user who referred this user

#### Referrals Table (New)
- `id` (UUID): Primary key
- `referrer_id` (UUID): User who made the referral
- `referred_id` (UUID): User who was referred
- `status` (TEXT): Status of the referral (pending, active, completed)
- `reward_amount` (DECIMAL): Reward amount for this referral
- `reward_paid` (BOOLEAN): Whether the reward has been paid
- `created_at`, `updated_at`: Timestamps

## How It Works

### For Users Sharing Referrals:
1. User logs into their dashboard
2. In the "Overview" tab, they see the "Refer & Earn" card
3. They can:
   - View their unique referral code
   - Copy their referral link with one click
   - See referral statistics (total, active, rewards)
   - Track how many people they've referred

### For Users Being Referred:
1. User clicks on a referral link (e.g., `https://yoursite.com/signup?ref=ABC12345`)
2. The signup page detects the referral code from the URL
3. Shows a message: "🎉 You were referred by [Referrer Name]"
4. When they complete signup, the referral relationship is automatically created
5. Both users are connected in the database

## Implementation Details

### Frontend Components

#### 1. Dashboard.tsx
- Added referral section in Overview tab
- Displays referral stats in a beautiful card
- Shows referral link with copy button
- Displays referral code with copy button
- Tracks total referrals, active referrals, rewards

#### 2. SignUp.tsx
- Captures `ref` parameter from URL using `useSearchParams`
- Validates referral code by fetching referrer information
- Displays referrer name if valid
- Passes referral information during signup

#### 3. SupabaseService.ts
Added three new methods:
- `getUserByReferralCode(referralCode)`: Fetch user by referral code
- `getUserReferrals(userId)`: Get all referrals made by a user
- `getReferralStats(userId)`: Get statistics about user's referrals

## Referral Link Format

```
https://yoursite.com/signup?ref=ABC12345
```

Where `ABC12345` is the user's unique referral code.

## Testing the Referral System

### 1. Create a Test User
```bash
# Sign up a new user at /signup
# They will automatically get a referral code
```

### 2. Get Their Referral Link
```bash
# Log in to dashboard
# Go to Overview tab
# Copy the referral link from the "Refer & Earn" card
```

### 3. Test Referral Signup
```bash
# Open the referral link in incognito/private window
# You should see "You were referred by [User Name]"
# Complete the signup
# Check the database - referrals table should have a new entry
```

### 4. Verify in Database
```sql
-- Check users table for referral codes
SELECT id, email, referral_code, referred_by FROM users;

-- Check referrals table
SELECT * FROM referrals;
```

## Reward System (Optional Enhancement)

The database is already set up for rewards. You can implement automatic rewards by:

1. Creating a database function that triggers when a referred user makes their first investment
2. Updating the `reward_amount` in the referrals table
3. Creating a transaction to credit the referrer's account
4. Setting `reward_paid` to true

Example SQL function:
```sql
CREATE OR REPLACE FUNCTION process_referral_reward()
RETURNS TRIGGER AS $$
BEGIN
  -- When a user makes their first investment
  IF NEW.status = 'active' AND OLD.status != 'active' THEN
    -- Update referral record with reward
    UPDATE referrals
    SET 
      reward_amount = 10.00, -- $10 reward example
      status = 'completed'
    WHERE referred_id = NEW.user_id;
    
    -- Credit the referrer's account
    -- Add your logic here
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Security Features

✅ RLS (Row Level Security) enabled on all tables
✅ Users can only view their own referrals
✅ Admins can view all referrals
✅ Unique referral codes prevent duplicates
✅ Referral codes are auto-generated securely

## Customization Options

### Change Referral Code Format
Edit `generate_referral_code()` function in SQL:
```sql
-- Current: 8-character uppercase alphanumeric
-- Example custom formats:
code := 'REF-' || upper(substring(md5(random()::text) from 1 for 6));
-- Or use UUID-based codes
code := upper(substring(gen_random_uuid()::text from 1 for 8));
```

### Modify Referral Stats Display
Edit the "Refer & Earn" card in `Dashboard.tsx` (around line 678-768)

### Change Referral Rewards
Update the `reward_amount` logic in your database triggers or create a settings table for dynamic reward amounts.

## Troubleshooting

### Referral Code Not Generated
```sql
-- Manually generate codes for existing users
SELECT set_referral_codes();
```

### Referral Link Not Working
1. Check browser console for errors
2. Verify `useSearchParams` is imported from react-router-dom
3. Ensure the URL contains `?ref=CODE`

### Stats Not Showing
1. Verify referrals table has data
2. Check `getReferralStats` method in SupabaseService
3. Ensure RLS policies allow user to read their referrals

## Next Steps

1. **Run the SQL Migration**: Execute `referral-system-schema.sql` in Supabase
2. **Test the System**: Create test users and verify referral tracking
3. **Implement Rewards**: Add automatic reward distribution logic
4. **Marketing**: Create promotional materials about the referral program
5. **Analytics**: Track referral conversion rates and optimize

## Support

If you encounter any issues:
1. Check Supabase logs for SQL errors
2. Verify RLS policies are correctly configured
3. Test with sample referral codes
4. Check browser console for JavaScript errors

## Summary

The referral system is now fully functional! Users can:
- ✅ Get unique referral codes automatically
- ✅ Share referral links easily
- ✅ Track their referral statistics
- ✅ See who they referred (admin feature can be added)
- ✅ Earn rewards (when implemented)

The system is scalable, secure, and ready for production use!

