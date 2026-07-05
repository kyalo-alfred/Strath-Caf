import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Role } from '../../types';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      const loggedInUser = await login(email, password);
      
      // Redirect based on actual backend role
      if (loggedInUser.role === 'admin') navigate('/admin/dashboard');
      else if (loggedInUser.role === 'server') navigate('/server/dashboard');
      else navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials or network error.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center bg-card rounded-2xl shadow-xl overflow-hidden border">
        {/* Left side abstract visual */}
        <div className="hidden md:flex flex-col justify-center h-full bg-primary text-primary-foreground p-12 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
            <p className="text-primary-foreground/80">
              Log in to manage your orders, pre-order meals, and skip the cafeteria queue.
            </p>
          </div>
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-secondary opacity-50 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-accent opacity-20 blur-3xl"></div>
        </div>

        {/* Right side form */}
        <div className="p-8 md:p-12">
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-2">Sign In</h3>
            <p className="text-sm text-muted-foreground">Select your role and enter your credentials.</p>
          </div>



          {error && <div className="mb-4 p-3 rounded bg-danger/10 text-danger text-sm">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="email@strathmore.edu" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium">Password</label>
                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
              </div>
              <Input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <div className="flex items-center">
              <input id="remember" type="checkbox" className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
              <label htmlFor="remember" className="ml-2 block text-sm text-muted-foreground">Remember me</label>
            </div>
            <Button type="submit" className="w-full">Sign In</Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
