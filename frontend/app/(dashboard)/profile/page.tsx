'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { CheckCircle, Clock, BarChart3, TrendingUp, Target, CheckCircle2 } from 'lucide-react';
import { Task } from '@/lib/task-types';
import { UserProfile } from '@/components/ui/user-profile';

export default function ProfilePage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchTasks(user.id);
    }
  }, [user]);

  const fetchTasks = async (userId: string) => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await api.getTasks(userId);

      // Transform backend tasks to UI format
      const uiTasks = data.map(task => {
        // Check if we have saved status for this task in localStorage
        const savedStatus = typeof window !== 'undefined'
          ? localStorage.getItem(`task-status-${task.id}`)
          : null;

        return {
          id: task.id,
          user_id: task.user_id,
          title: task.title,
          description: task.description,
          completed: task.completed,
          status: (savedStatus as 'todo' | 'in-progress' | 'completed') || (task.completed ? 'completed' as const : 'todo' as const),
          priority: 'medium' as const, // Default priority
          dueDate: undefined, // Backend doesn't have due date field
          tags: [], // Backend doesn't have tags field
          estimatedTime: undefined, // Backend doesn't have estimated time
          actualTimeSpent: undefined, // Backend doesn't have actual time spent
          timeLogged: [], // Backend doesn't have time logged
          dependencies: [], // Backend doesn't have dependencies
          assignee: undefined, // Backend doesn't have assignee
          createdAt: task.created_at, // Map to expected field name
          updatedAt: task.updated_at // Map to expected field name
        };
      });

      setTasks(uiTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white">
                My Profile
              </h1>
              <p className="text-white/70 mt-1">
                Manage your account and view your activity
              </p>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1">
            <UserProfile
              user={user}
              showEditButton={true}
              onEditClick={() => {
                // Navigate to settings page when edit is clicked
                window.location.href = '/settings';
              }}
            />
          </div>

          <div className="lg:col-span-2">
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white">Activity Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white/5 backdrop-blur-sm p-5 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white/70">Total Tasks</p>
                        <p className="text-3xl font-bold text-white mt-1">{totalTasks}</p>
                      </div>
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center text-sm text-green-400">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span>+12% from last week</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm p-5 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white/70">Completed</p>
                        <p className="text-3xl font-bold text-white mt-1">{completedTasks}</p>
                      </div>
                      <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                        <CheckCircle2 className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center text-sm text-green-400">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span>+8% from last week</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm p-5 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white/70">In Progress</p>
                        <p className="text-3xl font-bold text-white mt-1">{inProgressTasks}</p>
                      </div>
                      <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center text-sm text-orange-400">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span>+3% from last week</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm p-5 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white/70">Completion Rate</p>
                        <p className="text-3xl font-bold text-white mt-1">{completionRate}%</p>
                      </div>
                      <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                        <BarChart3 className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center text-sm text-purple-400">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span>+5% from last week</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Recent Activity</h3>
                  {loading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg animate-pulse">
                          <div className="w-8 h-8 bg-white/10 rounded-full"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-white/10 rounded w-3/4"></div>
                            <div className="h-3 bg-white/10 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : tasks.length > 0 ? (
                    <div className="space-y-3">
                      {tasks.slice(0, 5).map((task) => (
                        <div key={task.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            task.completed ? 'bg-green-500/20' : 'bg-blue-500/20'
                          }`}>
                            {task.completed ? (
                              <CheckCircle className="h-4 w-4 text-green-400" />
                            ) : (
                              <Clock className="h-4 w-4 text-blue-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate text-white">{task.title}</p>
                            <p className="text-xs text-white/60">
                              {task.completed ? 'Completed' : 'Created'} • {new Date(task.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={task.completed ? "default" : "secondary"} className="capitalize bg-white/10 text-white border-white/20">
                            {task.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-white/60">
                      <p>No recent activity</p>
                      <p className="text-sm mt-1">Complete tasks to see your activity here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}