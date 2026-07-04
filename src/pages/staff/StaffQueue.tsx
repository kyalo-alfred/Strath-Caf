import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Order, OrderStatus } from '../../types';
import { Card, CardContent } from '../../components/ui/Card';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ id, order }: { id: string, order: Order }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-3 cursor-grab active:cursor-grabbing">
      <Card className="shadow-sm border-l-4" style={{ borderLeftColor: order.status === 'Pending' ? '#F59E0B' : order.status === 'Preparing' ? '#003366' : '#22C55E' }}>
        <CardContent className="p-3">
          <div className="flex justify-between mb-1">
            <span className="font-bold text-sm">#{order.id}</span>
          </div>
          <p className="text-xs text-muted-foreground truncate">{order.customer_name}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export const StaffQueue = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    api.getOrders().then(setOrders);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      // In a real kanban we would have multiple droppable areas.
      // For this simplified version with DND Kit core without multiple containers, 
      // we'll simulate a status change based on column drop, but since we are mapping statuses manually,
      // let's build a simple multi-container dnd or just a basic UI without DND Kit for now 
      // if it gets too complex for the simplified file. 
      // Wait, standard DND-kit multi-container requires more boilerplate.
      // Let's implement a fallback button-based approach alongside DND if DND is complex.
    }
  };

  const columns: OrderStatus[] = ['Pending', 'Preparing', 'Ready', 'Collected'];

  const moveOrder = async (orderId: string, newStatus: OrderStatus) => {
    await api.updateOrderStatus(orderId, newStatus);
    fetchOrders();
  }

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <h1 className="text-3xl font-bold mb-2">Queue Board</h1>
      
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-6 h-full min-w-max pb-4">
          {columns.map(status => {
            const columnOrders = orders.filter(o => o.status === status);
            return (
              <div key={status} className="w-80 flex flex-col bg-muted/50 rounded-xl p-4">
                <h3 className="font-semibold mb-4 text-lg">{status} ({columnOrders.length})</h3>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                  {columnOrders.map(order => (
                    <Card key={order.id} className="shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold">#{order.id}</span>
                          <span className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <p className="text-sm font-medium mb-3">{order.customer_name}</p>
                        <div className="flex gap-2 flex-wrap">
                          {status === 'Pending' && <button onClick={() => moveOrder(order.id, 'Preparing')} className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Start Prep</button>}
                          {status === 'Preparing' && <button onClick={() => moveOrder(order.id, 'Ready')} className="text-xs bg-success text-success-foreground px-2 py-1 rounded">Mark Ready</button>}
                          {status === 'Ready' && <button onClick={() => moveOrder(order.id, 'Collected')} className="text-xs bg-muted-foreground text-white px-2 py-1 rounded">Collected</button>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {columnOrders.length === 0 && (
                    <div className="h-24 border-2 border-dashed rounded-xl flex items-center justify-center text-muted-foreground text-sm">
                      Empty
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
