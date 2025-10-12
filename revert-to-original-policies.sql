-- This reverts the policies back to the original version
-- (The version that was in supabase-chat-schema.sql originally)

-- Drop the fixed policies
DROP POLICY IF EXISTS "Users can view own messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can insert own messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Admin can insert messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Admin can update messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can update own message read status" ON public.chat_messages;

-- Recreate with original version (using auth.email())
-- Note: These were the original policies, but they may not work properly

-- Policy: Users can view their own messages
CREATE POLICY "Users can view own messages" ON public.chat_messages
  FOR SELECT
  USING (auth.uid() = user_id OR auth.email() = 'warrenokumu98@gmail.com');

-- Policy: Users can insert their own messages
CREATE POLICY "Users can insert own messages" ON public.chat_messages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id AND is_admin_message = FALSE);

-- Policy: Admin can insert messages for any user
CREATE POLICY "Admin can insert messages" ON public.chat_messages
  FOR INSERT
  WITH CHECK (auth.email() = 'warrenokumu98@gmail.com');

-- Policy: Admin can update any message
CREATE POLICY "Admin can update messages" ON public.chat_messages
  FOR UPDATE
  USING (auth.email() = 'warrenokumu98@gmail.com');

-- Policy: Users can update read status of their messages
CREATE POLICY "Users can update own message read status" ON public.chat_messages
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Success message
SELECT 'Policies reverted to original version' as status;

