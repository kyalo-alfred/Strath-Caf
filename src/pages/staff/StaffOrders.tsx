import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Order, OrderStatus } from '../../types';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Clock } from 'lucide-react';

export const StaffOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    api.getOrders().then(data => setOrders(data.filter(o => o.status === 'Pending' || o.status === 'Preparing')));
  };

  const updateStatus = async (id: string, status: OrderStatus) => {
    await api.updateOrderStatus(id, status);
    fetchOrders();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Incoming Orders</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {orders.map(order => (
          <Card key={order.id} className="border-l-4 border-l-warning">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">#{order.id}</h3>
                  <p className="text-muted-foreground">{order.customerName}</p>
                </div>
                {/* @ts-ignore */}
                <Badge variant={order.status === 'Pending' ? 'warning' : 'primary'}>{order.status}</Badge>
              </div>

              <div className="space-y-2 mb-6">
                {order.items.map(item => (
                  <div key={item.meal.id} className="flex justify-between text-sm">
                    <span><span className="font-bold">{item.quantity}x</span> {item.meal.name}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center text-muted-foreground text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(order.createdAt).toLocaleTimeString()}
                </div>
                <div className="flex gap-2">
                  {order.status === 'Pending' && (
                    <Button onClick={() => updateStatus(order.id, 'Preparing')}>Accept & Prepare</Button>
                  )}
                  {order.status === 'Preparing' && (
                    <Button className="bg-success text-success-foreground hover:bg-success/90" onClick={() => updateStatus(order.id, 'Ready')}>Mark Ready</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {orders.length === 0 && (
          <div className="col-span-2 text-center py-20 text-muted-foreground">
            No incoming orders at the moment.
          </div>
        )}
      </div>
    </div>
  );
};
