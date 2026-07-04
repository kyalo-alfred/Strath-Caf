import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { Order } from '../../types';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Search, Filter, Receipt } from 'lucide-react';

export const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Active' | 'Completed' | 'Cancelled'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.getOrders();
        setOrders(data.filter(o => o.user === user?.id));
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'warning';
      case 'Preparing': return 'primary';
      case 'Ready': return 'success';
      case 'Collected': return 'default';
      case 'Cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'Active' && !['Pending', 'Preparing', 'Ready'].includes(order.status)) return false;
    if (filter === 'Completed' && order.status !== 'Collected') return false;
    if (filter === 'Cancelled' && order.status !== 'Cancelled') return false;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return order.id.toLowerCase().includes(term) || 
             order.items.some(i => i.menu_item.name.toLowerCase().includes(term));
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Order History</h1>
          <p className="text-muted-foreground mt-1">View and track your past and current orders.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search orders..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['All', 'Active', 'Completed', 'Cancelled'].map(f => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            className="rounded-full shrink-0 text-sm h-8"
            onClick={() => setFilter(f as any)}
          >
            {f}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-24"></CardContent>
            </Card>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
          <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg mb-2">No orders found.</p>
          {filter !== 'All' ? (
            <Button variant="link" onClick={() => setFilter('All')}>View all orders</Button>
          ) : (
            <Link to="/menu"><Button>Order Something</Button></Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <Card key={order.id} className="hover:shadow-md transition-shadow group">
              <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-center justify-between sm:justify-start gap-4 mb-2">
                    <span className="font-bold text-lg">#{order.id}</span>
                    {/* @ts-ignore */}
                    <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                  </div>
                  <p className="text-sm text-foreground/80 mb-2 truncate">
                    {order.items.map(i => `${i.quantity}x ${i.menu_item.name}`).join(', ')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                
                <div className="flex items-center justify-between sm:flex-col sm:items-end w-full sm:w-auto gap-4">
                  <span className="font-bold text-lg whitespace-nowrap">KES {order.total_amount}</span>
                  {['Pending', 'Preparing', 'Ready'].includes(order.status) ? (
                    <Link to={`/orders/${order.id}`}>
                      <Button variant="outline" className="shrink-0 w-full sm:w-auto">Track Order</Button>
                    </Link>
                  ) : (
                    <Link to="/menu">
                      <Button variant="secondary" className="shrink-0 w-full sm:w-auto">Reorder</Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
