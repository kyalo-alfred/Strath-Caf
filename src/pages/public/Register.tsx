import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const Register = () => {
  const [role, setRole] = useState<'customer' | 'staff'>('customer');
  const { mockLoginAs } = useAuth();
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate registration
    mockLoginAs(role);
    if (role === 'staff') navigate('/staff/dashboard');
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="w-full max-w-lg bg-card rounded-2xl shadow-xl border p-8 md:p-12">
        <div className="mb-8 text-center">
          <h3 className="text-2xl font-semibold mb-2">Create an Account</h3>
          <p className="text-sm text-muted-foreground">Join StrathCaf to skip the queues.</p>
        </div>

        <div className="flex bg-muted p-1 rounded-lg mb-6">
          <button 
            className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${role === 'customer' ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setRole('customer')}
          >
            Student / Staff
          </button>
          <button 
            className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${role === 'staff' ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setRole('staff')}
          >
            Cafeteria Staff
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <Input required placeholder="John" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <Input required placeholder="Doe" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input type="email" required placeholder="john.doe@strathmore.edu" />
          </div>
          {role === 'customer' && (
            <div>
              <label className="block text-sm font-medium mb-1">Student / Staff ID</label>
              <Input required placeholder="123456" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input type="password" required placeholder="••••••••" />
          </div>
          
          <Button type="submit" className="w-full mt-6">Create Account</Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};
