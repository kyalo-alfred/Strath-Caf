import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { Order, Meal } from '../../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Clock, TrendingUp, Search, ChevronRight } from 'lucide-react';
import { Input } from '../../components/ui/Input';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [popularMeals, setPopularMeals] = useState<Meal[]>([]);

  useEffect(() => {
    // Fetch mock data
    const fetchData = async () => {
      try {
        const [ordersRes, mealsRes] = await Promise.all([
          api.getOrders(),
          api.getMeals()
        ]);
        setRecentOrders(ordersRes.filter(o => o.userId === user?.id).slice(0, 3));
        setPopularMeals(mealsRes.slice(0, 4));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'warning';
      case 'Preparing': return 'primary';
      case 'Ready': return 'success';
      case 'Collected': return 'default';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0]}!</h1>
        <p className="text-muted-foreground mt-1">What would you like to eat today?</p>
      </div>

      {/* Current Queue Status Widget */}
      <Card className="bg-gradient-to-br from-primary to-secondary text-primary-foreground border-none">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Current Queue Status</h2>
            <p className="text-primary-foreground/80 mb-4">Main Cafeteria is currently moderately busy.</p>
            <div className="flex items-center gap-4 text-sm font-medium">
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full">
                <Clock className="w-4 h-4" /> Est. wait: 15 mins
              </div>
              <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full">
                <TrendingUp className="w-4 h-4" /> 12 orders ahead
              </div>
            </div>
          </div>
          <Link to="/menu">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 w-full md:w-auto shadow-lg">
              Order Now to Skip Queue
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Popular Meals */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Popular Right Now</h3>
            <Link to="/menu" className="text-sm text-primary font-medium flex items-center hover:underline">
              View all menu <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {popularMeals.map(meal => (
              <Card key={meal.id} className="overflow-hidden hover:shadow-md transition-shadow group border-border/50">
                <div className="flex items-center p-3 gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                    <img src={meal.imageUrl} alt={meal.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{meal.name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">{meal.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-bold text-sm">KES {meal.price}</span>
                      <Link to={`/menu/${meal.id}`}>
                        <Button size="sm" variant="secondary" className="h-7 text-xs px-2">Add</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Recent Orders</h3>
            <Link to="/orders" className="text-sm text-primary font-medium hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <Card className="bg-muted/30 border-dashed">
                <CardContent className="p-6 text-center text-muted-foreground text-sm">
                  No recent orders found.
                </CardContent>
              </Card>
            ) : (
              recentOrders.map(order => (
                <Card key={order.id} className="hover:shadow-sm transition-shadow border-border/50">
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm truncate">
                          {order.items.map(i => i.meal.name).join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>KES {order.totalAmount}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {/* @ts-ignore */}
                      <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                      {['Pending', 'Preparing', 'Ready'].includes(order.status) ? (
                        <Link to={`/orders/${order.id}`}>
                          <Button size="sm" variant="outline" className="h-7 text-[10px] px-2">Track</Button>
                        </Link>
                      ) : (
                        <Button size="sm" variant="ghost" className="h-7 text-[10px] px-2" onClick={() => {/* Handle Reorder */}}>Reorder</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
