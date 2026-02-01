'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { CheckCircle, Clock, Target, Calendar, BarChart3, Users, Zap, Rocket, Award } from 'lucide-react';

export default function DashboardContent() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-white/90">Productivity Reimagined</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
              Transform Your
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Productivity
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              The ultimate task management platform designed to boost your efficiency and help you achieve more with less effort.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="text-2xl font-bold text-white mb-1">50K+</div>
              <div className="text-sm text-white/60">Tasks Completed</div>
            </div>
            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="text-2xl font-bold text-white mb-1">98%</div>
              <div className="text-sm text-white/60">Success Rate</div>
            </div>
            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="text-2xl font-bold text-white mb-1">24/7</div>
              <div className="text-sm text-white/60">Support</div>
            </div>
            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="text-2xl font-bold text-white mb-1">100%</div>
              <div className="text-sm text-white/60">Secure</div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-white">Lightning Fast</CardTitle>
                <CardDescription className="text-white/70">
                  Complete tasks in record time with our optimized workflow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white/60 text-sm">
                  Streamlined interface designed for maximum efficiency and speed
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-white">Smart Automation</CardTitle>
                <CardDescription className="text-white/70">
                  Automate repetitive tasks and focus on what matters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white/60 text-sm">
                  Intelligent features that learn from your habits and optimize your workflow
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-white">Achieve Goals</CardTitle>
                <CardDescription className="text-white/70">
                  Track progress and reach your objectives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white/60 text-sm">
                  Powerful analytics to help you understand your productivity patterns
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center space-y-6">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Productivity?</h2>
              <p className="text-white/70 mb-8">
                Join thousands of users who have revolutionized their workflow with our platform
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="px-8 py-4 text-base rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={handleGetStarted}
              >
                Start Free Trial
              </Button>

              <div className="flex gap-3">
                <Link href="/login">
                  <Button variant="outline" size="lg" className="px-6 py-4 rounded-xl border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 font-medium">
                    Log In
                  </Button>
                </Link>

                <Link href="/signup">
                  <Button variant="secondary" size="lg" className="px-6 py-4 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all duration-300 font-medium">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}