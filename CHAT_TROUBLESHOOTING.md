# Chat Functionality Troubleshooting Guide

## Issue: Admin Cannot See User Messages

### Symptoms
- User can send messages from dashboard
- Messages appear in user's chat box
- Admin dashboard shows "No messages yet"
- No conversations appear in admin panel

### Solution Steps

#### Step 1: Fix the RLS Policies
The original RLS policies might not work correctly because `auth.email()` function has issues in Supabase.

**Run this SQL in Supabase SQL Editor:**

```sql
-- Execute the fix-chat-policies.sql file
-- Or copy and paste the contents below:
```

Copy the contents of `fix-chat-policies.sql` and run it in your Supabase SQL Editor.

#### Step 2: Verify the Table Exists
In Supabase, go to **Table Editor** and verify:
- ✅ `chat_messages` table exists
- ✅ It has these columns:
  - `id` (uuid)
  - `user_id` (uuid)
  - `message` (text)
  - `is_admin_message` (boolean)
  - `is_read` (boolean)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

#### Step 3: Check Console Logs
1. Open your browser's **Developer Console** (F12)
2. Go to the **User Messages** tab in Admin Dashboard
3. Look for these logs:
   - "Loading all chats..."
   - "All users:" (should show array of users)
   - "All messages:" (should show object with messages)
   - "Fetched messages for admin:" (should show array of messages)

#### Step 4: Test the RLS Policies Directly

Run this SQL query in Supabase SQL Editor while logged in as admin:

```sql
-- This should return all messages
SELECT * FROM chat_messages;
```

If this returns no results, the policies are blocking you.

#### Step 5: Temporary Fix - Disable RLS (For Testing Only)

⚠️ **WARNING: Only do this for testing, never in production!**

```sql
-- Temporarily disable RLS to test if that's the issue
ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;
```

If messages appear after this, the problem is with the RLS policies.

**Re-enable RLS after testing:**
```sql
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
```

#### Step 6: Verify Admin Email

Make sure you're logged in with the correct admin email: `warrenokumu98@gmail.com`

Check in browser console:
```javascript
// Run this in browser console
const { data: { user } } = await supabase.auth.getUser();
console.log('Current user email:', user?.email);
```

### Alternative Solution: Use Service Role Key

If RLS policies continue to cause issues, you can create an admin-only endpoint:

1. Create a Supabase Edge Function (server-side)
2. Use the service role key (bypasses RLS)
3. Call this function from admin dashboard

### Quick Debug Checklist

- [ ] SQL schema executed successfully
- [ ] `chat_messages` table exists
- [ ] RLS is enabled on the table
- [ ] Fixed policies have been applied
- [ ] Logged in as admin (warrenokumu98@gmail.com)
- [ ] User has sent at least one message
- [ ] Browser console shows no errors
- [ ] Network tab shows successful API calls

### Common Errors and Solutions

#### Error: "relation public.chat_messages does not exist"
**Solution:** Run the `supabase-chat-schema.sql` script

#### Error: "permission denied for table chat_messages"
**Solution:** Run the `fix-chat-policies.sql` script

#### Error: "new row violates row-level security policy"
**Solution:** Check that user is authenticated and policies allow the operation

#### Messages appear after disabling RLS but not with RLS enabled
**Solution:** The RLS policies need to be updated. Use the fixed policies in `fix-chat-policies.sql`

### Test Query

Run this in Supabase SQL Editor to see if messages exist:

```sql
-- Check if any messages exist
SELECT 
  cm.*,
  au.email as sender_email
FROM chat_messages cm
LEFT JOIN auth.users au ON au.id = cm.user_id
ORDER BY cm.created_at DESC
LIMIT 10;
```

### Manual Policy Test

Test if the policy works for your admin user:

```sql
-- Replace 'your-admin-user-id' with your actual user ID
SELECT EXISTS (
  SELECT 1 FROM auth.users 
  WHERE auth.users.id = 'your-admin-user-id' 
  AND auth.users.email = 'warrenokumu98@gmail.com'
);
-- Should return: true
```

### Need More Help?

If the issue persists:
1. Check Supabase logs in Dashboard
2. Enable PostgreSQL logging in Supabase settings
3. Check Network tab in browser for failed requests
4. Verify all environment variables are set correctly
5. Try creating a test message directly in Supabase Table Editor

