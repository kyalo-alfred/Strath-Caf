import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { User as UserIcon, Camera, Save } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.first_name || '',
    last_name: user?.last_name || 'Doe',
    phone: user?.phone || '0712345678',
    university_id: user?.university_id || '123456',
  });

  const handleSave = () => {
    // Save profile logic
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row items-center gap-8 mb-8 pb-8 border-b">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center text-4xl font-bold text-muted-foreground overflow-hidden">
                {user?.first_name?.charAt(0)}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold">{user?.first_name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full uppercase tracking-wider">
                {user?.role}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <Input 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  disabled={!isEditing} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input 
                  value={formData.email} 
                  disabled
                  className="bg-muted"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <Input 
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  disabled={!isEditing} 
                />
              </div>
              {user?.role === 'customer' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Student/Staff Number</label>
                  <Input 
                    value={formData.university_id} 
                    disabled
                    className="bg-muted"
                  />
                </div>
              )}
            </div>

            {isEditing && (
              <div className="pt-4 flex justify-end">
                <Button onClick={handleSave} className="gap-2">
                  <Save className="w-4 h-4" /> Save Changes
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
            <Input type="password" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button variant="secondary" onClick={() => alert('TODO: Connect to POST /api/users/password/update/')}>Update Password</Button>
        </CardContent>
      </Card>
    </div>
  );
};
