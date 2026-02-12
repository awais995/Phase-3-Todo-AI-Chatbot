'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ChatInterface from '../../../src/components/ChatInterface';
import { useAuth } from '../../../contexts/AuthContext';
import { redirect } from 'next/navigation';

export default function ChatPage() {
  const { userId } = useParams();
  const { user, isAuthenticated, isLoading } = useAuth(); // Assuming you have an auth context
  const [isValidUser, setIsValidUser] = useState(false);

  // Check if the user is authenticated and if the userId matches
  useEffect(() => {
    // Wait for auth check to complete
    if (isLoading) return;

    if (!isAuthenticated) {
      // We can't redirect directly in a client component in app router
      // Instead, we'll handle this in the rendering logic
      setIsValidUser(false);
    } else if (user && Array.isArray(userId) ? userId[0] !== user.id : userId !== user.id) {
      // If the userId in the URL doesn't match the authenticated user
      // We'll handle this in the rendering logic
      setIsValidUser(false);
    } else {
      setIsValidUser(true);
    }
  }, [isAuthenticated, user, userId, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Check if the userId in the URL matches the authenticated user
  const actualUserId = Array.isArray(userId) ? userId[0] : userId;
  if (user && user.id !== actualUserId) {
    // Redirect to the correct chat page for the authenticated user
    if (typeof window !== 'undefined') {
      window.location.href = `/chat/${user.id}`;
    }
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600">Redirecting to your chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Task Assistant</h1>
        <p className="text-gray-600">Manage your tasks using natural language</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <ChatInterface userId={actualUserId} />
      </div>
      
      <div className="mt-6 text-sm text-gray-500 text-center">
        <p>You can ask me things like:</p>
        <ul className="flex flex-wrap justify-center gap-2 mt-2">
          <li className="bg-blue-50 px-3 py-1 rounded-full">"Add a task to buy groceries"</li>
          <li className="bg-blue-50 px-3 py-1 rounded-full">"Show my pending tasks"</li>
          <li className="bg-blue-50 px-3 py-1 rounded-full">"Complete the first task"</li>
          <li className="bg-blue-50 px-3 py-1 rounded-full">"Update task description"</li>
        </ul>
      </div>
    </div>
  );
}