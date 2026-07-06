import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Search, Shield, User as UserIcon, UserMinus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import toast from 'react-hot-toast';

export const AdminUsers = () => {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'customer',
    university_id: '',
    phone: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  // Debounce search term to avoid spamming the backend
  const [debouncedSearch, setDebouncedSearch] = useState('');
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to page 1 on new search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['admin-users', page, debouncedSearch],
    queryFn: () => api.getUsers({ page, search: debouncedSearch }),
  });

  const users = usersData?.results || [];
  const totalPages = usersData?.count ? Math.ceil(usersData.count / 10) : 1;

  const deactivateMutation = useMutation({
    mutationFn: api.deactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User deactivated successfully');
    },
    onError: () => {
      toast.error('Failed to deactivate user');
    }
  });

  const handleDeactivate = (id: string) => {
    if (confirm('Are you sure you want to deactivate this user? They will not be able to log in.')) {
      deactivateMutation.mutate(id);
    }
  };

  const createMutation = useMutation({
    mutationFn: api.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User created successfully');
      setIsCreateModalOpen(false);
      setNewUser({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'customer',
        university_id: '',
        phone: ''
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.email?.[0] || 'Failed to create user');
    }
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newUser);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button onClick={() => setIsCreateModalOpen(true)} variant="outline">Create New User</Button>
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
              <thead className="bg-muted text-muted-foreground border-b">
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
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">No users found.</td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const isActive = (u as any).is_active !== false; 

                    return (
                      <tr key={u.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 font-medium flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
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
          
          {totalPages > 1 && (
            <div className="p-4 border-t flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Showing page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={page === totalPages || usersData?.next === null}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New User">
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <Input required value={newUser.first_name} onChange={e => setNewUser({...newUser, first_name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <Input required value={newUser.last_name} onChange={e => setNewUser({...newUser, last_name: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input type="email" required value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input type="password" required minLength={8} value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={newUser.role} 
              onChange={e => setNewUser({...newUser, role: e.target.value})}
            >
              <option value="customer">Customer</option>
              <option value="server">Staff/Server</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Student/Staff ID</label>
              <Input value={newUser.university_id} onChange={e => setNewUser({...newUser, university_id: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <Input value={newUser.phone} onChange={e => setNewUser({...newUser, phone: e.target.value})} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
