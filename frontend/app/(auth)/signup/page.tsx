'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Eye, EyeOff, User, Mail, Lock, CheckCircle, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string; terms?: string; general?: string }>({});

  const router = useRouter();
  const { signup } = useAuth();

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; password?: string; confirmPassword?: string; terms?: string; general?: string } = {};

    if (!name) {
      newErrors.name = 'Name is required';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the Terms of Service and Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await signup(name, email, password);
    } catch (error: any) {
      setErrors({ general: error.message || 'Signup failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden"
      role="main"
      aria-label="Signup page"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="w-full shadow-2xl border-0 bg-white/5 backdrop-blur-sm border border-white/10">
          <CardHeader className="text-center pb-6">
            {/* Branding section */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-blue-500/20">
                <User className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Productivity Pro
              </h1>
            </div>

            <CardTitle id="signup-title" className="text-3xl font-bold text-white mt-3">
              Create Account
            </CardTitle>
            <CardDescription className="text-white/70 mt-2">
              Join us today and start organizing your tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div
                  className="text-red-400 text-sm p-3 bg-red-500/20 rounded-lg border border-red-500/30 animate-pulse"
                  role="alert"
                  aria-live="assertive"
                >
                  {errors.general}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-white/80">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 ${errors.name ? 'border-red-500 bg-red-500/10 ring-red-500/30' : 'border-white/20'} transition-all duration-300 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500`}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    disabled={loading}
                  />
                </div>
                {errors.name && (
                  <p
                    id="name-error"
                    className="text-red-400 text-sm flex items-center gap-1"
                    role="alert"
                    aria-live="assertive"
                  >
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-white/80">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 ${errors.email ? 'border-red-500 bg-red-500/10 ring-red-500/30' : 'border-white/20'} transition-all duration-300 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500`}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    disabled={loading}
                  />
                </div>
                {errors.email && (
                  <p
                    id="email-error"
                    className="text-red-400 text-sm flex items-center gap-1"
                    role="alert"
                    aria-live="assertive"
                  >
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-white/80">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pl-10 pr-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 ${errors.password ? 'border-red-500 bg-red-500/10 ring-red-500/30' : 'border-white/20'} transition-all duration-300 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500`}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-white/60 hover:text-white/80 transition-colors" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4 text-white/60 hover:text-white/80 transition-colors" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p
                    id="password-error"
                    className="text-red-400 text-sm flex items-center gap-1"
                    role="alert"
                    aria-live="assertive"
                  >
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-white/80">
                  Confirm Password
                </Label>
                <div className="relative">
                  <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 ${errors.confirmPassword ? 'border-red-500 bg-red-500/10 ring-red-500/30' : 'border-white/20'} transition-all duration-300 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500`}
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
                    disabled={loading}
                  />
                </div>
                {errors.confirmPassword && (
                  <p
                    id="confirm-password-error"
                    className="text-red-400 text-sm flex items-center gap-1"
                    role="alert"
                    aria-live="assertive"
                  >
                    <span>{errors.confirmPassword}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className={`mt-1 h-4 w-4 rounded border-white/30 text-blue-500 focus:ring-blue-500 bg-white/10 ${errors.terms ? 'border-red-500' : ''}`}
                    disabled={loading}
                  />
                  <Label htmlFor="terms" className="text-sm text-white/70 leading-5">
                    I agree to the <a href="#" className="text-blue-400 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>
                  </Label>
                </div>
                {errors.terms && (
                  <p
                    id="terms-error"
                    className="text-red-400 text-sm flex items-center gap-1"
                    role="alert"
                    aria-live="assertive"
                  >
                    <span>{errors.terms}</span>
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 group text-white shadow-lg hover:shadow-2xl shadow-blue-500/20"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Create Account
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-white/70">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-blue-400 hover:text-blue-300 hover:underline font-medium transition-colors"
                aria-label="Sign in to your existing account"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}