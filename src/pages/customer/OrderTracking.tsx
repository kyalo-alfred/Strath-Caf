import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Order, OrderStatus } from '../../types';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Clock, CheckCircle2, ChefHat, Package, Check, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export const OrderTracking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        const data = await api.getOrder(id);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();

    // Simulate real-time updates for demo purposes
    const interval = setInterval(() => {
      fetchOrder();
    }, 10000);

    return () => clearInterval(interval);
  }, [id]);

  if (loading && !order) {
    return <div className="flex justify-center items-center h-64"><RefreshCw className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Order not found</h2>
        <Button onClick={() => navigate('/orders')}>View All Orders</Button>
      </div>
    );
  }

  const stages: { status: OrderStatus; label: string; icon: any; desc: string }[] = [
    { status: 'Pending', label: 'Order Received', icon: CheckCircle2, desc: 'We have received your order.' },
    { status: 'Preparing', label: 'Preparing Meal', icon: ChefHat, desc: 'Chef is preparing your food.' },
    { status: 'Ready', label: 'Ready for Collection', icon: Package, desc: 'Your order is ready at the counter.' },
    { status: 'Collected', label: 'Collected', icon: Check, desc: 'Enjoy your meal!' },
  ];

  const currentStageIndex = stages.findIndex(s => s.status === order.status) !== -1 
    ? stages.findIndex(s => s.status === order.status) 
    : order.status === 'Cancelled' ? -1 : 0;

  // Calculate estimated time remaining
  const now = new Date();
  const est = new Date(order.estimatedReadyTime);
  const diffMinutes = Math.max(0, Math.round((est.getTime() - now.getTime()) / 60000));

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/orders" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Track Order</h1>
          <p className="text-muted-foreground text-sm">#{order.id}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-soft">
            <CardContent className="p-6">
              {order.status === 'Cancelled' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-danger mb-2">Order Cancelled</h3>
                  <p className="text-muted-foreground">This order has been cancelled.</p>
                </div>
              ) : (
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-muted -z-10 hidden sm:block"></div>
                  
                  <div className="space-y-8">
                    {stages.map((stage, idx) => {
                      const isCompleted = currentStageIndex >= idx;
                      const isCurrent = currentStageIndex === idx;
                      
                      return (
                        <div key={stage.status} className="flex gap-6 relative">
                          <div className={`
                            w-16 h-16 shrink-0 rounded-full flex items-center justify-center border-4 border-background z-10 transition-colors duration-500
                            ${isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                            ${isCurrent ? 'ring-4 ring-primary/20 shadow-lg' : ''}
                          `}>
                            <stage.icon className={`w-6 h-6 ${isCurrent && idx < 3 ? 'animate-pulse' : ''}`} />
                          </div>
                          <div className="pt-3">
                            <h3 className={`text-lg font-bold ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {stage.label}
                            </h3>
                            <p className="text-sm text-muted-foreground">{stage.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground border-none">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 mx-auto mb-3 opacity-80" />
              <p className="text-sm font-medium opacity-80 mb-1">Estimated Ready Time</p>
              {order.status === 'Ready' || order.status === 'Collected' || order.status === 'Cancelled' ? (
                <h2 className="text-3xl font-bold">--:--</h2>
              ) : (
                <>
                  <h2 className="text-3xl font-bold">{new Date(order.estimatedReadyTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</h2>
                  <p className="text-sm mt-2">in about <span className="font-bold">{diffMinutes}</span> mins</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 pb-2 border-b">Order Details</h3>
              <div className="space-y-3 text-sm mb-4">
                {order.items.map(item => (
                  <div key={item.meal.id} className="flex justify-between">
                    <span className="text-muted-foreground">{item.quantity}x {item.meal.name}</span>
                    <span className="font-medium">KES {item.meal.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">KES {order.totalAmount}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
