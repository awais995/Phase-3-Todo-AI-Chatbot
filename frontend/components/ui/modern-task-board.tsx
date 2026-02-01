'use client';

import React, { useState } from 'react';
import { ModernTaskCard } from './modern-task-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Circle, Clock, CheckCircle, Filter, Calendar, Flag, Tag, Search, MoreHorizontal, GripVertical } from 'lucide-react';
import { Task, statusConfig as originalStatusConfig, priorityConfig } from '@/lib/task-types';
import { Input } from '@/components/ui/input';

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
    search?: string;
  };
  onFilterChange?: (filter: any) => void;
}

export function ModernTaskBoard({
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
    if (filter?.search &&
        !task.title.toLowerCase().includes(filter.search.toLowerCase()) &&
        !(task.description && task.description.toLowerCase().includes(filter.search.toLowerCase()))
    ) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header with Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">Task Board</h2>
            <p className="text-gray-600 text-sm mt-1">Manage and organize your tasks efficiently</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-2">
              <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="h-10 w-24 bg-indigo-200 rounded-lg animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['To Do', 'In Progress', 'Completed'].map((status, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-lg shadow-sm animate-pulse">
                    <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 w-full bg-gray-200 rounded"></div>
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
  const hasActiveFilters = filter && (filter.priority || filter.status || filter.tag || filter.dueDate || filter.search);
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
      {/* Header with Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">Task Board</h2>
          <p className="text-gray-600 text-sm mt-1">Manage and organize your tasks efficiently</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={filter?.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10 pr-4 py-2 h-10 w-full sm:w-64"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Priority Filter */}
            <select
              value={filter?.priority || ''}
              onChange={(e) => handleFilterChange('priority', e.target.value || undefined)}
              className="h-10 px-3 rounded-lg border bg-white text-sm text-gray-700 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
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
              className="h-10 px-3 rounded-lg border bg-white text-sm text-gray-700 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            {/* Clear Filters Button */}
            {(filter?.priority || filter?.status || filter?.tag || filter?.dueDate || filter?.search) && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="h-10 px-3 text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                Clear
              </Button>
            )}

            <Button
              onClick={onAddTask}
              className="h-10 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-white shadow-md hover:shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>
      </div>

      {hasNoFilteredTasks ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
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
            className="h-10 px-4 text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* To Do Column */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {React.createElement(statusConfig.todo.icon, { className: `h-5 w-5 ${statusConfig.todo.color.replace('text-', 'text-')}` })}
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {statusConfig.todo.title}
                    </CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs px-2 py-1 h-6">
                    {todoTasks.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {todoTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                    <p className="text-sm">No tasks in this section</p>
                    <p className="text-xs text-gray-400 mt-1">Drag tasks here or add new ones</p>
                  </div>
                ) : (
                  todoTasks.map((task, index) => (
                    <ModernTaskCard
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
                      assignee={task.assignee}
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
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {React.createElement(statusConfig['in-progress'].icon, { className: `h-5 w-5 ${statusConfig['in-progress'].color.replace('text-', 'text-')}` })}
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {statusConfig['in-progress'].title}
                    </CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs px-2 py-1 h-6">
                    {inProgressTasks.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {inProgressTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                    <p className="text-sm">No tasks in this section</p>
                    <p className="text-xs text-gray-400 mt-1">Drag tasks here to start working</p>
                  </div>
                ) : (
                  inProgressTasks.map((task, index) => (
                    <ModernTaskCard
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
                      assignee={task.assignee}
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
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {React.createElement(statusConfig.completed.icon, { className: `h-5 w-5 ${statusConfig.completed.color.replace('text-', 'text-')}` })}
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {statusConfig.completed.title}
                    </CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs px-2 py-1 h-6">
                    {completedTasks.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {completedTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                    <p className="text-sm">No tasks completed yet</p>
                    <p className="text-xs text-gray-400 mt-1">Great job on your progress!</p>
                  </div>
                ) : (
                  completedTasks.map((task, index) => (
                    <ModernTaskCard
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
                      assignee={task.assignee}
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