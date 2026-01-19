'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, CheckCircle, Circle, Clock, Flag, Tag, Timer } from 'lucide-react';
import { priorityConfig, availableTags } from '@/lib/task-types';

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: {
    id?: string | number;
    title: string;
    description?: string;
    status?: 'todo' | 'in-progress' | 'completed';
    priority?: 'critical' | 'high' | 'medium' | 'low';
    dueDate?: string;
    tags?: string[];
    estimatedTime?: number;
    actualTimeSpent?: number;
    timeLogged?: {
      date: string;
      minutes: number;
    }[];
    dependencies?: string[];
    createdAt?: string;
    updatedAt?: string;
  };
  onSubmit: (taskData: {
    title: string;
    description?: string;
    priority?: string;
    dueDate?: string;
    tags?: string[];
    estimatedTime?: number;
  }) => void;
  loading?: boolean;
}

export function TaskForm({ open, onOpenChange, task, onSubmit, loading }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'todo' | 'in-progress' | 'completed'>('todo');
  const [priority, setPriority] = useState<'critical' | 'high' | 'medium' | 'low'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [estimatedTime, setEstimatedTime] = useState<number | ''>('');
  const [errors, setErrors] = useState<{ title?: string }>({});

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'todo');
      setPriority(task.priority || 'medium');
      setDueDate(task.dueDate || '');
      setTags(task.tags || []);
      setEstimatedTime(task.estimatedTime || '');
    } else {
      // Reset form when creating new task
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      setDueDate('');
      setTags([]);
      setEstimatedTime('');
      setCurrentTag('');
    }
    setErrors({});
  }, [task, open]);

  const validateForm = () => {
    const newErrors: { title?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || undefined,
      tags: tags.length > 0 ? tags : undefined,
      estimatedTime: estimatedTime ? Number(estimatedTime) : undefined
    });

    // Reset form after submission
    setTitle('');
    setDescription('');
    setStatus('todo');
    setPriority('medium');
    setDueDate('');
    setTags([]);
    setEstimatedTime('');
  };

  // Status icons mapping
  const statusIcons = {
    todo: Circle,
    'in-progress': Clock,
    completed: CheckCircle,
  };

  const StatusIcon = statusIcons[status];
  const priorityInfo = priorityConfig[priority];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col p-0 border-border shadow-2xl rounded-xl bg-background"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
      >
        <div className="flex flex-col h-full max-h-[80vh]">
          <DialogHeader className="p-6 pb-4 border-b border-border/50 bg-background">
            <DialogTitle
              id="task-form-title"
              className="text-2xl font-semibold text-foreground tracking-tight"
            >
              {task?.id ? 'Edit Task' : 'Create New Task'}
            </DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 p-6 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent scrollbar-corner-transparent hover:scrollbar-thumb-muted-foreground/40">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-sm font-medium text-foreground/80">
                  Title *
                </Label>
                <div className="relative">
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter task title..."
                    className={`h-12 rounded-lg transition-standard pl-10 ${
                      errors.title
                        ? 'border-destructive focus-visible:ring-destructive/30 bg-destructive/5'
                        : 'focus-visible:ring-primary/30 border-input'
                    }`}
                    aria-invalid={!!errors.title}
                    aria-describedby={errors.title ? "title-error" : undefined}
                    aria-required="true"
                    autoFocus={!task?.id} // Auto-focus on title field when creating new task
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <div className="p-1 bg-primary/10 rounded-md">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                  </div>
                </div>
                {errors.title && (
                  <div
                    id="title-error"
                    className="text-destructive text-sm font-medium flex items-center gap-1.5"
                    role="alert"
                    aria-live="assertive"
                  >
                    <div className="w-1.5 h-1.5 bg-destructive rounded-full flex-shrink-0"></div>
                    <span>{errors.title}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="text-sm font-medium text-foreground/80">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your task in detail (optional)..."
                  rows={4}
                  className="resize-none rounded-lg transition-standard focus-visible:ring-primary/30 border-input"
                  aria-describedby="description-help"
                />
                <p id="description-help" className="text-xs text-muted-foreground">
                  Optional field for additional task details
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="priority" className="text-sm font-medium text-foreground/80">
                    Priority
                  </Label>
                  <div className="relative">
                    <select
                      id="priority"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as 'critical' | 'high' | 'medium' | 'low')}
                      className="w-full h-12 rounded-lg border bg-background px-4 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 transition-standard disabled:cursor-not-allowed disabled:opacity-50 appearance-none border-input"
                      aria-describedby="priority-help"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <Flag className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <p id="priority-help" className="text-xs text-muted-foreground">
                    Set the priority level of the task
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="dueDate" className="text-sm font-medium text-foreground/80">
                    Due Date
                  </Label>
                  <div className="relative">
                    <input
                      type="date"
                      id="dueDate"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full h-12 rounded-lg border bg-background px-4 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 transition-standard disabled:cursor-not-allowed disabled:opacity-50 border-input"
                      aria-describedby="due-date-help"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <p id="due-date-help" className="text-xs text-muted-foreground">
                    Optional due date for the task
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="estimatedTime" className="text-sm font-medium text-foreground/80">
                  Estimated Time (minutes)
                </Label>
                <div className="relative">
                  <input
                    type="number"
                    id="estimatedTime"
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(e.target.value === '' ? '' : Number(e.target.value))}
                    min="1"
                    className="w-full h-12 rounded-lg border bg-background px-4 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 transition-standard disabled:cursor-not-allowed disabled:opacity-50 border-input"
                    aria-describedby="time-help"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <Timer className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <p id="time-help" className="text-xs text-muted-foreground">
                  Estimated time to complete (in minutes)
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="tags" className="text-sm font-medium text-foreground/80">
                  Tags
                </Label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a tag..."
                    className="flex-1 h-12 rounded-lg border bg-background px-4 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 transition-standard border-input"
                    aria-describedby="tags-help"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTag}
                    className="h-12 px-4 rounded-lg transition-standard hover:bg-accent"
                    aria-label="Add tag"
                  >
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-primary/10 text-primary border border-primary/20 transition-standard"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-0.5 text-xs text-primary/70 hover:text-primary transition-standard"
                          aria-label={`Remove tag ${tag}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <p id="tags-help" className="text-xs text-muted-foreground">
                  Add tags to categorize your task (press Enter to add)
                </p>
              </div>

              <DialogFooter className="gap-3 pt-6 border-t border-border/50 -mx-6 px-6 pb-6 bg-background">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                  className="h-11 px-6 rounded-lg transition-standard hover:bg-accent shadow-sm hover:shadow-md"
                  aria-label="Cancel task form"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 px-6 rounded-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-standard shadow-md hover:shadow-lg"
                  aria-label={task?.id ? 'Update task' : 'Create task'}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {task?.id ? 'Updating...' : 'Creating...'}
                    </span>
                  ) : (
                    task?.id ? 'Update Task' : 'Create Task'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}