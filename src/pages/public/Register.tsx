import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { authApi } from '../../api/authApi';

export const Register = () => {
  const [role, setRole] = useState<'customer' | 'server'>('customer');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [university_id, setUniversityId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      const payload = {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        role,
        ...(role === 'customer' ? { university_id } : {})
      };

      if (role === 'customer') {
        await authApi.registerCustomer(payload);
      } else {
        await authApi.registerServer(payload);
      }
      
      // Redirect to login after successful registration
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
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
            type="button"
            className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${role === 'customer' ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setRole('customer')}
          >
            Student
          </button>
          <button 
            type="button"
            className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${role === 'server' ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setRole('server')}
          >
            Staff
          </button>
        </div>

        {error && <div className="mb-4 p-3 rounded bg-danger/10 text-danger text-sm">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <Input required placeholder="John" value={firstName} onChange={e => setFirstName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <Input required placeholder="Doe" value={lastName} onChange={e => setLastName(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input type="email" required placeholder="john.doe@strathmore.edu" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          {role === 'customer' && (
            <div>
              <label className="block text-sm font-medium mb-1">Student ID</label>
              <Input required placeholder="123456" value={university_id} onChange={e => setUniversityId(e.target.value)} />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input type="password" required placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
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
