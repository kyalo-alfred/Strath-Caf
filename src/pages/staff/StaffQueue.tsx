import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { OrderStatus } from '../../types';
import { Card, CardContent } from '../../components/ui/Card';

export const StaffQueue = () => {
  const queryClient = useQueryClient();
  const [draggedOrderId, setDraggedOrderId] = useState<string | null>(null);

  const { data: pendingData } = useQuery({ queryKey: ['orders', 'pending'], queryFn: () => api.getOrders({ status: 'pending' }) });
  const { data: preparingData } = useQuery({ queryKey: ['orders', 'preparing'], queryFn: () => api.getOrders({ status: 'preparing' }) });
  const { data: readyData } = useQuery({ queryKey: ['orders', 'ready'], queryFn: () => api.getOrders({ status: 'ready' }) });
  const { data: completedData } = useQuery({ queryKey: ['orders', 'completed'], queryFn: () => api.getOrders({ status: 'completed' }) });

  const allOrders = [
    ...(pendingData?.results || []),
    ...(preparingData?.results || []),
    ...(readyData?.results || []),
    ...(completedData?.results || [])
  ];

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => api.updateOrderStatus(id, status),
    onMutate: async ({ id, status }) => {
      // Optimistic update: cancel outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: ['orders'] });
      
      // Save the previous state to rollback if needed
      const previousOrderData = queryClient.getQueryData(['orders', status]);
      
      // Find the order we are moving from all orders
      const targetOrder = allOrders.find(o => o.id.toString() === id);
      if (!targetOrder) return;

      const oldStatus = targetOrder.status;

      // Update the caches optimistically
      queryClient.setQueryData(['orders', oldStatus], (old: any) => {
        if (!old) return old;
        return { ...old, results: old.results.filter((o: any) => o.id.toString() !== id), count: old.count - 1 };
      });

      queryClient.setQueryData(['orders', status], (old: any) => {
        if (!old) return old;
        return { ...old, results: [...old.results, { ...targetOrder, status }], count: old.count + 1 };
      });

      return { previousOrderData };
    },
    onError: (err, variables, context: any) => {
      // Rollback on error
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onSettled: () => {
      // Always refetch to ensure we're perfectly synced with backend
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });

  const handleDragStart = (e: React.DragEvent, orderId: string) => {
    setDraggedOrderId(orderId);
    e.dataTransfer.setData('text/plain', orderId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetStatus: OrderStatus) => {
    e.preventDefault();
    const orderId = e.dataTransfer.getData('text/plain');
    if (orderId && draggedOrderId) {
      const order = allOrders.find(o => o.id.toString() === orderId);
      if (order && order.status !== targetStatus) {
        
        // Enforce valid forward state transitions on the frontend
        const validTransitions: Record<string, string[]> = {
          'pending': ['preparing', 'cancelled'],
          'preparing': ['ready', 'cancelled'],
          'ready': ['completed'],
          'completed': [],
          'cancelled': []
        };

        if (validTransitions[order.status]?.includes(targetStatus)) {
          updateStatusMutation.mutate({ id: orderId, status: targetStatus });
        }
      }
    }
    setDraggedOrderId(null);
  };

  const moveOrder = (orderId: string, newStatus: OrderStatus) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus });
  };

  const columns: { status: OrderStatus; label: string }[] = [
    { status: 'pending', label: 'Pending' },
    { status: 'preparing', label: 'Preparing' },
    { status: 'ready', label: 'Ready' },
    { status: 'completed', label: 'Collected' }
  ];

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <h1 className="text-3xl font-bold mb-2">Queue Board</h1>
      
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-6 h-full min-w-max pb-4">
          {columns.map(({ status, label }) => {
            const columnOrders = allOrders.filter(o => o.status === status);
            return (
              <div 
                key={status} 
                className="w-80 flex flex-col bg-muted/50 rounded-xl p-4 transition-colors"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status)}
              >
                <h3 className="font-semibold mb-4 text-lg">{label} ({columnOrders.length})</h3>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                  {columnOrders.map(order => (
                    <Card 
                      key={order.id} 
                      className={`shadow-sm cursor-grab active:cursor-grabbing border-l-4 ${status === 'pending' ? 'border-l-warning' : status === 'preparing' ? 'border-l-primary' : 'border-l-success'} ${updateStatusMutation.isPending && updateStatusMutation.variables?.id === order.id.toString() ? 'opacity-50' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, order.id.toString())}
                      onDragEnd={() => setDraggedOrderId(null)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold">#{order.id}</span>
                          <span className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <p className="text-sm font-medium mb-3">{order.customer_name}</p>
                        <div className="flex gap-2 flex-wrap">
                          {status === 'pending' && <button onClick={() => moveOrder(order.id.toString(), 'preparing')} className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Start Prep</button>}
                          {status === 'preparing' && <button onClick={() => moveOrder(order.id.toString(), 'ready')} className="text-xs bg-success text-success-foreground px-2 py-1 rounded">Mark Ready</button>}
                          {status === 'ready' && <button onClick={() => moveOrder(order.id.toString(), 'completed')} className="text-xs bg-muted-foreground text-white px-2 py-1 rounded">Collected</button>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {columnOrders.length === 0 && (
                    <div className="h-24 border-2 border-dashed rounded-xl flex items-center justify-center text-muted-foreground text-sm">
                      Drop Here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
