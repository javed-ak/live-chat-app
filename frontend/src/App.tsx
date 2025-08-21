import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, MessageCircle } from 'lucide-react';
import io from 'socket.io-client';

interface Message {
  id: string;
  text: string;
  timestamp: number;
  socketId: string;
  guestId: string;
}

function App() {
  const [socket, setSocket] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userCount, setUserCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUserGuestId, setCurrentUserGuestId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Connect to Socket.IO server
    const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
    
    const newSocket = io(serverUrl);
    
    newSocket.on('connect', () => {
      setIsConnected(true);
      setSocket(newSocket);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('existingMessages', (existingMessages: Message[]) => {
      setMessages(existingMessages);
    });

    newSocket.on('userInfo', (userInfo: { guestId: string }) => {
      setCurrentUserGuestId(userInfo.guestId);
    });

    newSocket.on('messageReceived', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('messageExpired', (messageId: string) => {
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    });

    newSocket.on('userCount', (count: number) => {
      setUserCount(count);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && socket && isConnected) {
      socket.emit('newMessage', newMessage);
      setNewMessage('');
      inputRef.current?.focus();
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getTimeRemaining = (timestamp: number) => {
    const elapsed = Date.now() - timestamp;
    const remaining = 5 * 60 * 1000 - elapsed; // 5 minutes - elapsed
    const minutes = Math.floor(remaining / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    return { minutes, seconds, remaining };
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to chat server...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm border-b border-gray-200 p-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-full">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">Let's Chat</h1>
              <p className="text-xs text-gray-500">Messages disappear in 5 minutes</p>
              {currentUserGuestId && (
                <p className="text-xs text-blue-600 font-medium">You are: {currentUserGuestId}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{userCount} online</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 max-w-4xl mx-auto w-full pt-24 pb-24">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 bg-white rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-sm">
              <MessageCircle className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg mb-2">Welcome to Javed's Live Chat!</p>
            <p className="text-gray-400 text-sm">Send a message to start the conversation</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.socketId === socket?.id;
            const timeRemaining = getTimeRemaining(message.timestamp);
            const isExpiringSoon = timeRemaining.remaining < 30000; // 30 seconds

            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} transition-opacity duration-500 ${
                  isExpiringSoon ? 'opacity-50' : 'opacity-100'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                    isOwnMessage
                      ? 'bg-blue-500 text-white rounded-br-md'
                      : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
                  }`}
                >
                  {!isOwnMessage && (
                    <p className={`text-xs font-medium mb-1 ${
                      isOwnMessage ? 'text-blue-200' : 'text-blue-600'
                    }`}>
                      {message.guestId}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed break-words">{message.text}</p>
                  <div className={`flex items-center justify-between mt-1 text-xs ${
                    isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    <span>{formatTime(message.timestamp)}</span>
                    {isExpiringSoon && (
                      <span className="ml-2 font-medium">
                        {timeRemaining.minutes}:{timeRemaining.seconds.toString().padStart(2, '0')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto flex space-x-3">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !isConnected}
            className={`p-3 rounded-full transition-all duration-200 ${
              newMessage.trim() && isConnected
                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;