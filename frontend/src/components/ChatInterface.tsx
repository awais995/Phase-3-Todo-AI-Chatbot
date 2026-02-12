import React, { useState, useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  userId: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Ensure component is mounted to avoid hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Function to send message to backend
  const sendMessageToBackend = async (message: string, conversationId?: number) => {
    try {
      // Check if window is defined to avoid SSR issues
      if (typeof window === 'undefined') {
        throw new Error('Window is not available');
      }
      
      const token = localStorage.getItem('token'); // Updated to use 'token' key
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Use the proxy path (will be rewritten to backend by next.config.js)
      const response = await fetch(`/api/${userId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message,
          conversation_id: conversationId || null,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        response: "Sorry, I encountered an error processing your request. Please try again.",
        conversation_id: conversationId || 1,
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Add user message to the chat
    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Send message to backend
      const response = await sendMessageToBackend(inputValue);

      // Add assistant response to the chat
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Check if the response indicates a task-related change and trigger a refresh
      const responseText = response.response.toLowerCase();
      if (
        responseText.includes('task') && 
        (responseText.includes('added') || 
         responseText.includes('deleted') || 
         responseText.includes('updated') || 
         responseText.includes('completed') ||
         responseText.includes('removed') ||
         responseText.includes('list') ||  // Added to handle list requests that may affect UI
         responseText.includes('show'))    // Added to handle show requests that may affect UI
      ) {
        // Dispatch a custom event to notify other components that tasks may have changed
        window.dispatchEvent(new CustomEvent('tasks-changed', { detail: { userId } }));
      }
    } catch (error) {
      console.error('Error getting response:', error);

      // Add error message to the chat
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Don't render during SSR to avoid hydration issues
  if (!isMounted) {
    return <div className="flex flex-col h-full bg-white border border-gray-200 rounded-lg shadow-sm"></div>;
  }

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 max-h-[300px]">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p className="mb-2">Ask me to manage your tasks!</p>
            <p className="text-sm">Examples: "Add task: Buy groceries", "Show my tasks"</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
            />
          ))
        )}
        {isLoading && (
          <div className="flex items-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></div>
            </div>
            <span className="ml-2 text-gray-500 text-sm">Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask to manage tasks..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              inputValue.trim() && !isLoading
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;