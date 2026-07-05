import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { User as UserIcon, Camera, Save } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../../services/api';

export const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const profileMutation = useMutation({
    mutationFn: (data: Partial<typeof user>) => api.updateProfile(data),
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      setIsEditing(false);
      alert('Profile updated successfully');
    },
    onError: (error: any) => {
      alert('Failed to update profile: ' + (error.response?.data?.detail || 'Error'));
    }
  });

  const passwordMutation = useMutation({
    mutationFn: (data: any) => api.updatePassword(data),
    onSuccess: () => {
      setPasswordData({ current_password: '', new_password: '' });
      alert('Password updated successfully');
    },
    onError: (error: any) => {
      alert('Failed to update password: ' + (JSON.stringify(error.response?.data) || 'Error'));
    }
  });

  const handleSave = () => {
    profileMutation.mutate(formData);
  };

  const handlePasswordUpdate = () => {
    if (!passwordData.current_password || !passwordData.new_password) {
      alert('Please fill in both password fields');
      return;
    }
    passwordMutation.mutate(passwordData);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row items-center gap-8 mb-8 pb-8 border-b">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center text-4xl font-bold text-muted-foreground overflow-hidden">
                {user?.first_name?.charAt(0) || <UserIcon className="w-12 h-12" />}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold">{user?.first_name} {user?.last_name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full uppercase tracking-wider">
                {user?.role}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)} disabled={profileMutation.isPending}>
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <Input 
                  value={formData.first_name} 
                  onChange={e => setFormData({...formData, first_name: e.target.value})}
                  disabled={!isEditing || profileMutation.isPending} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <Input 
                  value={formData.last_name} 
                  onChange={e => setFormData({...formData, last_name: e.target.value})}
                  disabled={!isEditing || profileMutation.isPending} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input 
                  value={user?.email || ''} 
                  disabled
                  className="bg-muted"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <Input 
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  disabled={!isEditing || profileMutation.isPending} 
                />
              </div>
              {user?.role === 'customer' && (
                <div>
                  <label className="block text-sm font-medium mb-1">University ID</label>
                  <Input 
                    value={user?.university_id || ''} 
                    disabled
                    className="bg-muted"
                  />
                </div>
              )}
            </div>

            {isEditing && (
              <div className="pt-4 flex justify-end">
                <Button onClick={handleSave} className="gap-2" disabled={profileMutation.isPending}>
                  <Save className="w-4 h-4" /> {profileMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Current Password</label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={passwordData.current_password}
              onChange={e => setPasswordData({...passwordData, current_password: e.target.value})}
              disabled={passwordMutation.isPending}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={passwordData.new_password}
              onChange={e => setPasswordData({...passwordData, new_password: e.target.value})}
              disabled={passwordMutation.isPending}
            />
          </div>
          <Button variant="secondary" onClick={handlePasswordUpdate} disabled={passwordMutation.isPending}>
            {passwordMutation.isPending ? 'Updating...' : 'Update Password'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
