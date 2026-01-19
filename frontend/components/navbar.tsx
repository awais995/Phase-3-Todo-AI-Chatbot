'use client';

import { Moon, Sun, Menu, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './sidebar';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Default to home page if loading or not authenticated
  const logoHref = isLoading || !isAuthenticated ? "/" : "/tasks";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 border-border shadow-sm">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden hover:bg-primary/10 transition-all duration-300 rounded-lg">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-64 p-0 bg-background border-r border-border shadow-2xl"
            >
              <Sidebar closeSidebar={() => setSidebarOpen(false)} />
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link
            href={logoHref}
            className="flex items-center space-x-3 group rounded-lg hover:bg-muted/30 p-2 transition-colors"
          >
            <div className="p-2.5 bg-gradient-to-r from-primary to-secondary rounded-lg group-hover:scale-105 transition-transform duration-300 shadow-md">
              <img
                src="/logo.svg"
                alt="TaskFlow Logo"
                width={24}
                height={24}
                className="text-white drop-shadow-sm"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                TaskFlow
              </span>
              <span className="text-xs text-muted-foreground -mt-1 ml-0.5 font-medium">
                Organize Your Life
              </span>
            </div>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-lg hover:bg-primary/10 transition-all duration-300"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 transition-transform duration-300 hover:rotate-12" />
            ) : (
              <Moon className="h-5 w-5 transition-transform duration-300 hover:rotate-12" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}