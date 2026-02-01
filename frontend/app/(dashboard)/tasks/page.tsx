import { Suspense } from 'react';
import TasksContent from './TasksContent';

// Loading fallback component
function TasksLoading() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="text-lg text-gray-600">Loading your tasks...</p>
      </div>
    </div>
  );
}

export default function TasksPage() {
  return (
    <Suspense fallback={null}>
      <TasksContent />
    </Suspense>
  );
}