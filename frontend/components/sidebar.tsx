'use client';

import { Home, Plus, Settings, LogOut, Calendar, BarChart3, User, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface SidebarProps {
  closeSidebar?: () => void;
}

export function Sidebar({ closeSidebar }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      title: 'Tasks',
      href: '/tasks',
      icon: BarChart3,
    },
    {
      title: 'Add Task',
      href: '#',
      icon: Plus,
    },
  ];

  const handleNavClick = (href: string) => {
    if (href === '#') {
      // For the "Add Task" option, trigger the task creation modal directly
      router.push('/tasks'); // Navigate to tasks page first
      // Trigger the custom event to open the task form
      window.dispatchEvent(new CustomEvent('open-add-task'));
      closeSidebar();
    } else if (href === '/tasks') {
      // For the "Tasks" option, just navigate to the tasks page
      router.push('/tasks');
      closeSidebar();
    } else if (href === '/chat') {
      // For the "AI Assistant" option, navigate to the chat page
      // Redirect to the dynamic route that will handle user authentication
      router.push('/chat/me');
      closeSidebar();
    } else if (href === '/settings') {
      // For the "Settings" option, navigate to the settings page
      router.push('/settings');
      closeSidebar();
    } else {
      if (closeSidebar) {
        closeSidebar();
      }
    }
  };

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-slate-900 to-purple-900">
      {/* Logo/Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg shadow-blue-500/20">
            <img
              src="/logo.svg"
              alt="Productivity Pro Logo"
              width={24}
              height={24}
              className="text-white drop-shadow-sm"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Productivity Pro
            </span>
            <span className="text-xs text-white/60 -mt-1 ml-0.5 font-medium">
              Boost Your Efficiency
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-1 py-6 px-3">
        <nav className="grid items-start gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === '/tasks' && pathname.startsWith('/tasks'));
            // Special case: Add Task should be highlighted when on the tasks page
            const isAddTaskActive = item.title === 'Add Task' && pathname.startsWith('/tasks');
            const Icon = item.icon;

            return (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  'flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 hover:bg-white/10 hover:text-white group w-full text-left',
                  item.href === '#' ?
                    (isAddTaskActive
                      ? 'bg-white/20 text-white'
                      : 'text-white/70')
                    :
                    (isActive
                      ? 'bg-white/20 text-white'
                      : 'text-white/70')
                )}
              >
                <Icon className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="flex-1">{item.title}</span>
                {(isActive || isAddTaskActive) && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/profile"
          onClick={() => {
            if (closeSidebar) {
              closeSidebar();
            }
          }}
          className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer mb-3"
        >
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">User Profile</p>
            <p className="text-xs text-white/60 truncate">View your profile</p>
          </div>
        </Link>

        <Button
          variant="ghost"
          className="w-full justify-start rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 text-white"
          onClick={async () => {
            await api.logout();
            router.push('/login');
            if (closeSidebar) {
              closeSidebar();
            }
          }}
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}