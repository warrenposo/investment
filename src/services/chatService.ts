import { supabase } from '@/lib/supabase';

export interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  is_admin_message: boolean;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

class ChatService {
  // Send a message from user
  async sendMessage(userId: string, message: string): Promise<ChatMessage | null> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: userId,
          message: message,
          is_admin_message: false,
          is_read: false
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        return null;
      }

      return data as ChatMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }

  // Send a message from admin to user
  async sendAdminMessage(userId: string, message: string): Promise<ChatMessage | null> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: userId,
          message: message,
          is_admin_message: true,
          is_read: false
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending admin message:', error);
        return null;
      }

      return data as ChatMessage;
    } catch (error) {
      console.error('Error sending admin message:', error);
      return null;
    }
  }

  // Get messages for a specific user
  async getUserMessages(userId: string): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }

      return data as ChatMessage[];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  // Get all messages for admin (grouped by user)
  async getAllMessagesForAdmin(): Promise<{ [userId: string]: ChatMessage[] }> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching all messages:', error);
        console.error('Error details:', error);
        return {};
      }

      console.log('Fetched messages for admin:', data);

      // Group messages by user_id
      const groupedMessages: { [userId: string]: ChatMessage[] } = {};
      data.forEach((message: any) => {
        if (!groupedMessages[message.user_id]) {
          groupedMessages[message.user_id] = [];
        }
        groupedMessages[message.user_id].push(message as ChatMessage);
      });

      console.log('Grouped messages:', groupedMessages);
      return groupedMessages;
    } catch (error) {
      console.error('Error fetching all messages:', error);
      return {};
    }
  }

  // Mark messages as read
  async markMessagesAsRead(userId: string, isAdmin: boolean = false): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_admin_message', !isAdmin); // Mark admin messages as read if user, vice versa

      if (error) {
        console.error('Error marking messages as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      return false;
    }
  }

  // Get unread message count for user
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_admin_message', true)
        .eq('is_read', false);

      if (error) {
        console.error('Error getting unread count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  // Get all users with unread messages for admin
  async getUsersWithUnreadMessages(): Promise<{ userId: string; count: number }[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('user_id')
        .eq('is_admin_message', false)
        .eq('is_read', false);

      if (error) {
        console.error('Error getting users with unread messages:', error);
        return [];
      }

      // Count unread messages per user
      const unreadByUser: { [userId: string]: number } = {};
      data.forEach((message: any) => {
        unreadByUser[message.user_id] = (unreadByUser[message.user_id] || 0) + 1;
      });

      return Object.entries(unreadByUser).map(([userId, count]) => ({
        userId,
        count
      }));
    } catch (error) {
      console.error('Error getting users with unread messages:', error);
      return [];
    }
  }

  // Subscribe to new messages for a user
  subscribeToMessages(userId: string, callback: (message: ChatMessage) => void) {
    const subscription = supabase
      .channel(`chat_messages_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new as ChatMessage);
        }
      )
      .subscribe();

    return subscription;
  }

  // Subscribe to all messages for admin
  subscribeToAllMessages(callback: (message: ChatMessage) => void) {
    const subscription = supabase
      .channel('all_chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        },
        (payload) => {
          callback(payload.new as ChatMessage);
        }
      )
      .subscribe();

    return subscription;
  }
}

export default new ChatService();

