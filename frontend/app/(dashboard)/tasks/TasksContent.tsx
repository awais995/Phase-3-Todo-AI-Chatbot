'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { ModernTaskBoard } from '@/components/ui/modern-task-board';
import { ModernTaskForm } from '@/components/ui/modern-task-form';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, BarChart3, Sparkles, TrendingUp, Target, CheckCircle, Clock, Activity, Layers } from 'lucide-react';
import { Task } from '@/lib/task-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TasksContent() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState<{
    priority?: 'critical' | 'high' | 'medium' | 'low';
    status?: 'todo' | 'in-progress' | 'completed';
    tag?: string;
    dueDate?: string;
  }>({});
  const mainContentRef = useRef<HTMLDivElement>(null);
  const fetchCalledRef = useRef(false); // Ref to track if fetch has been called
  const { isAuthenticated, user, isLoading: authIsLoading } = useAuth();

  // Listen for the custom event to open the add task form
  useEffect(() => {
    // Only redirect to login if we've finished loading and user is definitely not authenticated
    // During loading, we should not redirect
    if (!authIsLoading && !isAuthenticated) {
      // User is not authenticated, redirect to login
      router.push('/login');
    } else if (isAuthenticated && user && user.id) {
      // Don't use the refresh mechanism that causes infinite loops
      // Just fetch tasks normally if not already fetched
      if (!fetchCalledRef.current) {
        // Set loading to true before fetching to ensure proper loading state
        setLoading(true);
        fetchTasks(user.id);
        fetchCalledRef.current = true; // Mark that fetch has been called
      }
    }
  }, [isAuthenticated, authIsLoading, user, router]);

  // Focus management - when task form opens, focus on the main content area
  useEffect(() => {
    if (showTaskForm && mainContentRef.current) {
      mainContentRef.current.focus();
    }
  }, [showTaskForm]);

  // Listen for the custom event to open the add task form
  useEffect(() => {
    const handleOpenAddTask = () => {
      setShowTaskForm(true);
    };

    window.addEventListener('open-add-task', handleOpenAddTask);

    return () => {
      window.removeEventListener('open-add-task', handleOpenAddTask);
    };
  }, []);


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
          status: (savedStatus as 'todo' | 'in-progress' | 'completed') || (task.completed ? 'completed' as const : 'todo' as const), // Use saved status or default based on completed field
          priority: (task.priority || 'medium') as 'critical' | 'high' | 'medium' | 'low', // Use priority from backend or default to medium
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
      // Log more details about the error
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
    } finally {
      // Ensure loading is always set to false after the operation
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: { title: string; description?: string; priority?: string; dueDate?: string; tags?: string[]; estimatedTime?: number }) => {
    if (!user?.id) return;

    setIsSubmitting(true);
    try {
      // Send task data to API (send title, description, and priority)
      const newTask = await api.createTask(user.id, {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority || 'medium'
      });

      // Determine the status for the new task - default to 'todo'
      const newTaskStatus: 'todo' | 'in-progress' | 'completed' = 'todo';

      // Transform the created task to UI format
      const uiNewTask = {
        id: newTask.id,
        user_id: newTask.user_id,
        title: newTask.title,
        description: newTask.description,
        completed: newTask.completed,
        status: newTaskStatus, // New tasks start as 'todo'
        priority: (newTask.priority || 'medium') as 'critical' | 'high' | 'medium' | 'low', // Use priority from backend or default to medium
        dueDate: undefined, // Backend doesn't have due date field
        tags: [], // Backend doesn't have tags field
        estimatedTime: undefined, // Backend doesn't have estimated time
        actualTimeSpent: undefined, // Backend doesn't have actual time spent
        timeLogged: [], // Backend doesn't have time logged
        dependencies: [], // Backend doesn't have dependencies
        assignee: undefined, // Backend doesn't have assignee
        createdAt: newTask.created_at, // Map to expected field name
        updatedAt: newTask.updated_at // Map to expected field name
      };

      setTasks([...tasks, uiNewTask]);

      // Save the status to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(`task-status-${newTask.id}`, newTaskStatus);
      }

      setShowTaskForm(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (taskData: { title?: string; description?: string; completed?: boolean; priority?: string }) => {
    if (!editingTask || !user?.id) return;

    setIsSubmitting(true);
    try {
      // Prepare update data based on what was provided
      const updateData: any = {};
      if (taskData.title !== undefined) updateData.title = taskData.title;
      if (taskData.description !== undefined) updateData.description = taskData.description;
      if (taskData.completed !== undefined) updateData.completed = taskData.completed;
      if (taskData.priority !== undefined) updateData.priority = taskData.priority;

      const updatedTask = await api.updateTask(user.id, editingTask.id, updateData);

      // Transform the updated task to UI format
      // Preserve the current status if it's in 'in-progress' or 'todo', otherwise update based on completed status
      const currentTask = tasks.find(t => t.id === editingTask.id);
      let newStatus = currentTask?.status || 'todo'; // Preserve current status by default

      // If the backend completed field changed, then we should update the status accordingly
      // Only override the status if the completion state has changed
      if (taskData.completed !== undefined && taskData.completed !== currentTask?.completed) {
        newStatus = updatedTask.completed ? 'completed' : currentTask?.status || 'todo';
      }

      const uiUpdatedTask = {
        id: updatedTask.id,
        user_id: updatedTask.user_id,
        title: updatedTask.title,
        description: updatedTask.description,
        completed: updatedTask.completed,
        status: newStatus as 'todo' | 'in-progress' | 'completed',
        priority: (updatedTask.priority || 'medium') as 'critical' | 'high' | 'medium' | 'low', // Use priority from backend or default to medium
        dueDate: undefined, // Backend doesn't have due date field
        tags: [], // Backend doesn't have tags field
        estimatedTime: undefined, // Backend doesn't have estimated time
        actualTimeSpent: undefined, // Backend doesn't have actual time spent
        timeLogged: [], // Backend doesn't have time logged
        dependencies: [], // Backend doesn't have dependencies
        assignee: undefined, // Backend doesn't have assignee
        createdAt: updatedTask.created_at, // Map to expected field name
        updatedAt: updatedTask.updated_at // Map to expected field name
      };

      setTasks(tasks.map(task => task.id === editingTask.id ? uiUpdatedTask : task));

      // Update localStorage to reflect the new status
      if (typeof window !== 'undefined') {
        localStorage.setItem(`task-status-${editingTask.id}`, newStatus);
      }

      setEditingTask(null);
      setShowTaskForm(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!user?.id) return;

    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.deleteTask(user.id, id);
        setTasks(tasks.filter(task => task.id !== id));
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const handleToggleTask = async (id: number, completed: boolean) => {
    if (!user?.id) return;

    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      // Optimistic update
      // When toggling via checkbox, the status should be 'completed' if completed is true,
      // otherwise maintain the current status or default to 'todo'
      // Preserve 'in-progress' status if the task was in progress before toggling
      const newStatus = completed ? 'completed' : task.status === 'in-progress' ? 'in-progress' : 'todo';

      setTasks(tasks.map(t =>
        t.id === id ? { ...t, completed, status: newStatus } : t
      ));

      // Update on server
      await api.toggleTaskCompletion(user.id, id);

      // Update localStorage to reflect the new status
      if (typeof window !== 'undefined') {
        localStorage.setItem(`task-status-${id}`, newStatus);
      }
    } catch (error) {
      // Revert optimistic update on error
      setTasks(tasks.map(t =>
        t.id === id ? { ...t, completed: !completed, status: task.status } : t
      ));
      console.error('Failed to update task:', error);
    }
  };

  const handleStatusChange = async (id: number, newStatus: 'todo' | 'in-progress' | 'completed') => {
    if (!user?.id) return;

    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      // Optimistic update - determine backend completed status based on UI status
      // completed = true only if UI status is 'completed'
      // completed = false if UI status is 'todo' or 'in-progress'
      const completed = newStatus === 'completed';

      // Update the task with both the completed boolean (for backend) and the status (for UI)
      setTasks(tasks.map(t =>
        t.id === id ? { ...t, completed, status: newStatus } : t
      ));

      // Save the status to localStorage so it persists after refresh
      if (typeof window !== 'undefined') {
        localStorage.setItem(`task-status-${id}`, newStatus);
      }

      // Update on server (only the completed field is sent to backend)
      await api.updateTask(user.id, id, { completed });
    } catch (error) {
      // Revert optimistic update on error
      setTasks(tasks.map(t =>
        t.id === id ? { ...t, completed: task.completed, status: task.status } : t
      ));

      // Also revert the localStorage status
      if (typeof window !== 'undefined' && task) {
        localStorage.setItem(`task-status-${id}`, task.status);
      }

      console.error('Failed to update task status:', error);
    }
  };

  const handlePriorityChange = async (id: number, newPriority: 'critical' | 'high' | 'medium' | 'low') => {
    if (!user?.id) return;

    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      // Optimistic update
      setTasks(tasks.map(t =>
        t.id === id ? { ...t, priority: newPriority } : t
      ));

      // Update on server
      await api.updateTask(user.id, id, { priority: newPriority });
    } catch (error) {
      // Revert optimistic update on error
      setTasks(tasks.map(t =>
        t.id === id ? { ...t, priority: task.priority } : t
      ));
      console.error('Failed to update task priority:', error);
    }
  };

  const handleEditTask = (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      setEditingTask(task);
      setShowTaskForm(true);
    }
  };

  const handleFilterChange = (newFilter: any) => {
    setFilter(newFilter);
  };

  // Keyboard navigation handlers
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowTaskForm(false);
      setEditingTask(null);
    }
  };

  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;

  // If still authenticating, show loading
  // if (authIsLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-background">
  //       <div className="text-center">
  //         <p className="text-lg">Authenticating...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // If not authenticated and not loading, redirect will happen via useEffect
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <p className="text-lg text-white">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Show loading spinner while loading tasks
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <p className="text-lg text-white">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Productivity Dashboard
              </h1>
              <p className="text-white/70 text-lg">
                Manage your tasks and boost your productivity
              </p>
            </div>
            <Button
              onClick={() => setShowTaskForm(true)}
              className="h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 group text-white shadow-lg hover:shadow-2xl rounded-xl"
              aria-label="Add new task"
              disabled={loading || !user?.id}
            >
              <Plus className="h-5 w-5 mr-3" />
              <span className="text-lg font-semibold">Add Task</span>
              <Sparkles className="h-5 w-5 ml-3 transition-transform group-hover:rotate-12" />
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium">Total Tasks</p>
                    <p className="text-3xl font-bold text-white mt-1">{totalTasks}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                    <Layers className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-green-400">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+12% from last week</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium">Completed</p>
                    <p className="text-3xl font-bold text-white mt-1">{completedTasks}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-green-400">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+8% from last week</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium">In Progress</p>
                    <p className="text-3xl font-bold text-white mt-1">{inProgressTasks}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-orange-400">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+3% from last week</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium">Pending</p>
                    <p className="text-3xl font-bold text-white mt-1">{pendingTasks}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-purple-400">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+5% from last week</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Task Board */}
        <ModernTaskBoard
          tasks={tasks}
          loading={loading}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onToggle={handleToggleTask}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
          onAddTask={() => setShowTaskForm(true)}
          filter={filter}
          onFilterChange={handleFilterChange}
        />

        <ModernTaskForm
          open={showTaskForm}
          onOpenChange={(open) => {
            setShowTaskForm(open);
            if (!open) {
              setEditingTask(null);
            }
          }}
          task={editingTask || undefined}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          loading={isSubmitting}
        />
      </div>
    </div>
  );
}