import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, X, Send } from 'lucide-react';
import ChatService, { ChatMessage } from '@/services/chatService';
import SupabaseService from '@/services/supabaseService';

interface ChatBoxProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ChatBox = ({ isOpen: externalIsOpen, onOpenChange }: ChatBoxProps = {}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = onOpenChange || setInternalIsOpen;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load user and messages
  useEffect(() => {
    const loadUserAndMessages = async () => {
      const user = await SupabaseService.getCurrentUser();
      if (user) {
        setUserId(user.id);
        await loadMessages(user.id);
        await loadUnreadCount(user.id);
      }
    };

    loadUserAndMessages();
  }, []);

  // Subscribe to new messages
  useEffect(() => {
    if (!userId) return;

    const subscription = ChatService.subscribeToMessages(userId, (message) => {
      setMessages((prev) => [...prev, message]);
      if (message.is_admin_message && !isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
      scrollToBottom();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, isOpen]);

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (isOpen && userId) {
      ChatService.markMessagesAsRead(userId, false);
      setUnreadCount(0);
    }
  }, [isOpen, userId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async (uid: string) => {
    const msgs = await ChatService.getUserMessages(uid);
    setMessages(msgs);
  };

  const loadUnreadCount = async (uid: string) => {
    const count = await ChatService.getUnreadCount(uid);
    setUnreadCount(count);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !userId || isSending) return;

    setIsSending(true);
    const message = await ChatService.sendMessage(userId, newMessage.trim());
    
    if (message) {
      setMessages((prev) => [...prev, message]);
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

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform relative"
            size="icon"
          >
            <MessageCircle className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)]">
          <Card className="shadow-2xl border-2">
            <CardHeader className="bg-primary text-primary-foreground p-4 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Support Chat
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="p-0">
              {/* Messages Area */}
              <div className="h-[400px] overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No messages yet</p>
                      <p className="text-xs">Send a message to get started</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.is_admin_message ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-lg px-4 py-2 ${
                            message.is_admin_message
                              ? 'bg-white dark:bg-gray-800 text-foreground'
                              : 'bg-primary text-primary-foreground'
                          }`}
                        >
                          {message.is_admin_message && (
                            <p className="text-xs font-semibold mb-1 opacity-70">Support</p>
                          )}
                          <p className="text-sm break-words">{message.message}</p>
                          <p className={`text-xs mt-1 ${
                            message.is_admin_message ? 'text-muted-foreground' : 'opacity-70'
                          }`}>
                            {formatTime(message.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="p-4 border-t bg-white dark:bg-gray-950">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                    disabled={isSending}
                  />
                  <Button type="submit" size="icon" disabled={isSending || !newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ChatBox;

