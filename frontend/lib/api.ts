import { toast } from 'sonner';
import { Task, TaskCreate, TaskUpdate, TaskToggleComplete } from '../types/task';

interface ApiError {
  message: string;
  status?: number;
}

class ApiClient {
  private baseUrl: string;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  constructor() {
    // Use relative paths so Next.js rewrites can proxy to backend
    this.baseUrl = '';
  }

  // Cache methods
  private getCacheKey(endpoint: string, userId: string): string {
    return `${userId}:${endpoint}`;
  }

  private setCache(key: string, data: any, ttl: number = 5 * 60 * 1000): void { // Default 5 minutes TTL
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private getCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    // Check if cache is expired
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private invalidateCache(key: string): void {
    this.cache.delete(key);
  }

  // Invalidate all cache entries for a user
  private invalidateUserCache(userId: string): void {
    for (const cacheKey of this.cache.keys()) {
      if (cacheKey.startsWith(`${userId}:`)) {
        this.cache.delete(cacheKey);
      }
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {

    const startTime = Date.now();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Get JWT token from localStorage (stored after login via backend auth)
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token');
    }

    // Add authorization header if token is available
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    // Set a default timeout of 10 seconds if none is provided
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    // Add signal to the fetch config
    config.signal = controller.signal;

    try {
      // Check if online before making the request
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        toast.error('You are offline. Please check your internet connection.');
        throw new Error('Offline');
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, config);

      // Log performance metrics
      const endTime = Date.now();
      const duration = endTime - startTime;

      if (duration > 2000) { // Log if request takes more than 2 seconds
        console.warn(`Slow API request (${duration}ms): ${endpoint}`, {
          duration,
          url: `${this.baseUrl}${endpoint}`,
          method: options.method || 'GET',
          timestamp: new Date().toISOString()
        });
      }

      // Handle 401 Unauthorized - redirect to login
      if (response.status === 401) {
        // Sign out the user by clearing localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }

        toast.error('Session expired. Please log in again.');

        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        const error: ApiError = {
          message: 'Session expired',
          status: 401,
        };
        throw error;
      }

      // Handle 403 Forbidden - show access denied message
      if (response.status === 403) {
        toast.error('Access denied: Insufficient permissions.');
        const error: ApiError = {
          message: 'Access denied: Insufficient permissions',
          status: 403,
        };
        throw error;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error: ApiError = {
          message: errorData.detail || errorData.message || `HTTP error! status: ${response.status}`,
          status: response.status,
        };

        throw error;
      }

      // Special handling for 204 No Content responses
      if (response.status === 204) {
        return undefined as T;
      }

      return await response.json();
    } catch (error) {
      // Clear the timeout since we're done with the request
      clearTimeout(timeoutId);

      // Comprehensive error logging
      console.error(`API request error for ${endpoint}:`, {
        error: error,
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'Unknown error type',
        stack: error instanceof Error ? error.stack : undefined,
        url: `${this.baseUrl}${endpoint}`,
        method: options.method || 'GET',
        timestamp: new Date().toISOString()
      });

      if ((error as ApiError).status) {
        // Handle API errors
        toast.error((error as ApiError).message);
        throw error;
      } else {
        // Handle network errors
        if (error instanceof TypeError && error.message.includes('fetch')) {
          // Network error (e.g., fetch failed)
          toast.error('Network error. Please check your internet connection and try again.');
        } else if (error.name === 'AbortError') {
          // Timeout error
          console.warn(`Request timed out after 5 seconds: ${endpoint}`);
          toast.error('Request timed out. The server might be slow to respond.');
          throw new Error('Request timeout');
        } else if (error.message === 'Offline') {
          // Already handled above, but included for completeness
          toast.error('You are offline. Please check your internet connection.');
        } else {
          // Other errors
          toast.error('An unexpected error occurred. Please try again.');
        }
        throw new Error('Network error');
      }
    }
  }


  // Task methods - updated to match backend API endpoints
  async getTasks(userId: string): Promise<Task[]> {
    const cacheKey = this.getCacheKey(`/api/${userId}/tasks`, userId);
    const cachedResult = this.getCache(cacheKey);

    if (cachedResult) {
      return cachedResult;
    }

    const result: any = await this.request(`/api/${userId}/tasks`);
    this.setCache(cacheKey, result);
    return result;
  }

  async createTask(userId: string, taskData: TaskCreate): Promise<Task> {
    try {
      const result: any = await this.request(`/api/${userId}/tasks`, {
        method: 'POST',
        body: JSON.stringify(taskData),
      });

      // Invalidate cache for this user's tasks
      this.invalidateUserCache(userId);

      toast.success('Task created successfully');
      return result;
    } catch (error) {
      toast.error('Failed to create task');
      throw error;
    }
  }

  async getTaskById(userId: string, taskId: number): Promise<Task> {
    const result: any = await this.request(`/api/${userId}/tasks/${taskId}`);
    return result;
  }

  async updateTask(userId: string, taskId: number, taskData: TaskUpdate): Promise<Task> {
    try {
      const result: any = await this.request(`/api/${userId}/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(taskData),
      });

      // Invalidate cache for this user's tasks
      this.invalidateUserCache(userId);

      toast.success('Task updated successfully');
      return result;
    } catch (error) {
      toast.error('Failed to update task');
      throw error;
    }
  }

  async deleteTask(userId: string, taskId: number) {
    try {
      await this.request(`/api/${userId}/tasks/${taskId}`, {
        method: 'DELETE',
      });

      // Invalidate cache for this user's tasks
      this.invalidateUserCache(userId);

      toast.success('Task deleted successfully');
      return;
    } catch (error) {
      toast.error('Failed to delete task');
      throw error;
    }
  }

  async toggleTaskCompletion(userId: string, taskId: number): Promise<Task> {
    try {
      const result: any = await this.request(`/api/${userId}/tasks/${taskId}/complete`, {
        method: 'PATCH',
      });

      // Invalidate cache for this user's tasks
      this.invalidateUserCache(userId);

      toast.success('Task updated successfully');
      return result;
    } catch (error) {
      toast.error('Failed to update task');
      throw error;
    }
  }

  // Check if user is authenticated by validating the token
  async isAuthenticated(): Promise<boolean> {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        return false;
      }

      // Validate the token with the backend
      try {
        await this.getSession();
        return true;
      } catch (error) {
        // If session validation fails, remove the invalid token
        localStorage.removeItem('token');
        return false;
      }
    }
    return false;
  }

  // Simple check for token existence without validation
  hasValidToken(): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      return !!token;
    }
    return false;
  }

  // Refresh token if needed
  async refreshToken(): Promise<boolean> {
    try {
      // For now, just check if we have a token stored
      // In a real implementation, you might want to make a call to refresh the JWT
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        return !!token;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  // Authentication methods
  async register(userData: { email: string; name: string; password: string }): Promise<any> {
    try {
      // Use direct API call instead of going through the request method to avoid circular dependency
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || errorData.message || 'Registration failed';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      const result = await response.json();

      // Store token if provided in response
      if (result.access_token && typeof window !== 'undefined') {
        localStorage.setItem('token', result.access_token);
      }

      toast.success('Account created successfully');
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed';
      toast.error(errorMessage);
      throw error;
    }
  }

  // Alias for signup to match frontend expectations
  async signup(userData: { email: string; name: string; password: string }): Promise<any> {
    return this.register(userData);
  }

  async login(credentials: { email: string; password: string }): Promise<any> {
    try {
      // Use direct API call instead of going through the request method to avoid circular dependency
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || errorData.message || 'Login failed';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      const result = await response.json();

      // Store token if provided in response
      if (result.access_token && typeof window !== 'undefined') {
        localStorage.setItem('token', result.access_token);
      }

      toast.success('Login successful');
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      toast.error(errorMessage);
      throw error;
    }
  }

  // Get session information
  async getSession(): Promise<any> {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('/api/auth/get-session', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || errorData.message || 'Failed to retrieve session';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      const result = await response.json();
      toast.success('Session retrieved successfully');
      return result;
    } catch (error) {
      toast.error('Failed to retrieve session');
      throw error;
    }
  }

  // Logout method
  async logout(): Promise<void> {
    try {
      // Call the backend logout endpoint first
      await fetch('/api/auth/sign-out', {
        method: 'POST',
      }).catch(() => {
        // Ignore logout errors as we're clearing the local token anyway
      });

      // Clear the token from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      // Clear any cached data
      this.cache.clear();
      toast.success('Logged out successfully');
    } catch (error) {
      // Even if backend logout fails, clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      // Clear any cached data
      this.cache.clear();
      toast.success('Logged out successfully');
    }
  }
}

export const api = new ApiClient();