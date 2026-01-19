'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { directAuthAPI } from '@/lib/auth-client';
import { toast } from 'sonner';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuthStatus = async () => {
    try {
      if (await api.isAuthenticated()) {
        // Get user info from session, but suppress both success and error messages during auth status check
        const userData = await api.getSession(false, false); // Don't show success or error messages
        setUser(userData.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      // Only log to console, don't show toast notification
      console.error('Error checking auth status:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.login({ email, password });

      // Store token if provided
      if (response.access_token && typeof window !== 'undefined') {
        localStorage.setItem('token', response.access_token);
      }

      // Get user info - this should now have the token available
      const userData = await api.getSession();

      // Update states before redirect to ensure they're ready
      setUser(userData.user);
      setIsAuthenticated(true);

      // Wait a moment to ensure state updates are propagated before redirect
      await new Promise(resolve => setTimeout(resolve, 100));

      // Redirect to tasks page after state update
      router.push('/tasks');
    } catch (error: any) {
      // If login fails, clear any potentially invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }

      // Extract error message from response
      let errorMessage = 'Login failed. Please try again.';
      if (error.message) {
        errorMessage = error.message;
      } else if (error.detail) {
        errorMessage = error.detail;
      }

      console.error('Login failed:', error);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    let response = null; // Initialize response variable to make it accessible in catch block

    try {
      response = await api.signup({ email, password, name });

      // Store token if provided
      if (response.access_token && typeof window !== 'undefined') {
        localStorage.setItem('token', response.access_token);
      }

      // Wait briefly to ensure token is properly stored in localStorage
      await new Promise(resolve => setTimeout(resolve, 100));

      // Attempt to get user info with retry mechanism
      let userData;
      let retries = 3;
      let lastError;

      while (retries > 0) {
        try {
          // Call getSession with both showSuccessMessage and showErrorMessage set to false to avoid any notifications
          userData = await api.getSession(false, false);
          break; // Success, exit the loop
        } catch (error) {
          lastError = error;
          retries--;
          if (retries > 0) {
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }
      }

      if (!userData) {
        // If all retries failed, create a minimal user object based on the signup response
        userData = {
          user: {
            id: response.user?.id || '',
            email: email,
            name: name,
            bio: null
          }
        };
      }

      // Update states before redirect to ensure they're ready
      setUser(userData.user);
      setIsAuthenticated(true);
      setIsLoading(false); // Set loading to false so auth state is stable

      // Wait a moment to ensure state updates are propagated before redirect
      await new Promise(resolve => setTimeout(resolve, 200));

      // Show success message and redirect to login page
      // Use the toast function that's available through the api import
      toast.success('Account created successfully! Please log in with your new account.');

      // Redirect to login page after state update
      router.push('/login');
    } catch (error: any) {
      // If signup fails, clear any potentially invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }

      // Extract error message from response
      let errorMessage = 'Signup failed. Please try again.';
      if (error.message) {
        errorMessage = error.message;
        // Check if it's specifically a token issue and handle appropriately
        if (error.message.includes('No token found')) {
          // If it's a token issue, try to use the response data directly
          // Only access response if it was successfully obtained from signup
          const userId = response?.user?.id || '';

          setUser({
            id: userId,
            email: email,
            name: name,
            bio: null
          });
          setIsAuthenticated(true);
          setIsLoading(false);

          // Show success message and redirect
          toast.success('Account created successfully! Please log in with your new account.');
          await new Promise(resolve => setTimeout(resolve, 100));
          router.push('/login');
          return; // Exit early to prevent the error from propagating
        }
      } else if (error.detail) {
        errorMessage = error.detail;
      }

      console.error('Signup failed:', error);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.logout();
      // Update states before redirect
      setUser(null);
      setIsAuthenticated(false);

      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear the user state even if backend logout fails
      setUser(null);
      setIsAuthenticated(false);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };


  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}