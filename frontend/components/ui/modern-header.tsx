'use client';

import { Moon, Sun, Menu, Search, Bell, User, Grid3X3, Plus, Calendar, BarChart3 } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ModernSidebar } from './modern-sidebar';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function ModernHeader() {
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden hover:bg-indigo-100 transition-all duration-300 rounded-lg text-gray-700">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-64 p-0 bg-white border-r shadow-xl"
            >
              <ModernSidebar closeSidebar={() => setSidebarOpen(false)} />
            </SheetContent>
          </Sheet>

          {/* Breadcrumb-like navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-500">/</span>
            <Button variant="ghost" size="sm" className="h-8 px-2 hover:bg-gray-100">
              Dashboard
            </Button>
            <span className="text-sm text-gray-500">/</span>
            <span className="text-sm font-medium text-gray-700">Tasks</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64">
            <Search className="h-4 w-4 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="bg-transparent border-none outline-none text-sm flex-1 placeholder-gray-500"
            />
          </div>

          {/* Quick Actions */}
          <div className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
              <Calendar className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
              <BarChart3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-lg hover:bg-indigo-100 transition-all duration-300 text-gray-700"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 transition-transform duration-300 hover:rotate-12" />
              ) : (
                <Moon className="h-5 w-5 transition-transform duration-300 hover:rotate-12" />
              )}
            </Button>

            <Button variant="ghost" size="sm" className="hidden md:flex h-8 px-2 hover:bg-gray-100 relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
            </Button>

            <div className="hidden md:flex items-center gap-2 pl-2 border-l border-gray-200">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || user?.photo_url || undefined} alt={user?.name || user?.email || 'User'} />
                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                  {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden lg:block text-gray-700">
                {user?.name || user?.email}
              </span>
            </div>

            {/* Mobile User Button */}
            <Button variant="ghost" size="icon" className="md:hidden hover:bg-gray-100">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}