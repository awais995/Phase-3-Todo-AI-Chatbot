// app/chat/layout.tsx
import { ProtectedRoute } from '@/components/protected-route';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="h-full">
        {children}
      </div>
    </ProtectedRoute>
  );
}