-- This script completely removes the chat functionality from the database
-- WARNING: This will delete all chat messages permanently!

-- Drop the view
DROP VIEW IF EXISTS public.unread_message_counts;

-- Drop the trigger
DROP TRIGGER IF EXISTS update_chat_messages_timestamp ON public.chat_messages;

-- Drop the function
DROP FUNCTION IF EXISTS update_chat_messages_updated_at();

-- Drop all policies
DROP POLICY IF EXISTS "Users can view own messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can insert own messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Admin can insert messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Admin can update messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can update own message read status" ON public.chat_messages;

-- Drop the table (this deletes all messages!)
DROP TABLE IF EXISTS public.chat_messages;

-- Success message
SELECT 'Chat functionality has been completely removed from the database' as status;

