import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { ChefHat, ListTodo, CheckCircle2, Clock } from 'lucide-react';

export const StaffDashboard = () => {
  const { data: pendingData } = useQuery({
    queryKey: ['orders', 'pending'],
    queryFn: () => api.getOrders({ status: 'pending' })
  });

  const { data: preparingData } = useQuery({
    queryKey: ['orders', 'preparing'],
    queryFn: () => api.getOrders({ status: 'preparing' })
  });

  const { data: readyData } = useQuery({
    queryKey: ['orders', 'ready'],
    queryFn: () => api.getOrders({ status: 'ready' })
  });

  const { data: completedData } = useQuery({
    queryKey: ['orders', 'completed'],
    queryFn: () => api.getOrders({ status: 'completed' }) // Note: Might want to add date filtering for 'today' if backend supports it
  });

  const { data: recentOrdersData } = useQuery({
    queryKey: ['orders', 'recent'],
    queryFn: () => api.getOrders()
  });

  const pendingCount = pendingData?.count || 0;
  const preparingCount = preparingData?.count || 0;
  const readyCount = readyData?.count || 0;
  const completedToday = completedData?.count || 0;

  const stats = [
    { label: 'Pending Orders', value: pendingCount, icon: ListTodo, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Preparing', value: preparingCount, icon: ChefHat, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Ready for Pickup', value: readyCount, icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Completed', value: completedToday, icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Server Dashboard</h1>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border-none shadow-soft">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                <h3 className="text-3xl font-bold">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrdersData?.results?.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">{order.id} - {order.customer_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.items.map(i => `${i.quantity}x ${i.menu_item_detail?.name}`).join(', ')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                  order.status === 'pending' ? 'bg-warning/20 text-warning' :
                  order.status === 'preparing' ? 'bg-primary/20 text-primary' :
                  order.status === 'ready' ? 'bg-success/20 text-success' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {order.status}
                </span>
              </div>
            ))}
            {(!recentOrdersData?.results || recentOrdersData.results.length === 0) && (
              <p className="text-muted-foreground py-4">No recent activity.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
