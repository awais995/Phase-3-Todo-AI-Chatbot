'use client';

import React, { useState } from 'react';
import { TaskCard } from './task-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Circle, Clock, CheckCircle, Filter, Calendar, Flag, Tag } from 'lucide-react';
import { Task, statusConfig as originalStatusConfig, priorityConfig } from '@/lib/task-types';

interface TaskBoardProps {
  tasks: Task[];
  loading?: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number, completed: boolean) => void;
  onStatusChange: (id: number, status: 'todo' | 'in-progress' | 'completed') => void;
  onPriorityChange?: (id: number, priority: 'critical' | 'high' | 'medium' | 'low') => void;
  onAddTask: () => void;
  filter?: {
    priority?: 'critical' | 'high' | 'medium' | 'low';
    status?: 'todo' | 'in-progress' | 'completed';
    tag?: string;
    dueDate?: string;
  };
  onFilterChange?: (filter: any) => void;
}

export function TaskBoard({
  tasks,
  loading,
  onEdit,
  onDelete,
  onToggle,
  onStatusChange,
  onPriorityChange,
  onAddTask,
  filter,
  onFilterChange
}: TaskBoardProps) {
  // Apply filters to tasks
  const filteredTasks = tasks.filter(task => {
    if (filter?.priority && task.priority !== filter.priority) return false;
    if (filter?.status && task.status !== filter.status) return false;
    if (filter?.tag && task.tags && !task.tags.includes(filter.tag)) return false;
    if (filter?.dueDate && task.dueDate && task.dueDate !== filter.dueDate) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Filter Controls */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Task Board</h2>
          <div className="flex gap-2">
            <div className="h-9 w-24 bg-muted rounded-lg animate-pulse"></div>
            <div className="h-9 w-24 bg-muted rounded-lg animate-pulse"></div>
            <div className="h-9 w-24 bg-muted rounded-lg animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['To Do', 'In Progress', 'Completed'].map((status, index) => (
            <div key={index} className="bg-muted/30 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 w-32 bg-muted rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="p-4 bg-background rounded-lg animate-pulse">
                    <div className="h-4 w-3/4 bg-muted rounded mb-2"></div>
                    <div className="h-3 w-full bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const todoTasks = filteredTasks.filter(task => task.status === 'todo');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'in-progress');
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');

  // Check if filters are applied and if there are no tasks for the current filter
  const hasActiveFilters = filter && (filter.priority || filter.status || filter.tag || filter.dueDate);
  const hasNoFilteredTasks = hasActiveFilters && filteredTasks.length === 0;

  const statusConfig = {
    todo: {
      ...originalStatusConfig.todo,
      icon: Circle,
    },
    'in-progress': {
      ...originalStatusConfig['in-progress'],
      icon: Clock,
    },
    completed: {
      ...originalStatusConfig.completed,
      icon: CheckCircle,
    }
  };

  const handleStatusChange = (taskId: number, newStatus: 'todo' | 'in-progress' | 'completed') => {
    onStatusChange(taskId, newStatus);
  };

  const handleFilterChange = (filterType: string, value: any) => {
    if (onFilterChange) {
      onFilterChange({ ...filter, [filterType]: value });
    }
  };

  const clearFilters = () => {
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Task Board</h2>

        <div className="flex flex-wrap gap-2 items-center">
          {/* Priority Filter */}
          <select
            value={filter?.priority || ''}
            onChange={(e) => handleFilterChange('priority', e.target.value || undefined)}
            className="h-9 px-3 rounded-md border bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={filter?.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value as any || undefined)}
            className="h-9 px-3 rounded-md border bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* Clear Filters Button */}
          {(filter?.priority || filter?.status || filter?.tag || filter?.dueDate) && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="h-9 px-3"
            >
              Clear Filters
            </Button>
          )}

          <Button
            onClick={onAddTask}
            className="h-9 px-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {hasNoFilteredTasks ? (
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
            <Filter className="h-12 w-12 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No tasks found</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            No tasks match your current filters. Try adjusting your filter criteria to see tasks.
          </p>
          <Button
            variant="outline"
            onClick={clearFilters}
            className="h-9 px-4 text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* To Do Column */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  {React.createElement(statusConfig.todo.icon, { className: `h-5 w-5 ${statusConfig.todo.color.replace('text-', 'text-')}` })}
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    {statusConfig.todo.title}
                    <span className="ml-2 text-sm font-normal text-gray-600">
                      ({todoTasks.length})
                    </span>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {todoTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-600">
                    <p className="text-sm">No tasks in this section</p>
                  </div>
                ) : (
                  todoTasks.map((task, index) => (
                    <TaskCard
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      description={task.description}
                      status={task.status}
                      completed={task.completed}
                      priority={task.priority}
                      dueDate={task.dueDate}
                      tags={task.tags}
                      estimatedTime={task.estimatedTime}
                      actualTimeSpent={task.actualTimeSpent}
                      dependencies={task.dependencies}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onToggle={onToggle}
                      onStatusChange={onStatusChange}
                      onPriorityChange={onPriorityChange}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* In Progress Column */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  {React.createElement(statusConfig['in-progress'].icon, { className: `h-5 w-5 ${statusConfig['in-progress'].color.replace('text-', 'text-')}` })}
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    {statusConfig['in-progress'].title}
                    <span className="ml-2 text-sm font-normal text-gray-600">
                      ({inProgressTasks.length})
                    </span>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {inProgressTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-600">
                    <p className="text-sm">No tasks in this section</p>
                  </div>
                ) : (
                  inProgressTasks.map((task, index) => (
                    <TaskCard
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      description={task.description}
                      status={task.status}
                      completed={task.completed}
                      priority={task.priority}
                      dueDate={task.dueDate}
                      tags={task.tags}
                      estimatedTime={task.estimatedTime}
                      actualTimeSpent={task.actualTimeSpent}
                      dependencies={task.dependencies}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onToggle={onToggle}
                      onStatusChange={onStatusChange}
                      onPriorityChange={onPriorityChange}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Completed Column */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  {React.createElement(statusConfig.completed.icon, { className: `h-5 w-5 ${statusConfig.completed.color.replace('text-', 'text-')}` })}
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    {statusConfig.completed.title}
                    <span className="ml-2 text-sm font-normal text-gray-600">
                      ({completedTasks.length})
                    </span>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {completedTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-600">
                    <p className="text-sm">No tasks in this section</p>
                  </div>
                ) : (
                  completedTasks.map((task, index) => (
                    <TaskCard
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      description={task.description}
                      status={task.status}
                      completed={task.completed}
                      priority={task.priority}
                      dueDate={task.dueDate}
                      tags={task.tags}
                      estimatedTime={task.estimatedTime}
                      actualTimeSpent={task.actualTimeSpent}
                      dependencies={task.dependencies}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onToggle={onToggle}
                      onStatusChange={onStatusChange}
                      onPriorityChange={onPriorityChange}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}