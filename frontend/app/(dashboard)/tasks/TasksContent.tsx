'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { TaskBoard } from '@/components/ui/task-board';
import { TaskForm } from '@/components/ui/task-form';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, BarChart3, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { Sheet, SheetContent } from '@/components/ui/sheet';

import { Task } from '@/lib/task-types';

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
  const { isAuthenticated, user } = useAuth();

  // Listen for the custom event to open the add task form
  useEffect(() => {
    // Check if user is authenticated before proceeding
    // Only redirect to login if we've finished loading and user is definitely not authenticated
    if (isAuthenticated && user && user.id) {
      // Don't use the refresh mechanism that causes infinite loops
      // Just fetch tasks normally if not already fetched
      if (!fetchCalledRef.current) {
        // Set loading to true before fetching to ensure proper loading state
        setLoading(true);
        fetchTasks(user.id);
        fetchCalledRef.current = true; // Mark that fetch has been called
      }
    } else if (!isAuthenticated) {
      // User is not authenticated, redirect to login
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

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
      const uiTasks = data.map(task => ({
        id: task.id,
        user_id: task.user_id,
        title: task.title,
        description: task.description,
        completed: task.completed,
        status: task.completed ? 'completed' as const : 'todo' as const, // Initially map completed to 'completed', others to 'todo'
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
      }));

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
      // Send task data to API (only title and description are supported by backend)
      const newTask = await api.createTask(user.id, {
        title: taskData.title,
        description: taskData.description
      });

      // Transform the created task to UI format
      const uiNewTask = {
        id: newTask.id,
        user_id: newTask.user_id,
        title: newTask.title,
        description: newTask.description,
        completed: newTask.completed,
        status: newTask.completed ? 'completed' as const : 'todo' as const, // New tasks start as 'todo' if not completed
        priority: 'medium' as const, // Default priority
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
      setShowTaskForm(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (taskData: { title?: string; description?: string; completed?: boolean }) => {
    if (!editingTask || !user?.id) return;

    setIsSubmitting(true);
    try {
      const updatedTask = await api.updateTask(user.id, editingTask.id, taskData);

      // Transform the updated task to UI format
      // Preserve the current status if it was 'in-progress', otherwise update based on completed status
      const currentTask = tasks.find(t => t.id === editingTask.id);
      const newStatus = updatedTask.completed ? 'completed' :
                       currentTask?.status === 'in-progress' ? 'in-progress' : 'todo';

      const uiUpdatedTask = {
        id: updatedTask.id,
        user_id: updatedTask.user_id,
        title: updatedTask.title,
        description: updatedTask.description,
        completed: updatedTask.completed,
        status: newStatus as 'todo' | 'in-progress' | 'completed',
        priority: 'medium' as const, // Default priority
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
      // When toggling via checkbox, the status should be 'completed' if completed is true, otherwise 'todo'
      // Preserve 'in-progress' status if the task was in progress before toggling
      setTasks(tasks.map(t =>
        t.id === id ? { ...t, completed, status: completed ? 'completed' : 'todo' } : t
      ));

      // Update on server
      await api.toggleTaskCompletion(user.id, id);
    } catch (error) {
      // Revert optimistic update on error
      setTasks(tasks.map(t =>
        t.id === id ? { ...t, completed: !completed, status: !completed ? 'completed' : 'todo' } : t
      ));
      console.error('Failed to update task:', error);
    }
  };

  const handleStatusChange = async (id: number, newStatus: 'todo' | 'in-progress' | 'completed') => {
    if (!user?.id) return;

    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      // Optimistic update - convert status to completed boolean for backend
      // For the UI, we'll track the actual status separately
      const completed = newStatus === 'completed';

      // Update the task with both the completed boolean (for backend) and the status (for UI)
      setTasks(tasks.map(t =>
        t.id === id ? { ...t, completed, status: newStatus } : t
      ));

      // Update on server (only the completed field is sent to backend)
      await api.updateTask(user.id, id, { completed });
    } catch (error) {
      // Revert optimistic update on error
      setTasks(tasks.map(t =>
        t.id === id ? { ...t, completed: task.completed, status: task.completed ? 'completed' : 'todo' } : t
      ));
      console.error('Failed to update task status:', error);
    }
  };

  const handlePriorityChange = async (id: number, newPriority: 'critical' | 'high' | 'medium' | 'low') => {
    // Priority field is not supported by the backend model
    // This function currently does nothing to prevent errors
    console.warn('Priority field is not supported by the backend model');
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


  // If not authenticated, redirect will happen via useEffect
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Show loading spinner while loading tasks
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg">Loading your tasks...</p>
        </div>
      </div>
    );
  }

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

        {/* Mobile Sidebar Sheet */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent
            side="left"
            className="w-64 p-0 bg-background border-r border-border/50 backdrop-blur-sm shadow-2xl"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <Sidebar closeSidebar={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main
          ref={mainContentRef}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
          className="flex-1 md:ml-0"
        >
          <div className="container mx-auto py-8 px-4">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    My Tasks
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Stay organized and productive
                  </p>
                </div>
                <Button
                  onClick={() => setShowTaskForm(true)}
                  className="h-11 px-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-300 group"
                  aria-label="Add new task"
                  disabled={loading || !user?.id}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                  <Sparkles className="h-4 w-4 ml-2 transition-transform group-hover:rotate-12" />
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-card to-muted/30 p-5 rounded-xl border border-border/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                      <p className="text-2xl font-bold">{totalTasks}</p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-card to-muted/30 p-5 rounded-xl border border-border/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-card to-muted/30 p-5 rounded-xl border border-border/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold text-orange-600">{pendingTasks}</p>
                    </div>
                    <div className="p-3 bg-orange-500/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-orange-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-card to-muted/30 p-5 rounded-xl border border-border/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">To Do</p>
                      <p className="text-2xl font-bold text-blue-600">{pendingTasks}</p>
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Board */}
            <TaskBoard
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

            <TaskForm
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
        </main>
      </div>
    </div>
  );
}