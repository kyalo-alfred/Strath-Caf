import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { CustomerLayout } from './components/layout/CustomerLayout';
import { StaffLayout } from './components/layout/StaffLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Public Pages
import { Landing } from './pages/public/Landing';
import { Login } from './pages/public/Login';
import { Register } from './pages/public/Register';

// Customer Pages
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { Menu } from './pages/customer/Menu';
import { MealDetails } from './pages/customer/MealDetails';
import { Cart } from './pages/customer/Cart';
import { Checkout } from './pages/customer/Checkout';
import { OrderTracking } from './pages/customer/OrderTracking';
import { Orders } from './pages/customer/Orders';
import { Notifications } from './pages/customer/Notifications';
import { Profile } from './pages/customer/Profile';

// Staff Pages
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { StaffOrders } from './pages/staff/StaffOrders';
import { StaffQueue } from './pages/staff/StaffQueue';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminMenu } from './pages/admin/AdminMenu';
import { AdminReports } from './pages/admin/AdminReports';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'server') return <Navigate to="/server/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Customer Routes */}
            <Route element={<ProtectedRoute allowedRoles={['customer']}><CustomerLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<CustomerDashboard />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/menu/:id" element={<MealDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders/:id" element={<OrderTracking />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Server Routes */}
            <Route element={<ProtectedRoute allowedRoles={['server']}><StaffLayout /></ProtectedRoute>}>
              <Route path="/server/dashboard" element={<StaffDashboard />} />
              <Route path="/server/orders" element={<StaffOrders />} />
              <Route path="/server/queue" element={<StaffQueue />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/menu" element={<AdminMenu />} />
              <Route path="/admin/reports" element={<AdminReports />} />
            </Route>
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
