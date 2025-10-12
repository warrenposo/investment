import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, User } from 'lucide-react';
import ChatService, { ChatMessage } from '@/services/chatService';
import SupabaseService from '@/services/supabaseService';

interface UserChatData {
  userId: string;
  userName: string;
  userEmail: string;
  messages: ChatMessage[];
  unreadCount: number;
}

const AdminChat = () => {
  const [userChats, setUserChats] = useState<UserChatData[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadAllChats();
  }, []);

  // Subscribe to new messages
  useEffect(() => {
    const subscription = ChatService.subscribeToAllMessages((message) => {
      setUserChats((prevChats) => {
        const existingUserIndex = prevChats.findIndex(chat => chat.userId === message.user_id);
        
        if (existingUserIndex >= 0) {
          const updatedChats = [...prevChats];
          updatedChats[existingUserIndex].messages.push(message);
          
          // Increment unread count if message is from user and not currently selected
          if (!message.is_admin_message && message.user_id !== selectedUser) {
            updatedChats[existingUserIndex].unreadCount += 1;
          }
          
          return updatedChats;
        }
        
        return prevChats;
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedUser]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [selectedUser, userChats]);

  // Mark messages as read when user is selected
  useEffect(() => {
    if (selectedUser) {
      ChatService.markMessagesAsRead(selectedUser, true);
      setUserChats((prevChats) =>
        prevChats.map((chat) =>
          chat.userId === selectedUser ? { ...chat, unreadCount: 0 } : chat
        )
      );
    }
  }, [selectedUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadAllChats = async () => {
    try {
      setLoading(true);
      
      console.log('Loading all chats...');
      
      // Get all users
      const allUsers = await SupabaseService.getAllUsers();
      console.log('All users:', allUsers);
      
      // Get all messages grouped by user
      const allMessages = await ChatService.getAllMessagesForAdmin();
      console.log('All messages:', allMessages);
      
      // Get unread counts
      const unreadUsers = await ChatService.getUsersWithUnreadMessages();
      console.log('Unread users:', unreadUsers);
      const unreadMap = Object.fromEntries(
        unreadUsers.map(u => [u.userId, u.count])
      );
      
      // Combine data
      const chatsData: UserChatData[] = allUsers
        .map(user => ({
          userId: user.id,
          userName: `${user.first_name} ${user.last_name}`,
          userEmail: user.email,
          messages: allMessages[user.id] || [],
          unreadCount: unreadMap[user.id] || 0
        }))
        .filter(chat => chat.messages.length > 0) // Only show users with messages
        .sort((a, b) => {
          // Sort by latest message
          const aLatest = a.messages[a.messages.length - 1]?.created_at || '';
          const bLatest = b.messages[b.messages.length - 1]?.created_at || '';
          return bLatest.localeCompare(aLatest);
        });
      
      console.log('Processed chats data:', chatsData);
      setUserChats(chatsData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading chats:', error);
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedUser || isSending) return;

    setIsSending(true);
    const message = await ChatService.sendAdminMessage(selectedUser, newMessage.trim());
    
    if (message) {
      setUserChats((prevChats) =>
        prevChats.map((chat) =>
          chat.userId === selectedUser
            ? { ...chat, messages: [...chat.messages, message] }
            : chat
        )
      );
      setNewMessage('');
      scrollToBottom();
    }
    
    setIsSending(false);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + 
           date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const selectedUserChat = userChats.find(chat => chat.userId === selectedUser);
  const totalUnread = userChats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-muted-foreground">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
      {/* Users List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Messages</span>
            {totalUnread > 0 && (
              <Badge variant="destructive">{totalUnread}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y max-h-[calc(100vh-400px)] overflow-y-auto">
            {userChats.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No messages yet</p>
              </div>
            ) : (
              userChats.map((chat) => (
                <button
                  key={chat.userId}
                  onClick={() => setSelectedUser(chat.userId)}
                  className={`w-full p-4 text-left hover:bg-muted transition-colors ${
                    selectedUser === chat.userId ? 'bg-muted' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{chat.userName}</p>
                        <p className="text-xs text-muted-foreground truncate">{chat.userEmail}</p>
                      </div>
                    </div>
                    {chat.unreadCount > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {chat.unreadCount}
                      </Badge>
                    )}
                  </div>
                  {chat.messages.length > 0 && (
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {chat.messages[chat.messages.length - 1].message}
                    </p>
                  )}
                </button>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="lg:col-span-2">
        {selectedUserChat ? (
          <>
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{selectedUserChat.userName}</CardTitle>
                  <p className="text-sm text-muted-foreground">{selectedUserChat.userEmail}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 flex flex-col h-[calc(100vh-500px)]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
                {selectedUserChat.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.is_admin_message ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg px-4 py-2 ${
                        message.is_admin_message
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-white dark:bg-gray-800 text-foreground'
                      }`}
                    >
                      {!message.is_admin_message && (
                        <p className="text-xs font-semibold mb-1 opacity-70">{selectedUserChat.userName}</p>
                      )}
                      <p className="text-sm break-words">{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        message.is_admin_message ? 'opacity-70' : 'text-muted-foreground'
                      }`}>
                        {formatTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t bg-white dark:bg-gray-950">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1"
                    disabled={isSending}
                  />
                  <Button type="submit" size="icon" disabled={isSending || !newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold mb-2">No conversation selected</p>
              <p className="text-sm">Select a user from the list to view messages</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminChat;

