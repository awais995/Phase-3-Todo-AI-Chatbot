'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { CheckCircle, Clock, Target, Calendar, BarChart3, Users } from 'lucide-react';

export default function DashboardContent() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20 space-y-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-slate-800/80 rounded-full border border-slate-200/60 dark:border-slate-700/60 shadow-lg">
              <div className="h-3 w-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse shadow-sm shadow-blue-500/30"></div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Task Management Platform</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent leading-tight">
              Streamline Your Workflow
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Organize, track, and manage your tasks efficiently with our intuitive platform designed for productivity and focus
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <Card className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 overflow-hidden relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-5 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/20">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Manage Tasks</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 mt-2">
                  Organize and prioritize your work
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 pb-6">
                <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                  Create, update, and track your daily tasks with ease and efficiency
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-2 shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 overflow-hidden relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-5 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/20">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Stay Organized</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 mt-2">
                  Keep everything in one place
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 pb-6">
                <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                  Categorize tasks by status, priority, and deadlines for better focus
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 hover:-translate-y-2 shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 overflow-hidden relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-5 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/20">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Boost Productivity</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 mt-2">
                  Focus on what matters
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 pb-6">
                <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                  Complete tasks efficiently and effectively with smart insights
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 hover:-translate-y-2 shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 overflow-hidden relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-5 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-500/20">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Plan Ahead</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 mt-2">
                  Schedule and plan your workflow
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 pb-6">
                <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                  Set deadlines and reminders to stay on track with your goals
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 hover:-translate-y-2 shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 overflow-hidden relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-5 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/20">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Track Progress</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 mt-2">
                  Monitor your productivity
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 pb-6">
                <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                  Visualize your progress and identify areas for improvement
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 hover:-translate-y-2 shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 overflow-hidden relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-5 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-pink-500/20">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Collaborate</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 mt-2">
                  Work with your team
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 pb-6">
                <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                  Share tasks and collaborate with teammates for better results
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="flex flex-col items-center gap-8">
            <Button
              size="lg"
              className="px-12 py-6 text-lg rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 text-white font-semibold text-xl"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>

            <div className="flex flex-col sm:flex-row gap-5">
              <Link href="/login">
                <Button variant="outline" size="lg" className="px-10 py-5 rounded-xl border-2 hover:bg-blue-50/80 hover:border-blue-200 dark:hover:bg-slate-700/50 dark:hover:border-slate-600 transition-all duration-300 font-medium text-lg">
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" className="px-10 py-5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-white font-semibold text-lg">
                  Sign Up
                </Button>
              </Link>
            </div>

            {/* Stats Section */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">50K+</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Tasks Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">98%</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">User Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">24/7</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Support Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">100%</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Secure Platform</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}