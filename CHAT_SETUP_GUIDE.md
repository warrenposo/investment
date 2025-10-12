# Chat Functionality Setup Guide

## Overview
This guide explains how to set up the real-time chat functionality that allows users to communicate with administrators.

## Features
- ✅ Real-time messaging between users and admin
- ✅ Unread message indicators
- ✅ Message history
- ✅ Admin can view all user conversations
- ✅ Admin can reply to any user
- ✅ Floating chat box for users
- ✅ Full chat interface for admin
- ✅ Real-time updates using Supabase subscriptions

## Database Setup

### Step 1: Run the SQL Schema
Execute the SQL script to create the necessary tables and policies:

```bash
# Run this in your Supabase SQL Editor
cat supabase-chat-schema.sql
```

Or copy and paste the contents of `supabase-chat-schema.sql` into the Supabase SQL Editor and execute it.

### Step 2: Verify Tables
After running the script, verify the following tables exist:
- `chat_messages` - Stores all chat messages
- `unread_message_counts` - View for counting unread messages

### Step 3: Check RLS Policies
Ensure the following Row Level Security policies are enabled:
- ✅ Users can view their own messages
- ✅ Users can insert their own messages
- ✅ Admin can insert messages for any user
- ✅ Admin can update any message
- ✅ Users can update read status of their messages

## How It Works

### For Users (Dashboard)
1. A floating chat button appears in the bottom-right corner
2. Click the button to open the chat window
3. Users can send messages to support
4. Unread message count is displayed on the button
5. Messages are updated in real-time

### For Admin (Admin Dashboard)
1. Navigate to the "User Messages" tab
2. View all users who have sent messages
3. See unread message counts for each user
4. Click on a user to view their conversation
5. Reply to messages in real-time
6. Messages automatically mark as read when viewed

## File Structure

### Services
- `src/services/chatService.ts` - Chat operations and real-time subscriptions

### Components
- `src/components/ChatBox.tsx` - Floating chat box for users
- `src/components/AdminChat.tsx` - Admin chat interface

### Pages
- `src/pages/Dashboard.tsx` - Includes ChatBox component
- `src/pages/AdminDashboard.tsx` - Includes AdminChat in tabs

## Usage

### User Side
```typescript
// ChatBox is automatically included in Dashboard.tsx
import ChatBox from "@/components/ChatBox";

// In your component render:
<ChatBox />
```

### Admin Side
```typescript
// AdminChat is automatically included in AdminDashboard.tsx
import AdminChat from "@/components/AdminChat";

// In your component render:
<AdminChat />
```

## API Reference

### ChatService Methods

#### sendMessage(userId: string, message: string)
Sends a message from a user.

#### sendAdminMessage(userId: string, message: string)
Sends a message from admin to a user.

#### getUserMessages(userId: string)
Gets all messages for a specific user.

#### getAllMessagesForAdmin()
Gets all messages grouped by user (admin only).

#### markMessagesAsRead(userId: string, isAdmin: boolean)
Marks messages as read.

#### getUnreadCount(userId: string)
Gets unread message count for a user.

#### getUsersWithUnreadMessages()
Gets all users with unread messages (admin only).

#### subscribeToMessages(userId: string, callback)
Subscribes to new messages for a user.

#### subscribeToAllMessages(callback)
Subscribes to all new messages (admin only).

## Real-time Updates

The chat system uses Supabase Realtime to provide instant message delivery:

- **User Side**: Subscribes to messages for their own user ID
- **Admin Side**: Subscribes to all messages across all users
- Messages appear instantly without page refresh

## Styling

The chat components use Tailwind CSS and shadcn/ui components for styling:
- Responsive design
- Dark mode support
- Mobile-friendly
- Smooth animations

## Troubleshooting

### Messages not appearing in real-time
1. Check if Supabase Realtime is enabled in your project settings
2. Verify the subscription is properly set up
3. Check browser console for WebSocket errors

### Permission errors
1. Verify RLS policies are correctly set up
2. Check if the user is authenticated
3. Verify admin email matches in policies

### Messages not saving
1. Check if the `chat_messages` table exists
2. Verify RLS policies allow INSERT operations
3. Check browser console for errors

## Security Considerations

- ✅ Row Level Security (RLS) is enabled
- ✅ Users can only view their own messages
- ✅ Only admin can view all messages
- ✅ Users cannot send messages as admin
- ✅ Users cannot modify admin messages

## Future Enhancements

Potential features to add:
- File attachments
- Message reactions
- Typing indicators
- Message search
- Conversation archiving
- Email notifications for new messages
- Message templates for admin
- Conversation ratings

## Support

If you encounter any issues with the chat functionality:
1. Check the browser console for errors
2. Verify database schema is correctly set up
3. Check RLS policies in Supabase
4. Ensure real-time is enabled in Supabase project settings

