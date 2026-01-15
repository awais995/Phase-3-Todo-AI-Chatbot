import { Suspense } from 'react';
import TasksContent from './TasksContent';

// Loading fallback component
function TasksLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/5 to-background">
      <div className="text-center space-y-4">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-lg text-muted-foreground">Loading your tasks...</p>
      </div>
    </div>
  );
}

export default function TasksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background">
      <Suspense fallback={<TasksLoading />}>
        <TasksContent />
      </Suspense>
    </div>
  );
}