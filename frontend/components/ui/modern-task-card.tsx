'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit3, Trash2, Clock, CheckCircle, Circle, MoreHorizontal, Calendar, Flag, Tag, Timer, AlertTriangle, Users, Eye, EyeOff } from 'lucide-react';
import { priorityConfig, formatTime, calculateProgress } from '@/lib/task-types';

interface TaskCardProps {
  id: number;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  completed: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low';
  dueDate?: string;
  tags?: string[];
  estimatedTime?: number;
  actualTimeSpent?: number;
  dependencies?: string[];
  assignee?: {
    name: string;
    avatar?: string;
  };
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number, completed: boolean) => void;
  onStatusChange?: (id: number, status: 'todo' | 'in-progress' | 'completed') => void;
  onPriorityChange?: (id: number, priority: 'critical' | 'high' | 'medium' | 'low') => void;
}

export function ModernTaskCard({
  id,
  title,
  description,
  status,
  completed,
  priority,
  dueDate,
  tags,
  estimatedTime,
  actualTimeSpent,
  dependencies,
  assignee,
  onEdit,
  onDelete,
  onToggle,
  onStatusChange,
  onPriorityChange
}: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const statusColors = {
    todo: 'bg-blue-500',
    'in-progress': 'bg-orange-500',
    completed: 'bg-emerald-500',
  };

  const statusIcons = {
    todo: Circle,
    'in-progress': Clock,
    completed: CheckCircle,
  };

  const statusText = {
    todo: 'To Do',
    'in-progress': 'In Progress',
    completed: 'Completed',
  };

  const toggleTask = () => {
    onToggle(id, !completed);
  };

  const toggleExpand = () => {
    if (description) {
      setIsExpanded(!isExpanded);
    }
  };

  const truncateDescription = (desc: string, maxLength: number = 100) => {
    if (desc.length <= maxLength) return desc;
    return `${desc.substring(0, maxLength)}...`;
  };

  const StatusIcon = statusIcons[status];
  const priorityInfo = priorityConfig[priority];

  // Calculate time progress
  const progressPercentage = calculateProgress(estimatedTime, actualTimeSpent);

  // Format due date
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { formatted: date.toLocaleDateString(), isOverdue: true, days: Math.abs(diffDays) };
    } else if (diffDays === 0) {
      return { formatted: 'Today', isOverdue: false, days: 0 };
    } else if (diffDays === 1) {
      return { formatted: 'Tomorrow', isOverdue: false, days: 1 };
    } else {
      return { formatted: date.toLocaleDateString(), isOverdue: false, days: diffDays };
    }
  };

  const dueDateInfo = dueDate ? formatDate(dueDate) : null;

  return (
    <Card
      className={`transition-all duration-300 ease-in-out hover:shadow-lg shadow-sm border-0 bg-white hover:bg-gray-50 ${
        completed ? 'opacity-75' : ''
      } ${showActions ? 'ring-1 ring-indigo-500/30 shadow-md' : 'shadow-sm'} relative group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      role="listitem"
      aria-labelledby={`task-title-${id}`}
      aria-describedby={`task-description-${id} task-status-${id}`}
    >
      <CardContent className="p-4 relative">
        <div className="flex items-start gap-3">
          <div className="pt-1 flex-shrink-0">
            <Checkbox
              id={`task-checkbox-${id}`}
              checked={completed}
              onCheckedChange={toggleTask}
              aria-label={`Mark task "${title}" as ${completed ? 'incomplete' : 'complete'}`}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all duration-200"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0 group">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3
                    id={`task-title-${id}`}
                    className={`font-semibold text-sm leading-tight transition-all duration-200 ${
                      completed
                        ? 'line-through text-gray-500'
                        : 'text-gray-800 group-hover:text-indigo-700'
                    }`}
                  >
                    {title}
                  </h3>

                  <div className="flex items-center gap-1">
                    {assignee && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Users className="h-3 w-3" />
                        <span className="truncate max-w-[40px]">{assignee.name?.split(' ')[0]}</span>
                      </div>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-105 opacity-0 group-hover:opacity-100 text-gray-500"
                          aria-label="Task options"
                        >
                          <MoreHorizontal className="h-3 w-3" aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 z-50 min-w-[180px] max-h-[300px] overflow-y-auto rounded-lg shadow-lg p-2 bg-white border border-gray-200">
                        <DropdownMenuItem onClick={() => onEdit(id)} className="cursor-pointer focus:bg-gray-100 focus:text-gray-900 p-2">
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>

                        {/* Priority Options */}
                        <div className="px-2 py-1 text-xs font-semibold text-gray-500">Priority</div>
                        {Object.entries(priorityConfig).map(([key, config]) => (
                          <DropdownMenuItem
                            key={key}
                            onClick={() => onPriorityChange?.(id, key as 'critical' | 'high' | 'medium' | 'low')}
                            disabled={priority === key}
                            className={`cursor-pointer focus:bg-gray-100 focus:text-gray-900 p-2 ${priority === key ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <div className="flex items-center">
                              <Flag className={`h-4 w-4 mr-2 ${config.color.split(' ')[0]}`} />
                              <span>{config.label}</span>
                            </div>
                          </DropdownMenuItem>
                        ))}

                        <div className="border-t my-1" />

                        {/* Status Options */}
                        <div className="px-2 py-1 text-xs font-semibold text-gray-500">Move to</div>
                        <DropdownMenuItem
                          onClick={() => onStatusChange?.(id, 'todo')}
                          disabled={status === 'todo'}
                          className={`cursor-pointer focus:bg-gray-100 focus:text-gray-900 p-2 ${status === 'todo' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <Circle className="h-4 w-4 mr-2" />
                          To Do
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onStatusChange?.(id, 'in-progress')}
                          disabled={status === 'in-progress'}
                          className={`cursor-pointer focus:bg-gray-100 focus:text-gray-900 p-2 ${status === 'in-progress' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onStatusChange?.(id, 'completed')}
                          disabled={status === 'completed'}
                          className={`cursor-pointer focus:bg-gray-100 focus:text-gray-900 p-2 ${status === 'completed' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Completed
                        </DropdownMenuItem>

                        <div className="border-t my-1" />

                        <DropdownMenuItem
                          onClick={() => onDelete(id)}
                          className="cursor-pointer focus:bg-red-50 focus:text-red-600 text-red-600 p-2"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-2">
                  <Badge variant="secondary" className={`${priorityConfig[priority]?.color} text-xs px-2 py-1 h-6`}>
                    {priorityInfo?.icon || '📝'}
                    <span className="ml-1">{priorityInfo?.label || 'Medium'}</span>
                  </Badge>
                </div>

                {/* Description */}
                {description && (
                  <p
                    id={`task-description-${id}`}
                    className={`text-xs text-gray-600 mb-2 cursor-pointer transition-colors ${
                      completed ? 'line-through' : ''
                    }`}
                    onClick={toggleExpand}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        toggleExpand();
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-expanded={isExpanded}
                    aria-controls={`task-full-description-${id}`}
                  >
                    {isExpanded ? description : truncateDescription(description)}
                    {description.length > 100 && (
                      <span className="ml-1 text-indigo-600 hover:text-indigo-800 font-medium">
                        {isExpanded ? 'Show less' : 'Read more'}
                      </span>
                    )}
                  </p>
                )}

                {/* Due Date and Time Tracking */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {dueDateInfo && (
                    <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                      dueDateInfo.isOverdue
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}>
                      <Calendar className="h-3 w-3" />
                      <span>{dueDateInfo.formatted}</span>
                      {dueDateInfo.isOverdue && (
                        <AlertTriangle className="h-3 w-3" />
                      )}
                    </div>
                  )}

                  {(estimatedTime || actualTimeSpent) && (
                    <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                      <Timer className="h-3 w-3" />
                      <span>
                        {actualTimeSpent ? formatTime(actualTimeSpent) : '0m'}
                        {estimatedTime && ` / ${formatTime(estimatedTime)}`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {tags && tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs px-2 py-1 h-6">
                        <Tag className="h-2.5 w-2.5 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                    {tags.length > 2 && (
                      <Badge variant="outline" className="text-xs px-2 py-1 h-6">
                        +{tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Progress bar if both estimated and actual time exist */}
                {estimatedTime && actualTimeSpent !== undefined && (
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          progressPercentage > 100
                            ? 'bg-red-500'
                            : progressPercentage >= 90
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(100, progressPercentage)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1">
            <StatusIcon className={`h-3 w-3 ${statusColors[status]} transition-all duration-200`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}