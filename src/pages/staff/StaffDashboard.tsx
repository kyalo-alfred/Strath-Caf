import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Order } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { ChefHat, ListTodo, CheckCircle2, Clock } from 'lucide-react';

export const StaffDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    api.getOrders().then(setOrders);
  }, []);

  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const preparingCount = orders.filter(o => o.status === 'Preparing').length;
  const readyCount = orders.filter(o => o.status === 'Ready').length;
  const completedToday = orders.filter(o => o.status === 'Collected').length;

  const stats = [
    { label: 'Pending Orders', value: pendingCount, icon: ListTodo, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Preparing', value: preparingCount, icon: ChefHat, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Ready for Pickup', value: readyCount, icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Completed Today', value: completedToday, icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted' },
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
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">{order.id} - {order.customer_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.items.map(i => `${i.quantity}x ${i.menu_item.name}`).join(', ')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  order.status === 'Pending' ? 'bg-warning/20 text-warning' :
                  order.status === 'Preparing' ? 'bg-primary/20 text-primary' :
                  order.status === 'Ready' ? 'bg-success/20 text-success' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
