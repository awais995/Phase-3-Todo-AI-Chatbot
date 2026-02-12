// components/FloatingChatWidget.tsx
'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, Bot } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ChatInterface from '@/src/components/ChatInterface';

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Ensure component is mounted to avoid hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything during SSR or if not authenticated
  if (!isMounted) {
    // Return the same structure as the client-side render to avoid hydration mismatch
    return <div className="hidden"></div>;
  }

  if (!isAuthenticated || !user) {
    return null; // Don't render if not authenticated
  }

  return (
    <>
      {/* Floating chat button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          aria-label="Open AI Task Assistant"
        >
          <div className="relative">
            <Bot className="h-6 w-6" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
        </button>
      )}

      {/* Chat widget popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 h-[450px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col max-h-[80vh]">
          {/* Header */}
          <div className="bg-blue-600 text-white p-2 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bot className="h-4 w-4" />
              <h3 className="font-medium text-sm">AI Task Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-700 rounded-full p-1 transition-colors"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Chat content */}
          <div className="flex-1 overflow-hidden p-2">
            <ChatInterface userId={user.id} />
          </div>
        </div>
      )}
    </>
  );
}