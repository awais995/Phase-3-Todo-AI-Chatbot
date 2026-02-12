'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ChatMePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        router.push('/auth/login');
      } else if (user && user.id) {
        // Redirect to the user's specific chat page
        router.replace(`/chat/${user.id}`);
      }
    }
  }, [isAuthenticated, user, isLoading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <p className="text-lg text-gray-600">Redirecting to your AI assistant...</p>
      </div>
    </div>
  );
}