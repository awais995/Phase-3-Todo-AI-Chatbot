'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X, AlertTriangle } from 'lucide-react';

interface TaskDependencyManagerProps {
  taskId: number;
  taskTitle: string;
  availableTasks: Array<{
    id: number;
    title: string;
    status: 'todo' | 'in-progress' | 'completed';
  }>;
  dependencies: string[];
  onAddDependency: (dependencyId: string) => void;
  onRemoveDependency: (dependencyId: string) => void;
}

export function TaskDependencyManager({
  taskId,
  taskTitle,
  availableTasks,
  dependencies,
  onAddDependency,
  onRemoveDependency
}: TaskDependencyManagerProps) {
  const [selectedTask, setSelectedTask] = useState<string>('');

  // Filter out tasks that are already dependencies or the current task
  const availableDependencies = availableTasks.filter(
    task => task.id.toString() !== taskId.toString() && !dependencies.includes(task.id.toString())
  );

  const handleAddDependency = () => {
    if (selectedTask) {
      onAddDependency(selectedTask);
      setSelectedTask('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30';
      case 'in-progress':
        return 'bg-orange-500/10 text-orange-700 border-orange-500/30';
      case 'todo':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/30';
      default:
        return 'bg-muted text-muted-foreground border-muted-foreground/30';
    }
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-card to-muted/30">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-semibold text-foreground">Dependencies</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Dependency */}
        <div className="flex gap-2">
          <select
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
            className="flex-1 h-9 rounded-md border bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select a task to depend on...</option>
            {availableDependencies.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </select>
          <Button
            onClick={handleAddDependency}
            disabled={!selectedTask}
            size="sm"
            className="h-9"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Dependencies List */}
        {dependencies.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Depends on:</h4>
            <div className="space-y-1">
              {dependencies.map((depId) => {
                const depTask = availableTasks.find(t => t.id.toString() === depId);
                if (!depTask) return null;

                return (
                  <div key={depId} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getStatusColor(depTask.status)}`}>
                        {depTask.status.replace('-', ' ')}
                      </Badge>
                      <span className="text-sm">{depTask.title}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemoveDependency(depId)}
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      aria-label={`Remove dependency on ${depTask.title}`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-sm">No dependencies set</p>
          </div>
        )}

        {/* Dependency Warning */}
        {dependencies.some(depId => {
          const depTask = availableTasks.find(t => t.id.toString() === depId);
          return depTask && depTask.status !== 'completed';
        }) && (
          <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-yellow-600">
              Some dependencies are not completed. This task may not be ready to start.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}