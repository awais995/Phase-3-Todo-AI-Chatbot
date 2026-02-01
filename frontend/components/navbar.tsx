'use client';

import { Menu, Sparkles, BarChart3, Settings, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

export function Navbar() {
  const { isAuthenticated, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Default to home page if loading or not authenticated
  const logoHref = isLoading || !isAuthenticated ? "/" : "/tasks";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 backdrop-blur-xl bg-black/20 shadow-lg">
      <div className="max-w-7xl mx-auto flex h-16 items-center px-4">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden hover:bg-white/10 transition-all duration-300 rounded-lg text-white">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-64 p-0 bg-gradient-to-b from-slate-900 to-purple-900 border-r border-white/10 shadow-2xl"
            >
              <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-purple-900">
                <div className="p-4 border-b border-white/10">
                  <Link href={logoHref} className="flex items-center space-x-3" onClick={() => setMobileMenuOpen(false)}>
                    <div className="p-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg shadow-blue-500/20">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        Productivity Pro
                      </span>
                      <span className="text-xs text-white/60 font-medium">
                        Boost Your Efficiency
                      </span>
                    </div>
                  </Link>
                </div>

                <div className="flex-1 py-6 px-3 space-y-2">
                  <Link
                    href="/tasks"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <BarChart3 className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>

                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                </div>

                <div className="p-4 border-t border-white/10">
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 text-white"
                    onClick={async () => {
                      await api.logout();
                      window.location.href = '/login';
                    }}
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link
            href={logoHref}
            className="hidden md:flex items-center space-x-3 group rounded-lg hover:bg-white/10 p-2 transition-colors"
          >
            <div className="p-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/20">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                Productivity Pro
              </span>
              <span className="text-xs text-white/60 -mt-1 ml-0.5 font-medium">
                Boost Your Efficiency
              </span>
            </div>
          </Link>

          {/* Mobile Logo */}
          <Link
            href={logoHref}
            className="md:hidden flex items-center space-x-3 group rounded-lg hover:bg-white/10 p-2 transition-colors"
          >
            <div className="p-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/20">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 items-center justify-between space-x-8">
          <nav className="flex items-center space-x-8">
            <Link href="/tasks" className="text-white/70 hover:text-white transition-colors font-medium">
              Dashboard
            </Link>

            <Link href="/settings" className="text-white/70 hover:text-white transition-colors font-medium">
              Settings
            </Link>

            <Link href="/profile" className="text-white/70 hover:text-white transition-colors font-medium">
              Profile
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 text-white"
              onClick={async () => {
                await api.logout();
                window.location.href = '/login';
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

              </div>
    </header>
  );
}