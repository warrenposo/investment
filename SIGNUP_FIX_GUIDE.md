# 🚨 Signup Error Fix Guide

## The Problem
Your signup is failing with error: **"Database error saving new user"**

## Root Cause
The `handle_new_user()` trigger function was updated to include referral fields, but those columns don't exist yet or the migration didn't complete properly.

## ✅ The Solution (2 Simple Steps)

### STEP 1: Fix Signup NOW (Emergency Fix)

1. **Open Supabase Dashboard**
   - Go to your Supabase project
   - Click on **SQL Editor** in the left sidebar

2. **Run the Emergency Fix**
   - Open the file: `fix-signup-emergency.sql`
   - Copy ALL the contents
   - Paste into Supabase SQL Editor
   - Click **"Run"** (green button)

3. **Test Signup**
   - Go to your signup page: `localhost:8000/signup`
   - Try creating an account
   - **It should work now!** ✅

---

### STEP 2: Add Referral System (Optional - After Signup Works)

Only do this AFTER you confirm signup is working!

1. **Run the Referral Migration**
   - Open the file: `add-referrals-after-signup-works.sql`
   - Copy ALL the contents
   - Paste into Supabase SQL Editor
   - Click **"Run"**

2. **Test Referral Features**
   - Log in to your dashboard
   - You should see a "Refer & Earn" section
   - Copy your referral link
   - Test it in an incognito window

---

## 🔍 What Each File Does

### fix-signup-emergency.sql
- Restores the basic `handle_new_user()` function
- Removes dependency on referral columns
- Makes signup work immediately
- Still captures phone and country (basic fields)

### add-referrals-after-signup-works.sql
- Adds `referral_code` and `referred_by` columns
- Creates `referrals` table
- Generates unique referral codes
- Updates `handle_new_user()` to support referrals
- Gives existing users referral codes

---

## 🧪 Testing Steps

### Test Basic Signup (After Step 1)
```
1. Open: localhost:8000/signup
2. Fill in the form:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Phone: 1234567890
   - Country: Kenya
   - Password: password123
3. Click "Create Account"
4. Should redirect to dashboard ✅
```

### Test Referral System (After Step 2)
```
1. Log in to dashboard
2. Find "Refer & Earn" card in Overview tab
3. Copy your referral link
4. Open in incognito/private window
5. Should see: "🎉 You were referred by [Your Name]"
6. Complete signup
7. Check your dashboard - referral count should increase
```

---

## 🐛 Troubleshooting

### Still Getting Signup Error After Step 1?

**Check if columns exist:**
```sql
-- Run this in Supabase SQL Editor
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public';
```

You should see: `id, email, first_name, last_name, phone, country, kyc_status, is_active, created_at, updated_at`

**Check if trigger exists:**
```sql
-- Run this in Supabase SQL Editor
SELECT * FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';
```

Should return 1 row.

### Referral Link Not Working?

**Check if referral columns exist:**
```sql
-- Run this in Supabase SQL Editor
SELECT referral_code, referred_by 
FROM public.users 
LIMIT 1;
```

If you get an error, run `add-referrals-after-signup-works.sql` again.

---

## 📋 Summary

1. ✅ Run `fix-signup-emergency.sql` → Signup works
2. ✅ Test signup → Should succeed
3. ✅ Run `add-referrals-after-signup-works.sql` → Referrals enabled
4. ✅ Test referral link → Should work

---

## 🆘 Need More Help?

If you still have issues:

1. **Check Supabase Logs:**
   - Go to Supabase Dashboard
   - Click "Logs" → "Postgres Logs"
   - Look for errors when you try to sign up

2. **Check Browser Console:**
   - Open DevTools (F12)
   - Go to Console tab
   - Try signing up
   - Look for error messages

3. **Reset Everything:**
   If nothing works, you can reset:
   ```sql
   -- WARNING: This deletes all users!
   DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
   DELETE FROM public.users;
   DELETE FROM auth.users;
   
   -- Then run fix-signup-emergency.sql again
   ```

---

**Good luck! Signup should work now! 🎉**

