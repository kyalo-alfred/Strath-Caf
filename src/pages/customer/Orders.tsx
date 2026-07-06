import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Search, Receipt, ChevronLeft, ChevronRight } from 'lucide-react';

export const Orders = () => {
  const [filter, setFilter] = useState<'All' | 'Active' | 'Completed' | 'Cancelled'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [page, setPage] = useState(1);

  let statusFilter = undefined;
  if (filter === 'Completed') statusFilter = 'completed';
  if (filter === 'Cancelled') statusFilter = 'cancelled';

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['orders', appliedSearch, filter, page],
    queryFn: () => api.getOrders({
      search: appliedSearch || undefined,
      status: statusFilter,
      page
    })
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(searchTerm);
    setPage(1);
  };

  const handleFilterChange = (f: typeof filter) => {
    setFilter(f);
    setPage(1);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'warning';
      case 'preparing': return 'primary';
      case 'ready': return 'success';
      case 'completed': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  // If filter is 'Active', we must filter locally since we can't easily pass multiple statuses
  let orders = ordersData?.results || [];
  if (filter === 'Active') {
    orders = orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status));
  }

  const totalCount = ordersData?.count || 0;
  const hasNext = !!ordersData?.next;
  const hasPrevious = !!ordersData?.previous;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Order History</h1>
          <p className="text-muted-foreground mt-1">View and track your past and current orders.</p>
        </div>
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search orders..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['All', 'Active', 'Completed', 'Cancelled'].map(f => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            className="rounded-full shrink-0 text-sm h-8"
            onClick={() => handleFilterChange(f as any)}
          >
            {f}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-24"></CardContent>
            </Card>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
          <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg mb-2">No orders found.</p>
          {filter !== 'All' ? (
            <Button variant="link" onClick={() => handleFilterChange('All')}>View all orders</Button>
          ) : (
            <Link to="/menu"><Button>Order Something</Button></Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Card key={order.id} className="hover:shadow-md transition-shadow group">
              <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-center justify-between sm:justify-start gap-4 mb-2">
                    <span className="font-bold text-lg">#{order.id}</span>
                    {/* @ts-ignore */}
                    <Badge variant={getStatusColor(order.status)} className="capitalize">{order.status}</Badge>
                  </div>
                  <p className="text-sm text-foreground/80 mb-2 truncate">
                    {order.items.map(i => `${i.quantity}x ${i.menu_item_detail.name}`).join(', ')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                
                <div className="flex items-center justify-between sm:flex-col sm:items-end w-full sm:w-auto gap-4">
                  <span className="font-bold text-lg whitespace-nowrap">KES {order.total_amount}</span>
                  {['pending', 'preparing', 'ready'].includes(order.status) ? (
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
          
          {/* Pagination */}
          <div className="flex items-center justify-between pt-6">
            <p className="text-sm text-muted-foreground">
              Showing page {page} (Total: {totalCount})
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={!hasPrevious}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                disabled={!hasNext}
                onClick={() => setPage(p => p + 1)}
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
