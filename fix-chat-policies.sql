-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can insert own messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Admin can insert messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Admin can update messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can update own message read status" ON public.chat_messages;

-- Recreate policies with fixed admin check

-- Policy: Users can view their own messages or admin can view all
CREATE POLICY "Users can view own messages" ON public.chat_messages
  FOR SELECT
  USING (
    auth.uid() = user_id 
    OR 
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'warrenokumu98@gmail.com'
    )
  );

-- Policy: Users can insert their own messages
CREATE POLICY "Users can insert own messages" ON public.chat_messages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id AND is_admin_message = FALSE);

-- Policy: Admin can insert messages for any user
CREATE POLICY "Admin can insert messages" ON public.chat_messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'warrenokumu98@gmail.com'
    )
  );

-- Policy: Admin can update any message
CREATE POLICY "Admin can update messages" ON public.chat_messages
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'warrenokumu98@gmail.com'
    )
  );

-- Policy: Users can update read status of their messages
CREATE POLICY "Users can update own message read status" ON public.chat_messages
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

