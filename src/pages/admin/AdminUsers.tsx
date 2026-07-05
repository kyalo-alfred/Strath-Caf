import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Search, Shield, User as UserIcon, UserMinus } from 'lucide-react';

export const AdminUsers = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: api.getUsers,
  });

  const deactivateMutation = useMutation({
    mutationFn: api.deactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    }
  });

  const handleDeactivate = (id: string) => {
    if (confirm('Are you sure you want to deactivate this user? They will not be deleted, but they will not be able to log in.')) {
      deactivateMutation.mutate(id);
    }
  };

  const filteredUsers = users.filter(u => 
    `${u.first_name} ${u.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button onClick={() => alert('TODO: Implement User Creation Modal')} variant="outline">Create New User</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search users by name or email..." 
                className="pl-9" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">Loading users...</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">No users found.</td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    // Because we added 'is_active' indirectly, we can check it if the backend returns it.
                    // If not returned, assume active unless we add it to the serializer.
                    // For now, let's assume all fetched users are active or the serializer includes it.
                    // To be safe, we use any.
                    const isActive = (u as any).is_active !== false; 

                    return (
                      <tr key={u.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 font-medium flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                            {u.first_name?.charAt(0) || 'U'}
                          </div>
                          {u.first_name} {u.last_name}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{u.email}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {u.role === 'admin' ? <Shield className="w-4 h-4 text-danger" /> :
                             u.role === 'server' ? <UserIcon className="w-4 h-4 text-primary" /> :
                             <UserIcon className="w-4 h-4 text-muted-foreground" />}
                            <span className="capitalize">{u.role}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {isActive ? (
                            <Badge variant="success" className="bg-success/10 text-success hover:bg-success/20">Active</Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-muted text-muted-foreground">Deactivated</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-danger hover:text-danger hover:bg-danger/10"
                            onClick={() => handleDeactivate(u.id)}
                            disabled={!isActive || deactivateMutation.isPending}
                            title="Deactivate User"
                          >
                            <UserMinus className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
