import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Users, Coffee, PieChart, Settings, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Menu Mgmt', href: '/admin/menu', icon: Coffee },
    { name: 'Reports', href: '/admin/reports', icon: PieChart },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row">
      <aside className="hidden md:flex flex-col w-64 border-r bg-card px-4 py-6 fixed h-full z-10">
        <div className="flex items-center gap-2 px-2 mb-8">
          <span className="text-2xl font-bold text-accent">Admin Portal</span>
        </div>
        <nav className="flex-1 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive ? "bg-accent/20 text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="mt-auto border-t pt-4">
          <Button variant="ghost" className="w-full justify-start text-danger hover:text-danger hover:bg-danger/10" onClick={handleLogout}>
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col md:ml-64 min-h-screen">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur md:px-6 justify-end">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium hidden md:block">Welcome, {user?.first_name}</span>
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
              {user?.first_name?.charAt(0) || 'U'}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
