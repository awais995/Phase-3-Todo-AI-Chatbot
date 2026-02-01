'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, Lock, Bell, Save, Shield, Key, Eye, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export default function SettingsPage() {
  const { user, checkAuthStatus } = useAuth();
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
  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlerts: true,
    trustedDevices: true
  });

  useEffect(() => {
    setIsMounted(true);
    if (user) {
      // Set profile with actual user data from auth context
      setProfile({
        name: user.name || user.username || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        bio: user.bio || '' // Use bio if available, otherwise empty string
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    // Handle profile save logic
    console.log('Profile saved:', profile);

    try {
      // Update the user profile via API (excluding email for security)
      const updatedUserData = await api.updateUserProfile({
        name: profile.name,
        bio: profile.bio
      });

      // Refresh the user context to update the bio in the UI
      if (user) {
        // Update the local state to reflect the changes
        setProfile(prev => ({
          ...prev,
          name: profile.name,
          bio: profile.bio
        }));

        // Refresh the user context by calling checkAuthStatus
        await checkAuthStatus();
      }

      // Show success message
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleSaveNotifications = () => {
    // Handle notification settings save logic
    console.log('Notification settings saved:', notifications);
    toast.success('Notification preferences updated!');
  };

  const handleToggleSecurity = (setting: keyof typeof security) => {
    setSecurity(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  // Prevent hydration mismatch by only rendering after mount
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-white/70">
            Customize your experience and manage your account preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Settings */}
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-white">Personal Info</CardTitle>
                  <p className="text-white/60 text-sm">
                    Update your personal information
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-white/80">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  placeholder="Enter your full name"
                  className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="email" className="text-white/80">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  placeholder="your.email@example.com"
                  className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  disabled
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="bio" className="text-white/80">Bio</Label>
                <Input
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  placeholder="Tell us about yourself..."
                  className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>
              <Button
                onClick={handleSaveProfile}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-white">Notifications</CardTitle>
                  <p className="text-white/60 text-sm">
                    Choose how you receive updates
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <div>
                  <Label className="text-white font-medium">Email Notifications</Label>
                  <p className="text-white/60 text-sm">
                    Receive emails about important updates
                  </p>
                </div>
                <Button
                  type="button"
                  variant={notifications.email ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNotifications({...notifications, email: !notifications.email})}
                  className={`h-8 w-14 p-0 ${notifications.email ? 'bg-green-500 hover:bg-green-600' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  {notifications.email ? 'ON' : 'OFF'}
                </Button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <div>
                  <Label className="text-white font-medium">Push Notifications</Label>
                  <p className="text-white/60 text-sm">
                    Get instant alerts on your device
                  </p>
                </div>
                <Button
                  type="button"
                  variant={notifications.push ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNotifications({...notifications, push: !notifications.push})}
                  className={`h-8 w-14 p-0 ${notifications.push ? 'bg-green-500 hover:bg-green-600' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  {notifications.push ? 'ON' : 'OFF'}
                </Button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <Label className="text-white font-medium">SMS Notifications</Label>
                  <p className="text-white/60 text-sm">
                    Receive text message alerts
                  </p>
                </div>
                <Button
                  type="button"
                  variant={notifications.sms ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNotifications({...notifications, sms: !notifications.sms})}
                  className={`h-8 w-14 p-0 ${notifications.sms ? 'bg-green-500 hover:bg-green-600' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  {notifications.sms ? 'ON' : 'OFF'}
                </Button>
              </div>

              <Button
                onClick={handleSaveNotifications}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>


          {/* Security Settings */}
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 lg:col-span-2">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-white">Security</CardTitle>
                  <p className="text-white/60 text-sm">
                    Manage your account security
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <div>
                  <Label className="text-white font-medium">Two-Factor Authentication</Label>
                  <p className="text-white/60 text-sm">
                    Add an extra layer of security
                  </p>
                </div>
                <Button
                  type="button"
                  variant={security.twoFactor ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToggleSecurity('twoFactor')}
                  className={`h-8 w-14 p-0 ${security.twoFactor ? 'bg-green-500 hover:bg-green-600' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  {security.twoFactor ? 'ON' : 'OFF'}
                </Button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <div>
                  <Label className="text-white font-medium">Login Alerts</Label>
                  <p className="text-white/60 text-sm">
                    Get notified of new logins
                  </p>
                </div>
                <Button
                  type="button"
                  variant={security.loginAlerts ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToggleSecurity('loginAlerts')}
                  className={`h-8 w-14 p-0 ${security.loginAlerts ? 'bg-green-500 hover:bg-green-600' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  {security.loginAlerts ? 'ON' : 'OFF'}
                </Button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <Label className="text-white font-medium">Trusted Devices</Label>
                  <p className="text-white/60 text-sm">
                    Remember this device
                  </p>
                </div>
                <Button
                  type="button"
                  variant={security.trustedDevices ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToggleSecurity('trustedDevices')}
                  className={`h-8 w-14 p-0 ${security.trustedDevices ? 'bg-green-500 hover:bg-green-600' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  {security.trustedDevices ? 'ON' : 'OFF'}
                </Button>
              </div>

              <Button className="w-full h-12 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold">
                <Key className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}