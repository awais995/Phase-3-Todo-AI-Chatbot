// Enhanced Task interface with all new features
export interface Task {
  id: number; // Backend uses integer ID
  user_id: string; // Added from backend model
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  completed: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low';
  dueDate?: string; // ISO date string
  tags?: string[];
  estimatedTime?: number; // in minutes
  actualTimeSpent?: number; // in minutes
  timeLogged?: {
    date: string; // ISO date string
    minutes: number;
  }[];
  dependencies?: string[]; // array of task IDs this task depends on
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  assignee?: {
    name: string;
    email: string;
  }; // user object with name and email
}

// Priority levels with corresponding colors and values
export const priorityConfig = {
  critical: {
    label: 'Critical',
    color: 'text-red-700 bg-red-500/10 border-red-500/30',
    value: 4,
    icon: '🔥'
  },
  high: {
    label: 'High',
    color: 'text-orange-700 bg-orange-500/10 border-orange-500/30',
    value: 3,
    icon: '⚠️'
  },
  medium: {
    label: 'Medium',
    color: 'text-yellow-700 bg-yellow-500/10 border-yellow-500/30',
    value: 2,
    icon: '📝'
  },
  low: {
    label: 'Low',
    color: 'text-green-700 bg-green-500/10 border-green-500/30',
    value: 1,
    icon: '✅'
  }
};

// Status configuration
export const statusConfig = {
  todo: {
    title: 'To Do',
    icon: 'Circle',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500',
    bgGradient: 'from-blue-500/10 to-blue-500/5',
    borderColor: 'border-blue-500/20',
    value: 1
  },
  'in-progress': {
    title: 'In Progress',
    icon: 'Clock',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500',
    bgGradient: 'from-orange-500/10 to-orange-500/5',
    borderColor: 'border-orange-500/20',
    value: 2
  },
  completed: {
    title: 'Completed',
    icon: 'CheckCircle',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500',
    bgGradient: 'from-emerald-500/10 to-emerald-500/5',
    borderColor: 'border-emerald-500/20',
    value: 3
  }
} as const;

// Available tags for tasks
export const availableTags = [
  'work', 'personal', 'urgent', 'meeting', 'development', 'design',
  'research', 'review', 'bug', 'feature', 'planning', 'testing'
];

// Time tracking utilities
export const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0
    ? `${hours}h ${remainingMinutes}m`
    : `${hours}h`;
};

export const calculateProgress = (estimated?: number, actual?: number): number => {
  if (!estimated || estimated === 0) return 0;
  if (!actual) return 0;
  return Math.min(100, Math.round((actual / estimated) * 100));
};