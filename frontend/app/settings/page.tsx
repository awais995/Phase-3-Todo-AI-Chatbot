'use client';

import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/AuthContext';
import { Moon, Sun, User, Lock, Bell, Save } from 'lucide-react';

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: ''
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  });

  useEffect(() => {
    setIsMounted(true);
    if (user) {
      // Set profile with actual user data from auth context
      setProfile({
        name: user.name || user.username || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        bio: user.bio || 'Software Developer' // Use bio if available, otherwise default
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    // Handle profile save logic
    console.log('Profile saved:', profile);

    try {
      // In a real implementation, you would update the user profile via API
      // For now, we'll just log the changes
      // await api.updateUserProfile(profile);

      // Show success message
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleSaveNotifications = () => {
    // Handle notification settings save logic
    console.log('Notification settings saved:', notifications);
  };

  // Prevent hydration mismatch by only rendering after mount
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside
          className="hidden md:block w-64 border-r bg-background p-4 h-[calc(100vh-4rem)] sticky top-16"
          role="navigation"
          aria-label="Main navigation"
        >
          <Sidebar />
        </aside>

        {/* Mobile Sidebar Sheet */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent
            side="left"
            className="w-64 p-0 bg-background border-r border-border/50 backdrop-blur-sm shadow-2xl"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <Sidebar closeSidebar={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 md:ml-0">
          <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground mt-2">
                Manage your account settings and preferences
              </p>
            </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Settings */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Profile Information</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Update your account details
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        placeholder="Your email address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Input
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        placeholder="Tell us about yourself"
                      />
                    </div>
                    <Button onClick={handleSaveProfile} className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Save Profile
                    </Button>
                  </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Bell className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Notifications</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Configure your notification preferences
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications" className="text-sm font-normal">
                          Email Notifications
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant={notifications.email ? "default" : "outline"}
                        size="sm"
                        onClick={() => setNotifications({...notifications, email: !notifications.email})}
                        className="h-8 w-12 p-0"
                      >
                        {notifications.email ? 'ON' : 'OFF'}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-notifications" className="text-sm font-normal">
                          Push Notifications
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Receive push notifications
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant={notifications.push ? "default" : "outline"}
                        size="sm"
                        onClick={() => setNotifications({...notifications, push: !notifications.push})}
                        className="h-8 w-12 p-0"
                      >
                        {notifications.push ? 'ON' : 'OFF'}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sms-notifications" className="text-sm font-normal">
                          SMS Notifications
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Receive notifications via SMS
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant={notifications.sms ? "default" : "outline"}
                        size="sm"
                        onClick={() => setNotifications({...notifications, sms: !notifications.sms})}
                        className="h-8 w-12 p-0"
                      >
                        {notifications.sms ? 'ON' : 'OFF'}
                      </Button>
                    </div>

                    <Button onClick={handleSaveNotifications} className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Save Notifications
                    </Button>
                  </CardContent>
                </Card>

                {/* Appearance Settings */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Sun className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Appearance</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Customize the look and feel
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Theme</Label>
                      <div className="flex gap-4">
                        <Button
                          variant={theme === 'light' ? "default" : "outline"}
                          onClick={() => setTheme('light')}
                          className="flex-1"
                        >
                          Light
                        </Button>
                        <Button
                          variant={theme === 'dark' ? "default" : "outline"}
                          onClick={() => setTheme('dark')}
                          className="flex-1"
                        >
                          Dark
                        </Button>
                        <Button
                          variant={theme === 'system' ? "default" : "outline"}
                          onClick={() => setTheme('system')}
                          className="flex-1"
                        >
                          System
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Security Settings */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Lock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Security</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Change your password and security settings
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" placeholder="Enter current password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" placeholder="Enter new password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" placeholder="Confirm new password" />
                    </div>
                    <Button className="w-full">
                      <Lock className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </CardContent>
                </Card>
              </div>
          </div>
        </main>
      </div>
    </div>
  );
}