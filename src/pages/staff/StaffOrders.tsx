import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { OrderStatus } from '../../types';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Clock } from 'lucide-react';

export const StaffOrders = () => {
  const queryClient = useQueryClient();

  const { data: pendingData, isLoading: loadingPending } = useQuery({
    queryKey: ['orders', 'pending'],
    queryFn: () => api.getOrders({ status: 'pending' })
  });

  const { data: preparingData, isLoading: loadingPreparing } = useQuery({
    queryKey: ['orders', 'preparing'],
    queryFn: () => api.getOrders({ status: 'preparing' })
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => api.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });

  const isLoading = loadingPending || loadingPreparing;
  const orders = [
    ...(pendingData?.results || []),
    ...(preparingData?.results || [])
  ].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Incoming Orders</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {orders.map(order => (
          <Card key={order.id} className={`border-l-4 ${order.status === 'pending' ? 'border-l-warning' : 'border-l-primary'}`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">#{order.id}</h3>
                  <p className="text-muted-foreground">{order.customer_name}</p>
                </div>
                {/* @ts-ignore */}
                <Badge variant={order.status === 'pending' ? 'warning' : 'primary'} className="capitalize">
                  {order.status}
                </Badge>
              </div>

              <div className="space-y-2 mb-6">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span><span className="font-bold">{item.quantity}x</span> {item.menu_item_detail?.name}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center text-muted-foreground text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex gap-2">
                  {(order.status === 'pending' || order.status === 'preparing') && (
                    <Button 
                      variant="outline"
                      className="text-danger border-danger/50 hover:bg-danger/10"
                      onClick={() => updateStatusMutation.mutate({ id: order.id, status: 'cancelled' })}
                      disabled={updateStatusMutation.isPending}
                    >
                      Cancel
                    </Button>
                  )}
                  {order.status === 'pending' && (
                    <Button 
                      onClick={() => updateStatusMutation.mutate({ id: order.id, status: 'preparing' })}
                      disabled={updateStatusMutation.isPending}
                    >
                      Accept & Prepare
                    </Button>
                  )}
                  {order.status === 'preparing' && (
                    <Button 
                      className="bg-success text-success-foreground hover:bg-success/90" 
                      onClick={() => updateStatusMutation.mutate({ id: order.id, status: 'ready' })}
                      disabled={updateStatusMutation.isPending}
                    >
                      Mark Ready
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {orders.length === 0 && !isLoading && (
          <div className="col-span-2 text-center py-20 text-muted-foreground">
            No incoming orders at the moment.
          </div>
        )}
      </div>
    </div>
  );
};
