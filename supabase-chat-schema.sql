-- Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_admin_message BOOLEAN DEFAULT FALSE,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_is_read ON public.chat_messages(is_read);

-- Enable Row Level Security
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

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

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_chat_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_chat_messages_timestamp
  BEFORE UPDATE ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_messages_updated_at();

-- Create a view for unread message counts per user
CREATE OR REPLACE VIEW public.unread_message_counts AS
SELECT 
  user_id,
  COUNT(*) FILTER (WHERE NOT is_read AND NOT is_admin_message) as unread_from_user,
  COUNT(*) FILTER (WHERE NOT is_read AND is_admin_message) as unread_from_admin
FROM public.chat_messages
GROUP BY user_id;

-- Grant access to the view
GRANT SELECT ON public.unread_message_counts TO authenticated;

