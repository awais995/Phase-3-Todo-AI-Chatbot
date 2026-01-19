'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User as UserIcon, Mail, Calendar, Settings } from 'lucide-react';
import { User as UserType } from '@/types/user';
import { useState } from 'react';

interface UserProfileProps {
  user: UserType;
  showEditButton?: boolean;
  onEditClick?: () => void;
}

export function UserProfile({ user, showEditButton = true, onEditClick }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user.name || '',
    email: user.email || '', // Keep email for display only
    bio: user.bio || '',
  });

  const handleEditClick = () => {
    if (onEditClick) {
      onEditClick();
    } else {
      setIsEditing(!isEditing);
    }
  };

  const handleSave = () => {
    // In a real implementation, you would save the changes
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: user.name || '',
      email: user.email || '',
      bio: user.bio || '',
    });
    setIsEditing(false);
  };

  return (
    <Card className="bg-gradient-to-br from-card to-muted/30 border-border/50">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4">
          <UserIcon className="h-12 w-12 text-white" />
        </div>
        <CardTitle className="text-2xl">{user.name || 'User'}</CardTitle>
        <p className="text-muted-foreground text-sm">{user.email}</p>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="space-y-4">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm text-muted-foreground">Full Name</label>
                <input
                  id="name"
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-muted-foreground">Email (cannot be changed)</label>
                <input
                  id="email"
                  type="email"
                  value={editData.email}
                  readOnly
                  className="w-full p-2 border rounded-md bg-muted cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm text-muted-foreground">Bio</label>
                <input
                  id="bio"
                  type="text"
                  value={editData.bio}
                  onChange={(e) => setEditData({...editData, bio: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  placeholder="Tell us about yourself"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleSave} className="flex-1">Save</Button>
                <Button onClick={handleCancel} variant="outline" className="flex-1">Cancel</Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <UserIcon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{user.name || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <UserIcon className="h-4 w-4 text-primary" /> {/* Using User icon for Bio */}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bio</p>
                  <p className="font-medium">{user.bio || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Settings className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account Status</p>
                  <Badge variant="secondary" className="capitalize">
                    Active
                  </Badge>
                </div>
              </div>
            </>
          )}
        </div>

        {showEditButton && !isEditing && (
          <Button
            className="w-full mt-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
            onClick={handleEditClick}
          >
            Edit Profile
          </Button>
        )}
      </CardContent>
    </Card>
  );
}