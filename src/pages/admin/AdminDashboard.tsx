import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Users, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AdminDashboard = () => {
  const { data: reportsData, isLoading: reportsLoading } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: api.getReports,
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.getUsers(),
  });

  if (reportsLoading || usersLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading dashboard analytics...</div>;
  }

  const summary = reportsData?.summary || { total_revenue: 0, today_revenue: 0, total_orders: 0, today_orders: 0 };
  const totalUsers = usersData?.count || 0;

  const stats = [
    { title: 'Total Revenue', value: `KES ${(summary.total_revenue || 0).toLocaleString()}`, icon: DollarSign, trend: `Today: KES ${(summary.today_revenue || 0).toLocaleString()}` },
    { title: 'Total Orders', value: summary.total_orders?.toString() || '0', icon: TrendingUp, trend: `Today: ${summary.today_orders}` },
    { title: 'Registered Users', value: totalUsers.toString(), icon: Users, trend: 'Total active & inactive' },
  ];

  // Placeholder data for the chart, since the backend doesn't provide time-series data yet
  const chartData = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 2000 },
    { name: 'Thu', revenue: 2780 },
    { name: 'Fri', revenue: 1890 },
    { name: 'Sat', revenue: 2390 },
    { name: 'Sun', revenue: 3490 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Analytics</h1>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-accent/10 text-accent rounded-lg">
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-muted-foreground">
                  {stat.trend}
                </span>
              </div>
              <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#003366" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#003366" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `KES ${value}`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#003366" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportsData?.recent_orders?.slice(0, 4).map((order: any) => (
                <div key={order.id} className="border-b pb-2 last:border-0 last:pb-0">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold">#{order.id} - {order.customer_name}</span>
                    <span className="font-bold text-success">KES {order.total_amount}</span>
                  </div>
                  <div className="text-xs text-muted-foreground flex justify-between">
                    <span>{new Date(order.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                    <span className="capitalize">{order.status}</span>
                  </div>
                </div>
              ))}
              {(!reportsData?.recent_orders || reportsData.recent_orders.length === 0) && (
                <div className="text-muted-foreground text-sm text-center py-4">No recent orders found.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
