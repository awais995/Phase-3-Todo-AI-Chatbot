import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
// Import this to ensure all Tailwind classes are processed
import '@/app/tailwind-utils';

export const metadata = {
  title: 'Task Organizer - Organize Your Life',
  description: 'A modern task organization application to help you organize your life and manage tasks efficiently',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
