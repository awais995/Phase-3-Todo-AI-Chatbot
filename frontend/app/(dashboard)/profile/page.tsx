'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { CheckCircle, Clock, BarChart3 } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-background">
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
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background">
      <Navbar />

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside
          className="hidden md:block w-64 border-r bg-background p-4 h-[calc(100vh-4rem)] sticky top-16"
          role="navigation"
          aria-label="Main navigation"
        >
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-0">
          <div className="container mx-auto py-8 px-4">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    My Profile
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Manage your account and view your activity
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
                <Card className="bg-gradient-to-br from-card to-muted/30 border-border/50">
                  <CardHeader>
                    <CardTitle>Activity Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-card to-muted/30 p-4 rounded-xl border border-border/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                            <p className="text-2xl font-bold">{totalTasks}</p>
                          </div>
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <BarChart3 className="h-5 w-5 text-primary" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-card to-muted/30 p-4 rounded-xl border border-border/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Completed</p>
                            <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
                          </div>
                          <div className="p-2 bg-green-500/10 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-card to-muted/30 p-4 rounded-xl border border-border/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Pending</p>
                            <p className="text-2xl font-bold text-orange-600">{pendingTasks}</p>
                          </div>
                          <div className="p-2 bg-orange-500/10 rounded-lg">
                            <Clock className="h-5 w-5 text-orange-600" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-card to-muted/30 p-4 rounded-xl border border-border/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Completion</p>
                            <p className="text-2xl font-bold">{completionRate}%</p>
                          </div>
                          <div className="p-2 bg-blue-500/10 rounded-lg">
                            <BarChart3 className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
                      {loading ? (
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg animate-pulse">
                              <div className="w-8 h-8 bg-muted rounded-full"></div>
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-muted rounded w-3/4"></div>
                                <div className="h-3 bg-muted rounded w-1/2"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : tasks.length > 0 ? (
                        <div className="space-y-3">
                          {tasks.slice(0, 5).map((task) => (
                            <div key={task.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                task.completed ? 'bg-green-500/10' : 'bg-blue-500/10'
                              }`}>
                                {task.completed ? (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Clock className="h-4 w-4 text-blue-600" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{task.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {task.completed ? 'Completed' : 'Created'} • {new Date(task.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge variant={task.completed ? "default" : "secondary"} className="capitalize">
                                {task.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
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
        </main>
      </div>
    </div>
  );
}