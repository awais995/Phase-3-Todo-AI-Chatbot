'use client';

import { Home, Plus, Settings, LogOut, BarChart3, User, Bell, Search, Archive, Flag, CheckSquare } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  closeSidebar?: () => void;
  isCollapsed?: boolean;
}

export function ModernSidebar({ closeSidebar, isCollapsed = false }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const navItems = [
    {
      title: 'Dashboard',
      href: '/tasks',
      icon: BarChart3,
      badge: 0
    },
    {
      title: 'My Tasks',
      href: '/tasks/my',
      icon: CheckSquare,
      badge: 5
    },
    {
      title: 'Important',
      href: '/tasks/important',
      icon: Flag,
      badge: 2
    },
    {
      title: 'Completed',
      href: '/tasks/completed',
      icon: CheckSquare,
      badge: 8
    },
    {
      title: 'Archived',
      href: '/tasks/archived',
      icon: Archive,
      badge: 3
    },
  ];

  const secondaryItems = [
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
    },
    {
      title: 'Notifications',
      href: '/notifications',
      icon: Bell,
    },
  ];

  const handleNavClick = (href: string) => {
    if (href.startsWith('/tasks')) {
      router.push(href);
      closeSidebar?.();
    } else if (href === '/settings' || href === '/notifications') {
      router.push(href);
      closeSidebar?.();
    }
  };

  return (
    <div className="flex h-full flex-col bg-white border-r border-gray-200 shadow-lg">
      {/* Logo/Header */}
      {!isCollapsed && (
        <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-md">
              <img
                src="/logo.svg"
                alt="Task Organizer Logo"
                width={24}
                height={24}
                className="text-white drop-shadow-sm"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                TaskFlow
              </span>
              <span className="text-xs text-gray-600 -mt-0.5 font-medium">
                Productivity Suite
              </span>
            </div>
          </div>
        </div>
      )}

      {isCollapsed ? (
        <div className="p-3 border-b border-gray-100">
          <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md flex justify-center">
            <img
              src="/logo.svg"
              alt="Task Organizer Logo"
              width={16}
              height={16}
              className="text-white drop-shadow-sm"
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 space-y-1 py-4 px-3">
          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={cn(
                    'flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-700 group w-full text-left',
                    isActive
                      ? 'bg-indigo-100 text-indigo-700 border-r-2 border-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  )}
                >
                  <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                  <span className="ml-3 flex-1">{item.title}</span>
                  {item.badge > 0 && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Secondary Items */}
          <div className="pt-4 mt-4 border-t border-gray-100">
            <nav className="space-y-1">
              {secondaryItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className={cn(
                      'flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-700 group w-full text-left',
                      isActive
                        ? 'bg-indigo-100 text-indigo-700 border-r-2 border-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                    <span className="ml-3 flex-1">{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* User Profile Section */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 shadow-sm">
            <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || user?.email || 'User'}</p>
              <p className="text-xs text-gray-600 truncate">Free Plan</p>
            </div>
          </div>

          <Button
            variant="ghost"
            className="w-full justify-start rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-200 text-gray-700 mt-2"
            onClick={async () => {
              await api.logout();
              router.push('/login');
              closeSidebar?.();
            }}
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      )}
    </div>
  );
}